const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const {
  mongoIdValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  getAllLogs,
  getAuditLogs,
} = require("../controllers/auditLogController");

router.get("/", authMiddleware, authorizationMiddleware(["admin"]), getAllLogs);

router.get(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  validate,
  getAuditLogs,
);

module.exports = router;
