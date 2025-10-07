const express = require("express");
const authMiddleware = require("../../middlewere/user.middlewere");
const SuperAdminController = require("../../controllers/SuperAdmin/superAdmin.controller");
const roleMiddleware = require("../../middlewere/role.middleware");
const { authorizeRoles } = require("../../middlewere/role.middleware");
const router = express.Router();

// Dashboard route
router.get(
  "/dashboard",
  authMiddleware.userMiddlewere,
  SuperAdminController.dashboard,
  authorizeRoles("superadmin")
);

// List routes
router.get(
  "/products",
  authMiddleware.userMiddlewere,
  SuperAdminController.getProducts,
  authorizeRoles("superadmin")
);
router.get(
  "/categories",
  authMiddleware.userMiddlewere,
  authorizeRoles("superadmin"),
  SuperAdminController.getCategories
);
router.get(
  "/delivery-boys",
  authMiddleware.userMiddlewere,
  authorizeRoles("superadmin"),
  SuperAdminController.getDeliveryBoys
);
router.get(
  "/shopkeepers",
  authMiddleware.userMiddlewere,
  authorizeRoles("superadmin"),
  SuperAdminController.getShopkeepers
);
router.get(
  "/customers",
  authMiddleware.userMiddlewere,
  authorizeRoles("superadmin"),
  SuperAdminController.getCustomers
);

module.exports = router;
