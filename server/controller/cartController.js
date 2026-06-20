const Cart = require("../model/cartModel");

// GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("products.product");
    res.json(cart || { products: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
    }

    const itemIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
};

// UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, action } = req.body; // action: "inc" | "dec"

    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (action === "inc") item.quantity += 1;
    if (action === "dec" && item.quantity > 1) item.quantity -= 1;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error updating quantity" });
  }
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
};