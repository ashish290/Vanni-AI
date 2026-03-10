import { User, Plan, Upgrade } from "../models/index.js";

// ─── GET /api/plan/status ───────────────────────────────────
export const getPlanStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const plan = await Plan.findByPk(user.plan || "free");

    // Reset daily count if new day
    const today = new Date().toISOString().split("T")[0];
    const lastReset = user.lastReset
      ? new Date(user.lastReset).toISOString().split("T")[0]
      : null;
    if (lastReset !== today) {
      user.dailyCount = 0;
      user.lastReset = today;
      await user.save();
    }

    const dailyLimit = plan?.dailyLimit ?? null;
    const dailyRemaining =
      dailyLimit === null ? null : Math.max(0, dailyLimit - user.dailyCount);

    res.json({
      success: true,
      plan: user.plan,
      dailyLimit,
      dailyUsed: user.dailyCount,
      dailyRemaining,
      voiceEnabled: user.voiceEnabled,
      resetTime: "Midnight IST (12:00 AM)",
    });
  } catch (error) {
    console.error("Plan status error:", error.message);
    res.status(500).json({ error: "Failed to get plan status" });
  }
};

// ─── GET /api/plan/all ──────────────────────────────────────
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({ order: [["priceMonthly", "ASC"]] });

    const planDetails = plans.map((p) => ({
      name: p.name,
      dailyLimit: p.dailyLimit,
      voiceEnabled: p.voiceEnabled,
      historyDays: p.historyDays,
      priceMonthly: p.priceMonthly,
      features: buildFeatures(p),
    }));

    res.json({ success: true, plans: planDetails });
  } catch (error) {
    console.error("Get plans error:", error.message);
    res.status(500).json({ error: "Failed to get plans" });
  }
};

// ─── POST /api/plan/upgrade ─────────────────────────────────
export const upgradePlan = async (req, res) => {
  try {
    const { plan: newPlan, paymentRef } = req.body;

    if (!["basic", "pro"].includes(newPlan)) {
      return res
        .status(400)
        .json({ error: "Invalid plan. Choose basic or pro." });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const planInfo = await Plan.findByPk(newPlan);
    if (!planInfo) return res.status(400).json({ error: "Plan not found" });

    const fromPlan = user.plan;

    // Save upgrade record
    await Upgrade.create({
      userId: user.id,
      fromPlan,
      toPlan: newPlan,
      paymentRef: paymentRef || null,
    });

    // Update user
    user.plan = newPlan;
    user.voiceEnabled = planInfo.voiceEnabled;
    await user.save();

    res.json({
      success: true,
      message: `Plan upgraded to ${newPlan}! 🎉`,
      plan: user.plan,
      voiceEnabled: user.voiceEnabled,
    });
  } catch (error) {
    console.error("Upgrade error:", error.message);
    res.status(500).json({ error: "Failed to upgrade plan" });
  }
};

// ─── Helper ─────────────────────────────────────────────────
function buildFeatures(plan) {
  const features = [];
  features.push(
    plan.dailyLimit === null
      ? "Unlimited messages"
      : `${plan.dailyLimit} messages/day`,
  );
  features.push(plan.voiceEnabled ? "Voice mode ✅" : "Text mode only");
  features.push(
    plan.historyDays === null
      ? "Full history forever"
      : `Last ${plan.historyDays} days history`,
  );
  if (plan.name === "pro") features.push("All future features");
  return features;
}
