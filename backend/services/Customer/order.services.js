const orderModel = require("../../models/Customer/order.model");

module.exports.placeOrder = async (req, res) => {
  try {
    const { userId, products, amount, razorpay_order_id, razorpay_payment_id } =
      req.body;

    const newOrder = new orderModel({
      user: userId,
      products,
      amount,
      razorpay_order_id,
      razorpay_payment_id,
      status: "confirmed", // or "processing"
    });
    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order placement failed:", error);
    res.status(500).json({
      success: false,
      message: "Order placement failed",
      error: error.message,
    });
  }
};

module.exports.getOrderById = async (placeOrderId) => {
  try {
    const order = await orderModel.findById(placeOrderId).populate("user").populate({
    path: "products.productId",
    populate: {
      path: "createdBy", // populate createdBy inside product
      model: "User", // or whatever your User model is called
    }
  });
    console.log("Order:", order);
    return order;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return {
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    };
  }
};
