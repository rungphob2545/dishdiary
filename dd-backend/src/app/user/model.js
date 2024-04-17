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
        validate: {
          isEmail: {
            arg: true,
            msg: "Invalid email address format",
          },
        },
        allowNull: false,
        unique: true,
      },
      password: {
        field: "password",
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      role: {
        field: "role",
        type: DataTypes.ENUM("Guest", "User", "Admin"),
        defaultValue: "User",
        allowNull: false,
      },
      userImage: {
        field: "user_image",
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
