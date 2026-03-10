export const API_URL = import.meta.env.VITE_API_URL || "";

export const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ─── Auth ────────────────────────────────────────────────────

export const register = async (name, email, password, level) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, level }),
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const verifyOTP = async (email, otp) => {
  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};

export const resendOTP = async (email) => {
  const res = await fetch(`${API_URL}/api/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const verifyResetOTP = async (email, otp) => {
  const res = await fetch(`${API_URL}/api/auth/verify-reset-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return res.json();
};

export const resetPassword = async (email, resetToken, newPassword) => {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, resetToken, newPassword }),
  });
  return res.json();
};

export const getMe = async () => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: getHeaders(),
  });
  return res.json();
};

// ─── Chat ───────────────────────────────────────────────────

export const sendMessage = async (message, conversationId) => {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ message, conversationId }),
  });
  return res.json();
};

export const streamMessage = async (
  message,
  conversationId,
  onChunk,
  onDone,
  onError,
) => {
  try {
    const res = await fetch(`${API_URL}/api/chat/stream`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, conversationId }),
    });

    if (!res.ok) {
      const err = await res.json();
      onError?.(err.error || "Something went wrong");
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

      // Keep the last potentially incomplete line in buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) {
              onChunk?.(data.chunk);
            }
            if (data.done) {
              onDone?.(data);
            }
            if (data.error) {
              onError?.(data.error);
            }
          } catch (e) {
            // Ignore parse errors for partial chunks
          }
        }
      }
    }
  } catch (error) {
    onError?.(error.message || "Connection failed");
  }
};

export const getHistory = async () => {
  const res = await fetch(`${API_URL}/api/chat/history`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const startConversation = async () => {
  const res = await fetch(`${API_URL}/api/chat/conversation`, {
    method: "POST",
    headers: getHeaders(),
  });
  return res.json();
};

export const getConversations = async () => {
  const res = await fetch(`${API_URL}/api/chat/conversations`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const getConversationMessages = async (conversationId) => {
  const res = await fetch(
    `${API_URL}/api/chat/conversations/${conversationId}/messages`,
    {
      headers: getHeaders(),
    },
  );
  return res.json();
};

export const deleteConversationApi = async (conversationId) => {
  const res = await fetch(
    `${API_URL}/api/chat/conversations/${conversationId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    },
  );
  return res.json();
};

// ─── User ────────────────────────────────────────────────────

export const getUserProgress = async () => {
  const res = await fetch(`${API_URL}/api/user/progress`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const getUserProfile = async () => {
  const res = await fetch(`${API_URL}/api/user/profile`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const updateLevel = async (level) => {
  const res = await fetch(`${API_URL}/api/user/level`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ level }),
  });
  return res.json();
};

// ─── Plan ────────────────────────────────────────────────────

export const getPlanStatus = async () => {
  const res = await fetch(`${API_URL}/api/plan/status`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const getAllPlans = async () => {
  const res = await fetch(`${API_URL}/api/plan/all`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const upgradePlan = async (plan, paymentRef) => {
  const res = await fetch(`${API_URL}/api/plan/upgrade`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ plan, paymentRef }),
  });
  return res.json();
};

// ─── Quiz ───────────────────────────────────────────────────

export const answerQuiz = async (quizId, answer) => {
  const res = await fetch(`${API_URL}/api/quiz/answer`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ quizId, answer }),
  });
  return res.json();
};

export const getQuizStats = async () => {
  const res = await fetch(`${API_URL}/api/quiz/stats`, {
    headers: getHeaders(),
  });
  return res.json();
};

// ─── Roadmap ────────────────────────────────────────────────

export const getRoadmap = async () => {
  const res = await fetch(`${API_URL}/api/roadmap`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const getCurrentStage = async () => {
  const res = await fetch(`${API_URL}/api/roadmap/current`, {
    headers: getHeaders(),
  });
  return res.json();
};
