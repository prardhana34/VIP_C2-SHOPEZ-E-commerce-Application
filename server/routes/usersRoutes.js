const express = require("express");
const router = express.Router();

// ✅ FIX PATH (IMPORTANT)
const User = require("../model/User");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// GET ALL USERS (ADMIN ONLY)
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;