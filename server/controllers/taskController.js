const Project = require("../models/Project");
const Task = require("../models/Task");

const createAuditLog = require("../utils/createAuditLog");

// const getAllTasks = async (req, res, next) => {
//   try {
//     const tasks = await Task.find();
//     return res.status(200).json({ tasks });
//   } catch (error) {
//     next(error);
//   }
// };

const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not Found" });
    }
    return res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const { id } = req.params;
    const currentTask = await Task.findById(id);
    const project = await Project.findById(currentTask.project);

    const validUsers = assignedTo.every((userId) => {
      return project.members.some(
        (members) => members.toString() === userId.toString(),
      );
    });
    if (!validUsers) {
      return res.status(400).json({ message: "One or more users not found" });
    }
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, assignedTo, priority, dueDate },
      { new: true },
    );
    await createAuditLog({
      actor: req.user.id,
      action: "TASK_UPDATED",
      resource: "Task",
      resourceId: task._id,
      metadata: {
        title: task.title,
      },
      ipAddress: req.ip,
    });

    return res.status(200).json({ message: "Task Updated Successfully", task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    await createAuditLog({
      actor: req.user.id,
      action: "TASK_DELETED",
      resource: "Task",
      resourceId: task._id,
      metadata: {
        title: task.title,
        project: task.project,
      },
      ipAddress: req.ip,
    });

    return res.status(200).json({ message: "Task deleted Successfully", task });
  } catch (error) {
    next(error);
  }
};

const getAllTask = async (req, res, next) => {
  try {
    const { id } = req.user;
    const tasks = await Task.find({ assignedTo: id });
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });

    await createAuditLog({
      actor: req.user.id,
      action: "TASK_STATUS_UPDATED",
      resource: "Task",
      resourceId: task._id,
      metadata: {
        title: task.title,
        status: task.status,
      },
      ipAddress: req.ip,
    });

    return res.status(200).json({ message: "Updated Task Status", task });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTask,
  updateTask,
  deleteTask,
  getAllTask,
  updateTaskStatus,
  // getAllTasks,
};
