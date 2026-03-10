const SARVAM_BASE_URL = "https://api.sarvam.ai/v1";
const DEFAULT_MODEL = "sarvam-m";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "api-subscription-key": process.env.SARVAM_API_KEY,
});

/**
 * Strips internal <think>...</think> reasoning tags from LLM responses.
 * Also removes incomplete <think> tags if the response was cut off.
 */
export const cleanResponse = (text) => {
  if (!text) return text;

  let cleaned = text;

  // 1. Remove properly closed blocks: <think>...</think>
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // 2. Remove any remaining opening/closing <think> tags themselves
  cleaned = cleaned.replace(/<think>/gi, "");
  cleaned = cleaned.replace(/<\/think>/gi, "");

  // 3. Remove Markdown headers
  cleaned = cleaned.replace(/#{1,6}\s/g, "");

  return cleaned.trim();
};

/**
 * Prepares text for TTS by stripping all HTML-like tags and markdown.
 * Used for Sarvam Bulbul TTS input.
 */
export const getTTSText = (text) => {
  if (!text) return "";

  let cleaned = text;

  // 1. Remove properly closed blocks: <think>...</think>
  cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // 2. Remove any remaining thinking tags
  cleaned = cleaned.replace(/<think>/gi, "");
  cleaned = cleaned.replace(/<\/think>/gi, "");

  // 3. Strip highlight and wrong tags
  cleaned = cleaned.replace(/<\/?hl>/gi, "");
  cleaned = cleaned.replace(/<\/?wrong>/gi, "");

  // 4. Strip markdown headers
  cleaned = cleaned.replace(/#{1,6}\s/g, "");

  return cleaned.replace(/\s+/g, " ").trim();
};

/**
 * Chat with Vanni (non-streaming).
 * Calls Sarvam-M LLM and returns plain text reply.
 */
export const chatWithVanni = async (
  messages,
  systemPrompt,
  maxTokens = 1024,
) => {
  const apiMessages = [];

  if (systemPrompt) {
    apiMessages.push({ role: "system", content: systemPrompt });
  }

  for (const msg of messages) {
    apiMessages.push({
      role: msg.role === "model" ? "assistant" : msg.role,
      content: msg.content,
    });
  }

  let response;
  try {
    response = await fetch(`${SARVAM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: apiMessages,
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: false,
      }),
    });
  } catch (error) {
    console.error("fetch failed in chatWithVanni:", error.message);
    if (error.cause) console.error("fetch error cause:", error.cause);
    throw error;
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Sarvam-M error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;
  return cleanResponse(rawContent);
};

/**
 * Stream with Vanni (SSE streaming).
 * Calls Sarvam-M LLM and streams chunks via onChunk callback.
 * Returns the full accumulated text.
 */
export const streamWithVanni = async (
  messages,
  systemPrompt,
  onChunk,
  maxTokens = 1024,
) => {
  const apiMessages = [];

  if (systemPrompt) {
    apiMessages.push({ role: "system", content: systemPrompt });
  }

  for (const msg of messages) {
    apiMessages.push({
      role: msg.role === "model" ? "assistant" : msg.role,
      content: msg.content,
    });
  }

  let response;
  try {
    response = await fetch(`${SARVAM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: apiMessages,
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: true,
      }),
    });
  } catch (error) {
    console.error("fetch failed in streamWithVanni:", error.message);
    if (error.cause) console.error("fetch error cause:", error.cause);
    throw error;
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Sarvam-M stream error (${response.status}): ${errorBody}`);
  }

  let fullText = "";
  let isThinking = false;
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;

      const dataStr = trimmed.slice(6);
      if (dataStr === "[DONE]") continue;

      try {
        const parsed = JSON.parse(dataStr);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;

          // Streaming Cleaner Logic
          // We look for <think> and </think> in the full accumulated text
          // to decide whether to pass the current delta to onChunk.

          const openIndex = fullText.lastIndexOf("<think>");
          const closeIndex = fullText.lastIndexOf("</think>");

          if (openIndex > closeIndex) {
            isThinking = true;
          } else if (closeIndex > openIndex) {
            isThinking = false;
          }

          // If we just transitioned out of thinking, or we are not thinking,
          // and the delta itself isn't part of a tag, send it.
          // Note: This is an approximation. A perfect streaming cleaner is harder.
          // For now, we skip onChunk if we are inside a think block.
          if (
            !isThinking &&
            !delta.includes("<think>") &&
            !delta.includes("</think>")
          ) {
            if (onChunk) onChunk(delta);
          }
        }
      } catch {
        // Skip unparseable chunks
      }
    }
  }

  return cleanResponse(fullText);
};
