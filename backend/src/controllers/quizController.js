import {
  generateQuiz,
  evaluateAnswer,
  getQuizStats,
} from "../services/quizService.js";
import { getConversationHistory } from "../services/dbService.js";
import { getUserContext } from "../agents/memoryAgent.js";

// POST /api/quiz/generate
export const generate = async (req, res) => {
  try {
    const { conversationId } = req.body;
    if (!conversationId) {
      return res.status(400).json({ error: "conversationId is required" });
    }

    const history = await getConversationHistory(req.user.userId, 10);
    const userContext = await getUserContext(req.user.userId);

    const quiz = await generateQuiz(
      conversationId,
      req.user.userId,
      history,
      userContext?.weakAreas || [],
    );

    if (!quiz) {
      return res.status(500).json({ error: "Failed to generate quiz" });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    console.error("Quiz generate error:", error.message);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
};

// POST /api/quiz/answer
export const answer = async (req, res) => {
  try {
    const { quizId, answer: userAnswer } = req.body;
    if (!quizId || !userAnswer) {
      return res.status(400).json({ error: "quizId and answer are required" });
    }

    const result = await evaluateAnswer(quizId, userAnswer, req.user.userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Quiz answer error:", error.message);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
};

// GET /api/quiz/stats
export const stats = async (req, res) => {
  try {
    const quizStats = await getQuizStats(req.user.userId);
    res.json({ success: true, ...quizStats });
  } catch (error) {
    console.error("Quiz stats error:", error.message);
    res.status(500).json({ error: "Failed to get quiz stats" });
  }
};
