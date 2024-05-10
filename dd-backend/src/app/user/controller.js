const { STATUS_CODES } = require("http");
const db = require("../..");
const User = db.users;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const multer = require("multer");
// const path = require("path");

const userRegister = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  if (!userName || !userEmail || !password || !role) {
    res.status(400).send({
      message: "Input Fill Empty",
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(userEmail)) {
    return res.status(400).send({ message: "Invalid Email format" });
  }

  if (userName.length < 4 || userName.length > 20) {
    return res.status(400).send({ message: "Invalid Name length" });
  }

  if (password.length < 8 || password.length > 16) {
    return res.status(400).send({ message: "Invalid Password length" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let result = {
    userName,
    userEmail,
    password: hashedPassword,
    role,
    userImage: "dist\\images\\avatar_1.png",
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

    if (!userEmail || !password) {
      res.status(400).send({
        message: "Input Fill Empty",
      });
      return;
    }
    const user = await User.findOne({ where: { userEmail } });

    if (!user) {
      return res.status(400).json({ message: "่ไม่พบ User ในระบบ" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userEmail)) {
      return res.status(400).send({ message: "Invalid email format" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("user log", user);
    if (!isPasswordMatch) {
      return res.status(400).send({ message: "Password not match" });
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

const checkUserRole = (...roleName) => {
  return (req, res, next) => {
    try {
      // ดึง Token จาก header
      const token = req.headers.authorization.split(" ")[1];

      // ตรวจสอบ Token
      const decodedToken = jwt.verify(token, "mysecretpassword");
      console.log(decodedToken);
      // ตรวจสอบว่า Token ถูกสร้างโดยผู้ใช้ที่มีบทบาทที่ต้องการหรือไม่
      if (roleName.includes(decodedToken.role)) {
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
