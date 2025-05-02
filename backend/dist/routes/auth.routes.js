"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/v1/auth/verify
 * @desc    Verify user token
 * @access  Private
 */
router.get('/verify', authMiddleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Token is valid',
        user: req.user,
    });
});
/**
 * Note: Most auth functionality is handled by AWS Cognito directly
 * from the frontend. These routes are for special backend auth operations.
 */
exports.default = router;
//# sourceMappingURL=auth.routes.js.map