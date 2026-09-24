const User = require("../models/User");
const RefreshSession = require("../models/RefreshSession");
const PasswordResetToken = require("../models/PasswordResetToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendPasswordResetEmail = require("../services/emailService");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm Password must be same" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };
    const user = await User.create(newUser);
    return res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    const tokenId = crypto.randomBytes(32).toString("hex");

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await RefreshSession.create({
      user: user._id,
      tokenId,
      expiresAt: expiryDate,
    });

    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
        tokenId,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiryDate,
    });

    return res.status(200).json({
      message: "Login Successful",
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const { id, tokenId } = decoded;

    const session = await RefreshSession.findOne({
      user: id,
      tokenId,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh session",
      });
    }

    session.revoked = true;
    await session.save();

    const newTokenId = crypto.randomBytes(32).toString("hex");
    const newExpiryDate = new Date();
    newExpiryDate.setDate(newExpiryDate.getDate() + 7);
    await RefreshSession.create({
      user: id,
      tokenId: newTokenId,
      expiresAt: newExpiryDate,
    });

    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { id, tokenId: newTokenId },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: newExpiryDate,
    });

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return res.status(400).json({ message: "User not Found" });
    }
    return res.status(200).json({
      user: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        );
        const { id, tokenId } = decoded;
        await RefreshSession.findOneAndUpdate(
          {
            user: id,
            tokenId,
          },
          { revoked: true },
        );
      } catch (error) {}
    }
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a password reset link has been sent.",
      });
    }

    await PasswordResetToken.deleteMany({
      user: user._id,
      used: false,
    });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await PasswordResetToken.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({
      message: "If the email exists, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await PasswordResetToken.findOne({
      tokenHash,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!resetToken) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(resetToken.user, { password: hashedPassword });

    resetToken.used = true;
    await resetToken.save();

    await RefreshSession.updateMany(
      {
        user: resetToken.user,
        revoked: false,
      },
      {
        revoked: true,
      },
    );

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
};
