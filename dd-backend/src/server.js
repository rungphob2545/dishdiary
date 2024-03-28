const express = require("express");
const cors = require("cors");
const ip = require("ip");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const swaggerUi = require("swagger-ui-express");

const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("src/swagger.yaml", "utf8");
const swaggerDoc = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const corsOptions = {
  origin: "http://10.4.85.10",
};

//port
const port = process.env.PORT || 8080;
const db = require(".");

const Category = db.categories;

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await db.sequelize
    .sync({ force: true })
    .then((data) => {
      const categories = Category.bulkCreate([
        { categoryName: "Egg" },
        { categoryName: "Beef" },
        { categoryName: "Chicken" },
        { categoryName: "Pork" },
      ]);
      console.log("Table and model has been synced");
    })
    .catch((err) => {
      console.log(err, "Error syncing the table and model");
    });
})();

// (async () => {
//   await db.sequelize
//     .sync()
//     .then((data) => {
//       console.log("Table and model created");
//     })
//     .catch((err) => {
//       console.log("Error created");
//     });
// })();

//routes
const router = require("./routes");
const multer = require("multer");
app.use("/api", router);

//static img folder
app.use("/dist/images", express.static("dist/images"));

//server
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from api!" });
});


app.listen(port, () =>
  console.log(`[server] listening on: ${ip.address()}:${port}`)
);

