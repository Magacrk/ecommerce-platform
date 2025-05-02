"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/reviews/product/:productId
 * @desc    Get reviews for a product
 * @access  Public
 */
router.get('/product/:productId', (req, res, next) => {
    // This would call a controller method for getting product reviews
    res.status(200).json({
        success: true,
        message: 'Product reviews',
        data: []
    });
});
/**
 * @route   POST /api/v1/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', authMiddleware_1.authMiddleware, (req, res, next) => {
    // This would call a controller method for creating a review
    res.status(201).json({
        success: true,
        message: 'Review created',
        data: {}
    });
});
exports.default = router;
//# sourceMappingURL=review.routes.js.map