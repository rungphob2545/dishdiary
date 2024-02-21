const { STATUS_CODES } = require("http");
const db = require("../..");
const Recipe = db.recipes;
const multer = require("multer");
const path = require("path");
const { json } = require("sequelize");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./dist/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: '1000000'}
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    const err = new Error();
    err.message = "Please select an image file (jpg, jpeg, or png)";
    err.status = 400;
    return cb(err);
  },
}).single("recipeImage");
//.array('3','images') if multiple upload

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

  const existingRecipe = await Recipe.findOne({
    where: { recipeName: req.body.recipeName },
  });
  if (existingRecipe) {
    return res.status(400).send({ message: "Recipe name must be unique" });
  }

  const minLength = 5;
  if (req.body.recipeName.length < minLength) {
    return res.status(400).send({
      message: `Recipe name must be at least ${minLength} characters long`,
    });
  }

  let result = {
    recipeName: req.body.recipeName,
    cookingSteps: req.body.cookingSteps,
    cookingIngredients: req.body.cookingIngredients,
    introduce: req.body.introduce,
    recipeImage: req.file.path,
    categoryId: req.body.categoryId,
  };

  try {
    const recipe = await Recipe.create(result);
    res.status(201).send(recipe);
    console.log(recipe);
  } catch (err) {
    console.log(result);
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

  try {
    const recipe = await Recipe.update(filteredUpdate, { where: { id: id } });
    res.status(200).send("update success");
    console.log(recipe);
  } catch (err) {
    res.status(500).send({
      message: err.message || " Error occurred while updating",
    });
  }
};

//delete recipe
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
  upload,
};
