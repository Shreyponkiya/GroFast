const express = require("express");
const router = express.Router();
const cartController = require("../../controllers/Customer/cart.controller");
const authMiddleware = require("../../middlewere/user.middlewere");

router.post(
  "/create-cart",
  authMiddleware.userMiddlewere,
  cartController.certServices
);
router.get(
  "/get-cart/:OrderId", // ✅ Route param
  authMiddleware.userMiddlewere,
  cartController.getCartByOrderId
);

module.exports = router;
