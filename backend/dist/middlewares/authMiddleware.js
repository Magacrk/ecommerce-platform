"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sellerMiddleware = exports.adminMiddleware = exports.authMiddleware = void 0;
const aws_sdk_1 = require("aws-sdk");
const index_1 = require("../index");
const errorHandler_1 = require("./errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
// Initialize Cognito service
const cognito = new aws_sdk_1.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION,
});
/**
 * Middleware to authenticate users using AWS Cognito
 * It extracts and validates the JWT token from the request headers
 * and adds the authenticated user to the request object
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errorHandler_1.HttpError('Authorization token is required', 401);
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new errorHandler_1.HttpError('Invalid authorization token format', 401);
        }
        try {
            // Verify the token with Cognito
            // We'll use the GetUser API which requires a valid access token
            const cognitoUser = await cognito.getUser({
                AccessToken: token,
            }).promise();
            // Find the user in our database using the Cognito sub (unique identifier)
            const cognitoSub = cognitoUser.UserAttributes.find((attr) => attr.Name === 'sub')?.Value;
            if (!cognitoSub) {
                throw new errorHandler_1.HttpError('Invalid user identity', 401);
            }
            // Get user from the database
            const user = await index_1.prisma.user.findUnique({
                where: { cognitoId: cognitoSub },
                include: {
                    seller: true,
                    customer: true,
                },
            });
            if (!user) {
                throw new errorHandler_1.HttpError('User not found in the system', 404);
            }
            // Add the user to the request object
            req.user = {
                id: user.id,
                email: user.email,
                cognitoId: user.cognitoId,
                role: user.role,
                sellerId: user.seller?.id,
                customerId: user.customer?.id,
            };
            next();
        }
        catch (error) {
            // Handle Cognito errors
            if (error.code === 'NotAuthorizedException') {
                throw new errorHandler_1.HttpError('Invalid or expired token', 401);
            }
            logger_1.default.error('Auth error:', error);
            throw new errorHandler_1.HttpError('Authentication failed', 401);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Middleware to check if the user has admin role
 * Must be used after authMiddleware
 */
const adminMiddleware = (req, res, next) => {
    const user = req.user;
    if (user.role !== 'ADMIN') {
        return next(new errorHandler_1.HttpError('Access denied. Admin role required', 403));
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
/**
 * Middleware to check if the user has seller role
 * Must be used after authMiddleware
 */
const sellerMiddleware = (req, res, next) => {
    const user = req.user;
    if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
        return next(new errorHandler_1.HttpError('Access denied. Seller role required', 403));
    }
    if (user.role === 'SELLER' && !user.sellerId) {
        return next(new errorHandler_1.HttpError('Seller profile not found', 404));
    }
    next();
};
exports.sellerMiddleware = sellerMiddleware;
//# sourceMappingURL=authMiddleware.js.map