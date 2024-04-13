const recipeController = require("./app/recipe/controller");
const categoryController = require("./app/category/controller");
const orderController = require("./app/order/controller");
const userController = require("./app/user/controller");
const historyController = require("./app/history/controller");
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
router.get(
  "/recipe",
  userController.verifyToken,
  recipeController.getAllRecipe
);

//search
router.get("/recipe/search", recipeController.searchRecipeByName);

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

//Order
router.get("/order/:id", orderController.getOwnOrder);
router.post("/order", orderController.createOrder);

//Categories
router.get("/categories", categoryController.getAllCategories);

//User
router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);

//History
router.post("/history", historyController.searchRecord);
router.get("/history/:userId", historyController.searchHistory);

module.exports = router;
