import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserWeakArea = sequelize.define(
    "UserWeakArea",
    {},
    {
      tableName: "user_weak_areas",
      timestamps: true,
    },
  );

  UserWeakArea.associate = (models) => {
    // defined via belongsToMany in User and GrammarTopic, but we can leave this empty
  };

  return UserWeakArea;
};
