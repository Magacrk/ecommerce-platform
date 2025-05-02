import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', (req, res, next) => {
  // This would call a controller method for getting categories
  // For now, return a placeholder response
  res.status(200).json({
    success: true,
    message: 'Categories endpoint',
    data: []
  });
});

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Admin only
 */
router.post('/', authMiddleware, adminMiddleware, (req, res, next) => {
  // This would call a controller method for creating categories
  res.status(201).json({
    success: true,
    message: 'Category created',
    data: {}
  });
});

export default router; 