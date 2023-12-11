const db = require("../..");
const Category = db.categories;

//get all recipe
const getAllCategories = async (req, res) => {
  const category = await Category.findAll({});
  res.status(200).send(recipe);
  console.log(recipe);
};

module.exports = {
  getAllCategories,
};
