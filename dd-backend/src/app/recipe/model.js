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
        type: DataTypes.TEXT,
      },
      cookingIngredients: {
        field: "cooking_ingredients",
        type: DataTypes.TEXT,
      },

      introduce: {
        field: "introduce",
        type: DataTypes.TEXT,
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
      type: {
        type: DataTypes.ENUM("Soup", "Pizza", "Noodles", "Rice"),
        defaultValue: "Rice",
      },
      video: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      vegetarian: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
      },
      nutAllergy: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Recipe;
};
