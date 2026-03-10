import { DataTypes } from "sequelize";
export default (sequelize) => {
  const RoadmapProgress = sequelize.define(
    "RoadmapProgress",
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
      roadmap: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      stage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("locked", "current", "completed"),
        defaultValue: "locked",
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      xpEarned: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "roadmap_progress",
      timestamps: true,
    },
  );

  RoadmapProgress.associate = (models) => {
    RoadmapProgress.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return RoadmapProgress;
};
