import { useState, useCallback, useRef } from "react";

/**
 * Hook for handling SSE streaming from the chat API.
 */
export const useStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);

  const stream = useCallback(
    async (message, conversationId, onChunk, onDone, onError) => {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const token = localStorage.getItem("token");

      setIsStreaming(true);

      try {
        const res = await fetch(`${API_URL}/api/chat/stream`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message, conversationId }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          onError?.(err.error || "Something went wrong", {
            status: res.status,
            ...err,
          });
          setIsStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.chunk) onChunk?.(data.chunk);
                if (data.done) onDone?.(data);
                if (data.error) onError?.(data.error);
              } catch (e) {
                /* skip partial */
              }
            }
          }
        }
      } catch (error) {
        onError?.(error.message || "Connection failed");
      } finally {
        setIsStreaming(false);
      }
    },
    [],
  );

  return { stream, isStreaming };
};
