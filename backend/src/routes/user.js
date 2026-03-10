import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getProfile,
  getProgress,
  changeLevel,
} from "../controllers/userController.js";

const router = Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.get("/progress", getProgress);
router.patch("/level", changeLevel);

export default router;
