"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', (req, res, next) => {
    // This would call a controller method for getting categories
    // For now, return a placeholder response
    res.status(200).json({
        success: true,
        message: 'Categories endpoint',
        data: []
    });
});
/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Admin only
 */
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, (req, res, next) => {
    // This would call a controller method for creating categories
    res.status(201).json({
        success: true,
        message: 'Category created',
        data: {}
    });
});
exports.default = router;
//# sourceMappingURL=category.routes.js.map