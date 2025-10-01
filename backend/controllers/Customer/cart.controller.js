const certServices = require("../../services/Customer/cart.services");
const productModel = require("../../models/Product.model");
const calculateTotalPrice = (products, cartItems) => {
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
    totalPrice += price * quantity + gst;
    totalGST += gst;
  });

  return { totalPrice, totalGST };
};

module.exports.certServices = async (req, res) => {
  try {
    const { userId, cartItems, OrderId } = req.body;
    if (!userId || !cartItems || !OrderId) {
      return res
        .status(400)
        .json({ message: "User ID, cart items, and Order ID are required" });
    }
    // get User and Product For Database

    const products = await productModel.find({
      _id: { $in: cartItems.map((item) => item.productId) },
    });
    const CartPayload = calculateTotalPrice(products, cartItems);
    const cartData = {
      userId: userId,
      OrderId: OrderId,
      products: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: CartPayload.totalPrice,
      totalGST: CartPayload.totalGST,
    };

    const cart = await certServices.createCart(cartData);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getCartByOrderId = async (req, res) => {
  try {
    const { OrderId } = req.params;
    console.log("OrderId : ", OrderId);
    if (!OrderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const cart = await certServices.getCartByOrderId(OrderId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
