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
        "categoryTh",
        "categoryEn",
        "typeTh",
        "typeEn",
        "video",
        "vegetarian",
        "nutAllergy",
        "rating",
        "timeBased",
        "difficulty",
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
    let userId = null;

    // ตรวจสอบว่ามีโทเค็นหรือไม่
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      // ตรวจสอบ Token
      const decodedToken = jwt.verify(token, "mysecretpassword");
      console.log(decodedToken);

      userId = decodedToken.userId;

      const user = await User.findOne({
        where: { id: userId },
      });
      if (!user) {
        return res.status(404).send({ message: "User Not Found !" });
      }
    }

    let id = req.params.id;
    const existingRecipe = await Recipe.findOne({
      where: { id: id },
    });
    if (!existingRecipe) {
      return res.status(404).send({ message: "Error: Not Found" });
    }
    const recipe = await Recipe.findOne({ where: { id: id } });

    if (userId) {
      const existingHistory = await History.findOne({
        where: { userId, recipeId: id },
      });
      if (existingHistory) {
        await History.destroy({ where: { userId: userId, recipeId: id } });
      }

      await History.create({ userId: userId, recipeId: id });
    }

    // สร้างHistoryใหม่
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
      ingredients1: req.body.ingredients1,
      ingredients2: req.body.ingredients2,
      ingredients3: req.body.ingredients3,
      ingredients4: req.body.ingredients4,
      ingredients5: req.body.ingredients5,
      ingredients6: req.body.ingredients6,
      ingredients7: req.body.ingredients7,
      ingredients8: req.body.ingredients8,
      ingredients9: req.body.ingredients9,
      ingredients10: req.body.ingredients10,
      ingredients11: req.body.ingredients11,
      ingredients12: req.body.ingredients12,
      measure1: req.body.measure1,
      measure2: req.body.measure2,
      measure3: req.body.measure3,
      measure4: req.body.measure4,
      measure5: req.body.measure5,
      measure6: req.body.measure6,
      measure7: req.body.measure7,
      measure8: req.body.measure8,
      measure9: req.body.measure9,
      measure10: req.body.measure10,
      measure11: req.body.measure11,
      measure12: req.body.measure12,
      introduce: req.body.introduce,
      recipeImage: req.file.path,
      categoryTh: req.body.categoryTh,
      categoryEn: req.body.categoryEn,
      typeTh: req.body.typeTh,
      typeEn: req.body.typeEn,
      video: req.body.video,
      vegetarian: req.body.vegetarian,
      nutAllergy: req.body.nutAllergy,
      difficulty: req.body.difficulty,
      timeBased: req.body.timeBased,
      userId: id,
    };

    if (req.body.vegetarian !== "0" && req.body.vegetarian !== "1") {
      return res
        .status(400)
        .send({ message: "Invalid value for vegetarian. Must be 0 or 1." });
    }

    if (req.body.nutAllergy !== "0" && req.body.nutAllergy !== "1") {
      return res
        .status(400)
        .send({ message: "Invalid value for nutAllergy. Must be 0 or 1." });
    }

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

    const existingUser = await User.findOne({
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
          { recipeName: { [Op.like]: `%${query}%` } }, // ค้นหาชื่อเมนู
          { categoryTh: { [Op.like]: `%${query}%` } }, // ค้นหาชื่อเมนู
          { categoryEn: { [Op.like]: `%${query}%` } }, // ค้นหาชื่อเมนู
          { typeTh: { [Op.like]: `%${query}%` } }, // ค้นหา tag
          { typeEn: { [Op.like]: `%${query}%` } }, // ค้นหา tag
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
