import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { AuthRequest } from '../types/auth';

const router = Router();

/**
 * @route   POST /api/v1/auth/verify
 * @desc    Verify user token
 * @access  Private
 */
router.get('/verify', authMiddleware, (req: AuthRequest, res: Response) => {
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

export default router; 