import { CheckCircle, XCircle, Zap, Lightbulb } from "lucide-react";

/**
 * Quiz result rendered as a Vanni message bubble inside the chat flow.
 * Same left-alignment as regular Vanni messages.
 */
const QuizResultBubble = ({ message }) => {
  const {
    isCorrect,
    explanation,
    xpEarned,
    newStreak,
    correctAnswer,
    correctOptionText,
  } = message;

  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="max-w-[85%] sm:max-w-[75%]">
        <div
          className={`rounded-2xl rounded-tl-md shadow-sm px-4 py-3 border ${
            isCorrect
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50"
              : "bg-orange-50 dark:bg-orange-900/15 border-orange-200 dark:border-orange-700/50"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <CheckCircle size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    Sahi jawab! 🎉
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={16} className="text-orange-500" />
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    Oops! Koi nahi 😊
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 bg-turmeric-100 dark:bg-turmeric-900/40 px-2.5 py-0.5 rounded-full">
              <Zap
                size={12}
                className="text-turmeric-600 dark:text-turmeric-400"
              />
              <span className="text-xs font-bold text-turmeric-700 dark:text-turmeric-300">
                +{xpEarned} XP
              </span>
            </div>
          </div>

          {/* Correct answer for wrong answers */}
          {!isCorrect && correctAnswer && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mb-1.5 font-medium">
              Correct answer: ({correctAnswer}) {correctOptionText || ""}
            </p>
          )}

          {/* Explanation */}
          {explanation && (
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-1.5">
              <Lightbulb
                size={12}
                className="text-turmeric-500 shrink-0 mt-0.5"
              />
              {explanation}
            </p>
          )}

          {/* Streak */}
          {newStreak > 0 && isCorrect && (
            <p className="mt-2 text-xs font-bold text-saffron-600 dark:text-saffron-400">
              🔥 {newStreak} in a row!
            </p>
          )}

          {/* Encouragement for wrong answer */}
          {!isCorrect && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-500">
              Note karo aur agli baar try karo! 💪
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResultBubble;
