const express = require("express");
const router = express.Router();

const {
  loginValidation,
  registerValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  loginLimit,
  registerLimit,
} = require("../middleware/rateLimitMiddleware");

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
} = require("../controllers/authController");

router.post("/login", loginLimit, loginValidation, validate, loginUser);

router.post(
  "/register",
  registerLimit,
  registerValidation,
  validate,
  registerUser,
);

router.post("/refresh", refreshAccessToken);

router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
