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

const editUser = async (req, res) => {
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
    const user = await User.update(req.body, {
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

//get one recipe by id
// const userLogin = async (req, res) => {
//   try {
//     const { userEmail, password } = req.body;

//     if (!userEmail || !password) {
//       res.status(400).send({
//         message: "Input Fill Empty",
//       });
//       return;
//     }
//     const user = await User.findOne({ where: { userEmail } });

//     if (!user) {
//       return res.status(400).json({ message: "่ไม่พบ User ในระบบ" });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(userEmail)) {
//       return res.status(400).send({ message: "Invalid email format" });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     console.log("user log", user);
//     if (!isPasswordMatch) {
//       return res.status(400).send({ message: "Password not match" });
//     }
//     const token = jwt.sign(
//       {
//         userId: user.id,
//         userEmail: user.userEmail,
//         userName: user.userName,
//         role: user.role,
//       },
//       "mysecretpassword",
//       {
//         expiresIn: "1d",
//       }
//     );
//     res.status(201).json({ token });
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const verifyToken = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) {
//     return res.status(401).json({ meesage: "Access Denied" });
//   }
//   try {
//     const decoded = jwt.verify(token.split(" ")[1], "mysecretpassword");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     res.status(401).json({ message: "invalid token" });
//   }
// };

// const checkUserRole = (roleName) => {
//   return (req, res, next) => {
//     try {
//       // ดึง Token จาก header
//       const token = req.headers.authorization.split(" ")[1];

//       // ตรวจสอบ Token
//       const decodedToken = jwt.verify(token, "mysecretpassword");
//       console.log(decodedToken);
//       // ตรวจสอบว่า Token ถูกสร้างโดยผู้ใช้ที่มีบทบาทที่ต้องการหรือไม่
//       if (decodedToken.role === roleName) {
//         return next(); // ผู้ใช้มีสิทธิ์ในการเข้าถึง
//       } else {
//         return res.status(403).json({ error: "Unauthorized" });
//       }
//     } catch (error) {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//   };
// };

module.exports = {
  getUserDetail,
  editUser,
};
