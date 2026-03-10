import { Op } from "sequelize";
import { Quiz, QuizSession, User, Message } from "../models/index.js";
import { generateQuizFromConversation } from "../agents/quizAgent.js";

// ─── XP Level Thresholds ────────────────────────────────────

const LEVEL_THRESHOLDS = [
  { min: 0, max: 100, name: "Beginner", icon: "🌱" },
  { min: 101, max: 300, name: "Elementary", icon: "📚" },
  { min: 301, max: 600, name: "Intermediate", icon: "⭐" },
  { min: 601, max: 1000, name: "Advanced", icon: "🔥" },
  { min: 1001, max: 2000, name: "Expert", icon: "💎" },
  { min: 2001, max: Infinity, name: "Master", icon: "👑" },
];

// ─── Badge Definitions ──────────────────────────────────────

const BADGE_DEFINITIONS = [
  {
    id: "first_step",
    name: "First Step",
    icon: "🎯",
    condition: (s) => s.totalQuizzes >= 1,
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    icon: "🗓️",
    condition: (s) => s.quizStreak >= 7,
  },
  {
    id: "sharp_mind",
    name: "Sharp Mind",
    icon: "🧠",
    condition: (s) => s.correctAnswers >= 50,
  },
  {
    id: "century_club",
    name: "Century Club",
    icon: "💯",
    condition: (s) => s.correctAnswers >= 100,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    icon: "✨",
    condition: (s) => s.perfectQuizzes >= 5,
  },
  {
    id: "rising_star",
    name: "Rising Star",
    icon: "⭐",
    condition: (s) => s.xpLevel === "Intermediate",
  },
];

// ─── Should Trigger Quiz ────────────────────────────────────

export const shouldTriggerQuiz = async (conversationId) => {
  if (!conversationId) return false;

  try {
    // Count user messages in this conversation
    const messageCount = await Message.count({
      where: { conversationId, role: "user" },
    });

    // Trigger every 5 user messages (5, 10, 15...)
    if (messageCount < 5) return false;
    if (messageCount % 5 !== 0) return false;

    // Check last quiz wasn't too recent
    const lastQuiz = await Quiz.findOne({
      where: { conversationId },
      order: [["createdAt", "DESC"]],
    });

    if (lastQuiz) {
      const messagesSinceQuiz = await Message.count({
        where: {
          conversationId,
          role: "user",
          createdAt: { [Op.gt]: lastQuiz.createdAt },
        },
      });
      if (messagesSinceQuiz < 4) return false;
    }

    return true;
  } catch (error) {
    console.error("❌ shouldTriggerQuiz error:", error.message);
    return false;
  }
};

// ─── Generate Quiz ──────────────────────────────────────────

export const generateQuiz = async (
  conversationId,
  userId,
  conversationHistory,
  weakAreas,
) => {
  try {
    // Find last quiz type to avoid repeating
    const lastQuiz = await Quiz.findOne({
      where: { conversationId },
      order: [["createdAt", "DESC"]],
    });
    const avoidType = lastQuiz?.quizType || null;

    // Get last 3 question texts to avoid repeats
    const recentQuizzes = await Quiz.findAll({
      where: { conversationId },
      order: [["createdAt", "DESC"]],
      limit: 3,
      attributes: ["question"],
    });
    const askedQuestions = recentQuizzes.map((q) => q.question);

    const quizData = await generateQuizFromConversation(
      conversationHistory,
      weakAreas,
      avoidType,
      askedQuestions,
    );

    const quiz = await Quiz.create({
      userId,
      conversationId,
      question: quizData.question,
      quizType: quizData.type || "grammar_fix",
      options: quizData.options,
      correctAnswer: quizData.correct,
      explanation: quizData.explanation || "",
      hint: quizData.hint || "",
    });

    // Return quiz without correct answer (for frontend)
    return {
      id: quiz.id,
      question: quiz.question,
      type: quiz.quizType,
      options: quiz.options,
      hint: quiz.hint,
    };
  } catch (error) {
    console.error("❌ generateQuiz error:", error.message);
    return null;
  }
};

// ─── Evaluate Answer ────────────────────────────────────────

