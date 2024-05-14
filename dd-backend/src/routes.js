const recipeController = require("./app/recipe/controller");
const categoryController = require("./app/category/controller");
const orderController = require("./app/order/controller");
const userController = require("./app/user/controller");
const userManager = require("./app/user/userManage");
const historyController = require("./app/history/controller");
const favoriteController = require("./app/favorite/controller");
const ingredientController = require("./app/ingredient/controller");
const cartController = require("./app/cart/controller");
const router = require("express").Router();

// Middleware to validate ID parameter
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    // Check if id is a positive integer
    return res.status(400).send({ message: "Invalid ID" });
  }
  next(); // Continue to the next middleware or route handler
};

//Recipe
router.get("/recipe", recipeController.getAllRecipe);

//search
router.get("/recipe/searchByName", recipeController.searchRecipeByName);
router.get("/recipe/search", recipeController.searchRecipes);

//CRUD Recipe
router.get("/recipe/:id", validateId, recipeController.getRecipeById);
router.post(
  "/recipe",
  userController.checkUserRole("Admin"),
  recipeController.upload,
  recipeController.addRecipe
);
router.put(
  "/recipe/:id",
  userController.checkUserRole("Admin"),
  recipeController.updateRecipe
);
router.delete(
  "/recipe/:id",
  userController.checkUserRole("Admin"),
  recipeController.removeRecipe
);
router.get(
  "/recipe/category/:id",
  userController.checkUserRole("Admin"),
  recipeController.getRecipeByCategory
);

//Ingredients
router.get("/ingredients", ingredientController.getAllIngredients);

//Cart
router.get("/cart", cartController.getCartItems);
router.post("/cart", cartController.addToCart);
router.delete("/cart/:id", cartController.removeFromCart);

//Order
router.get("/order", orderController.getOwnOrder);
router.post("/order", orderController.createOrder);

//Categories
router.get("/categories", categoryController.getAllCategories);

//User
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

//User Manage
router.get("/user", userManager.getUserDetail);
router.put("/user", userManager.editUserName);
router.put("/user", userManager.editUserEmail);

//Favorite
router.post("/favorite", favoriteController.addFavorite);
router.get("/favorite", favoriteController.getFavoritesById);
router.delete("/favorite", favoriteController.removeFavorite);

//History
router.post("/history", historyController.searchRecord);
router.get("/history", historyController.searchHistory);

module.exports = router;
