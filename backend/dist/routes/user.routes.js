"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware_1.authMiddleware, (req, res, next) => {
    // This would call a controller method for getting current user
    res.status(200).json({
        success: true,
        message: 'Current user profile',
        data: {}
    });
});
/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Admin
 */
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res, next) => {
    // This would call a controller method for getting all users
    res.status(200).json({
        success: true,
        message: 'All users',
        data: []
    });
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map