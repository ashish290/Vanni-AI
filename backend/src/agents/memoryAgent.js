import {
  getConversationHistory,
  getUserWeakAreas,
  getUserMistakePatterns,
  getLearnedWordsCount,
  findUserById,
  saveMessage,
  saveMistake,
  saveLearnedWord,
  incrementMessageCount,
  updateUserStreak,
  getOrCreateConversation,
  getTopMistakes,
  getConversationTopics,
} from "../services/dbService.js";

/**
 * Retrieves full user context for the orchestrator.
 */
export const getUserContext = async (userId) => {
  try {
    const [
      user,
      history,
      weakAreas,
      mistakePatterns,
      learnedWordsCount,
      topMistakes,
    ] = await Promise.all([
      findUserById(userId),
      getConversationHistory(userId, 20),
      getUserWeakAreas(userId),
      getUserMistakePatterns(userId),
      getLearnedWordsCount(userId),
      getTopMistakes(userId, 5),
    ]);

    return {
      user,
      history,
      weakAreas,
      mistakePatterns,
      learnedWordsCount,
      topMistakes,
      messageCount: user?.messageCount
        ? user.messageCount.toNumber
          ? user.messageCount.toNumber()
          : user.messageCount
        : 0,
      streak: user?.streak
        ? user.streak.toNumber
          ? user.streak.toNumber()
          : user.streak
        : 0,
    };
  } catch (error) {
    console.error("❌ Memory Agent getUserContext error:", error.message);
    return {
      user: null,
      history: [],
      weakAreas: [],
      mistakePatterns: [],
      learnedWordsCount: 0,
      topMistakes: [],
      messageCount: 0,
      streak: 0,
    };
  }
};

/**
 * Saves conversation data, mistakes, and learned words.
 */
export const save = async (
  userId,
  conversationId,
  userMessage,
  assistantReply,
  analysisResult,
) => {
  try {
    // Ensure conversation exists
    const conversation = await getOrCreateConversation(userId, conversationId);
    const convId = conversation.id || conversationId;

    // Save messages
    await saveMessage(convId, "user", userMessage);
    await saveMessage(convId, "assistant", assistantReply);

    // Save mistakes
    if (analysisResult?.mistakes?.length) {
      for (const mistake of analysisResult.mistakes) {
        await saveMistake(userId, mistake);
      }
    }

    // Save learned words
    if (analysisResult?.newWordsUsed?.length) {
      for (const word of analysisResult.newWordsUsed) {
        await saveLearnedWord(
          userId,
          typeof word === "string" ? { text: word } : word,
        );
      }
    }

    // Update user stats
    await incrementMessageCount(userId);
    await updateUserStreak(userId);

    return { conversationId: convId, saved: true };
  } catch (error) {
    console.error("❌ Memory Agent save error:", error.message);
    return { conversationId, saved: false, error: error.message };
  }
};
