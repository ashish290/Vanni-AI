import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getPlanStatus,
  getAllPlans,
  upgradePlan,
} from "../controllers/planController.js";

const router = Router();

router.use(authMiddleware);

router.get("/status", getPlanStatus);
router.get("/all", getAllPlans);
router.post("/upgrade", upgradePlan);

export default router;
