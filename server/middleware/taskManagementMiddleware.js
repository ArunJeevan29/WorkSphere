const Project = require("../models/Project");
const Task = require("../models/Task");

const taskManagementMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (req.user.role === "admin") {
      return next();
    }
    if (project.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Invalid Access" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = taskManagementMiddleware;
