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

    // ตรวจสอบว่ารายการอาหารมีในตะกร้าแล้วหรือยัง
    let cartItem = await CartItem.findOne({
      where: { userId: id, ingredientId: ingredientId },
    });

    if (cartItem) {
      // อัปเดตจำนวนสินค้าในตะกร้า
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // สร้างรายการใหม่ในตะกร้า
      cartItem = await CartItem.create({
        userId: id,
        ingredientId: ingredientId,
        quantity: quantity,
      });
    }

    res.status(201).json({ message: "Added to cart", cartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    // ลบรายการในตะกร้าตาม cartItemId
    await CartItem.destroy({ where: { cartItemId: cartItemId } });

    res.status(200).json({ message: "Removed from cart" });
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
};
