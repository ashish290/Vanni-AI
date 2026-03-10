import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Mistake = sequelize.define(
    "Mistake",
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
      type: {
        type: DataTypes.STRING,
        allowNull: false, // tense, grammar, vocabulary, spelling
      },
      original: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      correction: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      explanation: {
        type: DataTypes.TEXT,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      mistakeType: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      lastSeen: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      grammarTopicId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "mistakes",
      timestamps: true,
    },
  );

  Mistake.associate = (models) => {
    Mistake.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Mistake.belongsTo(models.GrammarTopic, {
      foreignKey: "grammarTopicId",
      as: "grammarTopic",
    });
  };

  return Mistake;
};
