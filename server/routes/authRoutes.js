const express = require("express");
const router = express.Router();

const {
  loginValidation,
  registerValidation,
  forgotPasswordValidation,
  resetpassword,
  validate,
} = require("../middleware/validationMiddleware");

const {
  loginLimit,
  registerLimit,
  forgotPasswordLimit,
  resetPasswordLimit,
  refreshLimit,
} = require("../middleware/rateLimitMiddleware");

const authMiddleware = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", loginLimit, loginValidation, validate, loginUser);

router.post(
  "/register",
  registerLimit,
  registerValidation,
  validate,
  registerUser,
);

router.post("/refresh", refreshLimit, refreshAccessToken);

router.post("/logout", logoutUser);

router.get("/me", authMiddleware, getCurrentUser);

router.post(
  "/forgot-password",
  forgotPasswordLimit,
  forgotPasswordValidation,
  validate,
  forgotPassword,
);

router.post(
  "/reset-password/:token",
  resetPasswordLimit,
  resetpassword,
  validate,
  resetPassword,
);

module.exports = router;
