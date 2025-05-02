"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("./errorHandler");
/**
 * Middleware to validate requests using express-validator
 * It checks for validation errors, formats them, and returns a 400 status code
 * if any errors are found
 */
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        return next();
    }
    // Format the validation errors
    const extractedErrors = {};
    errors.array().forEach((err) => {
        extractedErrors[err.param] = err.msg;
    });
    // Create a detailed error message
    const errorMessage = Object.entries(extractedErrors)
        .map(([field, message]) => `${field}: ${message}`)
        .join(', ');
    // Create an HTTP error with the formatted message
    const error = new errorHandler_1.HttpError(`Validation failed: ${errorMessage}`, 400);
    next(error);
};
exports.default = validateRequest;
//# sourceMappingURL=validateRequest.js.map