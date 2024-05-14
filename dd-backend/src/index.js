const dbConfig = require("./db/db-config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT_DB,
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
db.carts = require("./app/cart/model")(sequelize, Sequelize.DataTypes);
db.categories = require("./app/category/model")(sequelize, Sequelize.DataTypes);
db.histories = require("./app/history/model")(sequelize, Sequelize.DataTypes);
db.favorites = require("./app/favorite/model")(sequelize, Sequelize.DataTypes);
db.orderItems = require("./app/orderItem/model")(
  sequelize,
  Sequelize.DataTypes
);

module.exports = db;
