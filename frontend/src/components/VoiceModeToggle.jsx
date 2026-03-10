import { Link, useLocation } from "react-router-dom";
import { Mic, MessageSquare, Lock } from "lucide-react";
import { usePlan } from "../context/PlanContext";

/**
 * Toggle component to switch between Chat (Text) and Voice Mode.
 * Voice is locked with 🔒 for free plan users.
 */
const VoiceModeToggle = () => {
  const location = useLocation();
  const isVoiceMode = location.pathname.startsWith("/voice");
  const { isVoiceAllowed, setShowVoiceLockedModal } = usePlan();

  const getPath = (baseName) => {
    const parts = location.pathname.split("/");
    const id = parts[parts.length - 1];
    const hasId = id !== "chat" && id !== "voice" && id !== "";
    if (hasId) return `/${baseName}/${id}`;
    return `/${baseName}`;
  };

  const handleVoiceClick = (e) => {
    if (!isVoiceAllowed) {
      e.preventDefault();
      setShowVoiceLockedModal(true);
    }
  };

  return (
    <div className="flex bg-gray-100/50 dark:bg-gray-800/50 p-0.5 rounded-full border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-inner">
      <Link
        to={getPath("chat")}
        title="Text Mode"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          !isVoiceMode
            ? "bg-white dark:bg-gray-700 text-navy-700 dark:text-white shadow-sm"
            : "text-gray-500 hover:text-navy-600 dark:hover:text-gray-300"
        }`}
      >
        <MessageSquare size={15} />
      </Link>

      <Link
        to={isVoiceAllowed ? getPath("voice") : "#"}
        onClick={handleVoiceClick}
        title="Voice Mode"
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          isVoiceMode && isVoiceAllowed
            ? "bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white shadow-md shadow-saffron-500/20"
            : !isVoiceAllowed
              ? "text-gray-400 dark:text-gray-500 cursor-pointer"
              : "text-gray-500 hover:text-saffron-600 dark:hover:text-saffron-400"
        }`}
      >
        {isVoiceAllowed ? <Mic size={15} /> : <Lock size={13} />}
      </Link>
    </div>
  );
};

export default VoiceModeToggle;
