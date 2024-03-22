const { DataTypes, literal } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define(
    "history",
    {
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      searchTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return History;
};
