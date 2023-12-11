const recipeController = require("./app/recipe/controller");
const orderController = require("./app/order/controller");
const router = require("express").Router();

// const apiRouter = Router();

router.get("/recipe", recipeController.getAllRecipe);
router.get("/recipe/:id", recipeController.getRecipeById);
router.post("/recipe", recipeController.addRecipe);
router.delete("/recipe/:id", recipeController.removeRecipe);
router.put("/recipe/:id", recipeController.updateRecipe);

router.post("/order", orderController.createOrder);

module.exports = router;
