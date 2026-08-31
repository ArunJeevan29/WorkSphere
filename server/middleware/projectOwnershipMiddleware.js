const Project = require("../models/Project");

const projectOwnershipMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (req.user.role === "admin") {
      return next();
    }
    if (userId.toString() !== project.createdBy.toString()) {
      return res.status(403).json({ message: "Invalid Access" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = projectOwnershipMiddleware;
