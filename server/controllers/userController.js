const User = require("../models/User");
const createAuditLog = require("../utils/createAuditLog");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true },
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await createAuditLog({
      actor: req.user.id,
      action: "USER_ROLE_UPDATED",
      resource: "User",
      resourceId: user._id,
      metadata: {
        name: user.name,
        role: user.role,
      },
      ipAddress: req.ip,
    });

    return res
      .status(200)
      .json({ message: "Member Role Updated Successfully", user });
  } catch (error) {
    next(error);
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (req.user.id.toString() === id.toString() && status === "disabled") {
      return res
        .status(400)
        .json({ message: "You cannot disable your own account" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await createAuditLog({
      actor: req.user.id,
      action: "USER_STATUS_UPDATED",
      resource: "User",
      resourceId: user._id,
      metadata: {
        name: user.name,
        status: user.status,
      },
      ipAddress: req.ip,
    });

    return res
      .status(200)
      .json({ message: " User status updated successfully", user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUser, updateUserRole, updateUserStatus };
