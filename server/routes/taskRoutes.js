const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const taskAccessMiddleware = require("../middleware/taskAccessMiddleware");
const taskManagementMiddleware = require("../middleware/taskManagementMiddleware");

const {
  updateTaskValidation,
  updateTaskStatusValidation,
  mongoIdValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");

router.get(
  "/",
  authMiddleware,
  authorizationMiddleware(["admin", "manager", "member"]),
  getTasks,
);

router.get(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager", "member"]),
  mongoIdValidation,
  validate,
  taskAccessMiddleware,
  getTask,
);

router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  updateTaskValidation,
  validate,
  taskManagementMiddleware,
  updateTask,
);

router.delete(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  validate,
  taskManagementMiddleware,
  deleteTask,
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizationMiddleware(["admin", "manager", "member"]),
  mongoIdValidation,
  updateTaskStatusValidation,
  validate,
  taskAccessMiddleware,
  updateTaskStatus,
);

module.exports = router;
