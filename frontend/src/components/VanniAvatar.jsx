import icon from "../assets/icon.svg";

/**
 * Animated Vanni Avatar based on the Voice WebSocket status
 * Statuses: idle, listening, processing_stt, generating_response, generating_audio, speaking
 */
const VanniAvatar = ({ status }) => {
  const getContainerClasses = () => {
    switch (status) {
      case "listening":
        return "scale-105 shadow-[0_0_40px_rgba(255,107,53,0.6)] border-saffron-400";
      case "processing_stt":
      case "generating_response":
      case "generating_audio":
        return "animate-pulse shadow-[0_0_30px_rgba(255,107,53,0.4)] border-saffron-300";
      case "speaking":
        return "scale-105 shadow-[0_0_60px_rgba(244,163,0,0.7)] border-turmeric-400";
      case "idle":
      default:
        return "shadow-lg border-gray-200 dark:border-gray-700";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "listening":
        return "Listening...";
      case "processing_stt":
        return "Understanding...";
      case "generating_response":
        return "Thinking...";
      case "generating_audio":
        return "Preparing voice...";
      case "speaking":
        return "Speaking...";
      case "idle":
      default:
        return "Tap mic to speak";
    }
  };

  // Outer ring animation for listening / speaking
  const getRingClasses = () => {
    if (status === "listening") {
      return "border-saffron-400/50 scale-110 animate-ping";
    }
    if (status === "speaking") {
      return "border-turmeric-400/40 scale-110 animate-pulse";
    }
    return "border-transparent scale-100";
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 sm:gap-6">
      {/* Outer animated ring */}
      <div className="relative">
        <div
          className={`absolute inset-[-12px] sm:inset-[-16px] rounded-full border-2 transition-all duration-700 ${getRingClasses()}`}
        />

        {/* Avatar Container */}
        <div
          className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-4 overflow-hidden bg-gradient-to-br from-saffron-100 to-turmeric-100 dark:from-gray-800 dark:to-gray-900 transition-all duration-500 ease-in-out ${getContainerClasses()}`}
        >
          <img
            src={icon}
            alt="Vanni AI"
            className="absolute inset-[-5%] w-[110%] h-[110%] max-w-none object-cover"
          />

          {/* Overlay effect when speaking */}
          {status === "speaking" && (
            <div className="absolute inset-0 bg-turmeric-400/15 animate-pulse rounded-full" />
          )}
        </div>
      </div>

      {/* Status label */}
      <span
        className={`text-xs sm:text-sm font-semibold uppercase tracking-widest transition-colors duration-300 ${
          status === "idle"
            ? "text-gray-400 dark:text-gray-500"
            : "text-saffron-500 dark:text-saffron-400"
        }`}
      >
        {getStatusText()}
      </span>
    </div>
  );
};

export default VanniAvatar;
