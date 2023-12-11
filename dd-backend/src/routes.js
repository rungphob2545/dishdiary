const recipeController = require("./app/recipe/controller");
const orderController = require("./app/order/controller");
const router = require("express").Router();

// const apiRouter = Router();

//Recipe
router.get("/recipe", recipeController.getAllRecipe);
router.get("/recipe/:id", recipeController.getRecipeById);
router.post("/recipe", recipeController.addRecipe);
router.put("/recipe/:id", recipeController.updateRecipe);
router.delete("/recipe/:id", recipeController.removeRecipe);
router.put("/recipe/:id", recipeController.updateRecipe);

//Order
router.get("/order/:id", orderController.getOwnOrder);
router.post("/order", orderController.createOrder);

module.exports = router;
