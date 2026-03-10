import icon from "../assets/icon.svg";

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  const renderMessage = (text) => {
    if (!text) return null;

    // 1. Initial Clean: Handle markdown and ensure tags are normalized
    let cleaned = text
      .replace(/\*\*(.*?)\*\*/g, "<hl>$1</hl>")
      .replace(/\*(.*?)\*/g, "<hl>$1</hl>");

    // 2. Clear out any unclosed tags or artifacts
    // 3. Regular split and map for <hl> and <wrong>
    const regex = /(<(?:hl|wrong)>[\s\S]*?<\/(?:hl|wrong)>)/gi;
    const parts = cleaned.split(regex);

    return parts.map((part, index) => {
      // Correct word — Saffron highlight (as per User's original style)
      const hlMatch = part.match(/<hl>([\s\S]*?)<\/hl>/i);
      if (hlMatch) {
        const word = hlMatch[1].trim().replace(/<\/?(?:hl|wrong)>/gi, "");
        return (
          <span
            key={index}
            className="text-saffron-600 dark:text-saffron-400 font-bold bg-saffron-50 dark:bg-saffron-900/30 px-1.5 py-0.5 rounded mx-0.5 inline-block"
          >
            "{word}"
          </span>
        );
      }

      // Wrong word — Red highlight
      const wrongMatch = part.match(/<wrong>([\s\S]*?)<\/wrong>/i);
      if (wrongMatch) {
        const word = wrongMatch[1].trim().replace(/<\/?(?:hl|wrong)>/gi, "");
        return (
          <span
            key={index}
            className="text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-900/10 px-1.5 py-0.5 rounded mx-0.5 inline-block line-through decoration-red-500/50"
          >
            "{word}"
          </span>
        );
      }

      // Normal text — Aggressively strip any stray tags
      const textPart = part.replace(/<\/?(?:hl|wrong)\s*?\/?>/gi, "");
      if (!textPart) return null;

      return <span key={index}>{textPart}</span>;
    });
  };

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} message-enter`}
    >
      <div
        className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isUser ? "flex-row-reverse" : ""}`}
      >
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-turmeric-500 flex-shrink-0 shadow-md overflow-hidden">
            <img
              src={icon}
              alt="Vanni"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bubble */}
        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm
            ${
              isUser
                ? "bg-gradient-to-br from-navy-500 to-navy-700 text-white rounded-br-md"
                : message.isError
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 rounded-bl-md"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-md"
            }
            ${message.isStreaming ? "animate-pulse-soft" : ""}
          `}
        >
          <div className="text-sm leading-relaxed font-nunito whitespace-pre-wrap">
            {isUser ? (
              message.content
            ) : !message.content && message.isStreaming ? (
              <div className="flex items-center gap-1.5 h-5 px-1">
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
            ) : (
              renderMessage(message.content)
            )}
            {message.isStreaming && !!message.content && (
              <span className="inline-block w-1.5 h-4 bg-saffron-500 ml-1 animate-pulse rounded-sm align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
