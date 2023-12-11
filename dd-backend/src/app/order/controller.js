const db = require("../../");
const Order = db.orders;

const createOrder = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "Invalid Data" });
    }

    let result = {
      ingredientId: req.body.ingredientId,
      quantity: req.body.quantity,
      unitPrice: req.body.unitPrice,
      totalPrice: req.body.quantity * req.body.unitPrice,
      orderDate: req.body.orderDate,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      shippingMethod: req.body.shippingMethod,
      userId: userId,
    };

    const order = await Order.create(result);
    res.status(200).send(order);
    console.log(order);
  } catch (err) {
    res.status(500).send({
      message: err.message || " Error occurred while creating",
    });
  }
};

module.exports = {
  createOrder,
};
