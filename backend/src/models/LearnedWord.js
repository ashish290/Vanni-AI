import { DataTypes } from "sequelize";
export default (sequelize) => {
  const LearnedWord = sequelize.define(
    "LearnedWord",
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
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      meaning: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      category: {
        type: DataTypes.STRING,
        defaultValue: "general",
      },
      difficulty: {
        type: DataTypes.STRING,
        defaultValue: "unknown",
      },
    },
    {
      tableName: "learned_words",
      timestamps: true,
    },
  );

  LearnedWord.associate = (models) => {
    LearnedWord.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return LearnedWord;
};
