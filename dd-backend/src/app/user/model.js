const { DataTypes } = require("sequelize");
const { sequelize } = require("../..");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      userId: {
        field: "user_id",
        type: DataTypes.INTEGER,
        allowNull: false,
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
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return User;
};
