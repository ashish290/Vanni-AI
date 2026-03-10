import { speechToText, textToSpeech } from "../services/sarvamVoiceService.js";
import { chatWithVanni } from "../services/sarvamService.js";
import { getConversationMessages, saveMessage } from "../services/dbService.js";

export const handleSTT = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No audio file provided" });
    }

    const transcript = await speechToText(req.file.path);

    res.json({
      success: true,
      text: transcript,
    });
  } catch (error) {
    next(error);
  }
};

export const handleTTS = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res
        .status(400)
        .json({ success: false, error: "Text is required" });
    }

    const base64Audio = await textToSpeech(text);

    res.json({
      success: true,
      audio: base64Audio,
    });
  } catch (error) {
    next(error);
  }
};

export const handleConversation = async (req, res, next) => {
  try {
    const { text, conversationId } = req.body;
    const userId = req.user.id; // from authMiddleware

    if (!text || !conversationId) {
      return res.status(400).json({
        success: false,
        error: "Text and conversationId are required",
      });
    }

    // 1. Get history and save user message
    const history = await getConversationMessages(conversationId);

    // Convert DB history to Sarvam messages format
    const messages = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      content: msg.content,
    }));

    // Add current user message
    messages.push({ role: "user", content: text });
    await saveMessage(conversationId, "user", text);

    // 2. We don't need full orchestrator for generic chat if it's too slow, but let's use the standard tutor prompt
    // Wait, typically we'd use tutorAgent. But for quick TTS response, we can call chatWithVanni directly
    // Let's import the prompt
    const { getTutorPrompt } = await import("../prompts/tutorPrompt.js");

    // We should ideally fetch user data (level, weak areas) but let's use defaults for speed in Voice mode
    // or fetch them from DB. For now, let's keep it simple.
    const systemPrompt = getTutorPrompt({
      userName: req.user.name || "Student",
      level: "Intermediate",
      weakAreas: [],
      recentMistakes: [],
    });

    const aiResponseText = await chatWithVanni(messages, systemPrompt, 150); // Shorter responses for voice
    await saveMessage(conversationId, "assistant", aiResponseText);

    // 3. Convert AI response to audio
    const base64Audio = await textToSpeech(aiResponseText);

    res.json({
      success: true,
      text: aiResponseText,
      audio: base64Audio,
    });
  } catch (error) {
    next(error);
  }
};
