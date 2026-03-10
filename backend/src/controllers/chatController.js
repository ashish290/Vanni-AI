import { run, runStream } from "../agents/orchestratorAgent.js";
import {
  createConversation,
  getConversationHistory,
  getUserConversations,
  getConversationMessages,
  deleteConversation,
} from "../services/dbService.js";

// POST /api/chat — regular chat
export const chat = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    const result = await run(req.user.userId, message.trim(), conversationId);

    res.json({
      success: true,
      reply: result.reply,
      conversationId: result.conversationId,
      messageCount: result.messageCount,
    });
  } catch (error) {
    console.error("❌ Chat error:", error.message);
    res.status(500).json({
      success: false,
      error: "Vanni chai break pe hai ☕ — ek minute mein wapas aayegi!",
    });
  }
};

// POST /api/chat/stream — SSE streaming chat
export const chatStream = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    await runStream(req.user.userId, message.trim(), conversationId, res);
  } catch (error) {
    console.error("❌ Stream error:", error.message);
    res.write(
      `data: ${JSON.stringify({ error: "Vanni chai break pe hai ☕ — ek minute mein wapas aayegi!" })}\n\n`,
    );
    res.end();
  }
};

// POST /api/chat/conversation — create new conversation
export const createNewConversation = async (req, res, next) => {
  try {
    const conversation = await createConversation(req.user.userId);
    res.status(201).json({ success: true, conversationId: conversation.id });
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/history — get recent message history
export const getHistory = async (req, res, next) => {
  try {
    const messages = await getConversationHistory(req.user.userId, 20);
    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/conversations — list all past conversations
export const listConversations = async (req, res, next) => {
  try {
    const conversations = await getUserConversations(req.user.userId);
    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// GET /api/chat/conversations/:id/messages — get messages for a conversation
export const getMessages = async (req, res, next) => {
  try {
    const messages = await getConversationMessages(req.params.id);
    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/chat/conversations/:id — delete a conversation
export const removeConversation = async (req, res, next) => {
  try {
    const deleted = await deleteConversation(req.params.id, req.user.userId);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, error: "Conversation not found" });
    }
    res.json({ success: true, message: "Conversation deleted" });
  } catch (error) {
    next(error);
  }
};
