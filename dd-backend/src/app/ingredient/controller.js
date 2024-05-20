const db = require("../..");
const Ingredient = db.ingredients;
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./dist/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: '1000000'}
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    const err = new Error();
    err.message = "Please select an image file (jpg, jpeg, or png)";
    err.status = 400;
    return cb(err);
  },
}).single("ingredientImage");

// เพิ่ม ingredient
const addIngredient = async (req, res) => {
  try {
    if (!req.body) {
      res.status(400).send({
        message: "ไม่มีข้อมูลถูกส่่งมา",
      });
      return;
    }

    const existingIngredient = await Ingredient.findOne({
      where: { ingredientName: req.body.ingredientName },
    });
    if (existingIngredient) {
      return res
        .status(400)
        .send({ message: "Ingredient name must be unique" });
    }

    let ingredient = {
      ingredientName: req.body.ingredientName,
      ingredientPricePerUnit: req.body.ingredientPricePerUnit,
      ingredientQuantity: req.body.ingredientQuantity,
      ingredientImage: req.file.path,
    };
    const newIngredient = await Ingredient.create(ingredient);

    res.status(201).json({
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
    res.status(200).send(ingredients);
  } catch (error) {
    res.status(500).send({ error: error.message });
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
  upload,
  updateIngredientById,
  deleteIngredientById,
};
