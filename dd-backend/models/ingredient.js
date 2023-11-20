const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define(
    "ingredients",
    {
      ingredientName: {
        field: "ingredient_name",
        type: DataTypes.STRING,
        allowNull: false,
      },
      ingredientImage: {
        field: "ingredient_image",
        type: DataTypes.STRING,
      },
      ingredientPrice: {
        field: "ingredient_price",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );

  return Ingredient;
};
