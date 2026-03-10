import { DataTypes } from "sequelize";
export default (sequelize) => {
  const QuizSession = sequelize.define(
    "QuizSession",
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
      questionsAsked: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      correctCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      xpEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isPerfect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "quiz_sessions",
      timestamps: true,
    },
  );

  QuizSession.associate = (models) => {
    QuizSession.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return QuizSession;
};
