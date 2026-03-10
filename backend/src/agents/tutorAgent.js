import { chatWithVanni, streamWithVanni } from "../services/sarvamService.js";
import { getTutorPrompt } from "../prompts/tutorPrompt.js";

// ─── Off-Topic Keyword Guard ────────────────────────────────
const OFF_TOPIC_KEYWORDS = [
  "supabase",
  "firebase",
  "mongodb",
  "database",
  "sql",
  "api",
  "vpn",
  "software",
  "hardware",
  "programming",
  "coding",
  "javascript",
  "python",
  "react",
  "nodejs",
  "github",
  "chatgpt",
  "openai",
  "gemini",
  "claude",
  "ai tool",
  "download",
  "install",
  "update",
  "app store",
  "play store",
  "election",
  "modi",
  "rahul",
  "congress",
  "bjp",
  "parliament",
  "supreme court",
  "government policy",
  "budget 2025",
  "budget 2026",
  "ipl",
  "cricket score",
  "who won",
  "match result",
  "world cup score",
  "champions league",
  "movie review",
  "web series",
  "netflix",
  "amazon prime",
  "bollywood",
  "tollywood",
  "box office",
  "photosynthesis",
  "chemical formula",
  "periodic table",
  "newton",
  "einstein",
  "quantum",
  "black hole",
  "stock market",
  "share price",
  "bitcoin",
  "crypto",
  "mutual fund",
  "nifty",
  "sensex",
];

const OFF_TOPIC_REDIRECT_RESPONSES = [
  "Tech/news/sports mein toh main weak hoon yaar 😄 But let's practice English instead! Can you tell me about your day in English?",
  "Yeh toh mere syllabus mein nahi hai 😄 But English zaroor sikha sakti hoon! Tell me — what did you do today? Try in English!",
  "Main sirf English teacher hoon yaar 😄 Let's focus on that! Describe something you ate today in English — try karo!",
  "Mujhe toh bas English aati hai 😄 But that's enough for us! Tell me about your favourite hobby in English!",
  "That's outside my expertise yaar 😄 But I can help with English! Can you describe your morning routine in one sentence?",
];

function isOffTopic(message) {
  const lower = message.toLowerCase();
  return OFF_TOPIC_KEYWORDS.some((kw) => lower.includes(kw));
}

function getRandomRedirect() {
  return OFF_TOPIC_REDIRECT_RESPONSES[
    Math.floor(Math.random() * OFF_TOPIC_REDIRECT_RESPONSES.length)
  ];
}

// ─── Respond (non-streaming) ────────────────────────────────

export const respond = async ({
  userMessage,
  userContext,
  analysisResult,
  level,
  userName,
  stageContext,
  isVoiceMode = false,
  topMistakes = [],
}) => {
  try {
    if (isOffTopic(userMessage)) {
      return { reply: getRandomRedirect() };
    }

    const systemPrompt = getTutorPrompt({
      userName,
      level,
      weakAreas: userContext?.weakAreas || [],
      recentMistakes: topMistakes, // Now using top mistakes from DB
      history: userContext?.history || [], // For conversation memory
      learnedWords: userContext?.learnedWordsCount || 0,
      stageContext,
      isVoiceMode,
    });

    const messages = [];
    if (userContext?.history?.length) {
      const recentHistory = userContext.history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    let enrichedMessage = userMessage;
    if (analysisResult?.mistakes?.length) {
      const mistakeHints = analysisResult.mistakes
        .map(
          (m) =>
            `[INTERNAL ERROR: "${m.original}" — use "${m.correction}" (${m.type})]`,
        )
        .join(" ");
      enrichedMessage = `${userMessage}\n\n[TUTOR CONTEXT — hidden: ${mistakeHints}]`;
    }

    messages.push({ role: "user", content: enrichedMessage });

    const reply = await chatWithVanni(messages, systemPrompt, 512);
    return { reply };
  } catch (error) {
    console.error("❌ Tutor Agent error:", error.message);
    return {
      reply: "Vanni chai break pe hai ☕ — ek minute mein wapas aayegi!",
    };
  }
};

// ─── Respond Stream (SSE) ───────────────────────────────────

export const respondStream = async ({
  userMessage,
  userContext,
  analysisResult,
  level,
  userName,
  stageContext,
  onChunk,
  isVoiceMode = false,
  topMistakes = [],
}) => {
  try {
    if (isOffTopic(userMessage)) {
      const redirect = getRandomRedirect();
      onChunk?.(redirect);
      return { reply: redirect };
    }

    const systemPrompt = getTutorPrompt({
      userName,
      level,
      weakAreas: userContext?.weakAreas || [],
      recentMistakes: topMistakes,
      history: userContext?.history || [],
      learnedWords: userContext?.learnedWordsCount || 0,
      stageContext,
      isVoiceMode,
    });

    const messages = [];
    if (userContext?.history?.length) {
      const recentHistory = userContext.history.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      }
    }

    let enrichedMessage = userMessage;
    if (analysisResult?.mistakes?.length) {
      const mistakeHints = analysisResult.mistakes
        .map(
          (m) =>
            `[INTERNAL ERROR: "${m.original}" — use "${m.correction}" (${m.type})]`,
        )
        .join(" ");
      enrichedMessage = `${userMessage}\n\n[TUTOR CONTEXT — hidden: ${mistakeHints}]`;
    }

    messages.push({ role: "user", content: enrichedMessage });

    const fullText = await streamWithVanni(
      messages,
      systemPrompt,
      onChunk,
      512,
    );
    return { reply: fullText };
  } catch (error) {
    console.error("❌ Tutor Agent stream error:", error.message);
    return {
      reply: "Vanni chai break pe hai ☕ — ek minute mein wapas aayegi!",
    };
  }
};
