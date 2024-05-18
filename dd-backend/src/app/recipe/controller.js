const { STATUS_CODES } = require("http");
const db = require("../..");
const Recipe = db.recipes;
const multer = require("multer");
const path = require("path");
const { Op, where } = require("sequelize");
const History = db.histories;
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
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get one recipe by id
const getRecipeById = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not Found !" });
    }

    let id = req.params.id;
    const existingRecipe = await Recipe.findOne({
      where: { id: id },
    });
    if (!existingRecipe) {
      return res.status(404).send({ message: "Error: Not Found" });
    }
    const recipe = await Recipe.findOne({ where: { id: id } });

    const existingHistory = await History.findOne({
      where: { userId, recipeId: id },
    });
    if (existingHistory) {
      // ถ้า recipeId มีการใช้งานแล้ว ให้ลบประวัติเก่าออกและสร้างประวัติใหม่
      await History.destroy({ where: { id: existingHistory.id } });
    }

    // สร้างHistoryใหม่
    await History.create({ userId: userId, recipeId: id });
    res.status(200).send(recipe);
    console.log(recipe);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//add recipe
const addRecipe = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "ไม่มีข้อมูลถูกส่่งมา",
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
      type: req.body.type,
      video: req.body.video,
      vegetarian: req.body.vegetarian,
      nutAllergy: req.body.nutAllergy,
      difficulty: req.body.difficulty,
      timeBased: req.body.timeBased,
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
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;

    const existingUser = await Recipe.findOne({
      where: { userId: userId },
    });
    if (!existingUser) {
      return res.status(403).send({ message: "Error: Forbidden" });
    }
    const existingRecipe = await Recipe.findOne({
      where: { id: id },
    });
    if (!existingRecipe) {
      return res.status(404).send({ message: "Error: Not Found" });
    }

    const updateFields = {
      recipeName: req.body.recipeName,
      cookingSteps: req.body.cookingSteps,
      cookingIngredients: req.body.cookingIngredients,
      introduce: req.body.introduce,
      difficulty: req.body.difficulty,
      timeBased: req.body.timeBased,
    };

    const recipe = await Recipe.update(updateFields, { where: { id: id } });
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
  try {
    let recipeId = req.params.id;
    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;

    const existingUser = await Recipe.findOne({
      where: { userId: userId },
    });
    if (!existingUser) {
      return res.status(403).send({ message: "Error: Forbidden" });
    }
    const existingRecipe = await Recipe.findOne({
      where: { id: recipeId },
    });
    if (!existingRecipe) {
      return res.status(404).send({ message: "Error: Not Found" });
    }

    await Recipe.destroy({ where: { id: recipeId } });
    res.status(200).send("Recipe has been deleted");
  } catch (err) {
    res.status(500).send({
      message: err.message || " Error occurred while updating",
    });
  }
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
};
