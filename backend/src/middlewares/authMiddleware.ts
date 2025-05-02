import { Request, Response, NextFunction } from 'express';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { prisma } from '../index';
import { HttpError } from './errorHandler';
import { AuthRequest } from '../types/auth';
import { UserRole } from '../types/prisma';
import logger from '../utils/logger';

// Initialize Cognito service
const cognito = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
});

/**
 * Middleware to authenticate users using AWS Cognito
 * It extracts and validates the JWT token from the request headers
 * and adds the authenticated user to the request object
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpError('Authorization token is required', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new HttpError('Invalid authorization token format', 401);
    }

    try {
      // Verify the token with Cognito
      // We'll use the GetUser API which requires a valid access token
      const cognitoUser = await cognito.getUser({
        AccessToken: token,
      }).promise();

      // Find the user in our database using the Cognito sub (unique identifier)
      const cognitoSub = cognitoUser.UserAttributes.find(
        (attr) => attr.Name === 'sub'
      )?.Value;

      if (!cognitoSub) {
        throw new HttpError('Invalid user identity', 401);
      }

      // Get user from the database
      const user = await prisma.user.findUnique({
        where: { cognitoId: cognitoSub },
        include: {
          seller: true,
          customer: true,
        },
      });

      if (!user) {
        throw new HttpError('User not found in the system', 404);
      }

      // Add the user to the request object
      (req as AuthRequest).user = {
        id: user.id,
        email: user.email,
        cognitoId: user.cognitoId,
        role: user.role as unknown as UserRole,
        sellerId: user.seller?.id,
        customerId: user.customer?.id,
      };

      next();
    } catch (error) {
      // Handle Cognito errors
      if (error && typeof error === 'object' && 'code' in error && error.code === 'NotAuthorizedException') {
        throw new HttpError('Invalid or expired token', 401);
      }
      
      logger.error('Auth error:', error);
      throw new HttpError('Authentication failed', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if the user has admin role
 * Must be used after authMiddleware
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as AuthRequest).user;

  if (user.role !== 'ADMIN') {
    return next(new HttpError('Access denied. Admin role required', 403));
  }

  next();
};

/**
 * Middleware to check if the user has seller role
 * Must be used after authMiddleware
 */
export const sellerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as AuthRequest).user;

  if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
    return next(new HttpError('Access denied. Seller role required', 403));
  }

  if (user.role === 'SELLER' && !user.sellerId) {
    return next(new HttpError('Seller profile not found', 404));
  }

  next();
}; 