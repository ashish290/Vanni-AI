import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import QuizBubble from "./QuizBubble";
import QuizResultBubble from "./QuizResultBubble";
import TypingIndicator from "./TypingIndicator";
import icon from "../assets/icon.svg";

const ChatWindow = ({ messages, isLoading, onSendMessage, onQuizAnswer }) => {
  const [input, setInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    // Show button if scrolled up by more than 150px
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollButton(isScrolledUp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-saffron-400 to-turmeric-500 overflow-hidden shadow-xl shadow-saffron-200 dark:shadow-none mb-6">
              <img
                src={icon}
                alt="Vanni AI"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-poppins font-bold text-2xl text-navy-700 dark:text-white mb-2">
              Hi! I'm Vanni
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-nunito max-w-sm">
              Your English learning buddy! Start typing in English (or Hinglish
              😄) and let's have a fun conversation!
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "Hi Vanni! I want to learn English 🙏",
                "Tell me about yourself",
                "I want to practice speaking",
                "Help me with grammar",
              ].map((starter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(starter);
                    onSendMessage(starter);
                  }}
                  className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300
                    hover:border-saffron-400 dark:hover:border-saffron-600 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 hover:text-saffron-700 dark:hover:text-saffron-300
                    transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          if (msg.type === "quiz") {
            return (
              <QuizBubble key={msg.id} message={msg} onAnswer={onQuizAnswer} />
            );
          }
          if (msg.type === "quiz_result") {
            return <QuizResultBubble key={msg.id} message={msg} />;
          }
          return <MessageBubble key={msg.id} message={msg} />;
        })}

        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}

        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 p-3 rounded-full bg-white dark:bg-gray-800 text-navy-600 dark:text-saffron-400 shadow-xl shadow-gray-200 dark:shadow-none border border-gray-200 dark:border-gray-700 hover:scale-105 transition-all z-20 animate-fade-in flex items-center justify-center"
          aria-label="Scroll to bottom"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            ></path>
          </svg>
        </button>
      )}

      {/* Input area */}
      <div className="border-t border-gray-300 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 py-4 relative z-30">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 chat-input-ring transition-all border border-gray-400 dark:border-gray-600 focus-within:border-saffron-500 dark:focus-within:border-saffron-500 focus-within:bg-white dark:focus-within:bg-gray-800">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message to Vanni..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 font-nunito placeholder:text-gray-400 dark:placeholder:text-gray-500 py-2"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
                input.trim() && !isLoading
                  ? "bg-gradient-to-r from-saffron-500 to-turmeric-500 text-white shadow-lg shadow-saffron-200 dark:shadow-none hover:shadow-xl hover:scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
