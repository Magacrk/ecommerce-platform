import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError } from './errorHandler';

/**
 * Middleware to validate requests using express-validator
 * It checks for validation errors, formats them, and returns a 400 status code
 * if any errors are found
 */
const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  // Format the validation errors
  const extractedErrors: { [key: string]: string } = {};
  errors.array().forEach((err: any) => {
    // Access properties using any type to bypass type checking
    extractedErrors[err.param || 'unknown'] = err.msg || 'Invalid value';
  });

  // Create a detailed error message
  const errorMessage = Object.entries(extractedErrors)
    .map(([field, message]) => `${field}: ${message}`)
    .join(', ');

  // Create an HTTP error with the formatted message
  const error = new HttpError(`Validation failed: ${errorMessage}`, 400);
  next(error);
};

export default validateRequest; 