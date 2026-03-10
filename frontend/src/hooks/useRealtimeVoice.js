import { useState, useRef, useCallback, useEffect } from "react";
import {
  playAudioBase64,
  speakFallback,
  stopAudio,
} from "../services/speechService";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000";

export const useRealtimeVoice = (conversationId) => {
  // States: idle, listening, processing_stt, generating_response, generating_audio, speaking
  const [status, setStatus] = useState("idle");
  const [userTranscript, setUserTranscript] = useState("");
  const [aiTranscript, setAiTranscript] = useState("");
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const isComponentMounted = useRef(true);
  const statusRef = useRef(status); // Mirror status in a ref for stable callbacks

  // Keep statusRef in sync with status state
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(
    (isActiveRef) => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to use Voice Mode.");
        return null;
      }

      let url = `${WS_URL}/api/voice/ws?token=${token}`;
      if (conversationId) {
        url += `&conversationId=${conversationId}`;
      }

      const socket = new WebSocket(url);

      socket.onopen = () => {
        if (!isActiveRef.current) return;
        console.log("Voice WebSocket connected!");
        setError(null);
      };

      socket.onmessage = async (event) => {
        if (!isActiveRef.current) return;
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "status":
              setStatus(data.message); // processing_stt, generating_response, generating_audio
              break;
            case "user_text":
              setUserTranscript((prev) =>
                prev ? `${prev} ${data.text}` : data.text,
              );
              break;
            case "conversation_created":
              // We expose this so VoiceMode can navigate to the new ID
              if (data.conversationId) {
                window.history.replaceState(
                  null,
                  "",
                  `/voice/${data.conversationId}`,
                );
              }
              break;
            case "ai_text":
              setAiTranscript(data.text);
              break;
            case "audio_response":
              setStatus("speaking");
              await playAudioBase64(data.audio);
              if (isActiveRef.current) {
                setStatus("idle"); // reset status after done speaking
              }
              break;
            case "error":
              setError(data.message);
              setStatus("idle");
              break;
            default:
              console.log("Unknown WS message:", data);
          }
        } catch (err) {
          console.error("Failed to parse WS message:", err);
        }
      };

      socket.onclose = (event) => {
        if (!isActiveRef.current) return;
        console.log("Voice WebSocket closed, code:", event.code, event.reason);
        // Show specific message for access-denied closes
        if (event.code === 4003 && event.reason) {
          setError(event.reason);
        }
        if (statusRef.current !== "idle") {
          setStatus("idle");
        }
      };

      socket.onerror = (err) => {
        if (!isActiveRef.current) return;
        console.error("❌ Voice WebSocket Error:", err);
        console.log("📊 Socket state at error:", socket.readyState);

        setError((prev) =>
          prev
            ? prev
            : "Connection to voice server lost. Check your internet or try again.",
        );
        setStatus("idle");
      };

      return socket;
    },
    [conversationId],
  );

  // Stop capturing and signal backend to process the audio buffer
  // Uses statusRef so this callback is stable (no status dependency)
  const stopListening = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // The final process_audio signal is now sent from mediaRecorder.onstop
    // to guarantee all audio chunks have been transmitted first.
    if (statusRef.current === "listening") {
      setStatus("processing_stt"); // Immediately update UI
    }
  }, []); // Stable — no dependencies that change

  // Start capturing audio from microphone
  const startVoiceListening = async () => {
    try {
      setError(null);
      // Clear previous transcripts for new turn
      setAiTranscript("");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (
          event.data.size > 0 &&
          wsRef.current?.readyState === WebSocket.OPEN
        ) {
          wsRef.current.send(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          console.log(
            "✅ MediaRecorder stopped. Sending process_audio signal.",
          );
          wsRef.current.send(JSON.stringify({ type: "process_audio" }));
        }
      };

      console.log("Audio Data :", mediaRecorder);

      mediaRecorder.start(250); // Emit chunk every 250ms
      setStatus("listening");
    } catch (err) {
      console.error("Microphone access denied:", err);
      setError("Please allow microphone access to use Voice Mode.");
    }
  };

  // Stop Vanni's current speech playback
  const stopSpeaking = useCallback(() => {
    stopAudio();
    if (statusRef.current === "speaking") {
      setStatus("idle");
    }
  }, []);

  useEffect(() => {
    isComponentMounted.current = true;
    const isActive = { current: true };
    const socket = connectWebSocket(isActive);
    wsRef.current = socket;

    return () => {
      isComponentMounted.current = false;
      isActive.current = false;
      stopListening(); // Ensure microphone is released
      stopSpeaking(); // Ensure audio is stopped
      if (socket) {
        socket.close();
      }
    };
  }, [connectWebSocket, stopListening, stopSpeaking]);

  return {
    status, // idle, listening, processing_stt, generating_response, generating_audio, speaking
    userTranscript,
    aiTranscript,
    error,
    startVoiceListening,
    stopListening,
    stopSpeaking,
  };
};
