import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Conversation = sequelize.define(
    "Conversation",
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
      messageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "conversations",
      timestamps: true,
    },
  );

  Conversation.associate = (models) => {
    Conversation.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Conversation.hasMany(models.Message, {
      foreignKey: "conversationId",
      as: "messages",
    });
    Conversation.hasMany(models.Quiz, {
      foreignKey: "conversationId",
      as: "quizzes",
    });
  };

  return Conversation;
};
