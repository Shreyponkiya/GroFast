const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/Customer/cart.controller");
const authMiddleware = require("../../middlewere/user.middlewere");

// Create full cart (checkout)
router.post(
  "/create-cart",
  authMiddleware.userMiddlewere,
  cartController.createCart
);

// Add item
router.post(
  "/add-item",
  authMiddleware.userMiddlewere,
  cartController.addCartItem
);

// Remove item
router.post(
  "/remove-item",
  authMiddleware.userMiddlewere,
  cartController.removeCartItem
);
router.get("/get-cart", authMiddleware.userMiddlewere, cartController.getCart);

// Get cart by user (refresh)
router.get(
  "/user/:userId",
  authMiddleware.userMiddlewere,
  cartController.getCartByUser
);

// Get cart by orderId
router.get("/get-cart", authMiddleware.userMiddlewere, cartController.getCart);

module.exports = router;
