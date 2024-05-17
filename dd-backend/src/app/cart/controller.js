const db = require("../..");
const CartItem = db.carts;
const Ingredient = db.ingredients;
const User = db.users;
const jwt = require("jsonwebtoken");

const addToCart = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let id = decodedToken.userId;
    const existingUser = await User.findOne({
      where: { id: id },
    });
    if (!existingUser) {
      return res.status(404).send({ message: "Error: Not Found" });
    }

    const { ingredientId, quantity } = req.body;

    const existingCartItem = await CartItem.findOne({
      where: { userId: id, ingredientId: ingredientId },
    });

    if (existingCartItem) {
      // อัปเดตจำนวนสินค้าในตะกร้า
      existingCartItem.quantity += req.body.quantity;
      await existingCartItem.save();
      return res
        .status(200)
        .json({ message: "Updated cart item", cartItem: existingCartItem });
    }

    // สร้างรายการใหม่ในตะกร้า
    const newCartItem = await CartItem.create({
      userId: id,
      ingredientId: req.body.ingredientId,
      quantity: req.body.quantity,
    });

    res.status(201).json({ message: "Added to cart", newCartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    const userId = decodedToken.userId;
    const existingUser = await User.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).send({ message: "Error: Not Found" });
    }

    const cartItemId = req.params.id;

    // ลบรายการในตะกร้าตาม cartItemId
    await CartItem.destroy({
      where: { userId: userId, cartItemId: cartItemId },
    });

    res.status(200).json({ message: "Removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeAllFromCart = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    const userId = decodedToken.userId;
    const existingUser = await User.findOne({
      where: { id: userId },
    });
    if (!existingUser) {
      return res.status(404).send({ message: "Error: Not Found" });
    }

    // ลบรายการทั้งหมดในตะกร้าสำหรับ user นั้นๆ
    await CartItem.destroy({ where: { userId: userId } });

    res.status(200).json({ message: "Removed all items from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;
    const cartItems = await CartItem.findAll({
      where: { userId: userId },
    });

    // ดึงข้อมูลรายการสินค้าจาก ingredientId ที่ได้จาก cartItems
    const ingredients = [];
    for (const cartItem of cartItems) {
      const ingredient = await Ingredient.findByPk(cartItem.ingredientId);
      if (ingredient) {
        ingredients.push(ingredient);
      }
    }

    res.status(200).json({ cartItems, ingredients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCartItems,
  removeAllFromCart,
};
