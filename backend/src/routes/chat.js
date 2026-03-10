import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkUsageLimit } from "../middleware/usageLimiter.js";
import {
  chat,
  chatStream,
  createNewConversation,
  getHistory,
  listConversations,
  getMessages,
  removeConversation,
} from "../controllers/chatController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", checkUsageLimit, chat);
router.post("/stream", checkUsageLimit, chatStream);
router.post("/conversation", createNewConversation);
router.get("/history", getHistory);
router.get("/conversations", listConversations);
router.get("/conversations/:id/messages", getMessages);
router.delete("/conversations/:id", removeConversation);

export default router;
