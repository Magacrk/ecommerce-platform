"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/cart
 * @desc    Get user's cart
 * @access  Private
 */
router.get('/', authMiddleware_1.authMiddleware, (req, res, next) => {
    // This would call a controller method for getting user's cart
    res.status(200).json({
        success: true,
        message: 'User cart',
        data: []
    });
});
/**
 * @route   POST /api/v1/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/', authMiddleware_1.authMiddleware, (req, res, next) => {
    // This would call a controller method for adding item to cart
    res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: {}
    });
});
exports.default = router;
//# sourceMappingURL=cart.routes.js.map