const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      categoryId: {
        field: "cart_id",
        type: DataTypes.INTEGER,
        allowNull: false,
      },
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
