const Order = require("../model/Order");
const Cart = require("../model/cartModel");

// 🛒 PLACE ORDER
const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId })
            .populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalPrice = 0;

        cart.products.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        const order = await Order.create({
            user: userId,
            products: cart.products,
            totalPrice,
            status: "Pending"
        });

        // Clear cart after placing order
        cart.products = [];
        await cart.save();

        res.json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// 📦 USER ORDERS
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).populate("products.product");

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// 🔥 ADMIN ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("products.product");

        res.json(orders);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// 🚚 UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = req.body.status;

        await order.save();

        res.json({
            message: "Order status updated",
            order
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// 📤 EXPORTS
module.exports = {
    placeOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
};