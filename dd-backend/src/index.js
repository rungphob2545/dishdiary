const dbConfig = require("./db/db-config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
<<<<<<< HEAD
    port: dbConfig.PORT_DB,		  
=======
    port: dbConfig.PORT_DB,
>>>>>>> 4adc2b6f2abbe30c123744d3f88cda065f8d7673
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
db.orders = require("./app/order/model")(sequelize, Sequelize.DataTypes);
db.users = require("./app/user/model")(sequelize, Sequelize.DataTypes);

module.exports = db;
