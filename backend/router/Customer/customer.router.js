const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewere/user.middlewere");

const customerController = require("../../controllers/Customer/customer.controller");

router.get(
  "/get-products",
  authMiddleware.userMiddlewere,
  customerController.getAllProducts
);



module.exports = router;
