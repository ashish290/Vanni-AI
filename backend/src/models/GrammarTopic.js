import { DataTypes } from "sequelize";
export default (sequelize) => {
  const GrammarTopic = sequelize.define(
    "GrammarTopic",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      tableName: "grammar_topics",
      timestamps: true,
    },
  );

  GrammarTopic.associate = (models) => {
    GrammarTopic.hasMany(models.Mistake, {
      foreignKey: "grammarTopicId",
      as: "mistakes",
    });
    GrammarTopic.belongsToMany(models.User, {
      through: models.UserWeakArea,
      as: "users",
      foreignKey: "grammarTopicId",
    });
  };

  return GrammarTopic;
};
