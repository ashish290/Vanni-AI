import { useNavigate } from "react-router-dom";
import { X, Lock } from "lucide-react";

/**
 * Modal shown when free user tries to access voice mode.
 */
const VoiceLockedModal = ({ isOpen, onClose }) => {
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
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-8 animate-fade-in border border-gray-200 dark:border-gray-700">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-saffron-50 dark:bg-saffron-900/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-saffron-500" size={28} />
          </div>
          <h2 className="font-poppins font-bold text-lg text-navy-800 dark:text-white mb-2">
            Voice Mode Locked 🔒
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-nunito text-sm leading-relaxed">
            Voice mode Basic ya Pro plan mein available hai!
            <br />
            Upgrade karo aur Vanni se baat karo 🎤
          </p>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={() => {
            onClose();
            navigate("/upgrade");
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white font-poppins font-bold shadow-lg shadow-saffron-500/20 hover:shadow-xl hover:shadow-saffron-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          Upgrade for Voice 🎤
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2.5 rounded-xl text-gray-400 dark:text-gray-500 text-sm font-nunito hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          Abhi nahi, text se chalega
        </button>
      </div>
    </div>
  );
};

export default VoiceLockedModal;
