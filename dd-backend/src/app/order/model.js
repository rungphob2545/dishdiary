const { DataTypes, literal } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      orderId: {
        field: "order_id",
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
      },
      quantity: {
        field: "ingredient_quantity",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderDate: {
        field: "order_date",
        type: DataTypes.DATE,
        defaultValue: literal("CURRENT_TIMESTAMP"),
      },
      status: {
        field: "status",
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingAddress: {
        field: "shipping_address",
        type: DataTypes.STRING,
      },
      paymentMethod: {
        field: "payment_method",
        type: DataTypes.STRING,
      },
      totalPrice: {
        field: "total_price",
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Order;
};
