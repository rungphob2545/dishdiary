const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      userName: {
        field: "user_name",
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userEmail: {
        field: "user_email",
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        field: "password",
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        field: "role",
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
