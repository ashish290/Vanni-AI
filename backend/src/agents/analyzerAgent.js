import { chatWithVanni } from "../services/sarvamService.js";
import { getAnalyzerPrompt } from "../prompts/analyzerPrompt.js";

/**
 * Analyzes a user message for grammar mistakes, topics, vocabulary, and engagement.
 * Returns structured JSON — the user never sees this output.
 */
export const analyze = async ({ userMessage, userLevel }) => {
  try {
    const systemPrompt = getAnalyzerPrompt(userLevel);

    const response = await chatWithVanni(
      [{ role: "user", content: userMessage }],
      systemPrompt,
      1024,
    );

    // Robust JSON extraction: Find the first { and the last }
    let cleaned = response.trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    } else if (cleaned.startsWith("```")) {
      // Fallback for markdown fences if no braces found (shouldn't happen with JSON)
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const analysis = JSON.parse(cleaned);
    return analysis;
  } catch (error) {
    console.error("❌ Analyzer Agent error:", error.message);
    // Return a safe default if analysis fails
    return {
      mistakes: [],
      topicsDiscussed: [],
      newWordsUsed: [],
      sentimentScore: 0.5,
      engagementLevel: "medium",
      suggestedFocusArea: "general conversation",
    };
  }
};
