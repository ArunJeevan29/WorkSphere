const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const {
  fetchAdminDashboardAnalytics,

} = require("../controllers/dashboardController");
router.get(
  "/admin",
  authMiddleware,
  authorizationMiddleware(["admin"]),
  fetchAdminDashboardAnalytics,
);


module.exports = router;
