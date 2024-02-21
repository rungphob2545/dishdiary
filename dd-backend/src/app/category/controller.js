const db = require("../..");
const Category = db.categories;
const Recipe = db.recipes;

//get all categories
const getAllCategories = async (req, res) => {
  const category = await Category.findAll({});
  res.status(200).send(category);
  console.log(category);
};

// const getCateogoryById = async (req, res) => {
//   try {
//     const categoryId = req.params.id;
//     const category = await Category.findByPk(categoryId, {
//       include: [{ model: Recipe }], // Include associated recipes
//     });
//     if (!category) {
//       return res.status(404).json({ error: "Category not found" });
//     }
//     res.json(category);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

module.exports = {
  getAllCategories,
};
