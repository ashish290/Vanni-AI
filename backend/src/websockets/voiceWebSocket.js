import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { speechToText, textToSpeech } from "../services/sarvamVoiceService.js";
import {
  getConversationMessages,
  saveMessage,
  getOrCreateConversation,
} from "../services/dbService.js";
import { chatWithVanni, cleanResponse } from "../services/sarvamService.js";
import { User, Plan } from "../models/index.js";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

export const setupVoiceWebSocket = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    console.log(`🔍 WS Upgrade Request: ${url.pathname}${url.search}`);

    if (request.url.startsWith("/api/voice/ws")) {
      console.log("✅ Matched voice route, upgrading...");
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      console.log("❌ No route match for upgrade");
    }
  });

  wss.on("connection", async (ws, request) => {
    ws.on("error", (err) => console.error("❌ Voice WebSocket Error:", err));

    let userId = null;
    let currentConversationId = null;
    let audioBuffer = [];

    // Parse query params for token and conversationId
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get("token");
    currentConversationId = url.searchParams.get("conversationId");

    if (!token) {
      ws.close(4001, "Unauthorized: No token provided");
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
      console.log("✅ Token verified, userId:", userId);
    } catch (err) {
      console.log("❌ Token verification failed:", err.message);
      ws.close(4001, "Unauthorized: Invalid token");
      return;
    }

    try {
      // Check voice access and plan limits
      const user = await User.findByPk(userId);
      if (!user) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: "User not found. Please log in again.",
          }),
        );
        ws.close(4003, "User not found");
        return;
      }

      // Check plan expiry
      if (
        user.plan !== "free" &&
        user.planExpiresAt &&
        new Date() > new Date(user.planExpiresAt)
      ) {
        user.plan = "free";
        user.voiceEnabled = false;
        user.planExpiresAt = null;
        await user.save();
      }

      if (!user.voiceEnabled) {
        ws.send(
          JSON.stringify({
            type: "error",
            message:
              "Voice mode requires a Basic or Pro plan. Please upgrade to use Voice Mode! 🎤",
          }),
        );
        // Delay closing to allow the client to receive the error message
        setTimeout(() => {
          if (ws.readyState === ws.OPEN) {
            ws.close(4003, "Voice mode not available on your plan");
          }
        }, 1000);
        return;
      }

      console.log(`🎤 Voice session started for user: ${user.email}`);
    } catch (err) {
      console.error("🔥 Voice access check error:", err);
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Failed to verify voice access. Please try again.",
        }),
      );
      ws.close(4003, "Failed to verify voice access");
      return;
    }

    ws.on("message", async (message, isBinary) => {
      // If message is binary, it's an audio chunk
      if (isBinary) {
        // Optional: comment out console.log if it's too noisy
        console.log(`📡 Received audio chunk: ${message.length} bytes`);
        audioBuffer.push(message);
        return;
      }

      // If message is text, it's control commands (e.g., 'stop_listening', 'start_listening')
      try {
        const messageString = message.toString();
        // console.log("📩 Received text message:", messageString);
        const data = JSON.parse(messageString);

        if (data.type === "process_audio") {
          if (audioBuffer.length === 0) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "No audio data received",
              }),
            );
            return;
          }

          ws.send(
            JSON.stringify({ type: "status", message: "processing_stt" }),
          );

          // Combine buffer and write to temp file
          const combinedBuffer = Buffer.concat(audioBuffer);
          const tempFilePath = path.join(os.tmpdir(), `voice_${uuidv4()}.webm`);
          fs.writeFileSync(tempFilePath, combinedBuffer);

          // Clear buffer for next turn
          audioBuffer = [];

          try {
            // 1. Speech to Text via Sarvam Saaras
            console.log("Speech to Text via Sarvam Saaras", tempFilePath);
            const userText = await speechToText(tempFilePath);
            console.log("🎙️ Transcription result:", userText);
            // Clean up temp file
            fs.unlinkSync(tempFilePath);

            if (!userText || userText.trim() === "") {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Could not transcribe audio",
                }),
              );
              return;
            }

            // Send transcribed text back to client so they can see what they said
            ws.send(JSON.stringify({ type: "user_text", text: userText }));
            ws.send(
              JSON.stringify({
                type: "status",
                message: "generating_response",
              }),
            );

            // 2. LLM response via Sarvam-M
            if (!currentConversationId) {
              const newConv = await getOrCreateConversation(userId, null);
              currentConversationId = newConv.id;
              // Inform the frontend so it can navigate to the new conversation URL if needed
              ws.send(
                JSON.stringify({
                  type: "conversation_created",
                  conversationId: currentConversationId,
                }),
              );
            }

            // Save user message
            await saveMessage(currentConversationId, "user", userText);

            const history = await getConversationMessages(
              currentConversationId,
            );
            const messages = history.map((msg) => ({
              role: msg.role === "assistant" ? "model" : msg.role,
              content: msg.content,
            }));

            const { getTutorPrompt } =
              await import("../prompts/tutorPrompt.js");
            const systemPrompt = getTutorPrompt({
              userName: "Student", // Could fetch from DB via userId
              level: "Intermediate",
              weakAreas: [],
              recentMistakes: [],
              isVoiceMode: true,
            });

            const aiResponseText = await chatWithVanni(
              messages,
              systemPrompt,
              800,
            ); // Increased from 100 to 800 because the reasoning `<think>` block needs more tokens before it starts speaking.

            // Save Vanni's cleaned message (already cleaned by chatWithVanni in sarvamService)
            await saveMessage(
              currentConversationId,
              "assistant",
              aiResponseText,
            );

            ws.send(JSON.stringify({ type: "ai_text", text: aiResponseText }));
            ws.send(
              JSON.stringify({ type: "status", message: "generating_audio" }),
            );

            // 3. Text to Speech via Sarvam Bulbul
            // Strip out <think> tags using central utility
            let cleanAiTextForSpeech = cleanResponse(aiResponseText);

            // If the model outputted nothing but think tags, give it a default fallback string
            // to prevent the Sarvam TTS API 400 error (inputs cannot be empty)
            if (!cleanAiTextForSpeech) {
              cleanAiTextForSpeech = "I am listening.";
            }

            const base64Audio = await textToSpeech(cleanAiTextForSpeech);

            // Send final audio back to client
            ws.send(
              JSON.stringify({
                type: "audio_response",
                audio: base64Audio,
              }),
            );

            // The client will set status to idle after playAudioBase64 finishes
          } catch (error) {
            console.error("Voice pipeline error:", error);
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Error processing voice request",
              }),
            );
            if (fs.existsSync(tempFilePath)) {
              fs.unlinkSync(tempFilePath);
            }
          }
        }
      } catch (err) {
        console.error("WebSocket text message error:", err);
      }
    });

    ws.on("close", () => {
      audioBuffer = [];
      console.log("Voice WebSocket disconnected");
    });
  });

  return wss;
};
