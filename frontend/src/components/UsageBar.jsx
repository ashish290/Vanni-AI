import { useNavigate } from "react-router-dom";
import { usePlan } from "../context/PlanContext";
import { Crown, Zap, ArrowUpRight } from "lucide-react";

/**
 * Usage bar + plan badge + upgrade button in sidebar.
 */
const UsageBar = () => {
  const navigate = useNavigate();
  const { plan, dailyUsed, dailyLimit, usagePercent } = usePlan();

  // Pro users — show Pro badge, no bar
  if (plan === "pro" || dailyLimit === null) {
    return (
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-turmeric-500/10 to-saffron-500/10 dark:from-turmeric-500/20 dark:to-saffron-500/20 border border-turmeric-400/30 dark:border-turmeric-500/30">
          <Crown size={14} className="text-turmeric-500" />
          <span className="text-xs font-bold text-turmeric-600 dark:text-turmeric-400 uppercase tracking-wider">
            Pro Plan
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">
            Unlimited ✨
          </span>
        </div>
      </div>
    );
  }

  // Basic users — show Basic badge + usage
  if (plan === "basic") {
    return (
      <div className="px-3 py-2.5 space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-saffron-500/10 dark:bg-saffron-500/20 border border-saffron-400/30 dark:border-saffron-500/30">
          <Zap size={14} className="text-saffron-500" />
          <span className="text-xs font-bold text-saffron-600 dark:text-saffron-400 uppercase tracking-wider">
            Basic Plan
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto">
            {dailyUsed}/{dailyLimit}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(usagePercent)} ${usagePercent >= 100 ? "animate-pulse" : ""}`}
            style={{ width: `${Math.min(100, usagePercent)}%` }}
          />
        </div>
        <button
          onClick={() => navigate("/upgrade")}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-saffron-500 dark:text-saffron-400 hover:text-saffron-600 dark:hover:text-saffron-300 py-1 transition-colors"
        >
          Upgrade to Pro <ArrowUpRight size={12} />
        </button>
      </div>
    );
  }

  // Free users — show usage + upgrade button
  return (
    <div className="px-3 py-2.5 space-y-2">
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider ${getTextColor(usagePercent)}`}
        >
          {dailyUsed}/{dailyLimit} messages
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">
          Free Plan
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor(usagePercent)} ${usagePercent >= 100 ? "animate-pulse" : ""}`}
          style={{ width: `${Math.min(100, usagePercent)}%` }}
        />
      </div>
      <button
        onClick={() => navigate("/upgrade")}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white text-xs font-bold shadow-md shadow-saffron-500/15 hover:shadow-lg hover:shadow-saffron-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      >
        Upgrade Plan <ArrowUpRight size={13} />
      </button>
    </div>
  );
};

function getBarColor(percent) {
  if (percent >= 85) return "bg-red-500";
  if (percent >= 60) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getTextColor(percent) {
  if (percent >= 85) return "text-red-500 dark:text-red-400";
  if (percent >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-gray-500 dark:text-gray-400";
}

export default UsageBar;
