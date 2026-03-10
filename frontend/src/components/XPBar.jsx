import { useEffect, useState } from "react";
import { getQuizStats } from "../services/api";
import { Zap } from "lucide-react";

/**
 * XP progress bar shown in sidebar.
 * Shows level name, XP count, and progress to next level.
 */
const XPBar = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getQuizStats();
      if (data.success) setStats(data);
    } catch (err) {
      // Silently fail
    }
  };

  // Listen for custom event to refresh after quiz answer
  useEffect(() => {
    const handler = () => fetchStats();
    window.addEventListener("xp-updated", handler);
    return () => window.removeEventListener("xp-updated", handler);
  }, []);

  if (!stats) return null;

  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <span>{stats.levelIcon}</span>
          {stats.xpLevel}
        </span>
        <span className="text-[10px] font-semibold text-turmeric-600 dark:text-turmeric-400 flex items-center gap-0.5">
          <Zap size={10} />
          {stats.xpPoints} XP
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-turmeric-400 to-saffron-500 transition-all duration-700"
          style={{ width: `${Math.min(100, stats.xpProgress || 0)}%` }}
        />
      </div>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-[9px] text-gray-400 dark:text-gray-600">
          {stats.xpToNextLevel > 0
            ? `${stats.xpToNextLevel} XP to ${stats.nextLevelName}`
            : "Max level reached!"}
        </span>
        {stats.quizStreak > 0 && (
          <span className="text-[9px] text-saffron-500 font-bold">
            🔥 {stats.quizStreak}
          </span>
        )}
      </div>
    </div>
  );
};

export default XPBar;
