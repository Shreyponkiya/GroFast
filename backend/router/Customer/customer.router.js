const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewere/user.middlewere");

const customerController = require("../../controllers/Customer/customer.controller");

// ✅ Get all products
router.get(
  "/get-products",
  authMiddleware.userMiddlewere,
  customerController.getAllProducts
);

// ✅ Get product by ID
router.get(
  "/get-products/:id",
  authMiddleware.userMiddlewere,
  customerController.getProductById
);

module.exports = router;
