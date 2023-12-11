const db = require("../..");
const Recipe = db.recipes;

//get all recipe
const getAllRecipe = async (req, res) => {
  const recipe = await Recipe.findAll({
    attributes: ["id", "recipeName", "recipeImage"],
  });
  res.status(200).send(recipe);
  console.log(recipe);
};

//get one recipe by id
const getRecipeById = async (req, res) => {
  let id = req.params.id;
  const recipe = await Recipe.findOne({ where: { id: id } });
  res.status(200).send(recipe);
  console.log(recipe);
};

//add new recipe(s)
const addRecipe = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "can't add",
    });
    return;
  }
  let result = {
    recipeName: req.body.recipeName,
    cookingSteps: req.body.cookingSteps,
    cookingIngredients: req.body.cookingIngredients,
    introduce: req.body.introduce,
    recipeImage: req.body.recipeImage,
    categoryId: req.body.categoryId,
  };

  try {
    const recipe = await Recipe.create(result);
    res.status(201).send(recipe);
    console.log(recipe);
  } catch (err) {
    res.status(500).send({
      message: err.message || " Error occurred while creating",
    });
  }
};

//update recipe(s)
const updateRecipe = async (req, res) => {
  let id = req.params.id;
  let updateField = req.body;

  let allowedFields = [
    "cookingSteps",
    "cookingIngredients",
    "introduce",
    "recipeImage",
  ];

  let filteredUpdate = {};

  allowedFields.forEach((field) => {
    if (updateField[field]) {
      filteredUpdate[field] = updateField[field];
    }
  });

  const recipe = await Recipe.update(req.body, { where: { id: id } });
  res.status(200).send("Recipe have been edit");
};

const removeRecipe = async (req, res) => {
  let id = req.params.id;
  await Recipe.destroy({ where: { id: id } });
  res.status(200).send("Recipe has been deleted");
};

module.exports = {
  getAllRecipe,
  getRecipeById,
  addRecipe,
  removeRecipe,
  updateRecipe,
};
