/**
 * Complete roadmap data — single source of truth.
 * Three roadmaps: beginner, intermediate, advanced.
 * Each has ordered stages with topics, XP thresholds, and goals.
 */

export const ROADMAP_DATA = {
  beginner: {
    name: "Beginner",
    icon: "🌱",
    totalXp: 600,
    stages: [
      {
        stage: 1,
        name: "Hello World",
        emoji: "👋",
        xpRequired: 0,
        xpToComplete: 50,
        topics: [
          "Basic greetings: hello, hi, good morning",
          "Introducing yourself: name, age, city",
          "Saying goodbye: bye, see you, take care",
        ],
        goals: [
          "Introduce yourself in 3 sentences",
          "Greet Vanni in 5 different ways",
        ],
        quizCount: 3,
      },
      {
        stage: 2,
        name: "About Me",
        emoji: "🙋",
        xpRequired: 50,
        xpToComplete: 100,
        topics: [
          "Family members: mother, father, sister, brother",
          "Describing people: tall, short, funny, kind",
          "Numbers and age",
          "My daily routine basics",
        ],
        goals: [
          "Describe your family in 5 sentences",
          "Tell Vanni about your day",
        ],
        quizCount: 3,
      },
      {
        stage: 3,
        name: "Daily Life",
        emoji: "🌅",
        xpRequired: 150,
        xpToComplete: 100,
        topics: [
          "Present tense: I eat, I go, I work",
          "Common verbs: eat, drink, sleep, walk, talk",
          "Time expressions: today, tomorrow, yesterday",
          "Places: market, school, home, office",
        ],
        goals: [
          "Describe your morning routine fully",
          "Talk about what you do every day",
        ],
        quizCount: 3,
      },
      {
        stage: 4,
        name: "What Happened",
        emoji: "📅",
        xpRequired: 250,
        xpToComplete: 150,
        topics: [
          "Past tense: I went, I ate, I played",
          "Irregular verbs: go-went, eat-ate, buy-bought",
          "Story telling: first, then, after that, finally",
          "Weekend and holiday vocabulary",
        ],
        goals: [
          "Tell a story about your last weekend",
          "Describe what you did yesterday",
        ],
        quizCount: 4,
      },
      {
        stage: 5,
        name: "What Will Happen",
        emoji: "🔮",
        xpRequired: 400,
        xpToComplete: 200,
        topics: [
          "Future tense: I will go, I am going to",
          "Plans and dreams vocabulary",
          "Making promises and commitments",
          "Talking about goals",
        ],
        goals: [
          "Describe your plans for next week",
          "Tell Vanni your life dream in English",
        ],
        quizCount: 4,
      },
      {
        stage: 6,
        name: "Beginner Graduate",
        emoji: "🎓",
        xpRequired: 600,
        xpToComplete: 0,
        topics: ["Final assessment conversation with Vanni"],
        goals: ["Complete final assessment", "Unlock Intermediate roadmap"],
        quizCount: 5,
      },
    ],
  },

  intermediate: {
    name: "Intermediate",
    icon: "⭐",
    totalXp: 1200,
    stages: [
      {
        stage: 1,
        name: "Article Master",
        emoji: "📰",
        xpRequired: 0,
        xpToComplete: 100,
        topics: [
          "A vs An vs The",
          "When to use no article",
          "Common article mistakes Indians make",
        ],
        goals: ["Write 10 sentences using articles correctly"],
        quizCount: 3,
      },
      {
        stage: 2,
        name: "Preposition Pro",
        emoji: "📍",
        xpRequired: 100,
        xpToComplete: 150,
        topics: [
          "In, on, at for time and place",
          "Common preposition mistakes",
          "Prepositions after verbs",
        ],
        goals: [
          "Describe your room using prepositions",
          "Talk about your schedule using time prepositions",
        ],
        quizCount: 3,
      },
      {
        stage: 3,
        name: "Tense Master",
        emoji: "⏰",
        xpRequired: 250,
        xpToComplete: 200,
        topics: [
          "Present continuous vs present simple",
          "Past continuous: I was going",
          "Present perfect: I have eaten",
          "Common tense mistakes",
        ],
        goals: [
          "Tell a story mixing past and past continuous",
          "Describe what you have done today",
        ],
        quizCount: 4,
      },
      {
        stage: 4,
        name: "Question Expert",
        emoji: "❓",
        xpRequired: 450,
        xpToComplete: 200,
        topics: [
          "Forming questions correctly",
          "Wh questions: what, where, when, why, how",
          "Yes/No questions",
          "Question tags: isn't it, don't you",
        ],
        goals: [
          "Interview Vanni with 10 questions",
          "Ask for directions using questions",
        ],
        quizCount: 4,
      },
      {
        stage: 5,
        name: "Vocabulary Builder",
        emoji: "📚",
        xpRequired: 650,
        xpToComplete: 250,
        topics: [
          "Synonyms and antonyms",
          "Formal vs informal words",
          "Common English idioms part 1",
          "Phrasal verbs basics",
        ],
        goals: [
          "Replace 5 simple words with better vocabulary",
          "Use 3 idioms correctly in conversation",
        ],
        quizCount: 4,
      },
      {
        stage: 6,
        name: "Confident Speaker",
        emoji: "💬",
        xpRequired: 900,
        xpToComplete: 300,
        topics: [
          "Expressing opinions: I think, I believe, In my opinion",
          "Agreeing and disagreeing politely",
          "Giving reasons: because, since, therefore",
          "Complex sentences with because, although, however",
        ],
        goals: [
          "Debate a simple topic with Vanni",
          "Give your opinion on 5 different topics",
        ],
        quizCount: 5,
      },
      {
        stage: 7,
        name: "Intermediate Graduate",
        emoji: "🎓",
        xpRequired: 1200,
        xpToComplete: 0,
        topics: ["Final assessment"],
        goals: ["Complete final assessment", "Unlock Advanced roadmap"],
        quizCount: 5,
      },
    ],
  },

  advanced: {
    name: "Advanced",
    icon: "🔥",
    totalXp: 2000,
    stages: [
      {
        stage: 1,
        name: "Idiom Expert",
        emoji: "🗣️",
        xpRequired: 0,
        xpToComplete: 200,
        topics: [
          "20 most used English idioms",
          "How to use idioms naturally",
          "Idioms in conversations",
        ],
        goals: ["Use 5 idioms naturally in conversation"],
        quizCount: 4,
      },
      {
        stage: 2,
        name: "Professional English",
        emoji: "💼",
        xpRequired: 200,
        xpToComplete: 300,
        topics: [
          "Email writing basics",
          "Office and professional vocabulary",
          "How to speak in meetings",
          "Resume and interview language",
        ],
        goals: [
          "Write a professional email with Vanni",
          "Practice a job interview with Vanni",
        ],
        quizCount: 4,
      },
      {
        stage: 3,
        name: "Storytelling",
        emoji: "📖",
        xpRequired: 500,
        xpToComplete: 300,
        topics: [
          "Narrative techniques",
          "Descriptive language",
          "Making stories interesting",
          "Humor in English",
        ],
        goals: [
          "Tell a 10 sentence story in English",
          "Make Vanni laugh with a funny story",
        ],
        quizCount: 4,
      },
      {
        stage: 4,
        name: "Debate Champion",
        emoji: "🏆",
        xpRequired: 800,
        xpToComplete: 400,
        topics: [
          "Advanced opinion language",
          "Persuasion techniques",
          "Counterarguments",
          "Formal discussion vocabulary",
        ],
        goals: [
          "Debate 3 topics with Vanni and win",
          "Write a persuasive argument",
        ],
        quizCount: 5,
      },
      {
        stage: 5,
        name: "Fluency Final",
        emoji: "🌟",
        xpRequired: 1200,
        xpToComplete: 800,
        topics: [
          "Natural connected speech",
          "Reducing hesitation",
          "Thinking in English",
          "Advanced vocabulary in context",
        ],
        goals: [
          "10 minute uninterrupted English conversation",
          "Talk about any topic for 5 minutes",
        ],
        quizCount: 5,
      },
      {
        stage: 6,
        name: "English Master",
        emoji: "👑",
        xpRequired: 2000,
        xpToComplete: 0,
        topics: ["Final assessment"],
        goals: ["Complete final assessment", "Earn English Master badge"],
        quizCount: 5,
      },
    ],
  },
};

/**
 * Get roadmap data for a specific level.
 */
export const getRoadmapForLevel = (level) => {
  return ROADMAP_DATA[level] || ROADMAP_DATA.beginner;
};

/**
 * Get a specific stage from a roadmap.
 */
export const getStageData = (level, stageNumber) => {
  const roadmap = getRoadmapForLevel(level);
  return (
    roadmap.stages.find((s) => s.stage === stageNumber) || roadmap.stages[0]
  );
};
