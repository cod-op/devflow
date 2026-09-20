import bcrypt from "bcryptjs";
import User from "../models/User.js";

const canManageUser = (req, userId) =>
  req.user.userId.toString() === userId.toString() || req.user.role === "Admin";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    if (!canManageUser(req, req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this user",
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (!canManageUser(req, req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this user",
      });
    }

    const allowedFields = ["name", "email"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = String(req.body[field]).trim();
      }
    }

    if (updates.name !== undefined && updates.name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (updates.email !== undefined) {
      updates.email = updates.email.toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }
    }

    if (req.body.password !== undefined) {
      const currentPassword = String(req.body.currentPassword || "");
      const currentUser = await User.findById(req.user.userId);
      if (!currentUser || !(await bcrypt.compare(currentPassword, currentUser.password))) {
        return res.status(401).json({ success: false, message: "Current password is incorrect" });
      }
      const password = String(req.body.password);
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters",
        });
      }
      updates.password = await bcrypt.hash(password, 12);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (!canManageUser(req, req.params.id)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this user",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
