const { DataTypes, literal } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "order",
    {
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
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

  Order.associate = (models) => {
    Order.hasMany(models.orderItem, {
      foreignKey: "orderId",
      as: "orderItems",
    });
  };

  return Order;
};
