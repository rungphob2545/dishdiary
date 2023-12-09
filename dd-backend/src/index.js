const dbConfig = require("./db/db-config");
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
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// db.models = {};
db.ingredients = require("./app/ingredient/model")(
  sequelize,
  Sequelize.DataTypes
);
db.recipes = require("./app/recipe/model")(sequelize, Sequelize.DataTypes);

module.exports = db;
