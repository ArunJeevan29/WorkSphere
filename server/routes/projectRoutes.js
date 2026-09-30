const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");
const projectOwnershipMiddleware = require("../middleware/projectOwnershipMiddleware");
const {
  createProjectValidation,
  updateProjectValidation,
  addProjectMembersValidation,
  deleteProjectValidation,
  createTaskValidation,
  fetchTaskValidation,
  mongoIdValidation,
  validate,
} = require("../middleware/validationMiddleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getAvailableProjectMembers,
  addProjectMember,
  removeProjectMembers,
  createTask,
  fetchAllTask,
} = require("../controllers/projectController");

// Project CRUD
// create project
router.post(
  "/",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  createProjectValidation,
  validate,
  createProject,
);
// get Projects
router.get(
  "/",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  getProjects,
);
// get One project
router.get(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  validate,
  getProject,
);
// edit Project
router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  updateProjectValidation,
  validate,
  projectOwnershipMiddleware,
  updateProject,
);

// delete project
router.delete(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  validate,
  projectOwnershipMiddleware,
  deleteProject,
);

// Project members
// fetch available users
router.get(
  "/:id/available-members",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  validate,
  projectOwnershipMiddleware,
  getAvailableProjectMembers,
);

// add project members
router.patch(
  "/:id/members",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  addProjectMembersValidation,
  validate,
  projectOwnershipMiddleware,
  addProjectMember,
);

// delete project members
router.delete(
  "/:id/members",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  deleteProjectValidation,
  validate,
  projectOwnershipMiddleware,
  removeProjectMembers,
);

// Task Operations through Project
// create task
router.post(
  "/:id/tasks",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  createTaskValidation,
  validate,
  projectOwnershipMiddleware,
  createTask,
);

// get all tasks
router.get(
  "/:id/tasks",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  mongoIdValidation,
  fetchTaskValidation,
  validate,
  projectOwnershipMiddleware,
  fetchAllTask,
);

module.exports = router;
