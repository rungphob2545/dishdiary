const { STATUS_CODES } = require("http");
const db = require("../..");
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");

const userRegister = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "can't add",
    });
    return;
  }
  const existingName = await User.findOne({
    where: { userEmail: req.body.userName },
  });
  if (existingName) {
    return res.status(400).send({ message: "Name must be unique" });
  }

  const existingEmail = await User.findOne({
    where: { userEmail: req.body.userEmail },
  });
  if (existingEmail) {
    return res.status(400).send({ message: "Email must be unique" });
  }

  // const minLength = 5;
  // if (req.body.email.length < minLength) {
  //   return res.status(400).send({
  //     message: `Recipe name must be at least ${minLength} characters long`,
  //   });
  // }

  const { userName, userEmail, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let result = {
    userName,
    userEmail,
    password: hashedPassword,
    role,
  };

  try {
    const user = await User.create(result);
    res.status(201).send({ message: " User registered successfully ", user });
    console.log(user);
  } catch (err) {
    console.log(result);
    res.status(500).send({
      message: err.message || " Error occurred while creating",
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const user = await User.findOne({ where: { userEmail } });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("user log", user);
    if (!isPasswordMatch) {
      return res.status(400).json({ meesage: "Password not match" });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        userEmail: user.userEmail,
        userName: user.userName,
        role: user.role,
      },
      "mysecretpassword",
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ meesage: "Access Denied" });
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], "mysecretpassword");
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "invalid token" });
  }
};

const checkUserRole = (roleName) => {
  return (req, res, next) => {
    try {
      // ดึง Token จาก header
      const token = req.headers.authorization.split(" ")[1];

      // ตรวจสอบ Token
      const decodedToken = jwt.verify(token, "mysecretpassword");
      console.log(decodedToken);
      // ตรวจสอบว่า Token ถูกสร้างโดยผู้ใช้ที่มีบทบาทที่ต้องการหรือไม่
      if (decodedToken.role === roleName) {
        return next(); // ผู้ใช้มีสิทธิ์ในการเข้าถึง
      } else {
        return res.status(403).json({ error: "Unauthorized" });
      }
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = {
  userRegister,
  userLogin,
  verifyToken,
  checkUserRole,
};
