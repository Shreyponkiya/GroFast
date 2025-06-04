// Save this in orderController.js
const Order = require("../../models/Customer/order.model");
const orderServices = require("../../services/Customer/order.services");

module.exports.placeOrder = async (req, res) => {
  try {
    const { userId, products, amount, razorpay_order_id, razorpay_payment_id } = req.body;

    const newOrder = new Order({
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

module.exports.getOrderById = async (req, res) => {
  try {
    const { placeOrderId } = req.params;
    if (!placeOrderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }
    const order = await orderServices.getOrderById(placeOrderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};