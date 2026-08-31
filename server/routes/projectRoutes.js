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
  validate,
} = require("../middleware/validationMiddleware");

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
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
  getProject,
);
// edit Project
router.put(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  projectOwnershipMiddleware,
  updateProjectValidation,
  validate,
  updateProject,
);
// delete project
router.delete(
  "/:id",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  projectOwnershipMiddleware,
  deleteProject,
);

// Project members
// add project members
router.patch(
  "/:id/members",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  projectOwnershipMiddleware,
  addProjectMembersValidation,
  validate,
  addProjectMember,
);
// delete project members
router.delete(
  "/:id/members",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  projectOwnershipMiddleware,
  deleteProjectValidation,
  validate,
  removeProjectMembers,
);

// Task Operations through Project
// create task
router.post(
  "/:id/tasks",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  projectOwnershipMiddleware,
  createTaskValidation,
  validate,
  createTask,
);
// get all tasks
router.get(
  "/:id/tasks",
  authMiddleware,
  authorizationMiddleware(["admin", "manager"]),
  projectOwnershipMiddleware,
  fetchAllTask,
);

module.exports = router;
