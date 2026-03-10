import express from "express";
import multer from "multer";
import {
  handleSTT,
  handleTTS,
  handleConversation,
} from "../controllers/voiceController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkVoiceAccess } from "../middleware/usageLimiter.js";

const router = express.Router();

import os from "os";
const upload = multer({ dest: os.tmpdir() });

router.use(authMiddleware);
router.use(checkVoiceAccess);

router.post("/stt", upload.single("file"), handleSTT);

router.post("/tts", handleTTS);

router.post("/conversation", handleConversation);

export default router;
