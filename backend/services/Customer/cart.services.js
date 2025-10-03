const CartModel = require("../../models/Customer/cart.model");

// ✅ Create Cart
exports.createCart = async (cartData) => {
  try {
    const cart = new CartModel(cartData);
    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error creating cart: " + error.message);
  }
};

// ✅ Add Item to Cart
exports.addCartItem = async (userId, productId, quantity) => {
  try {
    console.log("Adding item to cart:", { userId, productId, quantity });
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, products: [] });
    }

    const existingItem = cart.products.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error adding item: " + error.message);
  }
};

// ✅ Remove Item from Cart
exports.removeCartItem = async (userId, productId) => {
  try {
    const cart = await CartModel.findOne({ userId });
    if (!cart) throw new Error("Cart not found");

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error("Error removing item: " + error.message);
  }
};

// ✅ Get Cart by User
exports.getCartByUser = async (userId) => {
  try {
    return await CartModel.findOne({ userId })
      .populate("products.productId")
      .populate("userId");
  } catch (error) {
    throw new Error("Error fetching cart: " + error.message);
  }
};

// ✅ Get Cart by OrderId
exports.getCartByOrderId = async (orderId) => {
  try {
    console.log("Fetching cart for Order ID:", orderId);
    return await CartModel.findOne({ orderId })
      .populate("products.productId")
      .populate("userId");
  } catch (error) {
    throw new Error("Error fetching cart: " + error.message);
  }
};

exports.getCartByOrderAndUser = async (userId) => {
  try {
    const cart = await CartModel.findOne({ userId })
      .populate("products.productId")
      .populate("userId");

    return cart;
  } catch (error) {
    throw new Error("Error fetching cart: " + error.message);
  }
};
