const db = require("../..");
const Order = db.orders;
const orderItem = db.orderItems;
const User = db.users;
const jwt = require("jsonwebtoken");

const getOwnOrder = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not Found !" });
    }

    const order = await Order.findAll({ where: { userId: userId } });
    res.status(200).send(order);
    console.log(order);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ตรวจสอบ Token
    const decodedToken = jwt.verify(token, "mysecretpassword");
    console.log(decodedToken);

    let userId = decodedToken.userId;

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) {
      return res.status(404).send({ message: "User Not Found !" });
    }

    const { shippingAddress, paymentMethod, items } = req.body;

    // สร้าง Order
    const order = await Order.create({
      userId: userId,
      shippingAddress,
      paymentMethod,
      totalAmount: calculateTotalAmount(items),
    });

    // สร้าง Order Items
    const orderItems = items.map((item) => ({
      orderId: order.id,
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    await orderItem.bulkCreate(orderItems);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

function calculateTotalAmount(items) {
  return items.reduce((total, item) => total + item.quantity * item.price, 0);
}

module.exports = {
  createOrder,
  getOwnOrder,
};
