"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/v1/payments/create-payment-intent
 * @desc    Create a Stripe payment intent
 * @access  Private
 */
router.post('/create-payment-intent', authMiddleware_1.authMiddleware, (req, res, next) => {
    // This would call a controller method for creating a payment intent
    res.status(200).json({
        success: true,
        message: 'Payment intent created',
        data: {
            clientSecret: 'test_client_secret'
        }
    });
});
/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Handle Stripe webhook events
 * @access  Public (but verified by Stripe signature)
 */
router.post('/webhook', (req, res, next) => {
    // This would call a controller method for handling webhook events
    res.status(200).json({
        success: true,
        message: 'Webhook received'
    });
});
exports.default = router;
//# sourceMappingURL=payment.routes.js.map