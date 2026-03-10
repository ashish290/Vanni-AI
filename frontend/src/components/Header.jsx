import { useAuth } from "../hooks/useAuth";
import icon from "../assets/icon.svg";

const Header = ({ onNewChat, messageCount }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-saffron-200">
            <img
              src={icon}
              alt="Vanni AI"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="font-poppins font-bold text-navy-700 text-lg leading-tight">
              Vanni AI
            </h1>
            <p className="text-xs text-gray-400 font-nunito">
              AI English Tutor ✨
            </p>
          </div>
        </div>

        {/* User info & actions */}
        <div className="flex items-center gap-3">
          {messageCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-turmeric-50 px-3 py-1.5 rounded-full">
              <span className="text-turmeric-600 text-xs font-semibold">
                💬 {messageCount}
              </span>
            </div>
          )}

          {user && (
            <div className="hidden sm:flex items-center gap-1.5 bg-saffron-50 px-3 py-1.5 rounded-full">
              <span className="text-saffron-600 text-xs font-semibold capitalize">
                🔥 {user.level || "beginner"}
              </span>
            </div>
          )}

          <button
            onClick={onNewChat}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-navy-600"
            title="New Chat"
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

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-400 to-navy-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
