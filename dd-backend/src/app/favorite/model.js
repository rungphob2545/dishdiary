const { DataTypes } = require("sequelize");
const sequelize = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define("Favorite", {
    userId: {
      field: "user_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipeId: {
      field: "recipe_id",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Favorite;
};
