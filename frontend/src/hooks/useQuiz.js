import { useState, useCallback } from "react";
import { answerQuiz as answerQuizApi, getQuizStats } from "../services/api";

export const useQuiz = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [stats, setStats] = useState(null);

  const answerQuiz = useCallback(async (quizId, answer) => {
    setIsAnswering(true);
    try {
      const result = await answerQuizApi(quizId, answer);
      if (result.success) {
        setQuizResult(result);
        return result;
      }
    } catch (err) {
      console.error("Answer quiz error:", err);
    } finally {
      setIsAnswering(false);
    }
    return null;
  }, []);

  const dismissQuiz = useCallback(() => {
    setCurrentQuiz(null);
    setQuizResult(null);
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const data = await getQuizStats();
      if (data.success) setStats(data);
    } catch (err) {
      console.error("Quiz stats error:", err);
    }
  }, []);

  return {
    currentQuiz,
    setCurrentQuiz,
    quizResult,
    isAnswering,
    stats,
    answerQuiz,
    dismissQuiz,
    refreshStats,
  };
};
