const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    "recipes",
    {
      recipeName: {
        field: "recipe_name",
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Validation error: Name must be unique",
        },
        validate: {
          len: {
            args: [5, 20],
            msg: "Name must between 5 - 20 characters",
          },
        },
      },
      cookingSteps: {
        field: "cooking_steps",
        type: DataTypes.STRING,
      },
      cookingIngredients: {
        field: "cooking_ingredients",
        type: DataTypes.STRING,
      },

      introduce: {
        field: "introduce",
        type: DataTypes.STRING,
      },
      recipeImage: {
        field: "recipe_image",
        type: DataTypes.STRING,
        allowNull: false,
        // isUrl: true
      },
      categoryId: {
        field: "category_id",
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
