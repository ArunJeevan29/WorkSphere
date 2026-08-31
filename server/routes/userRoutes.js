const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  updateUserRoleValidation,
  updateUserStatusValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  getAllUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userController");

router.get(
  "/",
  authMiddleware,
  authorizationMiddleware(["admin"]),
  getAllUsers,
);

router.get("/:id", authMiddleware, authorizationMiddleware(["admin"]), getUser);

router.patch(
  "/:id/role",
  authMiddleware,
  authorizationMiddleware(["admin"]),
  updateUserRoleValidation,
  validate,
  updateUserRole,
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizationMiddleware(["admin"]),
  updateUserStatusValidation,
  validate,
  updateUserStatus,
);

module.exports = router;
