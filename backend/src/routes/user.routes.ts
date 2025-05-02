import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   GET /api/v1/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, (req, res, next) => {
  // This would call a controller method for getting current user
  res.status(200).json({
    success: true,
    message: 'Current user profile',
    data: {}
  });
});

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Admin
 */
router.get('/', authMiddleware, adminMiddleware, (req, res, next) => {
  // This would call a controller method for getting all users
  res.status(200).json({
    success: true,
    message: 'All users',
    data: []
  });
});

export default router; 