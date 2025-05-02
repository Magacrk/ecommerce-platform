"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductTags = exports.addProductAttributes = exports.getProductsByCategory = exports.getProductsBySeller = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getFeaturedProducts = exports.getAllProducts = void 0;
const index_1 = require("../index");
const errorHandler_1 = require("../middlewares/errorHandler");
/**
 * Get all products with filtering, sorting, and pagination
 */
const getAllProducts = async (req, res, next) => {
    try {
        const { page = '1', limit = '10', sort = 'createdAt', order = 'desc', search = '', minPrice, maxPrice, category, } = req.query;
        // Convert query parameters
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Build filter object
        const filter = {
            status: 'ACTIVE',
            // Only include products with stock
            stock: {
                gt: 0,
            },
        };
        // Add search filter
        if (search) {
            filter.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        // Add price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.gte = parseFloat(minPrice);
            if (maxPrice)
                filter.price.lte = parseFloat(maxPrice);
        }
        // Add category filter
        if (category) {
            filter.categoryId = category;
        }
        // Get total count for pagination
        const totalProducts = await index_1.prisma.product.count({ where: filter });
        // Get products with filters, sorting, and pagination
        const products = await index_1.prisma.product.findMany({
            where: filter,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                discountPrice: true,
                stock: true,
                images: true,
                rating: true,
                reviewCount: true,
                featured: true,
                createdAt: true,
                seller: {
                    select: {
                        id: true,
                        storeName: true,
                        rating: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                tags: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                [sort]: order,
            },
            skip,
            take: limitNum,
        });
        // Calculate pagination info
        const totalPages = Math.ceil(totalProducts / limitNum);
        const hasMore = pageNum < totalPages;
        const nextPage = hasMore ? pageNum + 1 : null;
        const prevPage = pageNum > 1 ? pageNum - 1 : null;
        return res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                total: totalProducts,
                page: pageNum,
                totalPages,
                hasMore,
                nextPage,
                prevPage,
            },
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProducts = getAllProducts;
/**
 * Get featured products
 */
const getFeaturedProducts = async (req, res, next) => {
    try {
        const { limit = '8' } = req.query;
        const limitNum = parseInt(limit, 10);
        const featuredProducts = await index_1.prisma.product.findMany({
            where: {
                featured: true,
                status: 'ACTIVE',
                stock: {
                    gt: 0,
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                discountPrice: true,
                stock: true,
                images: true,
                rating: true,
                seller: {
                    select: {
                        id: true,
                        storeName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limitNum,
        });
        return res.status(200).json({
            success: true,
            count: featuredProducts.length,
            data: featuredProducts,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
/**
 * Get a product by ID
 */
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await index_1.prisma.product.findUnique({
            where: { id },
            include: {
                seller: {
                    select: {
                        id: true,
                        storeName: true,
                        rating: true,
                        logo: true,
                    },
                },
                category: true,
                attributes: true,
                tags: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 5,
                },
            },
        });
        if (!product) {
            throw new errorHandler_1.HttpError('Product not found', 404);
        }
        return res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductById = getProductById;
/**
 * Create a new product
 */
const createProduct = async (req, res, next) => {
    try {
        const sellerId = req.user.sellerId;
        const { name, description, price, discountPrice, stock, sku, images, categoryId, attributes = [], tags = [], } = req.body;
        // Create the product
        const product = await index_1.prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                discountPrice: discountPrice ? parseFloat(discountPrice) : null,
                stock: parseInt(stock, 10),
                sku,
                images: images || [],
                sellerId,
                categoryId,
                status: 'ACTIVE',
            },
        });
        // Add attributes if provided
        if (attributes.length > 0) {
            await index_1.prisma.productAttribute.createMany({
                data: attributes.map((attr) => ({
                    productId: product.id,
                    name: attr.name,
                    value: attr.value,
                })),
            });
        }
        // Add tags if provided
        if (tags.length > 0) {
            await index_1.prisma.productTag.createMany({
                data: tags.map((tag) => ({
                    productId: product.id,
                    name: tag,
                })),
            });
        }
        // Get the created product with related data
        const createdProduct = await index_1.prisma.product.findUnique({
            where: { id: product.id },
            include: {
                attributes: true,
                tags: true,
                category: true,
            },
        });
        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: createdProduct,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
/**
 * Update a product
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sellerId = req.user.sellerId;
        // Check if product exists and belongs to the seller
        const existingProduct = await index_1.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new errorHandler_1.HttpError('Product not found', 404);
        }
        if (existingProduct.sellerId !== sellerId) {
            throw new errorHandler_1.HttpError('You are not authorized to update this product', 403);
        }
        // Update the product
        const updatedProduct = await index_1.prisma.product.update({
            where: { id },
            data: req.body,
            include: {
                attributes: true,
                tags: true,
                category: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
/**
 * Delete a product
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sellerId = req.user.sellerId;
        // Check if product exists and belongs to the seller
        const existingProduct = await index_1.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new errorHandler_1.HttpError('Product not found', 404);
        }
        if (existingProduct.sellerId !== sellerId) {
            throw new errorHandler_1.HttpError('You are not authorized to delete this product', 403);
        }
        // Soft delete by changing status to DELETED
        await index_1.prisma.product.update({
            where: { id },
            data: { status: 'DELETED' },
        });
        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
/**
 * Get products by seller ID
 */
const getProductsBySeller = async (req, res, next) => {
    try {
        const { sellerId } = req.params;
        const { page = '1', limit = '10' } = req.query;
        // Convert query parameters
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Get products count
        const totalProducts = await index_1.prisma.product.count({
            where: {
                sellerId,
                status: 'ACTIVE',
            },
        });
        // Get products
        const products = await index_1.prisma.product.findMany({
            where: {
                sellerId,
                status: 'ACTIVE',
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limitNum,
        });
        // Pagination info
        const totalPages = Math.ceil(totalProducts / limitNum);
        const hasMore = pageNum < totalPages;
        return res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                total: totalProducts,
                page: pageNum,
                totalPages,
                hasMore,
            },
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductsBySeller = getProductsBySeller;
/**
 * Get products by category ID
 */
const getProductsByCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const { page = '1', limit = '10' } = req.query;
        // Convert query parameters
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        // Get products count
        const totalProducts = await index_1.prisma.product.count({
            where: {
                categoryId,
                status: 'ACTIVE',
                stock: {
                    gt: 0,
                },
            },
        });
        // Get products
        const products = await index_1.prisma.product.findMany({
            where: {
                categoryId,
                status: 'ACTIVE',
                stock: {
                    gt: 0,
                },
            },
            include: {
                seller: {
                    select: {
                        id: true,
                        storeName: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limitNum,
        });
        // Pagination info
        const totalPages = Math.ceil(totalProducts / limitNum);
        const hasMore = pageNum < totalPages;
        return res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                total: totalProducts,
                page: pageNum,
                totalPages,
                hasMore,
            },
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductsByCategory = getProductsByCategory;
/**
 * Add product attributes
 */
const addProductAttributes = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { attributes } = req.body;
        const sellerId = req.user.sellerId;
        // Check if product exists and belongs to the seller
        const existingProduct = await index_1.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new errorHandler_1.HttpError('Product not found', 404);
        }
        if (existingProduct.sellerId !== sellerId) {
            throw new errorHandler_1.HttpError('You are not authorized to update this product', 403);
        }
        // Delete existing attributes to avoid duplicates
        await index_1.prisma.productAttribute.deleteMany({
            where: { productId: id },
        });
        // Add new attributes
        await index_1.prisma.productAttribute.createMany({
            data: attributes.map((attr) => ({
                productId: id,
                name: attr.name,
                value: attr.value,
            })),
        });
        // Get updated product with attributes
        const updatedProduct = await index_1.prisma.product.findUnique({
            where: { id },
            include: {
                attributes: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Product attributes updated successfully',
            data: updatedProduct,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addProductAttributes = addProductAttributes;
/**
 * Add product tags
 */
const addProductTags = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { tags } = req.body;
        const sellerId = req.user.sellerId;
        // Check if product exists and belongs to the seller
        const existingProduct = await index_1.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new errorHandler_1.HttpError('Product not found', 404);
        }
        if (existingProduct.sellerId !== sellerId) {
            throw new errorHandler_1.HttpError('You are not authorized to update this product', 403);
        }
        // Delete existing tags to avoid duplicates
        await index_1.prisma.productTag.deleteMany({
            where: { productId: id },
        });
        // Add new tags
        await index_1.prisma.productTag.createMany({
            data: tags.map((tag) => ({
                productId: id,
                name: tag,
            })),
        });
        // Get updated product with tags
        const updatedProduct = await index_1.prisma.product.findUnique({
            where: { id },
            include: {
                tags: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: 'Product tags updated successfully',
            data: updatedProduct,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addProductTags = addProductTags;
//# sourceMappingURL=product.controller.js.map