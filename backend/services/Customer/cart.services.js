const CartModel = require("../../models/Customer/cart.model");

exports.createCart = async (cartData) => {
  try {
    const cart = new CartModel(cartData);
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error creating cart: " + error.message);
  }
};
exports.getCartByOrderId = async (orderId) => {
  try {
    const cart = await CartModel.findOne({ OrderId: orderId })
      .populate("products.productId") // ✅ Now this will work
      .populate("userId");

    if (!cart) {
      throw new Error("Cart not found");
    }
    return cart;
  } catch (error) {
    throw new Error("Error fetching cart: " + error.message);
  }
};
