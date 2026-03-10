import WebSocket from "ws";
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.SARVAM_API_KEY;

console.log("Testing Saaras WS...");
const sttWs = new WebSocket("wss://api.sarvam.ai/v1/realtime/stt", null, {
  headers: { "api-subscription-key": API_KEY },
});

sttWs.on("open", () => {
  console.log("STT Connected. Sending test init...");
  sttWs.send(
    JSON.stringify({
      target_language_code: "en", // test
      model: "saaras:v3",
    }),
  );
});

sttWs.on("message", (data) => console.log("STT Msg:", data.toString()));
sttWs.on("error", (err) => console.log("STT Err:", err));
sttWs.on("close", (code, reason) =>
  console.log("STT Close:", code, reason.toString()),
);

console.log("Testing Bulbul WS...");
const ttsWs = new WebSocket("wss://api.sarvam.ai/v1/realtime/tts", null, {
  headers: { "api-subscription-key": API_KEY },
});

ttsWs.on("open", () => {
  console.log("TTS Connected. Sending test init...");
  ttsWs.send(
    JSON.stringify({
      inputs: ["Hello how are you?"],
      target_language_code: "hi-IN",
      speaker: "meera",
      model: "bulbul:v3",
    }),
  );
});

ttsWs.on("message", (data) => {
  if (Buffer.isBuffer(data)) {
    console.log("TTS Buffer length:", data.length);
  } else {
    console.log("TTS Msg:", data.toString());
  }
});
ttsWs.on("error", (err) => console.log("TTS Err:", err));
ttsWs.on("close", (code, reason) =>
  console.log("TTS Close:", code, reason.toString()),
);
