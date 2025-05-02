"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
const library_1 = require("@prisma/client/runtime/library");
const logger_1 = __importDefault(require("../utils/logger"));
// Define HTTP error class
class HttpError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
// Custom error handler middleware
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    // Log the error
    logger_1.default.error(`${err.message} ${err.stack || ''}`);
    // Handle specific error types
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    // Handle Prisma errors
    if (err instanceof library_1.PrismaClientKnownRequestError) {
        // P2002 is a unique constraint violation
        if (err.code === 'P2002') {
            const field = err.meta?.target;
            return res.status(409).json({
                success: false,
                message: `A record with this ${field.join(', ')} already exists.`,
            });
        }
        // P2025 is a not found error
        if (err.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Record not found.',
            });
        }
    }
    // For validation errors (express-validator)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.message,
        });
    }
    // Authentication errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token, please login again',
        });
    }
    // Handle other errors as 500 internal server error
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong on the server'
            : err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map