const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "cart",
    {
      cartId: {
        field: "cart_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ingredientImage: {
        field: "ingredient_image",
        type: DataTypes.STRING,
      },
      ingredientPricePerUnit: {
        field: "ingredient_price_per_unit",
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      ingredientQuantity: {
        field: "ingredient_quantity",
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {}
  );

  return Cart;
};
