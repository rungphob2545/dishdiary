const db = require("../..");
const Order = db.orders;
const OrderItem = db.orderItems;
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

    const orders = await Order.findAll({ where: { userId: userId } });

    const orderItems = [];
    for (const order of orders) {
      console.log(order);
      const orderItem = await OrderItem.findAll({
        where: { orderId: order.id },
      });
      if (orderItem) {
        orderItems.push(...orderItem);
      }
    }

    res.status(200).json({ orders, orderItems });
    console.log(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
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

    const id = req.params.id;
    const orders = await Order.findOne({ where: { id: id } });

    res.status(200).json({ orders });
    console.log(orders);
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

    const { shippingAddress, paymentMethod, items, status } = req.body;

    //for check Array Items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided for the order",
      });
    }

    const totalPrice = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    // สร้าง Order
    const order = await Order.create({
      userId: userId,
      shippingAddress,
      paymentMethod,
      status,
      totalPrice: totalPrice,
    });

    // สร้าง Order Items
    const orderItems = items.map((item) => ({
      orderId: order.id,
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price,
    }));

    await OrderItem.bulkCreate(orderItems);

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

module.exports = {
  createOrder,
  getOwnOrder,
  getOrderById,
};
