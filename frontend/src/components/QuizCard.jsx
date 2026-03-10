import { useState } from "react";
import { CheckCircle, XCircle, Lightbulb, Zap, HelpCircle } from "lucide-react";

/**
 * Quiz card that appears inline in the chat flow.
 * props: quiz, onAnswer, result, isAnswering
 */
const QuizCard = ({ quiz, onAnswer, result, isAnswering }) => {
  const [selected, setSelected] = useState(null);
  const [showHint, setShowHint] = useState(false);

  if (!quiz) return null;

  const isAnswered = !!result;

  const handleSelect = (option) => {
    if (isAnswered || isAnswering) return;
    setSelected(option);
    onAnswer(quiz.id, option);
  };

  const getOptionStyle = (key) => {
    const base =
      "w-full text-left px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all duration-300 flex items-center gap-3";

    if (!isAnswered) {
      return `${base} border-gray-200 dark:border-gray-700 hover:border-saffron-400 dark:hover:border-saffron-500 hover:bg-saffron-50/50 dark:hover:bg-saffron-900/20 text-gray-700 dark:text-gray-200 cursor-pointer active:scale-[0.98]`;
    }

    if (key === result.correctAnswer) {
      return `${base} border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300`;
    }

    if (key === selected && !result.isCorrect) {
      return `${base} border-red-400 bg-red-50 dark:bg-red-900/30 dark:border-red-500 text-red-700 dark:text-red-300 animate-shake`;
    }

    return `${base} border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 opacity-50`;
  };

  const quizTypeLabel = {
    grammar_fix: "Grammar Fix 📝",
    fill_blank: "Fill in the Blank ✏️",
    word_meaning: "Word Meaning 📖",
    sentence_build: "Build a Sentence 🔨",
    tense_id: "Identify the Tense ⏰",
  };

  return (
    <div className="mx-auto max-w-lg my-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-saffron-200 dark:border-saffron-700/50 shadow-lg shadow-saffron-100/50 dark:shadow-none overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-saffron-500 to-turmeric-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-white" />
            <span className="text-white font-bold text-sm">
              Quick Quiz Time! 🎯
            </span>
          </div>
          <span className="text-white/80 text-xs font-medium">
            {quizTypeLabel[quiz.type] || "Quiz"}
          </span>
        </div>

        {/* Question */}
        <div className="px-5 py-4">
          <p className="text-gray-800 dark:text-gray-100 font-semibold text-base leading-relaxed mb-4">
            {quiz.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {Object.entries(quiz.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                disabled={isAnswered || isAnswering}
                className={getOptionStyle(key)}
              >
                <span className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                  {key}
                </span>
                <span>{value}</span>
                {isAnswered && key === result.correctAnswer && (
                  <CheckCircle
                    size={18}
                    className="ml-auto text-emerald-500 shrink-0"
                  />
                )}
                {isAnswered &&
                  key === selected &&
                  !result.isCorrect &&
                  key !== result.correctAnswer && (
                    <XCircle
                      size={18}
                      className="ml-auto text-red-500 shrink-0"
                    />
                  )}
              </button>
            ))}
          </div>

          {/* Hint */}
          {!isAnswered && quiz.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="mt-3 flex items-center gap-1.5 text-xs text-saffron-500 dark:text-saffron-400 hover:text-saffron-600 dark:hover:text-saffron-300 transition-colors"
            >
              <HelpCircle size={14} />
              {showHint ? quiz.hint : "Show hint"}
            </button>
          )}
        </div>

        {/* Result */}
        {isAnswered && (
          <div
            className={`px-5 py-4 border-t-2 ${
              result.isCorrect
                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20"
                : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {result.isCorrect ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    Sahi jawab! 🎉
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-bold text-sm">
                    Oops! Koi nahi 😊
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 bg-turmeric-100 dark:bg-turmeric-900/40 px-3 py-1 rounded-full">
                <Zap
                  size={14}
                  className="text-turmeric-600 dark:text-turmeric-400"
                />
                <span className="text-turmeric-700 dark:text-turmeric-300 font-bold text-sm">
                  +{result.xpEarned} XP
                </span>
              </div>
            </div>

            {result.explanation && (
              <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed flex items-start gap-2">
                <Lightbulb
                  size={14}
                  className="text-turmeric-500 shrink-0 mt-0.5"
                />
                {result.explanation}
              </p>
            )}

            {result.streakCount > 0 && result.isCorrect && (
              <div className="mt-2 text-xs text-saffron-600 dark:text-saffron-400 font-semibold">
                🔥 {result.streakCount} streak!
              </div>
            )}

            {result.leveledUp && (
              <div className="mt-2 text-xs text-turmeric-600 dark:text-turmeric-400 font-bold animate-bounce">
                🎉 Level up! You reached {result.newLevel}!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard;
