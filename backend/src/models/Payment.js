import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
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
      razorpayOrderId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      razorpayPaymentId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      razorpaySignature: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      plan: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER, // in paise
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(5),
        defaultValue: "INR",
      },
      status: {
        type: DataTypes.ENUM("created", "paid", "failed", "refunded"),
        defaultValue: "created",
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "payments",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["razorpayOrderId"],
        },
      ],
    },
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return Payment;
};
