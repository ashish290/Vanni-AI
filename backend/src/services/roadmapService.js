import { User, RoadmapProgress } from "../models/index.js";
import { getRoadmapForLevel, getStageData } from "../data/roadmapData.js";

// ─── Initialize Roadmap ─────────────────────────────────────

export const initializeRoadmap = async (userId, level) => {
  const roadmap = getRoadmapForLevel(level);
  const rows = roadmap.stages.map((s) => ({
    userId,
    roadmap: level,
    stage: s.stage,
    status: s.stage === 1 ? "current" : "locked",
    xpEarned: 0,
  }));

  await RoadmapProgress.bulkCreate(rows, { ignoreDuplicates: true });

  await User.update(
    {
      currentRoadmap: level,
      currentStage: 1,
      stageXp: 0,
      roadmapStartedAt: new Date(),
    },
    { where: { id: userId } },
  );

  return { roadmap: level, stages: rows };
};

// ─── Get User Roadmap ───────────────────────────────────────

export const getUserRoadmap = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  const level = user.currentRoadmap || user.level || "beginner";
  const roadmapData = getRoadmapForLevel(level);

  const progressRows = await RoadmapProgress.findAll({
    where: { userId, roadmap: level },
    order: [["stage", "ASC"]],
  });

  // Merge static data with user progress
  const stages = roadmapData.stages.map((s) => {
    const progress = progressRows.find((p) => p.stage === s.stage);
    return {
      ...s,
      status: progress?.status || "locked",
      xpEarned: progress?.xpEarned || 0,
      completedAt: progress?.completedAt || null,
    };
  });

  return {
    level,
    name: roadmapData.name,
    icon: roadmapData.icon,
    totalXp: roadmapData.totalXp,
    currentStage: user.currentStage,
    stageXp: user.stageXp,
    xpPoints: user.xpPoints,
    stages,
  };
};

// ─── Get Current Stage ──────────────────────────────────────

export const getCurrentStage = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  const level = user.currentRoadmap || user.level || "beginner";
  const stageData = getStageData(level, user.currentStage);

  const progress = await RoadmapProgress.findOne({
    where: { userId, roadmap: level, stage: user.currentStage },
  });

  return {
    roadmap: level,
    stageNumber: user.currentStage,
    name: stageData.name,
    emoji: stageData.emoji,
    topics: stageData.topics,
    goals: stageData.goals,
    xpRequired: stageData.xpRequired,
    xpToComplete: stageData.xpToComplete,
    xpEarned: progress?.xpEarned || 0,
    stageXp: user.stageXp,
    totalXp: user.xpPoints,
  };
};

// ─── Check Stage Progress ───────────────────────────────────

export const checkStageProgress = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return { advanced: false };

  const level = user.currentRoadmap || user.level || "beginner";
  const roadmapData = getRoadmapForLevel(level);
  const currentStageData = getStageData(level, user.currentStage);
  const nextStageData = roadmapData.stages.find(
    (s) => s.stage === user.currentStage + 1,
  );

  // Check if user has enough XP to advance
  if (!nextStageData) return { advanced: false }; // Already at final stage
  if (user.xpPoints < nextStageData.xpRequired) return { advanced: false };

  // Advance: complete current, unlock next
  await RoadmapProgress.update(
    {
      status: "completed",
      completedAt: new Date(),
      xpEarned: currentStageData.xpToComplete,
    },
    { where: { userId, roadmap: level, stage: user.currentStage } },
  );

  await RoadmapProgress.update(
    { status: "current" },
    { where: { userId, roadmap: level, stage: nextStageData.stage } },
  );

  await User.update(
    { currentStage: nextStageData.stage, stageXp: 0 },
    { where: { id: userId } },
  );

  return {
    advanced: true,
    previousStage: {
      stage: currentStageData.stage,
      name: currentStageData.name,
    },
    newStage: {
      stage: nextStageData.stage,
      name: nextStageData.name,
      emoji: nextStageData.emoji,
      topics: nextStageData.topics,
    },
  };
};

// ─── Get Stage Context (for Vanni prompt) ───────────────────

export const getStageContext = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  const level = user.currentRoadmap || user.level || "beginner";
  const stageData = getStageData(level, user.currentStage);

  return {
    roadmap: level,
    stageName: `Stage ${stageData.stage}: ${stageData.name} ${stageData.emoji}`,
    topics: stageData.topics,
    goals: stageData.goals,
    currentGoal: stageData.goals[0] || "Keep practicing",
    xpProgress: `${user.xpPoints}/${stageData.xpRequired + stageData.xpToComplete} XP`,
  };
};
