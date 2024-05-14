const db = require("../..");
const History = db.histories;
const User = db.users;
const jwt = require("jsonwebtoken");

const searchRecord = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const record = await History.create({ userId, recipeId });
    res.status(201).send(record);
    console.log("console log", record);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error while recording" });
  }
};

const searchHistory = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not Found !" });
    }
    const history = await History.findAll({ where: { userId } });
    res.status(200).json(history);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error while read history" });
  }
};

module.exports = {
  searchRecord,
  searchHistory,
};
