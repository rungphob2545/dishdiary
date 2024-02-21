const db = require("../..");
const Category = db.categories;

//get all categories
const getAllCategories = async (req, res) => {
  const category = await Category.findAll({});
  res.status(200).send(category);
  console.log(category);
};

module.exports = {
  getAllCategories,
};
