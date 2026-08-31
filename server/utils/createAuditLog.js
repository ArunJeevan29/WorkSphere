const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  actor,
  action,
  resource,
  resourceId,
  metadata,
  ipAddress,
}) => {
  const auditLog = await AuditLog.create({
    actor,
    action,
    resource,
    resourceId,
    metadata,
    ipAddress,
  });
  return auditLog;
};

module.exports = createAuditLog;
