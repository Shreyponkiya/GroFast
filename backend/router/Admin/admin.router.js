const express = require("express");
const router = express.Router();
const upload = require("../../middlewere/uploadMiddleware");
const adminController = require("../../controllers/Admin/admin.controller");
const authMiddleware = require("../../middlewere/user.middlewere");
const roleMiddleware = require("../../middlewere/role.middleware");

// Apply role middleware to ensure only 'admin' and 'superadmin' can access these routes

router.post(
  "/add-product",
  authMiddleware.userMiddlewere,
  upload.single("productImage"),
  roleMiddleware.authorizeRoles("admin", "superadmin"),
  adminController.addProduct
);
router.post(
  "/add-category",
  authMiddleware.userMiddlewere,
  roleMiddleware.authorizeRoles("admin", "superadmin"),
  adminController.addCategory
);
router.put(
  "/update-product/:productId",
  authMiddleware.userMiddlewere,
  roleMiddleware.authorizeRoles("admin", "superadmin"),
  upload.single("productImage"),
  adminController.updateProduct
);
router.put(
  "/update-category/:categoryId",
  roleMiddleware.authorizeRoles("admin", "superadmin"),
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
  roleMiddleware.authorizeRoles("admin", "superadmin"),
  adminController.deleteProduct
);
router.delete(
  "/delete-category/:categoryId",
  authMiddleware.userMiddlewere,
  roleMiddleware.authorizeRoles("admin", "superadmin"),
  adminController.deleteCategory
);
// router.get(
//   "/get-product/:categoryId/:userId",
//   authMiddleware.userMiddlewere,
//   upload.single("productImage"),
//   adminController.getProductByCategoryIdAndUserId
// );

module.exports = router;
