"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const productController = __importStar(require("../controllers/product.controller"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validateRequest_1 = __importDefault(require("../middlewares/validateRequest"));
const router = (0, express_1.Router)();
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
router.post('/', authMiddleware_1.authMiddleware, authMiddleware_1.sellerMiddleware, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Product name is required'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Product description is required'),
    (0, express_validator_1.body)('price').isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('categoryId').notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
], validateRequest_1.default, productController.createProduct);
/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update a product
 * @access  Private (Seller only)
 */
router.put('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.sellerMiddleware, [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    (0, express_validator_1.body)('price').optional().isNumeric().withMessage('Price must be a number'),
    (0, express_validator_1.body)('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
], validateRequest_1.default, productController.updateProduct);
/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete a product
 * @access  Private (Seller only)
 */
router.delete('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.sellerMiddleware, productController.deleteProduct);
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
router.post('/:id/attributes', authMiddleware_1.authMiddleware, authMiddleware_1.sellerMiddleware, [
    (0, express_validator_1.body)('attributes').isArray().withMessage('Attributes must be an array'),
    (0, express_validator_1.body)('attributes.*.name').notEmpty().withMessage('Attribute name is required'),
    (0, express_validator_1.body)('attributes.*.value').notEmpty().withMessage('Attribute value is required'),
], validateRequest_1.default, productController.addProductAttributes);
/**
 * @route   POST /api/v1/products/:id/tags
 * @desc    Add product tags
 * @access  Private (Seller only)
 */
router.post('/:id/tags', authMiddleware_1.authMiddleware, authMiddleware_1.sellerMiddleware, [
    (0, express_validator_1.body)('tags').isArray().withMessage('Tags must be an array'),
    (0, express_validator_1.body)('tags.*').notEmpty().withMessage('Tag name is required'),
], validateRequest_1.default, productController.addProductTags);
exports.default = router;
//# sourceMappingURL=product.routes.js.map