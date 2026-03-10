import { DataTypes } from "sequelize";
export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      oauthProvider: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      oauthId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      level: {
        type: DataTypes.ENUM("beginner", "intermediate", "advanced"),
        defaultValue: "beginner",
      },
      messageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastActive: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      plan: {
        type: DataTypes.ENUM("free", "basic", "pro"),
        defaultValue: "free",
      },
      dailyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastReset: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      voiceEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      xpPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      xpLevel: {
        type: DataTypes.STRING(20),
        defaultValue: "Beginner",
      },
      quizStreak: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalQuizzes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      correctAnswers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      badges: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      currentRoadmap: {
        type: DataTypes.STRING(20),
        defaultValue: "beginner",
      },
      currentStage: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      stageXp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      roadmapStartedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      planExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    },
  );

  User.associate = (models) => {
    User.hasMany(models.Conversation, {
      foreignKey: "userId",
      as: "conversations",
    });
    User.hasMany(models.Mistake, { foreignKey: "userId", as: "mistakes" });
    User.hasMany(models.LearnedWord, {
      foreignKey: "userId",
      as: "learnedWords",
    });
    User.belongsToMany(models.GrammarTopic, {
      through: models.UserWeakArea,
      as: "weakAreas",
      foreignKey: "userId",
    });
    User.hasMany(models.Upgrade, { foreignKey: "userId", as: "upgrades" });
    User.hasMany(models.Quiz, { foreignKey: "userId", as: "quizzes" });
    User.hasMany(models.QuizSession, {
      foreignKey: "userId",
      as: "quizSessions",
    });
    User.hasMany(models.RoadmapProgress, {
      foreignKey: "userId",
      as: "roadmapProgress",
    });
    User.hasMany(models.Payment, { foreignKey: "userId", as: "payments" });
  };

  return User;
};
