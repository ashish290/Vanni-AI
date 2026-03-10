import {
  findUserById,
  getUserWeakAreas,
  getUserMistakePatterns,
  getLearnedWordsCount,
  updateUserLevel,
} from "../services/dbService.js";

// GET /api/user/profile
export const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        messageCount: user.messageCount?.toNumber
          ? user.messageCount.toNumber()
          : user.messageCount || 0,
        streak: user.streak?.toNumber
          ? user.streak.toNumber()
          : user.streak || 0,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/progress
export const getProgress = async (req, res, next) => {
  try {
    const [weakAreas, mistakePatterns, learnedWordsCount] = await Promise.all([
      getUserWeakAreas(req.user.userId),
      getUserMistakePatterns(req.user.userId),
      getLearnedWordsCount(req.user.userId),
    ]);

    const user = await findUserById(req.user.userId);

    res.json({
      success: true,
      progress: {
        weakAreas,
        mistakePatterns,
        learnedWordsCount,
        streak: user?.streak?.toNumber
          ? user.streak.toNumber()
          : user?.streak || 0,
        messageCount: user?.messageCount?.toNumber
          ? user.messageCount.toNumber()
          : user?.messageCount || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/user/level
export const changeLevel = async (req, res, next) => {
  try {
    const { level } = req.body;
    const validLevels = ["beginner", "intermediate", "advanced"];

    if (!level || !validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        error: "Invalid level. Must be: beginner, intermediate, or advanced",
      });
    }

    const user = await updateUserLevel(req.user.userId, level);
    res.json({ success: true, level: user.level });
  } catch (error) {
    next(error);
  }
};
