const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const taskAccessMiddleware = require("../middleware/taskAccessMiddleware");
const taskManagementMiddleware = require("../middleware/taskManagementMiddleware");

const {
  updateTaskValidation,
  updateTaskStatusValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  // getAllTasks,
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
  taskAccessMiddleware,
  getTask,
);

router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  taskManagementMiddleware,
  updateTaskValidation,
  validate,
  updateTask,
);

router.delete(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  taskManagementMiddleware,
  deleteTask,
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorizationMiddleware(["admin", "manager", "member"]),
  taskAccessMiddleware,
  updateTaskStatusValidation,
  validate,
  updateTaskStatus,
);

module.exports = router;
