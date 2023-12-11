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
      ingredientId: {
        field: "ingredient_id",
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        field: "ingredient_quantity",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        field: "unit_price",
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      totalPrice: {
        field: "total_price",
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      orderDate: {
        field: "order_date",
        type: DataTypes.DATE,
        defaultValue: literal("CURRENT_TIMESTAMP"),
      },
      shippingAddress: {
        field: "shipping_address",
        type: DataTypes.STRING,
      },
      paymentMethod: {
        field: "payment_method",
        type: DataTypes.STRING,
      },
      shippingMethod: {
        field: "shipping_method",
        type: DataTypes.STRING,
      },
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Order;
};
