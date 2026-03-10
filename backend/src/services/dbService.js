import { Op } from "sequelize";
import {
  sequelize,
  User,
  Conversation,
  Message,
  Mistake,
  LearnedWord,
  GrammarTopic,
  UserWeakArea,
} from "../models/index.js";

export const initDriver = async () => {
  await sequelize.authenticate();
};

export const closeDriver = async () => {
  await sequelize.close();
};

export const createUser = async (userData) => {
  const user = await User.create({
    name: userData.name,
    email: userData.email,
    passwordHash: userData.passwordHash,
    level: userData.level || "beginner",
    otp: userData.otp,
    otpExpiry: userData.otpExpiry,
    isVerified: userData.isVerified || false,
  });
  return user.toJSON();
};

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user ? user.toJSON() : null;
};

export const findUserById = async (id) => {
  const user = await User.findByPk(id);
  return user ? user.toJSON() : null;
};

export const createConversation = async (userId) => {
  const conversation = await Conversation.create({ userId });
  return conversation.toJSON();
};

export const getConversationHistory = async (userId, limit = 20) => {
  const conversations = await Conversation.findAll({
    where: { userId },
    include: [
      {
        model: Message,
        as: "messages",
        order: [["createdAt", "ASC"]],
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  const allMessages = conversations
    .flatMap((c) => c.messages || [])
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-limit)
    .map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    }));

  return allMessages;
};

export const getOrCreateConversation = async (userId, conversationId) => {
  if (conversationId) {
    const conversation = await Conversation.findByPk(conversationId);
    if (conversation) return conversation.toJSON();
  }
  return await createConversation(userId);
};

