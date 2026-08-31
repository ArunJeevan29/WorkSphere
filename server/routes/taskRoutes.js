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
  getTask,
  updateTask,
  deleteTask,
  getAllTask,
  updateTaskStatus,
  // getAllTasks,
} = require("../controllers/taskController");

router.get(
  "/my-tasks",
  authMiddleware,
  authorizationMiddleware(["admin", "manager", "member"]),
  getAllTask,
);

// router.get("/", getAllTasks);

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
  authorizationMiddleware(["member"]),
  taskAccessMiddleware,
  updateTaskStatusValidation,
  validate,
  updateTaskStatus,
);

module.exports = router;
