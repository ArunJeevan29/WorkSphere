const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const createAuditLog = require("../utils/createAuditLog");

const createProject = async (req, res, next) => {
  try {
    const { name, description, status, icon, color } = req.body;
    const newProject = {
      name,
      description,
      status,
      icon,
      color,
      createdBy: req.user.id,
    };
    const project = await Project.create(newProject);
    await createAuditLog({
      actor: req.user.id,
      action: "PROJECT_CREATED",
      resource: "Project",
      resourceId: project._id,
      metadata: {
        name: project.name,
      },
      ipAddress: req.ip,
    });

    return res
      .status(201)
      .json({ message: "Project created Successfully", project });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const fetchProjects = await Project.find().populate(
      "createdBy",
      "name email",
    );
    const projects = await Promise.all(
      fetchProjects.map(async (project) => {
        const tasks = await Task.find({ project: project._id });

        const completedTasks = tasks.filter(
          (task) => task.status === "completed",
        ).length;
        const progress =
          tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;

        return {
          ...project.toObject(),
          totalTasks: tasks.length,
          completedTasks,
          progress,
          memberCount: project.members.length,
        };
      }),
    );
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate("createdBy", "name email role")
      .populate("members", "name email role");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    console.log(project);
    return res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, status },
      { new: true },
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await createAuditLog({
      actor: req.user.id,
      action: "PROJECT_EDITED",
      resource: "Project",
      resourceId: project._id,
      metadata: {
        name: project.name,
        status: project.status,
      },
      ipAddress: req.ip,
    });
    return res
      .status(200)
      .json({ message: "Project Updated Successfully", project });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await createAuditLog({
      actor: req.user.id,
      action: "PROJECT_DELETED",
      resource: "Project",
      resourceId: project._id,
      metadata: {
        name: project.name,
      },
      ipAddress: req.ip,
    });
    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const addProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { members } = req.body;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const users = await User.find({ _id: { $in: members } });
    if (users.length !== members.length) {
      return res.status(404).json({ message: "One or more users not found" });
    }
    const newMembers = members.filter((userId) => {
      return !project.members.some(
        (member) => member.toString() === userId.toString(),
      );
    });
    project.members.push(...newMembers);
    await project.save();

    await createAuditLog({
      actor: req.user.id,
      action: "PROJECT_MEMBERS_ADDED",
      resource: "Project",
      resourceId: project._id,
      metadata: {
        addedMembers: newMembers,
      },
      ipAddress: req.ip,
    });
    await project.populate("members", "name email role");
    return res
      .status(200)
      .json({ message: "Members added successfully", project });
  } catch (error) {
    next(error);
  }
};

const removeProjectMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { members } = req.body;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const remainingMembers = project.members.filter((member) => {
      return !members.some((userId) => userId.toString() === member.toString());
    });
    const removedCount = project.members.length - remainingMembers.length;
    if (removedCount !== members.length) {
      return res
        .status(404)
        .json({ message: "One or more users are not members of this project" });
    }
    project.members = remainingMembers;
    await project.save();

    await createAuditLog({
      actor: req.user.id,
      action: "PROJECT_MEMBERS_REMOVED",
      resource: "Project",
      resourceId: project._id,
      metadata: {
        removedMembers: members,
      },
      ipAddress: req.ip,
    });

    return res.status(200).json({ message: "Users deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const projectId = req.params.id;
    const userID = req.user.id;
    const project = await Project.findById(projectId);
    const members = assignedTo;
    const availableUser = members.every((member) => {
      return project.members.some(
        (userId) => member.toString() === userId.toString(),
      );
    });
    if (!availableUser) {
      return res.status(400).json({ message: "One or more User is Invalid" });
    }
    const newTask = {
      title,
      description,
      project: projectId,
      assignedTo,
      priority,
      dueDate,
      createdBy: userID,
    };
    const task = await Task.create(newTask);

    await createAuditLog({
      actor: req.user.id,
      action: "TASK_CREATED",
      resource: "Task",
      resourceId: task._id,
      metadata: {
        title: task.title,
        project: task.project,
      },
      ipAddress: req.ip,
    });
    return res.status(201).json({ message: "Task created Successfully", task });
  } catch (error) {
    next(error);
  }
};

const fetchAllTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = await Task.find({ project: id });
    const completedTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;
    const progress =
      tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;
    console.log(tasks);
    return res
      .status(200)
      .json({ tasks, totalTasks: tasks.length, completedTasks, progress });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  addProjectMember,
  removeProjectMembers,
  deleteProject,
  createTask,
  fetchAllTask,
};
