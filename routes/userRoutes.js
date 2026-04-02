import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── @route  PUT /api/users/profile
// ── @desc   Update own profile
// ── @access Private
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phone = req.body.phone || user.phone;

    // Only update password if provided
    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error updating profile" });
  }
});

// ── @route  GET /api/users
// ── @desc   Get all users (admin)
// ── @access Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// ── @route  PUT /api/users/:id/toggle
// ── @desc   Activate or deactivate a user (admin)
// ── @access Private/Admin
router.put("/:id/toggle", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error toggling user status" });
  }
});

export default router;
