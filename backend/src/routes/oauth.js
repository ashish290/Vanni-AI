import express from "express";
import passport from "../services/passportService.js";
import {
  googleCallback,
  githubCallback,
} from "../controllers/oauthController.js";

const router = express.Router();

// ── GOOGLE ──
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

// ── GITHUB ──
router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  githubCallback,
);

export default router;
