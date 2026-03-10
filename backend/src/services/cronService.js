import cron from "node-cron";
import { Op } from "sequelize";
import { User } from "../models/index.js";

/**
 * Initializes cron jobs for the application.
 * - Runs every hour to check for expired plans
 */
export const initCronJobs = () => {
  // Run at minute 0 past every hour (e.g. 10:00, 11:00)
  cron.schedule("0 * * * *", async () => {
    console.log("[CRON] Running hourly plan expiry check...");
    try {
      // Find all users who are not on a free plan, and whose planExpiresAt is in the past
      const expiredUsers = await User.findAll({
        where: {
          plan: {
            [Op.notIn]: ["free"],
          },
          planExpiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });

      if (expiredUsers.length === 0) {
        console.log("[CRON]  No expired plans found this hour.");
        return;
      }

      console.log(
        `[CRON] Found ${expiredUsers.length} users with expired plans. Downgrading...`,
      );

      // Update in a transaction or individually. We'll do it individually here for simplicity and safety
      // if one fails, others still process
      let count = 0;
      for (const user of expiredUsers) {
        user.plan = "free";
        user.voiceEnabled = false;
        user.planExpiresAt = null;
        await user.save();
        count++;
      }

      console.log(
        `[CRON] Successfully downgraded ${count} users to the free plan.`,
      );
    } catch (error) {
      console.error("[CRON] Error during plan expiry check:", error);
    }
  });

  console.log("⌚ Cron jobs initialized successfully.");
};
