import { Router } from 'express';
import { authMiddleware, sellerMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   GET /api/v1/sellers
 * @desc    Get all sellers
 * @access  Public
 */
router.get('/', (req, res, next) => {
  // This would call a controller method for getting sellers
  res.status(200).json({
    success: true,
    message: 'Sellers endpoint',
    data: []
  });
});

/**
 * @route   GET /api/v1/sellers/me
 * @desc    Get current seller profile
 * @access  Seller only
 */
router.get('/me', authMiddleware, sellerMiddleware, (req, res, next) => {
  // This would call a controller method for getting seller profile
  res.status(200).json({
    success: true,
    message: 'Seller profile',
    data: {}
  });
});

export default router; 