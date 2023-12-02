const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "http://localhost:8080",
};

const port = process.env.PORT || 8080;
const db = require(".");

//middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await db.sequelize
    .sync({ force: true })
    .then((data) => {
      console.log("Table and model has been synced");
    })
    .catch((err) => {
      console.log("Error syncing the table and model");
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
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({ message: "Hello from api!" });
});

app.listen(port, () => console.log(`app listening on port ${port}`));
