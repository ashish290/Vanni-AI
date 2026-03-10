import { User, Plan } from "../models/index.js";

const checkAndResetDaily = async (user) => {
  const today = new Date().toISOString().split("T")[0];
  const lastReset = user.lastReset
    ? new Date(user.lastReset).toISOString().split("T")[0]
    : null;

  if (lastReset !== today) {
    user.dailyCount = 0;
    user.lastReset = today;
    await user.save();
  }
};

export const checkUsageLimit = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(401).json({ error: "User not found" });
    await checkAndResetDaily(user);

    const plan = await Plan.findByPk(user.plan || "free");
    if (!plan) return next();

    // Check plan expiry for paid plans
    if (
      user.plan !== "free" &&
      user.planExpiresAt &&
      new Date() > new Date(user.planExpiresAt)
    ) {
      user.plan = "free";
      user.voiceEnabled = false;
      user.planExpiresAt = null;
      await user.save();

      return res.status(403).json({
        error: "plan_expired",
        message: "Aapka plan expire ho gaya hai! Kripya renew karein.",
      });
    }

    if (plan.dailyLimit === null) {
      req.planUser = user;
      req.planInfo = plan;
      return next();
    }

    if (user.dailyCount >= plan.dailyLimit) {
      return res.status(429).json({
        error: "limit_reached",
        message: "Aaj ki limit ho gayi! 😅",
        currentPlan: user.plan,
        dailyLimit: plan.dailyLimit,
        dailyUsed: user.dailyCount,
        upgradeRequired: true,
      });
    }

    req.planUser = user;
    req.planInfo = plan;
    next();
  } catch (error) {
    console.error("❌ Usage limiter error:", error.message);
    next();
  }
};

export const checkVoiceAccess = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(401).json({ error: "User not found" });

    if (!user.voiceEnabled) {
      return res.status(403).json({
        error: "voice_not_allowed",
        message: "Voice mode Basic ya Pro plan mein hai! 🎤",
        currentPlan: user.plan,
        upgradeRequired: true,
      });
    }

    await checkAndResetDaily(user);
    const plan = await Plan.findByPk(user.plan || "free");

    // Check plan expiry for paid plans
    if (
      user.plan !== "free" &&
      user.planExpiresAt &&
      new Date() > new Date(user.planExpiresAt)
    ) {
      user.plan = "free";
      user.voiceEnabled = false;
      user.planExpiresAt = null;
      await user.save();

      return res.status(403).json({
        error: "plan_expired",
        message: "Aapka plan expire ho gaya hai! Kripya renew karein.",
        currentPlan: user.plan,
        upgradeRequired: true,
      });
    }

    if (
      plan &&
      plan.dailyLimit !== null &&
      user.dailyCount >= plan.dailyLimit
    ) {
      return res.status(429).json({
        error: "limit_reached",
        message: "Aaj ki limit ho gayi! 😅",
        currentPlan: user.plan,
        dailyLimit: plan.dailyLimit,
        dailyUsed: user.dailyCount,
        upgradeRequired: true,
      });
    }

    req.planUser = user;
    req.planInfo = plan;
    next();
  } catch (error) {
    console.error("❌ Voice access check error:", error.message);
    next();
  }
};
