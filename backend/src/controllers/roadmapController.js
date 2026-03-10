import {
  getUserRoadmap,
  getCurrentStage,
  checkStageProgress,
  initializeRoadmap,
} from "../services/roadmapService.js";

// GET /api/roadmap
export const getRoadmap = async (req, res) => {
  try {
    let roadmap = await getUserRoadmap(req.user.userId);

    // Auto-initialize if no roadmap found
    if (!roadmap || !roadmap.stages?.length) {
      await initializeRoadmap(req.user.userId, "beginner");
      roadmap = await getUserRoadmap(req.user.userId);
    }

    if (!roadmap) {
      return res
        .status(404)
        .json({ success: false, error: "Roadmap not found" });
    }

    res.json({ success: true, ...roadmap });
  } catch (error) {
    console.error("Roadmap fetch error:", error.message);
    res.status(500).json({ success: false, error: "Failed to load roadmap" });
  }
};

// GET /api/roadmap/current
export const getCurrent = async (req, res) => {
  try {
    let stage = await getCurrentStage(req.user.userId);

    // Auto-initialize if no stage found
    if (!stage) {
      await initializeRoadmap(req.user.userId, "beginner");
      stage = await getCurrentStage(req.user.userId);
    }

    if (!stage) {
      return res.status(404).json({ success: false, error: "Stage not found" });
    }

    res.json({ success: true, ...stage });
  } catch (error) {
    console.error("Current stage error:", error.message);
    res.status(500).json({ success: false, error: "Failed to load stage" });
  }
};

// POST /api/roadmap/advance
export const advance = async (req, res) => {
  try {
    const result = await checkStageProgress(req.user.userId);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Stage advance error:", error.message);
    res.status(500).json({ success: false, error: "Failed to advance stage" });
  }
};
