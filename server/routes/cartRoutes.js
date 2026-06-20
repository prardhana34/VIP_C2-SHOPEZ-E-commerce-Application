const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} = require("../controller/cartController");

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateQuantity);
router.delete("/remove", protect, removeFromCart);

module.exports = router;