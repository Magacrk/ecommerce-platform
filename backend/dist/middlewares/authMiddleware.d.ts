import { Request, Response, NextFunction } from 'express';
/**
 * Middleware to authenticate users using AWS Cognito
 * It extracts and validates the JWT token from the request headers
 * and adds the authenticated user to the request object
 */
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware to check if the user has admin role
 * Must be used after authMiddleware
 */
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to check if the user has seller role
 * Must be used after authMiddleware
 */
export declare const sellerMiddleware: (req: Request, res: Response, next: NextFunction) => void;
