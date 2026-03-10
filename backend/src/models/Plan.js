import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Plan = sequelize.define(
    "Plan",
    {
      name: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
      },
      dailyLimit: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = unlimited
      },
      voiceEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      historyDays: {
        type: DataTypes.INTEGER,
        allowNull: true, // NULL = forever
      },
      priceMonthly: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "plans",
      timestamps: false,
    },
  );

  Plan.associate = (models) => {
    // No associations
  };

  return Plan;
};
