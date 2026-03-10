import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import VoiceModeToggle from "./VoiceModeToggle";
import UsageBar from "./UsageBar";
import XPBar from "./XPBar";
import StageCard from "./StageCard";
import icon from "../assets/icon.svg";

const Sidebar = ({
  conversations,
  conversationsLoading,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteChat,
  collapsed,
  onToggleCollapse,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef(null);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const groupConversations = (convos) => {
    const today = [],
      yesterday = [],
      thisWeek = [],
      older = [];
    const now = new Date();
    convos.forEach((c) => {
      const diffDays = Math.floor(
        (now - new Date(c.updatedAt || c.createdAt)) / 86400000,
      );
      if (diffDays === 0) today.push(c);
      else if (diffDays === 1) yesterday.push(c);
      else if (diffDays < 7) thisWeek.push(c);
      else older.push(c);
    });
    return { today, yesterday, thisWeek, older };
  };

  const groups = groupConversations(conversations);

  const handleDelete = (e, convId) => {
    e.stopPropagation();
    if (deleteConfirm === convId) {
      onDeleteChat(convId);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(convId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    setShowScrollTop(scrollContainerRef.current.scrollTop > 150);
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderGroup = (label, convos) => {
    if (!convos.length) return null;
    return (
      <div className="mb-4">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-1.5">
          {label}
        </p>
        {convos.map((conv) => (
          <div
            key={conv.id}
            onClick={() => {
              onSelectConversation(conv.id);
              setIsOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group flex items-center gap-2.5 cursor-pointer ${
              activeConversationId === conv.id
                ? "bg-saffron-50 dark:bg-saffron-900/30 text-navy-700 dark:text-saffron-200 border border-saffron-200 dark:border-saffron-700"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-navy-700 dark:hover:text-white border border-transparent"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 opacity-40 group-hover:opacity-70"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium text-xs leading-tight">
                {conv.title}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                {formatTime(conv.updatedAt || conv.createdAt)}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(e, conv.id)}
              className={`p-1 rounded-lg transition-all flex-shrink-0 ${
                deleteConfirm === conv.id
                  ? "bg-red-100 dark:bg-red-900/40 text-red-500"
                  : "opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              }`}
              title={
                deleteConfirm === conv.id ? "Click again to confirm" : "Delete"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };

  const ThemeIcon = () =>
    isDark ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );

  // Toggle collapse/expand arrow icon
  const CollapseIcon = ({ pointsLeft }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {pointsLeft ? (
        <>
          <line x1="17" y1="18" x2="7" y2="12" />
          <line x1="7" y1="12" x2="17" y2="6" />
        </>
      ) : (
        <>
          <line x1="7" y1="18" x2="17" y2="12" />
          <line x1="17" y1="12" x2="7" y2="6" />
        </>
      )}
    </svg>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 relative w-72 whitespace-nowrap">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-saffron-200 dark:shadow-none">
              <img
                src={icon}
                alt="Vanni AI"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-navy-700 dark:text-white text-base leading-tight">
                Vanni AI
              </h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-nunito">
                AI English Tutor ✨
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="hidden lg:flex p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-saffron-500 dark:hover:text-saffron-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              title={isDark ? "Light mode" : "Dark mode"}
            >
              <ThemeIcon />
            </button>
            {/* Desktop collapse button */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-navy-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              title="Hide sidebar"
            >
              <CollapseIcon pointsLeft={true} />
            </button>
          </div>
        </div>

        {/* Usage Bar */}
        <UsageBar />

        {/* XP Progress */}
        <XPBar />

        {/* Stage Progress */}
        <StageCard />

        <button
          onClick={() => {
            onNewChat();
            setIsOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-saffron-600 dark:hover:text-saffron-400 hover:border-saffron-300 dark:hover:border-saffron-600 hover:bg-saffron-50/50 dark:hover:bg-saffron-900/20 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      {/* Conversations list */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-2 custom-scrollbar"
      >
        {conversationsLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-saffron-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <span className="text-3xl block mb-2">💬</span>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-nunito">
              No conversations yet. Start chatting with Vanni!
            </p>
          </div>
        ) : (
          <>
            {renderGroup("Today", groups.today)}
            {renderGroup("Yesterday", groups.yesterday)}
            {renderGroup("This week", groups.thisWeek)}
            {renderGroup("Older", groups.older)}
          </>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-20 right-4 p-2.5 rounded-full bg-white dark:bg-gray-800 text-navy-600 dark:text-saffron-400 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all z-20 animate-fade-in flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            ></path>
          </svg>
        </button>
      )}

      {/* User footer */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-navy-700 dark:text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">
              🔥 {user?.level || "beginner"}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — collapsible */}
      <aside
        className={`hidden lg:flex flex-col h-full bg-white dark:bg-gray-900 transition-[width,min-width,border-color] duration-300 ease-in-out overflow-hidden border-r ${
          collapsed
            ? "w-0 min-w-0 border-transparent"
            : "w-72 min-w-[18rem] border-gray-100 dark:border-gray-800"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop expand button — shows when sidebar is collapsed */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-saffron-500 dark:hover:text-saffron-400 hover:border-saffron-300 dark:hover:border-saffron-600 shadow-lg hover:shadow-xl transition-all duration-200"
          title="Show sidebar"
        >
          <CollapseIcon pointsLeft={false} />
        </button>
      )}

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <VoiceModeToggle />
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <ThemeIcon />
          </button>
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-50 shadow-2xl flex flex-col animate-slide-up">
            <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
                title={isDark ? "Light mode" : "Dark mode"}
              >
                <ThemeIcon />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
