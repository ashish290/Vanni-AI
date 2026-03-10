const TypingIndicator = () => {
  return (
    <div className="flex justify-start message-enter">
      <div className="flex items-end gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-turmeric-500 flex items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-white text-xs font-bold">P</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-5 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 bg-saffron-400 rounded-full animate-typing"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-saffron-400 rounded-full animate-typing"
              style={{ animationDelay: "200ms" }}
            />
            <div
              className="w-2 h-2 bg-saffron-400 rounded-full animate-typing"
              style={{ animationDelay: "400ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
