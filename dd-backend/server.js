const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const db = require("./models");

(async () => {
  await db.sequelize.sync();
})();

app.get("/", (req, res) => {
  res.json({ message: "Hello from api!" });
});

app.listen(port, () => console.log(`app listening on port ${port}`));
