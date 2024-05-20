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
router.get("/recipe/user", recipeController.getRecipeByUser);

//search
router.get("/recipe/searchByName", recipeController.searchRecipeByName);
router.get("/recipe/search", recipeController.searchRecipes);

//History
router.delete("/recipe/history", historyController.removeHistory);
router.get("/recipe/history", historyController.searchHistory);

//CRUD Recipe
router.get("/recipe/:id", validateId, recipeController.getRecipeById);
router.post(
  "/recipe",
  userController.checkUserRole("Admin", "User"),
  recipeController.upload,
  recipeController.addRecipe
);
router.put(
  "/recipe/:id",
  userController.checkUserRole("Admin", "User"),
  recipeController.updateRecipe
);
router.delete(
  "/recipe/:id",
  userController.checkUserRole("Admin", "User"),
  recipeController.removeRecipe
);
router.get(
  "/recipe/category/:id",
  userController.checkUserRole("Admin", "User"),
  recipeController.getRecipeByCategory
);

//Ingredients
router.get("/ingredients", ingredientController.getAllIngredients);
router.post(
  "/ingredients",
  userController.checkUserRole("Admin"),
  ingredientController.upload,
  ingredientController.addIngredient
);
router.delete(
  "/ingredients/:id",
  userController.checkUserRole("Admin"),
  ingredientController.deleteIngredientById
);

//Cart
router.get("/cart", cartController.getCartItems);
router.post("/cart", cartController.addToCart);
router.delete("/cart/:id", cartController.removeFromCart);
router.delete("/cart", cartController.removeAllFromCart);

//Order
router.get("/order", orderController.getOwnOrder);
router.get("/order/:id", orderController.getOrderById);
router.post("/order", orderController.createOrder);

//Categories
router.get("/categories", categoryController.getAllCategories);

//User
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

//User Manage
router.get(
  "/users",
  userController.checkUserRole("Admin"),
  userManager.getAllUser
);
router.get("/user", userManager.getUserDetail);
router.put("/user/:id", userManager.editUser);

//Favorite
router.post("/favorite", favoriteController.addFavorite);
router.get("/favorite", favoriteController.getFavoritesById);
router.get("/favorite/:id", favoriteController.getFavoritesByParamsId);
router.delete("/favorite", favoriteController.removeFavorite);

module.exports = router;
