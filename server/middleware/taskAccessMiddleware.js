const Task = require("../models/Task");
const Project = require("../models/Project");

const taskAccessMiddleware = async (req, res, next) => {
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
    if (req.user.role === "manager") {
      if (project.createdBy.toString() === req.user.id.toString()) {
        return next();
      }
    }
    if (req.user.role === "member") {
      const isAssigned = task.assignedTo.some(
        (member) => member.toString() === req.user.id.toString(),
      );
      if (isAssigned) {
        return next();  
      }
    }
    return res.status(403).json({ message: "Invalid Access" });
  } catch (error) {
    next(error);
  }
};

module.exports = taskAccessMiddleware;
