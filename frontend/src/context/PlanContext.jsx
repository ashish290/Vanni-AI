import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { getPlanStatus } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const PlanContext = createContext(null);

export const PlanProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [planData, setPlanData] = useState({
    plan: "free",
    dailyLimit: 20,
    dailyUsed: 0,
    dailyRemaining: 20,
    voiceEnabled: false,
    resetTime: "Midnight IST",
  });
  const [loading, setLoading] = useState(true);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showVoiceLockedModal, setShowVoiceLockedModal] = useState(false);

  const fetchPlanStatus = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getPlanStatus();
      if (data.success) {
        setPlanData(data);
      }
    } catch (err) {
      console.error("Failed to fetch plan status:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch on mount / auth change
  useEffect(() => {
    fetchPlanStatus();
  }, [fetchPlanStatus]);

  // Derived values
  const isLimitReached =
    planData.dailyLimit !== null && planData.dailyUsed >= planData.dailyLimit;
  const isVoiceAllowed = planData.voiceEnabled;
  const usagePercent =
    planData.dailyLimit === null
      ? 0
      : Math.min(
          100,
          Math.round((planData.dailyUsed / planData.dailyLimit) * 100),
        );

  const value = {
    ...planData,
    loading,
    isLimitReached,
    isVoiceAllowed,
    usagePercent,
    refreshPlan: fetchPlanStatus,
    showLimitModal,
    setShowLimitModal,
    showVoiceLockedModal,
    setShowVoiceLockedModal,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export const usePlan = () => {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside PlanProvider");
  return ctx;
};
