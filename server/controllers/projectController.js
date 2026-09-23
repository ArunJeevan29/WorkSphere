const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const AuditLog = require("../models/AuditLog");
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
      project: project._id,
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
    const { id, role } = req.user;
    const query = {};
    if (role === "manager") {
      query.createdBy = id;
    }
    const fetchProjects = await Project.find(query).populate(
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
    return res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status, icon, color } = req.body;
    const project = await Project.findByIdAndUpdate(
      id,
      { name, description, status, icon, color },
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
      project: project._id,
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
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    await Task.deleteMany({ project: id });

    await AuditLog.deleteMany({ project: id });

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

    await Project.findByIdAndDelete(id);

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getAvailableProjectMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    const users = await User.find({
      _id: { $nin: project.members },
      role: "member",
      status: "active",
    }).select("-password");
    console.log(users);
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const addProjectMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { members } = req.body;
    const project = await Project.findById(id);
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
      project: project._id,
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
      project: project._id,
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
      project: projectId,
      metadata: {
        title: task.title,
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
    const { status, priority, search, sort, page = 1, limit = 5 } = req.query;
    const query = {
      project: id,
    };
    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }
    if (sort === "due-asc") {
      sortOption = { dueDate: 1 };
    }

    if (sort === "due-desc") {
      sortOption = { dueDate: -1 };
    }
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .populate("assignedTo", "name email role");

    const filteredTotalTasks = await Task.countDocuments(query);
    const projectTotalTasks = await Task.countDocuments({ project: id });
    const totalPages = Math.ceil(filteredTotalTasks / limitNumber);

    const projectId = new mongoose.Types.ObjectId(id);

    const stats = await Task.aggregate([
      {
        $match: {
          project: projectId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let completedTasks = 0;
    let pendingTask = 0;
    let inProgressTask = 0;
    stats.forEach((stat) => {
      if (stat._id === "completed") {
        completedTasks = stat.count;
      }
      if (stat._id === "pending") {
        pendingTask = stat.count;
      }
      if (stat._id === "in-progress") {
        inProgressTask = stat.count;
      }
    });

    const progress =
      projectTotalTasks === 0 ? 0 : (completedTasks / projectTotalTasks) * 100;

    return res.status(200).json({
      tasks,
      totalTasks: projectTotalTasks,
      filteredTotalTasks,
      totalPages,
      currentPage: pageNumber,
      limit: limitNumber,

      completedTasks,
      progress,
      pendingTask,
      inProgressTask,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  getAvailableProjectMembers,
  addProjectMember,
  removeProjectMembers,
  deleteProject,
  createTask,
  fetchAllTask,
};
