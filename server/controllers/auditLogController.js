const AuditLog = require("../models/AuditLog");

const getAllLogs = async (req, res, next) => {
  try {
    const auditLogs = await AuditLog.find()
      .populate("actor", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ auditLogs });
  } catch (error) {
    next(error);
  }
};

const getAuditLogs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const auditLogs = await AuditLog.find({ resourceId: id })
      .populate("actor", "name email role")
      .sort({ createdAt: -1 });
    console.log(auditLogs);
    return res.status(200).json({ auditLogs });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllLogs, getAuditLogs };
