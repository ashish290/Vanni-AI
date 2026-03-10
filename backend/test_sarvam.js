import { chatWithVanni } from "./src/services/sarvamService.js";
import { textToSpeech } from "./src/services/sarvamVoiceService.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

async function test() {
  try {
    console.log("Testing LLM...");
    const aiText = await chatWithVanni(
      [{ role: "user", content: "Hello, how are you?" }],
      "You are a helpful tutor.",
      100,
    );
    console.log("LLM Output:", aiText);

    console.log("Testing TTS with text:", aiText || "I am listening.");
    const audio = await textToSpeech(aiText || "I am listening.");
    console.log("TTS Audio generated, length:", audio?.length);
  } catch (err) {
    console.error("Test Error:", err);
  }
}

test();
