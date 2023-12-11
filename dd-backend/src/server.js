const express = require("express");
const cors = require("cors");
const ip = require("ip");
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
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
<<<<<<< HEAD
      console.log(err,"Error syncing the table and model");
=======
      console.log(err, "Error syncing the table and model");
>>>>>>> 4adc2b6f2abbe30c123744d3f88cda065f8d7673
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

<<<<<<< HEAD
app.listen(port, () => console.log(`app listening on: ${ip.address()}:${port}`));
=======
app.listen(port, () =>
  console.log(`app listening on: ${ip.address()}:${port}`)
);
>>>>>>> 4adc2b6f2abbe30c123744d3f88cda065f8d7673
