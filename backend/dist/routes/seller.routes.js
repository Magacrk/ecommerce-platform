"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/sellers
 * @desc    Get all sellers
 * @access  Public
 */
router.get('/', (req, res, next) => {
    // This would call a controller method for getting sellers
    res.status(200).json({
        success: true,
        message: 'Sellers endpoint',
        data: []
    });
});
/**
 * @route   GET /api/v1/sellers/me
 * @desc    Get current seller profile
 * @access  Seller only
 */
router.get('/me', authMiddleware_1.authMiddleware, authMiddleware_1.sellerMiddleware, (req, res, next) => {
    // This would call a controller method for getting seller profile
    res.status(200).json({
        success: true,
        message: 'Seller profile',
        data: {}
    });
});
exports.default = router;
//# sourceMappingURL=seller.routes.js.map