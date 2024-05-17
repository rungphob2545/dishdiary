const db = require("../..");
const Favorite = db.favorites;
const User = db.users;
const Recipe = db.recipes;
const jwt = require("jsonwebtoken");

const addFavorite = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;

    const existingUser = await User.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).send({ message: "Error: Not Found" });
    }

    const { recipeId } = req.body;

    // ตรวจสอบว่า recipeId นั้นมีอยู่ใน favorites แล้วหรือไม่
    const existingFavorite = await Favorite.findOne({
      where: { userId, recipeId },
    });

    if (existingFavorite) {
      return res.status(200).json({ message: "Recipe already in favorites" });
    }

    const favorite = await Favorite.create({
      userId,
      recipeId,
    });

    res.status(201).json({ message: "Added to favorites", favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFavorite = async (req, res) => {
  try {
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

    const favorite = await Favorite.destroy({
      where: {
        userId: id,
        recipeId: req.body.recipeId,
      },
    });
    res.status(200).json({ message: "Remove favorites", favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFavoritesById = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let id = decodedToken.userId;
    const favorites = await Favorite.findAll({
      where: { userId: id },
    });

    // ดึงข้อมูลรายการอาหารจาก recipeId ที่ได้จาก favorites
    const recipes = [];
    for (const favorite of favorites) {
      const recipe = await Recipe.findByPk(favorite.recipeId);
      if (recipe) {
        recipes.push(recipe);
      }
    }

    res.status(200).json({ favorites, recipes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFavoritesByParamsId = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;
    let id = req.params.id;
    const favorite = await Favorite.findOne({
      where: { userId: userId, recipeId: id },
    });

    res.status(200).json(favorite);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addFavorite,
  getFavoritesById,
  removeFavorite,
  getFavoritesByParamsId,
};
