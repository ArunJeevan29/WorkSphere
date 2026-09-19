const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const {
  fetchAdminDashboardAnalytics,
  fetchManagerDashboardAnalytics,
  fetchMemberDashboardAnalytics,
} = require("../controllers/dashboardController");
router.get(
  "/admin",
  authMiddleware,
  authorizationMiddleware(["admin"]),
  fetchAdminDashboardAnalytics,
);

router.get(
  "/manager",
  authMiddleware,
  authorizationMiddleware(["manager"]),
  fetchManagerDashboardAnalytics,
);

router.get(
  "/member",
  authMiddleware,
  authorizationMiddleware(["member"]),
  fetchMemberDashboardAnalytics,
);

module.exports = router;
