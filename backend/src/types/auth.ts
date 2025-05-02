import { Request } from 'express';
import { UserRole } from './prisma';

/**
 * Authenticated user data that will be attached to the request
 */
export interface AuthUser {
  id: string;
  email: string;
  cognitoId: string;
  role: UserRole;
  sellerId?: string;
  customerId?: string;
}

/**
 * Extended Express Request interface with authenticated user
 * Note: No need to explicitly declare params and body as they are
 * already in the Request interface from express
 */
export interface AuthRequest extends Request {
  user: AuthUser;
} 