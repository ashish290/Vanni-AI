import { GoogleGenerativeAI } from "@google/generative-ai";

let client;
let genAI;

const getClient = () => {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Convert messages from [{role, content}] format to Gemini's format.
 * Gemini uses 'user' and 'model' roles (not 'assistant').
 */
const convertMessages = (messages) => {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
};

/**
 * Send a message to Gemini and get a complete response.
 */
export const sendMessage = async ({
  systemPrompt,
  messages,
  model = "gemini-2.0-flash",
  maxTokens = 1024,
}) => {
  const ai = getClient();
  const generativeModel = ai.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: maxTokens,
    },
  });

  // Separate the last user message from history
  const history = convertMessages(messages.slice(0, -1));
  const lastMessage = messages[messages.length - 1];

  const chat = generativeModel.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;

  return response.text();
};

/**
 * Send a message with tool definitions (for orchestrator).
 * Note: For the current orchestrator pipeline design, this isn't actively used,
 * but kept for future tool_use integration with Gemini function calling.
 */
export const sendWithTools = async ({
  systemPrompt,
  messages,
  tools,
  model = "gemini-2.0-flash",
  maxTokens = 1024,
}) => {
  const ai = getClient();

  // Convert tools to Gemini function declarations format
  const functionDeclarations =
    tools?.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.input_schema || tool.parameters,
    })) || [];

  const generativeModel = ai.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    tools:
      functionDeclarations.length > 0 ? [{ functionDeclarations }] : undefined,
    generationConfig: {
      maxOutputTokens: maxTokens,
    },
  });

  const history = convertMessages(messages.slice(0, -1));
  const lastMessage = messages[messages.length - 1];

  const chat = generativeModel.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content);

  return result.response;
};

/**
 * Stream a message from Gemini.
 */
export const streamMessage = async ({
  systemPrompt,
  messages,
  model = "gemini-2.0-flash",
  maxTokens = 1024,
  onChunk,
}) => {
  const ai = getClient();
  const generativeModel = ai.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: maxTokens,
    },
  });

  const history = convertMessages(messages.slice(0, -1));
  const lastMessage = messages[messages.length - 1];

  const chat = generativeModel.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage.content);

  let fullText = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    if (chunkText) {
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }
  }

  return fullText;
};
