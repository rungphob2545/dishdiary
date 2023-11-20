const dbConfig = require("../config/db-config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
  }
);

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.User = require("./ingredient")(sequelize, Sequelize.DataTypes);

module.exports = db;
