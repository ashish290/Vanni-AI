import fs from "fs";
import { getTTSText } from "./sarvamService.js";

const SARVAM_BASE_URL = "https://api.sarvam.ai";

const getHeaders = (isFormData = false) => {
  const headers = {
    "api-subscription-key": process.env.SARVAM_API_KEY,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

/**
 * Speech-to-Text using Sarvam Saaras
 * Takes an audio file path, sends it to Sarvam, returns transcribed text
 */
export const speechToText = async (audioFilePath) => {
  console.log("Audio File Path:", audioFilePath);

  const form = new FormData();
  const fileBuffer = fs.readFileSync(audioFilePath);
  const blob = new Blob([fileBuffer], { type: "audio/webm" });

  form.append("file", blob, "audio.webm");
  form.append("model", "saaras:v2.5");
  form.append("language_code", "hi-IN");
  form.append("prompt", "transcribe english and hindi, return english script");

  const response = await fetch(`${SARVAM_BASE_URL}/speech-to-text-translate`, {
    method: "POST",
    headers: {
      "api-subscription-key": process.env.SARVAM_API_KEY,
    },
    body: form,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Sarvam STT error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.transcript || data.text;
};

/**
 * Text-to-Speech using Sarvam Bulbul
 */
export const textToSpeech = async (text) => {
  // Safety check: The API requires non-empty strings
  // Also strip tags so the voice doesn't read them
  const safeText = getTTSText(text || ".") || ".";

  const response = await fetch(`${SARVAM_BASE_URL}/text-to-speech`, {
    method: "POST",
    headers: getHeaders(false),
    body: JSON.stringify({
      text: safeText,
      target_language_code: "hi-IN",
      speaker: "shruti",
      model: "bulbul:v3",
      pace: 1.1,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Sarvam TTS error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return data.audios[0];
};
