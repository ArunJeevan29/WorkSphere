const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token Provided" });
  }
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(401).json({ message: "User does not Exists" });
    }
    if (currentUser.status !== "active") {
      return res.status(403).json({ message: "User is not Active" });
    }
    req.user = {
      id: currentUser._id,
      role: currentUser.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = authMiddleware;
