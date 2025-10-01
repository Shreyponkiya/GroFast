const authMiddleware = require('../../middlewere/user.middlewere');
const express = require('express');
const router = express.Router();

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the Super Admin Dashboard" });
});
router.get("/shop-list",authMiddleware.userMiddlewere,)