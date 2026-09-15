const AuditLog = require("../models/AuditLog");
const User = require("../models/User");

const getAllLogs = async (req, res, next) => {
  try {
    const { search, action, page = 1, limit = 20 } = req.query;
    const actionGroups = {
      created: ["PROJECT_CREATED", "TASK_CREATED", "USER_CREATED"],

      updated: ["PROJECT_EDITED", "TASK_UPDATED", "USER_UPDATED"],

      deleted: ["PROJECT_DELETED", "TASK_DELETED", "USER_DELETED"],

      status_changed: ["TASK_STATUS_UPDATED", "USER_STATUS_UPDATED"],

      role_changed: ["USER_ROLE_UPDATED"],

      member_add_remove: ["PROJECT_MEMBERS_ADDED", "PROJECT_MEMBERS_REMOVED"],
    };
    const query = {};
    if (action && actionGroups[action]) {
      query.action = { $in: actionGroups[action] };
    }
    if (search) {
      // To find user by their name
      const users = await User.find({
        name: {
          $regex: search,
          $options: "i",
        },
      }).select("_id");
      const actorsId = users.map((user) => user._id);

      query.$or = [
        {
          action: {
            $regex: search,
            $options: "i",
          },
        },
        {
          resource: {
            $regex: search,
            $options: "i",
          },
        },
        {
          actor: { $in: actorsId },
        },
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const auditLogs = await AuditLog.find(query)
      .skip(skip)
      .limit(limitNumber)
      .populate("actor", "name email role")
      .sort({ createdAt: -1 });
    const filteredTotalPages = await AuditLog.countDocuments(query);
    const totalPages = Math.ceil(filteredTotalPages / limitNumber);
    return res.status(200).json({ auditLogs, totalPages });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { search, action, page = 1, limit = 10 } = req.query;
    const query = {
      project: id,
    };
    if (action) {
      query.action = action;
    }
    if (search) {
      query.$or = [
        {
          action: {
            $regex: search,
            $options: "i",
          },
        },
        {
          resource: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    const pageNumber = Number(page);
    const LimitNumber = Number(limit);
    const skip = (pageNumber - 1) * LimitNumber;

    const auditLogs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(LimitNumber)
      .populate("actor", "name email role");

    const filteredTotalAuditLogs = await AuditLog.countDocuments(query);
    const totalPages = Math.ceil(filteredTotalAuditLogs / LimitNumber);
    return res.status(200).json({ auditLogs, totalPages });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllLogs, getAuditLogs };
