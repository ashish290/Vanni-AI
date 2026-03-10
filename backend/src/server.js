import "dotenv/config";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import oauthRoutes from "./routes/oauth.js";
import chatRoutes from "./routes/chat.js";
import userRoutes from "./routes/user.js";
import voiceRoutes from "./routes/voice.js";
import planRoutes from "./routes/plan.js";
import quizRoutes from "./routes/quiz.js";
import roadmapRoutes from "./routes/roadmap.js";
import paymentRoutes from "./routes/payment.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { initDriver, closeDriver } from "./services/dbService.js";
import { setupVoiceWebSocket } from "./websockets/voiceWebSocket.js";
import { seedPlans } from "./models/index.js";
import { initCronJobs } from "./services/cronService.js";
import session from "express-session";
import passport from "./services/passportService.js";

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", oauthRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/payment", paymentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Vanni AI API is running 🚀" });
});

// Error handler
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await initDriver();
    await seedPlans();
    console.log("✅ PostgreSQL connected & tables synced");

    initCronJobs();

    const server = app.listen(PORT, () => {
      console.log(`Vanni AI server running on port ${PORT}`);
    });

    // Attach Voice WebSocket
    setupVoiceWebSocket(server);
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGINT", async () => {
  await closeDriver();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDriver();
  process.exit(0);
});

start();

export default app;
