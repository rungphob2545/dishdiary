const recipeController = require("./app/recipe/controller");
const orderController = require("./app/order/controller");
const categoryController = require("./app/category/controller");
const router = require("express").Router();

// const apiRouter = Router();

//Recipe
router.get("/recipe", recipeController.getAllRecipe);
router.get("/recipe/:id", recipeController.getRecipeById);
router.post("/recipe", recipeController.upload, recipeController.addRecipe);
router.put("/recipe/:id", recipeController.updateRecipe);
router.delete("/recipe/:id", recipeController.removeRecipe);

//Order
router.get("/order/:id", orderController.getOwnOrder);
router.post("/order", orderController.createOrder);

//Categories
router.get("/categories", categoryController.getAllCategories);
module.exports = router;