export const evaluateAnswer = async (quizId, userAnswer, userId) => {
  try {
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) throw new Error("Quiz not found");

    const isCorrect =
      userAnswer.toLowerCase() === quiz.correctAnswer.toLowerCase();

    // Get user for XP calculation
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    // Calculate XP
    const xpEarned = calculateXP(isCorrect, user.quizStreak);

    // Update quiz record
    quiz.userAnswer = userAnswer;
    quiz.isCorrect = isCorrect;
    quiz.xpEarned = xpEarned;
    quiz.answeredAt = new Date();
    await quiz.save();

    // Update user stats
    const oldXP = user.xpPoints;
    user.xpPoints += xpEarned;
    user.totalQuizzes += 1;

    if (isCorrect) {
      user.correctAnswers += 1;
      user.quizStreak += 1;
    } else {
      user.quizStreak = 0;
    }

    // Check level up
    const newLevel = getLevelForXP(user.xpPoints);
    const leveledUp = newLevel.name !== user.xpLevel;
    user.xpLevel = newLevel.name;

    // Check new badges
    const newBadges = checkNewBadges(user);
    if (newBadges.length > 0) {
      const currentBadges = user.badges || [];
      user.badges = [...currentBadges, ...newBadges.map((b) => b.id)];
    }

    await user.save();

    return {
      isCorrect,
      correctAnswer: quiz.correctAnswer,
      correctOptionText: quiz.options[quiz.correctAnswer],
      explanation: quiz.explanation,
      xpEarned,
      newTotalXP: user.xpPoints,
      newLevel: newLevel.name,
      levelIcon: newLevel.icon,
      leveledUp,
      newBadges,
      streakCount: user.quizStreak,
    };
  } catch (error) {
    console.error("❌ evaluateAnswer error:", error.message);
    throw error;
  }
};

// ─── Get Quiz Stats ─────────────────────────────────────────

export const getQuizStats = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const level = getLevelForXP(user.xpPoints);
    const nextLevel = LEVEL_THRESHOLDS.find((l) => l.min > user.xpPoints);

    const recentQuizzes = await Quiz.findAll({
      where: { userId, userAnswer: { [Op.ne]: null } },
      order: [["answeredAt", "DESC"]],
      limit: 10,
    });

    const accuracy =
      user.totalQuizzes > 0
        ? Math.round((user.correctAnswers / user.totalQuizzes) * 100)
        : 0;

    return {
      xpPoints: user.xpPoints,
      xpLevel: level.name,
      levelIcon: level.icon,
      xpToNextLevel: nextLevel ? nextLevel.min - user.xpPoints : 0,
      nextLevelName: nextLevel ? nextLevel.name : "Max",
      xpProgress: nextLevel
        ? Math.round(
            ((user.xpPoints - level.min) / (nextLevel.min - level.min)) * 100,
          )
        : 100,
      quizStreak: user.quizStreak,
      totalQuizzes: user.totalQuizzes,
      correctAnswers: user.correctAnswers,
      accuracy,
      badges: (user.badges || [])
        .map((id) => {
          const badge = BADGE_DEFINITIONS.find((b) => b.id === id);
          return badge
            ? { id: badge.id, name: badge.name, icon: badge.icon }
            : null;
        })
        .filter(Boolean),
      recentQuizzes: recentQuizzes.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.quizType,
        isCorrect: q.isCorrect,
        xpEarned: q.xpEarned,
        answeredAt: q.answeredAt,
      })),
    };
  } catch (error) {
    console.error("❌ getQuizStats error:", error.message);
    throw error;
  }
};

// ─── Helpers ────────────────────────────────────────────────

function calculateXP(isCorrect, currentStreak) {
  let xp = 0;

  if (isCorrect) {
    xp = 10; // Correct answer
    // Streak bonuses
    if (currentStreak + 1 >= 5) xp += 10;
    else if (currentStreak + 1 >= 3) xp += 5;
  } else {
    xp = 2; // Participation XP
  }

  return xp;
}

function getLevelForXP(xp) {
  for (const level of LEVEL_THRESHOLDS) {
    if (xp >= level.min && xp <= level.max) return level;
  }
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

function checkNewBadges(user) {
  const currentBadges = user.badges || [];
  const newBadges = [];

  const stats = {
    totalQuizzes: user.totalQuizzes,
    correctAnswers: user.correctAnswers,
    quizStreak: user.quizStreak,
    xpLevel: user.xpLevel,
    perfectQuizzes: 0, // Could track separately
  };

  for (const badge of BADGE_DEFINITIONS) {
    if (!currentBadges.includes(badge.id) && badge.condition(stats)) {
      newBadges.push({ id: badge.id, name: badge.name, icon: badge.icon });
    }
  }

  return newBadges;
}
