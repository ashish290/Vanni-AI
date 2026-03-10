import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPlans } from "../services/api";
import { usePlan } from "../context/PlanContext";
import { usePayment } from "../hooks/usePayment";
import { Check, Crown, Zap, Sparkles, ArrowLeft } from "lucide-react";

const Upgrade = () => {
  const navigate = useNavigate();
  const { plan: currentPlan, refreshPlan } = usePlan();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    handleUpgrade,
    isLoading: isPaymentLoading,
    error: paymentError,
    success,
  } = usePayment();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getAllPlans();
        if (data.success) setPlans(data.plans);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const onUpgradeClick = async (planName) => {
    await handleUpgrade(planName, async () => {
      // Refresh plan on success and navigate back
      await refreshPlan();
      setTimeout(() => navigate("/chat"), 2000);
    });
  };

  const planIcons = {
    free: <Sparkles className="text-gray-400" size={24} />,
    basic: <Zap className="text-saffron-500" size={24} />,
    pro: <Crown className="text-turmeric-500" size={24} />,
  };

  const planColors = {
    free: "border-gray-200 dark:border-gray-700",
    basic: "border-saffron-300 dark:border-saffron-600",
    pro: "border-2 border-turmeric-400 dark:border-turmeric-500 shadow-xl shadow-turmeric-400/10",
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFAF8] to-white dark:from-gray-950 dark:to-gray-900">
        <div className="text-center animate-fade-in">
          <span className="text-6xl block mb-4">🎉</span>
          <h1 className="font-poppins font-bold text-2xl text-navy-800 dark:text-white mb-2">
            Plan Upgraded Successfully!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-nunito">
            Redirecting to chat...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-poppins font-bold text-lg text-navy-800 dark:text-white">
            Choose Your Plan
          </h1>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-10">
          <h2 className="font-poppins font-bold text-2xl sm:text-3xl text-navy-800 dark:text-white mb-3">
            Apna Plan Select Karo ✨
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-nunito max-w-md mx-auto">
            Jitna seekhna hai utna seekho. Upgrade karo aur unlock karo Voice
            Mode, more messages, aur bahut kuch!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-saffron-300 border-t-saffron-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((p) => {
              const isCurrent = currentPlan === p.name;
              const isUpgradeable = !isCurrent && p.priceMonthly > 0;

              return (
                <div
                  key={p.name}
                  className={`relative rounded-2xl border bg-white dark:bg-gray-900 p-6 flex flex-col transition-all duration-300 hover:scale-[1.02] ${planColors[p.name]}`}
                >
                  {/* Popular badge */}
                  {p.name === "pro" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-4 mt-1">
                    {planIcons[p.name]}
                    <h3 className="font-poppins font-bold text-lg text-navy-800 dark:text-white capitalize">
                      {p.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <span className="font-poppins font-bold text-3xl text-navy-800 dark:text-white">
                      ₹{p.priceMonthly}
                    </span>
                    {p.priceMonthly > 0 && (
                      <span className="text-gray-400 dark:text-gray-500 text-sm">
                        /month
                      </span>
                    )}
                    {p.priceMonthly === 0 && (
                      <span className="text-gray-400 dark:text-gray-500 text-sm ml-1">
                        forever
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6 flex-1">
                    {(p.features || []).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <Check
                          size={16}
                          className="text-emerald-500 mt-0.5 flex-shrink-0"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action */}
                  {isCurrent ? (
                    <div className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Current Plan ✓
                    </div>
                  ) : isUpgradeable ? (
                    <button
                      onClick={() => onUpgradeClick(p.name)}
                      disabled={isPaymentLoading}
                      className={`w-full py-3 rounded-xl font-poppins font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 ${
                        p.name === "pro"
                          ? "bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white shadow-lg shadow-saffron-500/20"
                          : "bg-navy-800 dark:bg-white text-white dark:text-navy-800 shadow-lg"
                      }`}
                    >
                      {isPaymentLoading
                        ? "Connecting..."
                        : `Upgrade to ${p.name.charAt(0).toUpperCase() + p.name.slice(1)}`}
                    </button>
                  ) : (
                    <div className="py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center text-sm text-gray-400">
                      Free Forever
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upgrade;