// Get all conversations for sidebar listing
export const getUserConversations = async (userId) => {
  const conversations = await Conversation.findAll({
    where: { userId },
    include: [
      {
        model: Message,
        as: "messages",
        attributes: ["content", "role", "createdAt"],
        order: [["createdAt", "ASC"]],
        limit: 1, // just the first message for preview
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return conversations.map((c) => {
    const firstUserMsg = c.messages?.find((m) => m.role === "user");
    const firstMsg = c.messages?.[0];
    return {
      id: c.id,
      title:
        firstUserMsg?.content?.slice(0, 60) ||
        firstMsg?.content?.slice(0, 60) ||
        "New conversation",
      messageCount: c.messageCount,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  });
};

// Get all messages for a specific conversation
export const getConversationMessages = async (conversationId) => {
  const messages = await Message.findAll({
    where: { conversationId },
    order: [["createdAt", "ASC"]],
    attributes: ["id", "role", "content", "createdAt"],
  });
  return messages.map((m) => m.toJSON());
};

// Delete a conversation and all its messages
export const deleteConversation = async (conversationId, userId) => {
  const conversation = await Conversation.findOne({
    where: { id: conversationId, userId },
  });
  if (!conversation) return false;
  await Message.destroy({ where: { conversationId } });
  await conversation.destroy();
  return true;
};

// ─── Message Functions ──────────────────────────────────────

export const saveMessage = async (conversationId, role, content) => {
  const message = await Message.create({ conversationId, role, content });

  // Increment conversation message count
  await Conversation.increment("messageCount", {
    where: { id: conversationId },
  });

  return message.toJSON();
};

// ─── Mistake Functions ──────────────────────────────────────

export const upsertMistake = async (userId, mistakeData) => {
  // Try to find an existing mistake of the same type and content for this user
  // We identify "repetition" by mistakeType + userId
  const mistakeType = mistakeData.type || "general";
  const original = mistakeData.original;

  let mistake = await Mistake.findOne({
    where: { userId, mistakeType, original },
  });

  if (mistake) {
    // If it exists, increment count and update lastSeen
    await mistake.increment("count");
    await mistake.update({ lastSeen: new Date() });
    return mistake.toJSON();
  }

  // Find or create the grammar topic
  const [topic] = await GrammarTopic.findOrCreate({
    where: { name: mistakeType },
    defaults: { description: "" },
  });

  // If new, create the mistake
  mistake = await Mistake.create({
    userId,
    mistakeType,
    type: mistakeType, // keep old 'type' col for compatibility for now
    original: mistakeData.original,
    correction: mistakeData.correction,
    explanation: mistakeData.explanation || "",
    grammarTopicId: topic.id,
  });

  // Add to user's weak areas
  const user = await User.findByPk(userId);
  if (user) {
    await user.addWeakArea(topic);
  }

  return mistake.toJSON();
};

export const getTopMistakes = async (userId, limit = 3) => {
  const mistakes = await Mistake.findAll({
    where: { userId },
    order: [
      ["count", "DESC"],
      ["lastSeen", "DESC"],
    ],
    limit,
  });
  return mistakes.map((m) => m.toJSON());
};

export const getConversationTopics = async (
  userId,
  conversationId,
  limit = 20,
) => {
  const messages = await Message.findAll({
    where: { conversationId },
    order: [["createdAt", "DESC"]],
    limit,
  });

  // Simple topic extraction (can be enhanced later)
  // For now, return the last few messages for the LLM to analyze
  return messages.reverse().map((m) => ({
    role: m.role,
    content: m.content,
  }));
};

// Deprecated in favor of upsertMistake, but kept for compatibility
export const saveMistake = async (userId, mistakeData) => {
  return await upsertMistake(userId, mistakeData);
};

// ─── Word Functions ─────────────────────────────────────────

export const saveLearnedWord = async (userId, wordData) => {
  const text = typeof wordData === "string" ? wordData : wordData.text;

  const [word, created] = await LearnedWord.findOrCreate({
    where: { userId, text },
    defaults: {
      meaning: wordData.meaning || "",
      category: wordData.category || "general",
      difficulty: wordData.difficulty || "unknown",
    },
  });

  return word.toJSON();
};

// ─── Analytics Functions ────────────────────────────────────

export const getUserWeakAreas = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return [];

  const weakAreas = await user.getWeakAreas();

  // Count mistakes per topic
  const result = [];
  for (const topic of weakAreas) {
    const mistakeCount = await Mistake.count({
      where: { userId, grammarTopicId: topic.id },
    });
    result.push({ topic: topic.name, mistakeCount });
  }

  return result.sort((a, b) => b.mistakeCount - a.mistakeCount).slice(0, 5);
};

export const getUserMistakePatterns = async (userId) => {
  const mistakes = await Mistake.findAll({
    where: { userId },
    attributes: [
      "type",
      [sequelize.fn("COUNT", sequelize.col("type")), "count"],
    ],
    group: ["type"],
    order: [[sequelize.fn("COUNT", sequelize.col("type")), "DESC"]],
    limit: 5,
    raw: true,
  });

  return mistakes.map((m) => ({
    type: m.type,
    count: parseInt(m.count),
  }));
};

export const getLearnedWordsCount = async (userId) => {
  return await LearnedWord.count({ where: { userId } });
};

// ─── User Stats Functions ───────────────────────────────────

export const updateUserStreak = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return;

  const now = new Date();
  const lastActive = user.lastActive ? new Date(user.lastActive) : null;

  let newStreak = 1;
  if (lastActive) {
    const diffDays = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      newStreak = user.streak + 1; // consecutive day
    } else if (diffDays === 0) {
      newStreak = user.streak; // same day
    }
    // else resets to 1
  }

  await user.update({ streak: newStreak, lastActive: now });
};

export const incrementMessageCount = async (userId) => {
  await User.increment("messageCount", { where: { id: userId } });
  await User.increment("dailyCount", { where: { id: userId } });
};

export const updateUserLevel = async (userId, level) => {
  const user = await User.findByPk(userId);
  if (!user) return null;
  await user.update({ level });
  return user.toJSON();
};
