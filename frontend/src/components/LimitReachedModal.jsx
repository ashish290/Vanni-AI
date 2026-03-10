import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

/**
 * Modal shown when daily message limit is reached (429 response).
 */
const LimitReachedModal = ({ isOpen, onClose, currentPlan, dailyLimit }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-fade-in border border-gray-200 dark:border-gray-700">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <span className="text-4xl block mb-3">😅</span>
          <h2 className="font-poppins font-bold text-xl text-navy-800 dark:text-white mb-2">
            Aaj ki limit ho gayi!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-nunito text-sm leading-relaxed">
            Aapke{" "}
            <span className="font-bold capitalize text-saffron-500">
              {currentPlan}
            </span>{" "}
            plan mein {dailyLimit} messages/day hain.
            <br />
            Kal free mein continue karo ya abhi upgrade karo! 🚀
          </p>
        </div>

        {/* Plan Cards */}
        <div className="space-y-3 mb-6">
          {/* Basic */}
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-saffron-300 dark:hover:border-saffron-600 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-poppins font-bold text-sm text-navy-700 dark:text-white">
                Basic Plan
              </span>
              <span className="text-saffron-500 font-bold text-sm">
                ₹149/mo
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              100 messages/day + Voice Mode 🎤
            </p>
          </div>

          {/* Pro */}
          <div className="p-4 rounded-xl border-2 border-saffron-400 dark:border-saffron-500 bg-saffron-50/50 dark:bg-saffron-900/20">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-poppins font-bold text-sm text-navy-700 dark:text-white">
                Pro Plan{" "}
                <span className="text-xs bg-saffron-500 text-white px-1.5 py-0.5 rounded-full ml-1">
                  Best
                </span>
              </span>
              <span className="text-saffron-500 font-bold text-sm">
                ₹299/mo
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Unlimited messages + Everything ✨
            </p>
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={() => {
            onClose();
            navigate("/upgrade");
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white font-poppins font-bold shadow-lg shadow-saffron-500/20 hover:shadow-xl hover:shadow-saffron-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Upgrade Now 🚀
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 rounded-xl text-gray-400 dark:text-gray-500 text-sm font-nunito hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Kal wapas aaunga 👋
        </button>
      </div>
    </div>
  );
};

export default LimitReachedModal;
