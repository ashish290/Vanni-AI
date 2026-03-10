import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoadmap } from "../services/api";
import { ChevronLeft } from "lucide-react";

const Roadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStage, setExpandedStage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const data = await getRoadmap();
      if (data.success) setRoadmap(data);
    } catch (err) {
      console.error("Roadmap error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-saffron-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Roadmap not available yet.
        </p>
      </div>
    );
  }

  const completedCount = roadmap.stages.filter(
    (s) => s.status === "completed",
  ).length;
  const progressPercent = Math.round(
    (completedCount / roadmap.stages.length) * 100,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate("/chat")}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          </button>
          <div className="flex-1">
            <h1 className="font-poppins font-bold text-lg text-navy-700 dark:text-white">
              {roadmap.icon} {roadmap.name} Roadmap
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-saffron-400 to-turmeric-500 transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                {progressPercent}%
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-turmeric-600 dark:text-turmeric-400">
              ⚡ {roadmap.xpPoints} XP
            </span>
          </div>
        </div>
      </header>

      {/* Stage Map */}
      <div className="max-w-lg mx-auto px-6 py-8">
        <div className="relative">
          {/* Vertical path line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-saffron-300 via-turmeric-300 to-gray-200 dark:from-saffron-700 dark:via-turmeric-700 dark:to-gray-800" />

          <div className="space-y-6">
            {roadmap.stages.map((stage, i) => {
              const isExpanded = expandedStage === stage.stage;
              const isCurrent = stage.status === "current";
              const isCompleted = stage.status === "completed";
              const isLocked = stage.status === "locked";

              return (
                <div key={stage.stage} className="relative pl-16">
                  {/* Stage node */}
                  <div
                    className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-3 transition-all duration-300 cursor-pointer ${
                      isCompleted
                        ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400"
                        : isCurrent
                          ? "bg-saffron-100 dark:bg-saffron-900/40 border-saffron-400 dark:border-saffron-500 text-saffron-600 dark:text-saffron-400 shadow-lg shadow-saffron-200 dark:shadow-none animate-pulse"
                          : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600"
                    }`}
                    onClick={() =>
                      setExpandedStage(isExpanded ? null : stage.stage)
                    }
                  >
                    {isCompleted ? "✅" : isLocked ? "🔒" : stage.emoji}
                  </div>

                  {/* Stage card */}
                  <div
                    className={`rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isCompleted
                        ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50"
                        : isCurrent
                          ? "bg-white dark:bg-gray-800 border-saffron-200 dark:border-saffron-700/50 shadow-md shadow-saffron-100/50 dark:shadow-none"
                          : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60"
                    }`}
                    onClick={() =>
                      setExpandedStage(isExpanded ? null : stage.stage)
                    }
                  >
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <h3
                          className={`font-semibold text-sm ${
                            isCompleted
                              ? "text-emerald-700 dark:text-emerald-300"
                              : isCurrent
                                ? "text-navy-700 dark:text-white"
                                : "text-gray-500 dark:text-gray-500"
                          }`}
                        >
                          {stage.emoji} Stage {stage.stage}: {stage.name}
                        </h3>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-0.5">
                          {isCompleted
                            ? `Completed ${stage.completedAt ? new Date(stage.completedAt).toLocaleDateString() : ""}`
                            : isCurrent
                              ? `${stage.xpToComplete} XP to complete`
                              : `Unlocks at ${stage.xpRequired} XP`}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-saffron-100 dark:bg-saffron-900/40 text-saffron-600 dark:text-saffron-400 font-bold">
                          CURRENT
                        </span>
                      )}
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-4 pb-3 border-t border-gray-100 dark:border-gray-700/50 pt-3 animate-fadeIn">
                        <div className="mb-2">
                          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                            Topics
                          </p>
                          <ul className="space-y-0.5">
                            {stage.topics.map((t, ti) => (
                              <li
                                key={ti}
                                className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5"
                              >
                                <span className="text-saffron-500 mt-0.5">
                                  •
                                </span>
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {stage.goals?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                              Goals
                            </p>
                            <ul className="space-y-0.5">
                              {stage.goals.map((g, gi) => (
                                <li
                                  key={gi}
                                  className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5"
                                >
                                  <span className="text-turmeric-500 mt-0.5">
                                    🎯
                                  </span>
                                  {g}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {isCurrent && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/chat");
                            }}
                            className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white text-xs font-bold hover:shadow-lg transition-all"
                          >
                            Start Practicing →
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
