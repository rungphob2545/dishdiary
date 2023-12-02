const recipeController = require("./app/recipe/controller");
const router = require("express").Router();

// const apiRouter = Router();

router.get("/recipe", recipeController.getAllRecipe);
router.get("/recipe/:id", recipeController.getRecipeById);
router.post("/recipe", recipeController.addRecipe);
router.delete("/recipe/:id", recipeController.removeRecipe);

module.exports = router;
