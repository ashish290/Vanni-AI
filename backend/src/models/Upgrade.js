import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Upgrade = sequelize.define(
    "Upgrade",
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
      fromPlan: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      toPlan: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      upgradedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      paymentRef: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "upgrades",
      timestamps: false,
    },
  );

  Upgrade.associate = (models) => {
    Upgrade.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Upgrade;
};
