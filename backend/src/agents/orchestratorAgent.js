import { getUserContext, save } from "./memoryAgent.js";
import { analyze } from "./analyzerAgent.js";
import { respond, respondStream } from "./tutorAgent.js";
import { findUserById } from "../services/dbService.js";
import { shouldTriggerQuiz, generateQuiz } from "../services/quizService.js";
import {
  getStageContext,
  checkStageProgress,
} from "../services/roadmapService.js";

export const run = async (
  userId,
  message,
  conversationId,
  isVoiceMode = false,
) => {
  const user = await findUserById(userId);
  if (!user) throw new Error("User not found");

  const userName = user.name;
  const level = user.level || "beginner";

  // Step 1: Get user context
  console.log("🔄 Step 1: Getting user context...");
  const userContext = await getUserContext(userId);

  // Step 1b: Get stage context for roadmap
  let stageContext = null;
  try {
    stageContext = await getStageContext(userId);
  } catch (err) {
    console.log("Stage context fetch skipped:", err.message);
  }

  // Step 2: Analyze the user's message
  console.log("🔄 Step 2: Analyzing message...");
  const analysisResult = await analyze({
    userMessage: message,
    userLevel: level,
  });

  // Step 3: Generate Vanni's response
  console.log("🔄 Step 3: Generating Vanni response...");
  const { reply } = await respond({
    userMessage: message,
    userContext,
    analysisResult,
    level,
    userName,
    stageContext,
    isVoiceMode,
    topMistakes: userContext.topMistakes || [],
  });

  // Step 4: Save everything to memory
  console.log("🔄 Step 4: Saving to memory...");
  const saveResult = await save(
    userId,
    conversationId,
    message,
    reply,
    analysisResult,
  );

  // Step 5: Check if quiz should be triggered
  console.log("🔄 Step 5: Checking quiz trigger...");
  let quiz = null;
  try {
    const convId = saveResult.conversationId || conversationId;
    const trigger = await shouldTriggerQuiz(convId);
    if (trigger) {
      console.log("🎯 Quiz triggered!");
      quiz = await generateQuiz(
        convId,
        userId,
        userContext?.history || [],
        userContext?.weakAreas || [],
      );
    }
  } catch (err) {
    console.error("Quiz check failed (non-fatal):", err.message);
  }

  // Step 6: Check stage advancement
  let stageAdvance = null;
  try {
    stageAdvance = await checkStageProgress(userId);
  } catch (err) {
    console.log("Stage check skipped:", err.message);
  }

  console.log("✅ Orchestrator pipeline complete");

  return {
    reply,
    conversationId: saveResult.conversationId,
    messageCount: (userContext.messageCount || 0) + 1,
    quiz,
    stageAdvance: stageAdvance?.advanced ? stageAdvance : null,
  };
};

/**
 * Streaming version of the orchestrator pipeline.
 * Analysis & context happen first, then Vanni streams her response.
 */
export const runStream = async (
  userId,
  message,
  conversationId,
  res,
  isVoiceMode = false,
) => {
  const user = await findUserById(userId);
  if (!user) throw new Error("User not found");

  const userName = user.name;
  const level = user.level || "beginner";

  // Step 1: Get user context
  const userContext = await getUserContext(userId);

  // Step 1b: Get stage context
  let stageContext = null;
  try {
    stageContext = await getStageContext(userId);
  } catch (err) {
    console.log("Stage context fetch skipped:", err.message);
  }

  // Step 2: Analyze message (non-streaming)
  const analysisResult = await analyze({
    userMessage: message,
    userLevel: level,
  });

  // Step 3: Stream Vanni's response
  const { reply } = await respondStream({
    userMessage: message,
    userContext,
    analysisResult,
    level,
    userName,
    stageContext,
    onChunk: (chunk) => {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    },
    isVoiceMode,
    topMistakes: userContext.topMistakes || [],
  });

  // Step 4: Save to memory (after streaming completes)
  const saveResult = await save(
    userId,
    conversationId,
    message,
    reply,
    analysisResult,
  );

  // Step 5: Check if quiz should be triggered
  let quiz = null;
  try {
    const convId = saveResult.conversationId || conversationId;
    const trigger = await shouldTriggerQuiz(convId);
    if (trigger) {
      console.log("🎯 Quiz triggered (stream)!");
      quiz = await generateQuiz(
        convId,
        userId,
        userContext?.history || [],
        userContext?.weakAreas || [],
      );
    }
  } catch (err) {
    console.error("Quiz check failed (non-fatal):", err.message);
  }

  // Step 6: Check stage advancement
  let stageAdvance = null;
  try {
    stageAdvance = await checkStageProgress(userId);
  } catch (err) {
    console.log("Stage check skipped:", err.message);
  }

  // Send done event with quiz and stage data
  res.write(
    `data: ${JSON.stringify({
      done: true,
      reply, // Final cleaned reply
      conversationId: saveResult.conversationId,
      messageCount: (userContext.messageCount || 0) + 1,
      quiz,
      stageAdvance: stageAdvance?.advanced ? stageAdvance : null,
    })}\n\n`,
  );
  res.end();

  return { reply, conversationId: saveResult.conversationId };
};
