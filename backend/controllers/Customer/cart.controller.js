const cartServices = require("../../services/Customer/cart.services");
const productModel = require("../../models/Product.model");

// ✅ Helper: Calculate Total Price & GST
const calculateTotals = (products, cartItems) => {
  let totalPrice = 0;
  let totalGST = 0;

  products.forEach((product) => {
    const cartItem = cartItems.find(
      (item) => item.productId.toString() === product._id.toString()
    );
    if (!cartItem) return;

    const quantity = cartItem.quantity;
    const price = product.productPrice;
    const gst = (price * 18) / 100;

    totalPrice += (price + gst) * quantity;
    totalGST += gst * quantity;
  });

  return { totalPrice, totalGST };
};

// ✅ Create Cart (when checkout starts)
exports.createCart = async (req, res) => {
  try {
    const { userId, cartItems, OrderId } = req.body;

    if (!userId || !cartItems || !OrderId) {
      return res
        .status(400)
        .json({ message: "User ID, cart items, and Order ID are required" });
    }

    const products = await productModel.find({
      _id: { $in: cartItems.map((item) => item.productId) },
    });
    console.log("Products fetched for cart creation:", products);
    if (!products.length) {
      return res.status(404).json({ message: "Products not found" });
    }

    const totals = calculateTotals(products, cartItems);

    const cartData = {
      userId,
      OrderId,
      products: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: totals.totalPrice,
      totalGST: totals.totalGST,
    };

    const cart = await cartServices.createCart(cartData);
    return res.status(201).json(cart);
  } catch (error) {
    console.error("Error in createCart:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add Item to Cart
exports.addCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "UserId and productId required" });
    }

    const cart = await cartServices.addCartItem(
      userId,
      productId,
      quantity || 1
    );
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addCartItem:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Remove Item from Cart
exports.removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ message: "UserId and productId required" });
    }

    const cart = await cartServices.removeCartItem(userId, productId);
    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Cart by User (for refresh / normal use)
exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const cart = await cartServices.getCartByUser(userId);
    return res.status(200).json(cart || { products: [] });
  } catch (error) {
    console.error("Error in getCartByUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Cart by OrderId (after checkout)
exports.getCartByOrderId = async (req, res) => {
  try {
    const { OrderId } = req.params;
    console.log("Fetching cart for Order ID:", OrderId);

    if (!OrderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    const cart = await cartServices.getCartByOrderId(OrderId);
    console.log("Cart fetched:", cart);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCartByOrderId:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/cart/get-cart/:userId
module.exports.getCart = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cart = await cartServices.getCartByUser(userId); // Fetch cart without orderId

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: error.message });
  }
};
