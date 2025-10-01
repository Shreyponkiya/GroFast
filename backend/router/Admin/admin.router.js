const express = require("express");
const router = express.Router();
const upload = require("../../middlewere/uploadMiddleware");
const adminController = require("../../controllers/Admin/admin.controller");
const authMiddleware = require("../../middlewere/user.middlewere");

router.post(
  "/add-product",
  authMiddleware.userMiddlewere,
  upload.single("productImage"),
  adminController.addProduct
);
router.post(
  "/add-category",
  authMiddleware.userMiddlewere,
  adminController.addCategory
);
router.put(
  "/update-product/:productId",
  authMiddleware.userMiddlewere,
  upload.single("productImage"),
  adminController.updateProduct
);
router.put(
  "/update-category/:categoryId",
  authMiddleware.userMiddlewere,
  adminController.updateCategory
);
router.get(
  "/get-products/:createdBy",
  authMiddleware.userMiddlewere,
  adminController.getProductsByUserId
);
router.get(
  "/get-categories",
  authMiddleware.userMiddlewere,
  adminController.getCategories
);
router.get(
  "/get-product/:categoryId/:userId",
  authMiddleware.userMiddlewere,
  adminController.getProductByCategoryIdAndUserId
);
router.delete(
  "/delete-product/:productId",
  authMiddleware.userMiddlewere,
  adminController.deleteProduct
);
router.delete(
  "/delete-category/:categoryId",
  authMiddleware.userMiddlewere,
  adminController.deleteCategory
);
// router.get(
//   "/get-product/:categoryId/:userId",
//   authMiddleware.userMiddlewere,
//   upload.single("productImage"),
//   adminController.getProductByCategoryIdAndUserId
// );

module.exports = router;
