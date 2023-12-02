const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

// const Recipe = sequelize.define("recipes", {
//   recipeName: {
//     field: "recipe_name",
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   cookingInstrcution: {
//     field: "cooking_instruction",
//     type: DataTypes.STRING,
//   },
//   recipeImage: {
//     field: "recipe_price",
//     type: DataTypes.INTEGER,
//     allowNull: false,
//   },
// });

// Recipe.sync();

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    "recipes",
    {
      recipeName: {
        field: "recipe_name",
        type: DataTypes.STRING,
        allowNull: false,
      },
      cookingInstruction: {
        field: "cooking_instruction",
        type: DataTypes.STRING,
      },
      recipeImage: {
        field: "recipe_price",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Recipe;
};
