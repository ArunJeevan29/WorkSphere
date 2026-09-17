const User = require("../models/User");
const Task = require("../models/Task");
const Project = require("../models/Project");
const AuditLog = require("../models/AuditLog");

const fetchAdminDashboardAnalytics = async (req, res, next) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $eq: ["$status", "active"] }, 1, 0],
            },
          },
          disabledUsers: {
            $sum: {
              $cond: [{ $eq: ["$status", "disabled"] }, 1, 0],
            },
          },
          managers: {
            $sum: {
              $cond: [{ $eq: ["$role", "manager"] }, 1, 0],
            },
          },
          members: {
            $sum: {
              $cond: [{ $eq: ["$role", "member"] }, 1, 0],
            },
          },
        },
      },
    ]);
    const userData = userStats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      disabledUsers: 0,
      managers: 0,
      members: 0,
    };

    const taskStats = await Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          pendingTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          inProgressTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0],
            },
          },
          completedTasks: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
        },
      },
    ]);
    const taskData = taskStats[0] || {
      totalTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
    };
    const totalProjects = await Project.countDocuments();
    const completionRate =
      taskData.totalTasks === 0
        ? 0
        : (taskData.completedTasks / taskData.totalTasks) * 100;

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("actor", "name email role");

    return res.status(200).json({
      userStats: userData,
      totalProjects,
      taskStats: taskData,
      completionRate,
      recentProjects,
      recentActivity,
    });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  fetchAdminDashboardAnalytics,

};
