const { DataTypes } = require("sequelize");
const { sequelize, Sequelize } = require("../..");

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
        type: DataTypes.STRING(500),
      },
      cookingIngredients: {
        field: "cooking_ingredients",
        type: DataTypes.STRING(500),
      },

      introduce: {
        field: "introduce",
        type: DataTypes.STRING(500),
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
        defaultValue: 0,
      },
      type: {
        type: DataTypes.ENUM("Soup", "Pizza", "Noodles", "Rice"),
        defaultValue: "Rice",
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Recipe;
};
