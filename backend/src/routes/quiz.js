import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { generate, answer, stats } from "../controllers/quizController.js";

const router = Router();

router.use(authMiddleware);

router.post("/generate", generate);
router.post("/answer", answer);
router.get("/stats", stats);

export default router;
