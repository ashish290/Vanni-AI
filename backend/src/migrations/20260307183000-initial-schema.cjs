"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create Users
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: true },
      oauthProvider: { type: Sequelize.STRING(20), allowNull: true },
      oauthId: { type: Sequelize.STRING(100), allowNull: true },
      level: {
        type: Sequelize.ENUM("beginner", "intermediate", "advanced"),
        defaultValue: "beginner",
      },
      messageCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      streak: { type: Sequelize.INTEGER, defaultValue: 0 },
      lastActive: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      plan: {
        type: Sequelize.ENUM("free", "basic", "pro"),
        defaultValue: "free",
      },
      dailyCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      lastReset: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.literal("CURRENT_DATE"),
      },
      voiceEnabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      xpPoints: { type: Sequelize.INTEGER, defaultValue: 0 },
      xpLevel: { type: Sequelize.STRING(20), defaultValue: "Beginner" },
      quizStreak: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalQuizzes: { type: Sequelize.INTEGER, defaultValue: 0 },
      correctAnswers: { type: Sequelize.INTEGER, defaultValue: 0 },
      badges: { type: Sequelize.JSON, defaultValue: [] },
      currentRoadmap: { type: Sequelize.STRING(20), defaultValue: "beginner" },
      currentStage: { type: Sequelize.INTEGER, defaultValue: 1 },
      stageXp: { type: Sequelize.INTEGER, defaultValue: 0 },
      roadmapStartedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      planExpiresAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 2. Create Grammar Topics
    await queryInterface.createTable("grammar_topics", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, defaultValue: "" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 3. Create Plans
    await queryInterface.createTable("plans", {
      name: { type: Sequelize.STRING(10), primaryKey: true, allowNull: false },
      dailyLimit: { type: Sequelize.INTEGER, allowNull: true },
      voiceEnabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      historyDays: { type: Sequelize.INTEGER, allowNull: true },
      priceMonthly: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    // 4. Create Conversations
    await queryInterface.createTable("conversations", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      messageCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 5. Create Messages
    await queryInterface.createTable("messages", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "conversations", key: "id" },
        onDelete: "CASCADE",
      },
      role: { type: Sequelize.ENUM("user", "assistant"), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 6. Create Mistakes
    await queryInterface.createTable("mistakes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      grammarTopicId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "grammar_topics", key: "id" },
        onDelete: "SET NULL",
      },
      type: { type: Sequelize.STRING, allowNull: false },
      original: { type: Sequelize.TEXT, allowNull: false },
      correction: { type: Sequelize.TEXT, allowNull: false },
      explanation: { type: Sequelize.TEXT },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 7. Create Learned Words
    await queryInterface.createTable("learned_words", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      text: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 8. Create User Weak Areas
    await queryInterface.createTable("user_weak_areas", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      grammarTopicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "grammar_topics", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    // 9. Others (Payments, Roadmaps, Quizzes)
    await queryInterface.createTable("payments", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      razorpayOrderId: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      razorpayPaymentId: { type: Sequelize.STRING(255), allowNull: true },
      razorpaySignature: { type: Sequelize.STRING(255), allowNull: true },
      plan: { type: Sequelize.STRING(20), allowNull: false },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      currency: { type: Sequelize.STRING(5), defaultValue: "INR" },
      status: {
        type: Sequelize.ENUM("created", "paid", "failed", "refunded"),
        defaultValue: "created",
      },
      paidAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("roadmap_progress", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      roadmap: { type: Sequelize.STRING(20), allowNull: false },
      stage: { type: Sequelize.INTEGER, allowNull: false },
      status: {
        type: Sequelize.ENUM("locked", "current", "completed"),
        defaultValue: "locked",
      },
      completedAt: { type: Sequelize.DATE, allowNull: true },
      xpEarned: { type: Sequelize.INTEGER, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("quizzes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "conversations", key: "id" },
        onDelete: "SET NULL",
      },
      question: { type: Sequelize.TEXT, allowNull: false },
      quizType: { type: Sequelize.STRING(30), allowNull: false },
      options: { type: Sequelize.JSONB, allowNull: false },
      correctAnswer: { type: Sequelize.STRING(10), allowNull: false },
      explanation: { type: Sequelize.TEXT, allowNull: true },
      hint: { type: Sequelize.TEXT, allowNull: true },
      userAnswer: { type: Sequelize.STRING(10), allowNull: true },
      isCorrect: { type: Sequelize.BOOLEAN, allowNull: true },
      xpEarned: { type: Sequelize.INTEGER, defaultValue: 0 },
      answeredAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("quiz_sessions", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "conversations", key: "id" },
        onDelete: "SET NULL",
      },
      questionsAsked: { type: Sequelize.INTEGER, defaultValue: 0 },
      correctCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      xpEarned: { type: Sequelize.INTEGER, defaultValue: 0 },
      isPerfect: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("upgrades", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      fromPlan: { type: Sequelize.STRING(10), allowNull: false },
      toPlan: { type: Sequelize.STRING(10), allowNull: false },
      upgradedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      paymentRef: { type: Sequelize.STRING(255), allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("upgrades");
    await queryInterface.dropTable("quiz_sessions");
    await queryInterface.dropTable("quizzes");
    await queryInterface.dropTable("payments");
    await queryInterface.dropTable("roadmap_progress");
    await queryInterface.dropTable("user_weak_areas");
    await queryInterface.dropTable("learned_words");
    await queryInterface.dropTable("mistakes");
    await queryInterface.dropTable("messages");
    await queryInterface.dropTable("conversations");
    await queryInterface.dropTable("plans");
    await queryInterface.dropTable("grammar_topics");
    await queryInterface.dropTable("users");
  },
};
