import { useState } from "react";
import { Zap, HelpCircle, Loader2 } from "lucide-react";

/**
 * Quiz rendered as a Vanni message bubble inside the chat flow.
 * Same left-alignment and styling as regular Vanni messages.
 */
const QuizBubble = ({ message, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { quizId, question, options, hint, answered, userAnswer, isCorrect } =
    message;

  const handleSelect = async (key) => {
    if (answered || submitting) return;
    setSelected(key);
    setSubmitting(true);
    await onAnswer?.(quizId, key);
    setSubmitting(false);
  };

  const getOptionClasses = (key) => {
    const base =
      "w-full text-left px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-300 flex items-center gap-2.5";

    if (!answered) {
      if (submitting && key === selected) {
        return `${base} border-saffron-400 dark:border-saffron-500 bg-saffron-50 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-300`;
      }
      return `${base} border-gray-200 dark:border-gray-700 hover:border-saffron-400 dark:hover:border-saffron-500 hover:bg-saffron-50/50 dark:hover:bg-saffron-900/20 text-gray-700 dark:text-gray-200 cursor-pointer active:scale-[0.98]`;
    }

    // After answered
    if (key === message.correctAnswer) {
      return `${base} border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300`;
    }
    if (key === userAnswer && !isCorrect) {
      return `${base} border-red-400 bg-red-50 dark:bg-red-900/30 dark:border-red-500 text-red-700 dark:text-red-300 animate-shake`;
    }
    return `${base} border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 opacity-50`;
  };

  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="max-w-[85%] sm:max-w-[75%]">
        <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          {/* Quiz header */}
          <div className="bg-gradient-to-r from-saffron-500/10 to-turmeric-500/10 dark:from-saffron-500/20 dark:to-turmeric-500/20 px-4 py-2 flex items-center gap-2 border-b border-saffron-200/50 dark:border-saffron-700/30">
            <Zap size={14} className="text-saffron-500" />
            <span className="text-xs font-bold text-saffron-600 dark:text-saffron-400">
              Quick Quiz 🎯
            </span>
          </div>

          {/* Question */}
          <div className="px-4 py-3">
            <p className="text-gray-800 dark:text-gray-100 text-sm font-medium leading-relaxed mb-3">
              {question}
            </p>

            {/* Options */}
            <div className="space-y-2">
              {Object.entries(options || {}).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={answered || submitting}
                  className={getOptionClasses(key)}
                >
                  <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                    {key}
                  </span>
                  <span className="flex-1">{value}</span>
                  {submitting && key === selected && (
                    <Loader2
                      size={14}
                      className="animate-spin text-saffron-500 shrink-0"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Hint */}
            {!answered && hint && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="mt-2 flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 hover:text-saffron-500 dark:hover:text-saffron-400 transition-colors"
              >
                <HelpCircle size={12} />
                {showHint ? hint : "Show hint"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizBubble;
