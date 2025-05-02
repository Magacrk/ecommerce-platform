import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to validate requests using express-validator
 * It checks for validation errors, formats them, and returns a 400 status code
 * if any errors are found
 */
declare const validateRequest: (req: Request, res: Response, next: NextFunction) => void;
export default validateRequest;
