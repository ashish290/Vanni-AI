import { chatWithVanni } from "../services/sarvamService.js";

const QUIZ_INTRO_LINES = [
  "Ek second — brain check time! 🎯",
  "Chalo ek quick question! 😄",
  "Test karte hain kya seekha! 🧠",
  "Quick practice round! ⚡",
  "Boom — quiz time! 🎉",
  "Acha batao toh — 🤔",
  "Challenge accepted? 💪",
];

let lastIntroIndex = -1;

const getRandomIntro = () => {
  let index;
  do {
    index = Math.floor(Math.random() * QUIZ_INTRO_LINES.length);
  } while (index === lastIntroIndex && QUIZ_INTRO_LINES.length > 1);
  lastIntroIndex = index;
  return QUIZ_INTRO_LINES[index];
};

const QUIZ_TYPES = [
  "grammar_fix",
  "fill_blank",
  "word_meaning",
  "sentence_build",
  "tense_id",
];

const buildSystemPrompt = (avoidType, askedQuestions) => {
  const typeInstruction = avoidType
    ? `\nIMPORTANT: Do NOT use quiz type "${avoidType}" — you used it last time. Pick a DIFFERENT type from: ${QUIZ_TYPES.filter((t) => t !== avoidType).join(", ")}.`
    : "";

  const repeatInstruction =
    askedQuestions?.length > 0
      ? `\nDo NOT repeat any of these previously asked questions:\n${askedQuestions.map((q) => `- "${q}"`).join("\n")}`
      : "";

  return `You are a quiz generator for an English learning app called Vanni AI.
You look at the LATEST conversation messages and generate ONE quiz question.
Base the question on mistakes the user made or words they used recently.
Make it helpful and educational, not tricky.

QUIZ TYPES (you MUST rotate through these — never use the same type twice in a row):
1. grammar_fix — Show a wrong sentence, ask user to pick the correct one
2. fill_blank — Remove a key word from a sentence, give 4 options
3. word_meaning — Ask meaning of a word used in conversation
4. sentence_build — Give jumbled words, ask user to arrange correctly
5. tense_id — Show a sentence and ask what tense it is
${typeInstruction}
${repeatInstruction}

You MUST return ONLY valid JSON in this EXACT format, nothing else:
{
  "question": "question text here",
  "type": "one of: grammar_fix, fill_blank, word_meaning, sentence_build, tense_id",
  "options": {
    "a": "option a text",
    "b": "option b text",
    "c": "option c text",
    "d": "option d text"
  },
  "correct": "a or b or c or d",
  "explanation": "brief explanation why this is correct",
  "hint": "optional hint for user"
}

RULES:
- Return ONLY the JSON object, no markdown, no code fences, no extra text
- The "correct" field must be exactly one of: "a", "b", "c", "d"
- Base questions on the LATEST messages shown below only
- Keep questions at the user's level
- Questions should feel fun, not like a test
- Each question MUST be unique and different from previous ones`;
};

/**
 * Generate a quiz from conversation history using Sarvam-M.
 * @param {Array} conversationHistory - messages array
 * @param {Array} weakAreas - user weak areas
 * @param {string} avoidType - last quiz type used (to rotate)
 * @param {Array} askedQuestions - previously asked question texts
 */
export const generateQuizFromConversation = async (
  conversationHistory,
  weakAreas = [],
  avoidType = null,
  askedQuestions = [],
) => {
  try {
    // Use only last 5 messages for freshness
    const recentMessages = (conversationHistory || []).slice(-5);

    const conversationText = recentMessages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const weakAreasText = weakAreas.length
      ? `User's weak areas: ${weakAreas.map((w) => w.topic).join(", ")}`
      : "";

    const userPrompt = `Here is the LATEST conversation:\n\n${conversationText}\n\n${weakAreasText}\n\nGenerate ONE unique quiz question. Return ONLY valid JSON.`;

    const systemPrompt = buildSystemPrompt(avoidType, askedQuestions);
    const messages = [{ role: "user", content: userPrompt }];
    const response = await chatWithVanni(messages, systemPrompt, 512);

    const quiz = parseQuizJSON(response);
    // Prepend random intro to the question
    quiz.question = `${getRandomIntro()}\n\n${quiz.question}`;
    return quiz;
  } catch (error) {
    console.error("❌ Quiz Agent error:", error.message);
    return getFallbackQuiz(avoidType);
  }
};

function parseQuizJSON(text) {
  if (!text) return null;

  // Try direct parse
  try {
    const parsed = JSON.parse(text.trim());
    if (isValidQuiz(parsed)) return parsed;
  } catch (e) {
    /* skip */
  }

  // Try extracting from code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (isValidQuiz(parsed)) return parsed;
    } catch (e) {
      /* skip */
    }
  }

  // Try extracting first { ... } block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (isValidQuiz(parsed)) return parsed;
    } catch (e) {
      /* skip */
    }
  }

  return getFallbackQuiz();
}

function isValidQuiz(obj) {
  return (
    obj &&
    obj.question &&
    obj.options &&
    obj.correct &&
    ["a", "b", "c", "d"].includes(obj.correct)
  );
}

function getFallbackQuiz(avoidType = null) {
  // Rotate fallback type based on avoidType
  const fallbacks = [
    {
      question: "Which sentence is correct?",
      type: "grammar_fix",
      options: {
        a: "I goes to school every day",
        b: "I go to school every day",
        c: "I going to school every day",
        d: "I goed to school every day",
      },
      correct: "b",
      explanation: "'Go' is the correct base form. 'I go' is correct.",
      hint: "Think about subject-verb agreement with 'I'",
    },
    {
      question: "Complete: She _____ to the park yesterday.",
      type: "fill_blank",
      options: { a: "go", b: "goes", c: "went", d: "going" },
      correct: "c",
      explanation: "'Went' is the past tense of 'go'.",
      hint: "Yesterday means past tense!",
    },
    {
      question: "What tense is: 'They are playing cricket'?",
      type: "tense_id",
      options: {
        a: "Simple present",
        b: "Present continuous",
        c: "Past continuous",
        d: "Simple past",
      },
      correct: "b",
      explanation:
        "'Are playing' uses is/am/are + verb-ing = present continuous.",
      hint: "Look for the -ing form",
    },
  ];

  const filtered = avoidType
    ? fallbacks.filter((f) => f.type !== avoidType)
    : fallbacks;

  const pick =
    filtered[Math.floor(Math.random() * filtered.length)] || fallbacks[0];
  pick.question = `${getRandomIntro()}\n\n${pick.question}`;
  return pick;
}
