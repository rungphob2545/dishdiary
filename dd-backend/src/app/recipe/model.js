const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    "recipes",
    {
      recipeName: {
        field: "recipe_name",
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: {
          msg: "Validation error: Name must be unique",
        },
        validate: {
          len: {
            args: [5, 30],
            msg: "Name must between 5 - 30 characters",
          },
        },
      },
      cookingSteps: {
        field: "cooking_steps",
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ingredients1: {
        field: "cooking_ingredients1",
        type: DataTypes.STRING,
      },
      ingredients2: {
        field: "cooking_ingredients2",
        type: DataTypes.STRING,
      },
      ingredients3: {
        field: "cooking_ingredients3",
        type: DataTypes.STRING,
      },
      ingredients4: {
        field: "cooking_ingredients4",
        type: DataTypes.STRING,
      },
      ingredients5: {
        field: "cooking_ingredients5",
        type: DataTypes.STRING,
      },
      ingredients6: {
        field: "cooking_ingredients6",
        type: DataTypes.STRING,
      },
      ingredients7: {
        field: "cooking_ingredients7",
        type: DataTypes.STRING,
      },
      ingredients8: {
        field: "cooking_ingredients8",
        type: DataTypes.STRING,
      },
      ingredients9: {
        field: "cooking_ingredients9",
        type: DataTypes.STRING,
      },
      ingredients10: {
        field: "cooking_ingredients10",
        type: DataTypes.STRING,
      },
      ingredients11: {
        field: "cooking_ingredients11",
        type: DataTypes.STRING,
      },
      ingredients12: {
        field: "cooking_ingredients12",
        type: DataTypes.STRING,
      },
      measure1: {
        field: "cooking_measure1",
        type: DataTypes.STRING,
      },
      measure2: {
        field: "cooking_measure2",
        type: DataTypes.STRING,
      },
      measure3: {
        field: "cooking_measure3",
        type: DataTypes.STRING,
      },
      measure4: {
        field: "cooking_measure4",
        type: DataTypes.STRING,
      },
      measure5: {
        field: "cooking_measure5",
        type: DataTypes.STRING,
      },
      measure6: {
        field: "cooking_measure6",
        type: DataTypes.STRING,
      },
      measure7: {
        field: "cooking_measure7",
        type: DataTypes.STRING,
      },
      measure8: {
        field: "cooking_measure8",
        type: DataTypes.STRING,
      },
      measure9: {
        field: "cooking_measure9",
        type: DataTypes.STRING,
      },
      measure10: {
        field: "cooking_measure10",
        type: DataTypes.STRING,
      },
      measure11: {
        field: "cooking_measure11",
        type: DataTypes.STRING,
      },
      measure12: {
        field: "cooking_measure12",
        type: DataTypes.STRING,
      },

      introduce: {
        field: "introduce",
        type: DataTypes.TEXT,
        allowNull: false,
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
        type: DataTypes.ENUM("Soup", "Pizza", "Noodles", "Rice", "Side dish"),
        defaultValue: "Rice",
        allowNull: false,
      },
      video: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      vegetarian: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
        allowNull: false,
      },
      nutAllergy: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "0",
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM("Easy", "Normal", "Difficult"),
        defaultValue: "Easy",
        allowNull: false,
      },
      timeBased: {
        field: "time_based",
        type: DataTypes.STRING,
        defaultValue: "30m",
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 2.5,
        validate: {
          min: 0,
          max: 5,
        },
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
