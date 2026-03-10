import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getRoadmap,
  getCurrent,
  advance,
} from "../controllers/roadmapController.js";

const router = Router();

// GET /api/roadmap — full roadmap with progress
router.get("/", authMiddleware, getRoadmap);

// GET /api/roadmap/current — current stage details
router.get("/current", authMiddleware, getCurrent);

// POST /api/roadmap/advance — check and advance stage
router.post("/advance", authMiddleware, advance);

export default router;
