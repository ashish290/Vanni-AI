import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createOrder,
  verifyPayment,
  getHistory,
  handleWebhook,
} from "../controllers/paymentController.js";

const router = Router();

router.post("/create-order", authMiddleware, createOrder);

router.post("/verify", authMiddleware, verifyPayment);

router.get("/history", authMiddleware, getHistory);

router.post("/webhook", handleWebhook);

export default router;
