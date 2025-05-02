import { Router } from 'express';
import { body } from 'express-validator';
import * as productController from '../controllers/product.controller';
import { authMiddleware, sellerMiddleware } from '../middlewares/authMiddleware';
import validateRequest from '../middlewares/validateRequest';

const router = Router();

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with filtering, sorting, and pagination
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET /api/v1/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get a product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private (Seller only)
 */
router.post(
  '/',
  authMiddleware,
  sellerMiddleware,
  [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Product description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('categoryId').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  ],
  validateRequest,
  productController.createProduct
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update a product
 * @access  Private (Seller only)
 */
router.put(
  '/:id',
  authMiddleware,
  sellerMiddleware,
  [
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
  ],
  validateRequest,
  productController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete a product
 * @access  Private (Seller only)
 */
router.delete(
  '/:id',
  authMiddleware,
  sellerMiddleware,
  productController.deleteProduct
);

/**
 * @route   GET /api/v1/products/seller/:sellerId
 * @desc    Get products by seller ID
 * @access  Public
 */
router.get('/seller/:sellerId', productController.getProductsBySeller);

/**
 * @route   GET /api/v1/products/category/:categoryId
 * @desc    Get products by category ID
 * @access  Public
 */
router.get('/category/:categoryId', productController.getProductsByCategory);

/**
 * @route   POST /api/v1/products/:id/attributes
 * @desc    Add product attributes
 * @access  Private (Seller only)
 */
router.post(
  '/:id/attributes',
  authMiddleware,
  sellerMiddleware,
  [
    body('attributes').isArray().withMessage('Attributes must be an array'),
    body('attributes.*.name').notEmpty().withMessage('Attribute name is required'),
    body('attributes.*.value').notEmpty().withMessage('Attribute value is required'),
  ],
  validateRequest,
  productController.addProductAttributes
);

/**
 * @route   POST /api/v1/products/:id/tags
 * @desc    Add product tags
 * @access  Private (Seller only)
 */
router.post(
  '/:id/tags',
  authMiddleware,
  sellerMiddleware,
  [
    body('tags').isArray().withMessage('Tags must be an array'),
    body('tags.*').notEmpty().withMessage('Tag name is required'),
  ],
  validateRequest,
  productController.addProductTags
);

export default router; 