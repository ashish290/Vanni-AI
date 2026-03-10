import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Quiz = sequelize.define(
    "Quiz",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      quizType: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      options: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      correctAnswer: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hint: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userAnswer: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      xpEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      answeredAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "quizzes",
      timestamps: true,
    },
  );

  Quiz.associate = (models) => {
    Quiz.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Quiz.belongsTo(models.Conversation, {
      foreignKey: "conversationId",
      as: "conversation",
    });
  };

  return Quiz;
};
