const db = require("../..");
const Ingredient = db.ingredients;

// เพิ่ม ingredient
const addIngredient = async (req, res) => {
  try {
    const {
      ingredientName,
      ingredientImage,
      ingredientPricePerUnit,
      ingredientQuantity,
    } = req.body;
    const newIngredient = await Ingredient.create({
      ingredientName,
      ingredientImage,
      ingredientPricePerUnit,
      ingredientQuantity,
    });
    res
      .status(201)
      .json({
        message: "Ingredient added successfully",
        ingredient: newIngredient,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงข้อมูล ingredient ทั้งหมด
const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll();
    res.status(200).json({ ingredients });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ดึงข้อมูล ingredient ตาม ID
const getIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    res.status(200).json({ ingredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// อัปเดตข้อมูล ingredient ตาม ID
const updateIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      ingredientName,
      ingredientImage,
      ingredientPricePerUnit,
      ingredientQuantity,
    } = req.body;
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    ingredient.ingredientName = ingredientName;
    ingredient.ingredientImage = ingredientImage;
    ingredient.ingredientPricePerUnit = ingredientPricePerUnit;
    ingredient.ingredientQuantity = ingredientQuantity;
    await ingredient.save();
    res
      .status(200)
      .json({ message: "Ingredient updated successfully", ingredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ลบข้อมูล ingredient ตาม ID
const deleteIngredientById = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }
    await ingredient.destroy();
    res.status(200).json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredientById,
  deleteIngredientById,
};
