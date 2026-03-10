import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import VoiceModeToggle from "../components/VoiceModeToggle";
import LimitReachedModal from "../components/LimitReachedModal";
import VoiceLockedModal from "../components/VoiceLockedModal";
import BadgePopup from "../components/BadgePopup";
import { useChat } from "../hooks/useChat";
import { usePlan } from "../context/PlanContext";

const Chat = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    messages,
    isLoading,
    error,
    messageCount,
    conversationId,
    conversations,
    conversationsLoading,
    limitError,
    setLimitError,
    sendMessage,
    handleQuizAnswer,
    startNewConversation,
    loadConversation,
    deleteChat,
  } = useChat();

  const {
    plan,
    dailyLimit,
    showVoiceLockedModal,
    setShowVoiceLockedModal,
    refreshPlan,
  } = usePlan();

  const [newBadges, setNewBadges] = useState(null);

  const handleSend = async (text) => {
    await sendMessage(text);
    refreshPlan();
  };

  // Wrap quiz answer to catch badge popups
  const onQuizAnswer = async (quizId, answer) => {
    const result = await handleQuizAnswer(quizId, answer);
    if (result?.newBadges?.length > 0) {
      setNewBadges(result.newBadges);
    }
    return result;
  };

  return (
    <div className="h-screen flex bg-gradient-to-b from-[#FAFAF8] to-white dark:from-gray-950 dark:to-gray-900">
      <Sidebar
        conversations={conversations}
        conversationsLoading={conversationsLoading}
        activeConversationId={conversationId}
        onSelectConversation={loadConversation}
        onNewChat={startNewConversation}
        onDeleteChat={deleteChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Desktop-only header */}
        <header className="hidden lg:flex h-14 items-center justify-end px-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-10 shrink-0">
          <VoiceModeToggle className="ml-2" />
        </header>

        {/* Mobile spacer for the Sidebar's fixed mobile header */}
        <div className="lg:hidden h-14 shrink-0" />

        <main className="flex-1 overflow-hidden max-w-4xl w-full mx-auto">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSend}
            onQuizAnswer={onQuizAnswer}
          />
        </main>
      </div>

      {/* Limit Reached Modal */}
      <LimitReachedModal
        isOpen={!!limitError}
        onClose={() => setLimitError(null)}
        currentPlan={limitError?.currentPlan || plan}
        dailyLimit={limitError?.dailyLimit || dailyLimit}
      />

      {/* Voice Locked Modal */}
      <VoiceLockedModal
        isOpen={showVoiceLockedModal}
        onClose={() => setShowVoiceLockedModal(false)}
      />

      {/* Badge Popup */}
      <BadgePopup badges={newBadges} onClose={() => setNewBadges(null)} />
    </div>
  );
};

export default Chat;
