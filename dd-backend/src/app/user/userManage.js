const { STATUS_CODES } = require("http");
const db = require("../..");
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");

const getUserDetail = async (req, res) => {
  try {
    // ดึง Token จาก header
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let id = decodedToken.userId;
    const existingUser = await User.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      return res.status(404).send({ message: "Error: Not Found" });
    }
    const user = await User.findOne({
      where: { id: id },
      attributes: ["userName", "userEmail", "userImage"],
    });
    res.status(200).send(user);
    console.log(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const editUserName = async (req, res) => {
  try {
    // ดึง Token จาก header
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let id = decodedToken.userId;
    const existingUser = await User.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      return res.status(404).send({ message: "Error: Not Found" });
    }
    const user = await User.update(req.body.userName, {
      where: { id: id },
    });
    res.status(201).send(user);
    console.log("dd", user);
  } catch (err) {
    res.status(500).send({
      message: err.message || " Error occurred while updating",
    });
  }
};

const editUserEmail = async (req, res) => {
  try {
    // ดึง Token จาก header
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let id = decodedToken.userId;
    const existingUser = await User.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      return res.status(404).send({ message: "Error: Not Found" });
    }
    const user = await User.update(req.body.userEmail, {
      where: { id: id },
    });
    res.status(201).send(user);
    console.log("dd", user);
  } catch (err) {
    res.status(500).send({
      message: err.message || " Error occurred while updating",
    });
  }
};

module.exports = {
  getUserDetail,
  editUserName,
  editUserEmail,
};
