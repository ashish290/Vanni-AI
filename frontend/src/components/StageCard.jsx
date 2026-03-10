import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentStage } from "../services/api";

/**
 * Small card showing current stage progress in sidebar.
 * Tap navigates to full Roadmap page.
 */
const StageCard = () => {
  const [stage, setStage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStage();
  }, []);

  // Listen for stage updates
  useEffect(() => {
    const handler = () => fetchStage();
    window.addEventListener("xp-updated", handler);
    return () => window.removeEventListener("xp-updated", handler);
  }, []);

  const fetchStage = async () => {
    try {
      const data = await getCurrentStage();
      if (data.success) setStage(data);
    } catch (err) {
      // Silently fail
    }
  };

  if (!stage) return null;

  const progress =
    stage.xpToComplete > 0
      ? Math.min(100, Math.round((stage.stageXp / stage.xpToComplete) * 100))
      : 100;

  return (
    <div className="px-3 py-2">
      <button
        onClick={() => navigate("/roadmap")}
        className="w-full text-left group"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            📍 Stage {stage.stageNumber}
          </span>
          <span className="text-[10px] text-saffron-500 dark:text-saffron-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            View Map →
          </span>
        </div>
        <p className="text-[11px] font-semibold text-navy-700 dark:text-gray-200 mb-1 truncate">
          {stage.emoji} {stage.name}
        </p>
        <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-turmeric-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[9px] text-gray-400 dark:text-gray-600 mt-0.5">
          {stage.xpToComplete > 0
            ? `${stage.xpToComplete - stage.stageXp} XP to next stage`
            : "Final stage"}
        </p>
      </button>
    </div>
  );
};

export default StageCard;
