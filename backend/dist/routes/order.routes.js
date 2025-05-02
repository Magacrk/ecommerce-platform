"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/orders
 * @desc    Get user orders
 * @access  Private
 */
router.get('/', authMiddleware_1.authMiddleware, (req, res, next) => {
    // This would call a controller method for getting user orders
    res.status(200).json({
        success: true,
        message: 'User orders',
        data: []
    });
});
/**
 * @route   POST /api/v1/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', authMiddleware_1.authMiddleware, (req, res, next) => {
    // This would call a controller method for creating an order
    res.status(201).json({
        success: true,
        message: 'Order created',
        data: {}
    });
});
exports.default = router;
//# sourceMappingURL=order.routes.js.map