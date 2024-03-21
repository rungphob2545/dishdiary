const recipeController = require("./app/recipe/controller");
const orderController = require("./app/order/controller");
const categoryController = require("./app/category/controller");
const userController = require("./app/user/controller");
const router = require("express").Router();

// const apiRouter = Router();

//Recipe
router.get("/recipe", recipeController.getAllRecipe);
router.get("/recipe/:id", recipeController.getRecipeById);
router.post("/recipe", recipeController.upload, recipeController.addRecipe);
router.put("/recipe/:id", recipeController.updateRecipe);
router.delete("/recipe/:id", recipeController.removeRecipe);
router.get("/recipe/category/:id", recipeController.getRecipeByCategory);

//Order
router.get("/order/:id", orderController.getOwnOrder);
router.post("/order", orderController.createOrder);

//Categories
router.get("/categories", categoryController.getAllCategories);

//User
router.get("/user", userController.getAllUsers);
router.post("/user", userController.createUser);
router.delete("/user/:id", userController.deleteUser);

module.exports = router;
