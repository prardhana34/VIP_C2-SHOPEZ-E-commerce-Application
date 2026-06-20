const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

console.log({
  protect: typeof protect,
  admin: typeof admin,
  createProduct: typeof createProduct,
});

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;