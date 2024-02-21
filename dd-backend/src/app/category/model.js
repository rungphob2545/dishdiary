const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      categoryName: {
        field: "category_name",
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );

  return Category;
};
