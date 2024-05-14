const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define(
    "ingredients",
    {
      ingredientId: {
        field: "ingredient_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ingredientName: {
        field: "ingredient_name",
        type: DataTypes.STRING,
        allowNull: false,
      },
      ingredientImage: {
        field: "ingredient_image",
        type: DataTypes.STRING,
      },
      ingredientPricePerUnit: {
        field: "ingredient_price_per_unit",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      ingredientQuantity: {
        field: "ingredient_quantity",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Ingredient;
};
