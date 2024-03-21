const db = require("../..");
const User = db.users;

//get all user
const getAllUsers = async (req, res) => {
  const user = await User.findAll({});
  res.status(200).send(user);
  console.log(user);
};

//create new user
const createUser = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Can't create this user",
    });
    return;
  }
  let result = {
    userId: req.body.userId,
    userEmail: req.body.userEmail,
  };
  try {
    const user = await User.create(result);
    res.status(201).send(user);
    console.log(user);
  } catch (err) {
    console.log(result);
    res.status(500).send({
      message: err.message || " Error occurred while creating",
    });
  }
};

//delete user
const deleteUser = async (req, res) => {
  let id = req.params.id;
  const existingUser = await User.findOne({
    where: { id: id },
  });
  if (!existingUser) {
    return res.status(404).send({ message: "Error: User Not Found" });
  }
  await User.destroy({ where: { id: id } });
  res.status(200).send("User has been deleted");
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
};
