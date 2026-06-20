// middleware/adminMiddleware.js

const admin = (req, res, next) => {
    try {
        // Check if user exists (must be set by auth middleware)
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized: User not found"
            });
        }

        // Check admin role
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Admin Access Only"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: "Server error in admin middleware",
            error: error.message
        });
    }
};

module.exports =  admin ;