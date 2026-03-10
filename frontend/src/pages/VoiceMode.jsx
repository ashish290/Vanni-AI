import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import VoiceModeToggle from "../components/VoiceModeToggle";
import VanniAvatar from "../components/VanniAvatar";
import { useRealtimeVoice } from "../hooks/useRealtimeVoice";
import { useChat } from "../hooks/useChat";
import toast from "react-hot-toast";
import { Mic, Square, AlertCircle } from "lucide-react";

const VoiceMode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    status,
    userTranscript,
    aiTranscript,
    error,
    startVoiceListening,
    stopListening,
    stopSpeaking,
  } = useRealtimeVoice(id);

  const [displayTranscript, setDisplayTranscript] = useState("");

  // Handle the "brief transcript" fade-out logic
  useEffect(() => {
    if (userTranscript) {
      // Show only the last 6 words for context
      const words = userTranscript.split(" ");
      const brief =
        words.length > 6 ? "..." + words.slice(-6).join(" ") : userTranscript;

      setDisplayTranscript(brief);

      // Clear after 2 seconds for a clean UI
      const timer = setTimeout(() => {
        setDisplayTranscript("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userTranscript]);

  // Trigger a toast whenever an error string appears from the voice hook
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const { conversations, conversationsLoading, deleteChat } = useChat();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleNewChat = () => navigate("/voice");
  const handleSelectChat = (chatId) => navigate(`/voice/${chatId}`);

  const isListening = status === "listening";
  const isProcessing = [
    "processing_stt",
    "generating_response",
    "generating_audio",
  ].includes(status);
  const isSpeaking = status === "speaking";

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#FAFAF8] to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        conversationsLoading={conversationsLoading}
        activeConversationId={id}
        onSelectConversation={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={deleteChat}
        collapsed={!sidebarOpen}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Ambient backgrounds */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className={`absolute top-[15%] left-[20%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-saffron-400/10 dark:bg-saffron-500/10 blur-[120px] transition-all duration-1000 ${isSpeaking ? "scale-125 opacity-80" : "scale-100 opacity-50"}`}
          />
          <div
            className={`absolute bottom-[10%] right-[15%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-turmeric-400/10 dark:bg-turmeric-500/10 blur-[120px] transition-all duration-1000 ${isListening ? "scale-125 opacity-80" : "scale-100 opacity-50"}`}
          />
        </div>

        {/* Desktop-only header with toggle on LEFT */}
        <header className="hidden lg:flex h-14 items-center justify-end px-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10 shrink-0">
          <VoiceModeToggle />
        </header>

        {/* Mobile spacer for the Sidebar's fixed mobile header */}
        <div className="lg:hidden h-14 shrink-0" />

        {/* Voice Content — vertically centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 pb-8 z-10 relative overflow-y-auto">
          {/* Avatar */}
          <div className="mb-4 sm:mb-8">
            <VanniAvatar status={status} />
          </div>

          {/* Clean Status Text */}
          <div className="w-full text-center px-2 flex flex-col items-center justify-center gap-1">
            {displayTranscript && (
              <span className="text-sm sm:text-base text-gray-400 dark:text-gray-500 font-nunito italic animate-fade-in mb-2">
                {displayTranscript.split(/(<hl>.*?<\/hl>)/gi).map((part, i) => {
                  if (
                    part.toLowerCase().startsWith("<hl>") &&
                    part.toLowerCase().endsWith("</hl>")
                  ) {
                    const word = part.replace(/<\/?hl>/gi, "");
                    return (
                      <span
                        key={i}
                        className="text-saffron-500 dark:text-saffron-400 font-bold bg-saffron-400/10 dark:bg-saffron-400/20 px-1 rounded mx-0.5"
                      >
                        {word}
                      </span>
                    );
                  }
                  return part;
                })}
              </span>
            )}
            <span className="text-xl sm:text-2xl text-navy-800 dark:text-white font-nunito font-semibold animate-fade-in">
              {isListening
                ? "✨ Sun rahi hoon..."
                : isProcessing
                  ? "💭 Soch rahi hoon..."
                  : isSpeaking
                    ? "🗣️ Bol rahi hoon..."
                    : ""}
            </span>
          </div>

          {/* Control Section */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-6 w-full max-w-xs">
            {/* Main Action area */}
            <div className="relative flex items-center justify-center w-full">
              {isSpeaking ? (
                /* Prominent Force Stop Button */
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                  <button
                    onClick={stopSpeaking}
                    className="group relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 border-4 border-red-500 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-90"
                    title="Force Stop Vanni"
                  >
                    <div className="absolute inset-0 rounded-full bg-red-500/10 group-hover:bg-red-500/20 animate-pulse" />
                    <Square
                      className="text-red-500 fill-red-500 group-hover:scale-110 transition-transform"
                      size={32}
                    />
                  </button>
                  <span className="text-red-500 font-bold tracking-wider text-xs uppercase animate-pulse">
                    Force Stop Vanni
                  </span>
                </div>
              ) : (
                /* Mic Button Logic */
                <div className="flex flex-col items-center gap-3">
                  {isListening ? (
                    <button
                      onClick={stopListening}
                      className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-red-500 hover:bg-red-600 rounded-full shadow-xl shadow-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-25" />
                      <Square className="text-white fill-white" size={28} />
                    </button>
                  ) : (
                    <button
                      onClick={startVoiceListening}
                      disabled={isProcessing}
                      className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-xl transition-all duration-300 active:scale-95 ${
                        isProcessing
                          ? "bg-gray-200 dark:bg-gray-800 cursor-not-allowed text-gray-400"
                          : "bg-gradient-to-tr from-saffron-500 to-turmeric-500 hover:from-saffron-600 hover:to-turmeric-600 text-white shadow-saffron-500/40 hover:scale-105"
                      }`}
                    >
                      <Mic size={36} />
                    </button>
                  )}
                  {/* Small Hint */}
                  <span className="text-sm text-gray-400 dark:text-gray-500 font-nunito mt-1">
                    {isListening
                      ? "Tap to finish"
                      : isProcessing
                        ? "Thinking..."
                        : "Tap to speak"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMode;
