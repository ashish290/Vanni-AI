import { useState, useEffect, useCallback, useRef } from "react";
import {
  getHistory,
  startConversation,
  getConversations,
  getConversationMessages,
  deleteConversationApi,
  answerQuiz as answerQuizApi,
} from "../services/api";
import { useStream } from "./useStream";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [limitError, setLimitError] = useState(null);
  const streamingRef = useRef("");
  const { stream, isStreaming } = useStream();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setConversationsLoading(true);
      const data = await getConversations();
      if (data.success) setConversations(data.conversations || []);
    } catch (err) {
      console.log("Failed to load conversations");
    } finally {
      setConversationsLoading(false);
    }
  };

  const loadConversation = useCallback(
    async (convId) => {
      if (convId === conversationId) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await getConversationMessages(convId);
        if (data.success) {
          setMessages(
            data.messages.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              createdAt: m.createdAt,
            })),
          );
          setConversationId(convId);
        }
      } catch (err) {
        setError("Failed to load conversation");
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId],
  );

  const deleteChat = useCallback(
    async (convId) => {
      try {
        const data = await deleteConversationApi(convId);
        if (data.success) {
          // If the deleted conversation is active, clear the chat
          if (convId === conversationId) {
            setConversationId(null);
            setMessages([]);
          }
          // Refresh sidebar list
          fetchConversations();
        }
      } catch (err) {
        setError("Failed to delete conversation");
      }
    },
    [conversationId],
  );

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading || isStreaming) return;

      const userMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      streamingRef.current = "";

      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          isStreaming: true,
          createdAt: new Date().toISOString(),
        },
      ]);

      await stream(
        text.trim(),
        conversationId,
        (chunk) => {
          streamingRef.current += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: streamingRef.current }
                : m,
            ),
          );
        },
        (data) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: data.reply || m.content, // Use final cleaned reply if available
                    isStreaming: false,
                  }
                : m,
            ),
          );
          if (data.conversationId) setConversationId(data.conversationId);
          if (data.messageCount) setMessageCount(data.messageCount);
          // If quiz in response, add as message
          if (data.quiz) {
            const quizMsg = {
              id: `quiz-${Date.now()}`,
              role: "assistant",
              type: "quiz",
              quizId: data.quiz.id,
              question: data.quiz.question,
              quizType: data.quiz.type,
              options: data.quiz.options,
              hint: data.quiz.hint,
              answered: false,
              userAnswer: null,
              isCorrect: null,
              correctAnswer: null,
              xpEarned: null,
              explanation: null,
              createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, quizMsg]);
          }
          setIsLoading(false);
          fetchConversations();
        },
        (errMsg, errData) => {
          // Check if this is a usage limit error (429)
          if (errData?.status === 429 && errData?.error === "limit_reached") {
            // Remove the empty assistant bubble only
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
            setIsLoading(false);
            // Set limitError so Chat.jsx can trigger the modal
            setLimitError(errData);
            return;
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      errMsg || "Vanni is taking a chai break ☕ — try again!",
                    isStreaming: false,
                    isError: true,
                  }
                : m,
            ),
          );
          setError(errMsg);
          setIsLoading(false);
        },
      );
    },
    [conversationId, isLoading, isStreaming, stream],
  );

  const handleQuizAnswer = useCallback(async (quizId, answer) => {
    try {
      const result = await answerQuizApi(quizId, answer);
      if (result.success) {
        // Update quiz message as answered
        setMessages((prev) =>
          prev.map((m) =>
            m.type === "quiz" && m.quizId === quizId
              ? {
                  ...m,
                  answered: true,
                  userAnswer: answer,
                  isCorrect: result.isCorrect,
                  correctAnswer: result.correctAnswer,
                }
              : m,
          ),
        );
        // Add result as new message
        const resultMsg = {
          id: `quiz-result-${Date.now()}`,
          role: "assistant",
          type: "quiz_result",
          isCorrect: result.isCorrect,
          correctAnswer: result.correctAnswer,
          correctOptionText: result.correctOptionText,
          explanation: result.explanation,
          xpEarned: result.xpEarned,
          newStreak: result.streakCount,
          leveledUp: result.leveledUp,
          newLevel: result.newLevel,
          newBadges: result.newBadges,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, resultMsg]);
        // Refresh XPBar
        window.dispatchEvent(new Event("xp-updated"));
        return result;
      }
    } catch (err) {
      console.error("Quiz answer error:", err);
    }
    return null;
  }, []);

  const startNewConversation = useCallback(async () => {
    try {
      const data = await startConversation();
      if (data.success) {
        setConversationId(data.conversationId);
        setMessages([]);
        setError(null);
        fetchConversations();
      }
    } catch (err) {
      setError("Failed to start new conversation");
    }
  }, []);

  return {
    messages,
    isLoading: isLoading || isStreaming,
    error,
    conversationId,
    messageCount,
    conversations,
    conversationsLoading,
    limitError,
    setLimitError,
    sendMessage,
    handleQuizAnswer,
    startNewConversation,
    loadConversation,
    deleteChat,
    fetchConversations,
  };
};
