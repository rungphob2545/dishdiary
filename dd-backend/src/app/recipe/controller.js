const { STATUS_CODES } = require("http");
const db = require("../..");
const Recipe = db.recipes;
const multer = require("multer");
const path = require("path");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const User = db.users;

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
    attributes: [
      "id",
      "recipeName",
      "recipeImage",
      "categoryId",
      "video",
      "vegetarian",
      "nutAllergy",
      "rating",
      "timeBased",
      "difficulty",
      "type",
    ],
  });
  res.status(200).send(recipe);
  console.log(recipe);
};

//get one recipe by id
const getRecipeById = async (req, res) => {
  let id = req.params.id;
  const existingRecipe = await Recipe.findOne({
    where: { id: id },
  });
  if (!existingRecipe) {
    return res.status(404).send({ message: "Error: Not Found" });
  }
  const recipe = await Recipe.findOne({ where: { id: id } });
  res.status(200).send(recipe);
  console.log(recipe);
};

//add recipe
const addRecipe = async (req, res) => {
  try {
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
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let id = decodedToken.userId;

    let result = {
      recipeName: req.body.recipeName,
      cookingSteps: req.body.cookingSteps,
      cookingIngredients: req.body.cookingIngredients,
      introduce: req.body.introduce,
      recipeImage: req.file.path,
      categoryId: req.body.categoryId,
      userId: id,
    };

    const recipe = await Recipe.create(result);
    res.status(201).send(recipe);
    console.log(recipe);
  } catch (err) {
    console.log("err", err);
    res.status(500).send({
      message: err.message || " Error occurred while creating",
    });
  }
};

//update recipe
const updateRecipe = async (req, res) => {
  try {
    let id = req.params.id;
    const existingRecipe = await Recipe.findOne({
      where: { id: id },
    });
    if (!existingRecipe) {
      return res.status(404).send({ message: "Error: Not Found" });
    }
    const recipe = await Recipe.update(req.body, { where: { id: id } });
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
  const existingRecipe = await Recipe.findOne({
    where: { id: id },
  });
  if (!existingRecipe) {
    return res.status(404).send({ message: "Error: Not Found" });
  }
  await Recipe.destroy({ where: { id: id } });
  res.status(200).send("Recipe has been deleted");
};

//get recipe by category
const getRecipeByCategory = async (req, res) => {
  let id = req.params.id;
  try {
    const existingCategory = await Recipe.findOne({
      where: { categoryId: id },
    });
    if (!existingCategory) {
      return res.status(404).send({ message: "Error: Not Found" });
    }
    const recipe = await Recipe.findAll({ where: { categoryId: id } });
    res.status(200).send(recipe);
  } catch (err) {
    res.status(500).send({
      message: err.message || " Error occurred while updating",
    });
  }
};

const searchRecipeByName = async (req, res) => {
  const { query } = req.query;
  try {
    console.log(query);
    const recipes = await Recipe.findAll({
      where: {
        [Op.or]: [
          { recipeName: { [Op.like]: `${query}%` } }, // ค้นหาชื่อเมนู
          { type: { [Op.like]: `${query}%` } }, // ค้นหา tag
        ],
      },
    });
    res.status(200).send(recipes);
  } catch (err) {
    console.log("error:", err);
    res.status(500).send({
      message: err.message || " Error occurred while updating",
    });
  }
};

const searchRecipes = async (req, res) => {
  const { type, difficulty, ratingMin, ratingMax } = req.query;
  try {
    let whereClause = {};
    if (type) {
      whereClause.type = type;
    }
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }
    if (ratingMin && ratingMax) {
      whereClause.rating = {
        [Op.between]: [parseFloat(ratingMin), parseFloat(ratingMax)],
      };
    }
    const recipes = await Recipe.findAll({ where: whereClause });
    res.status(200).send(recipes);
  } catch (err) {
    console.log("error:", err);
    res.status(500).send({
      message: err.message || " Error occurred while updating",
    });
  }
};

//Get recipe by userId
const getRecipeByUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let id = decodedToken.userId;
    const myRecipe = await Recipe.findAll({
      where: { userId: id },
    });

    res.status(200).json(myRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Post recipe by userId
const createRecipeByUser = async (req, res) => {
  try {
    const user = User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

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
      userId: user.id,
    };
    const recipe = await Recipe.create(result);
    res.status(201).send(recipe);
    console.log(recipe);
  } catch (err) {
    console.log("err", err);
    res.status(500).send({
      message: err.message || " Error occurred while creating",
    });
  }
};
module.exports = {
  getAllRecipe,
  getRecipeById,
  addRecipe,
  removeRecipe,
  updateRecipe,
  upload,
  getRecipeByCategory,
  searchRecipeByName,
  searchRecipes,
  getRecipeByUser,
  createRecipeByUser,
};
