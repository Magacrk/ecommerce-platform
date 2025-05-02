import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../index';
import { HttpError } from '../middlewares/errorHandler';
import { AuthRequest } from '../types/auth';
import { ProductFilter } from '../types/prisma';
import { Prisma } from '@prisma/client';

/**
 * Get all products with filtering, sorting, and pagination
 */
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'createdAt',
      order = 'desc',
      search = '',
      minPrice,
      maxPrice,
      category,
    } = req.query;

    // Convert query parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {
      status: 'ACTIVE',
      // Only include products with stock
      stock: {
        gt: 0,
      },
    };

    // Add search filter
    if (search) {
      filter.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.lte = parseFloat(maxPrice as string);
    }

    // Add category filter
    if (category) {
      filter.categoryId = category as string;
    }

    // Get total count for pagination
    const totalProducts = await prisma.product.count({ where: filter });

    // Get products with filters, sorting, and pagination
    const products = await prisma.product.findMany({
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
        [sort as string]: order,
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
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { limit = '8' } = req.query;
    const limitNum = parseInt(limit as string, 10);

    const featuredProducts = await prisma.product.findMany({
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
  } catch (error) {
    next(error);
  }
};

/**
 * Get a product by ID
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
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
      throw new HttpError('Product not found', 404);
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 */
export const createProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sellerId = req.user.sellerId;
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      sku,
      images,
      categoryId,
      attributes = [],
      tags = [],
    } = req.body;

    // Create the product
    const product = await prisma.product.create({
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
      await prisma.productAttribute.createMany({
        data: attributes.map((attr: { name: string; value: string }) => ({
          productId: product.id,
          name: attr.name,
          value: attr.value,
        })),
      });
    }

    // Add tags if provided
    if (tags.length > 0) {
      await prisma.productTag.createMany({
        data: tags.map((tag: string) => ({
          productId: product.id,
          name: tag,
        })),
      });
    }

    // Get the created product with related data
    const createdProduct = await prisma.product.findUnique({
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
  } catch (error) {
    next(error);
  }
};

/**
 * Update a product
 */
export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.sellerId;

    // Check if product exists and belongs to the seller
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new HttpError('Product not found', 404);
    }

    if (existingProduct.sellerId !== sellerId) {
      throw new HttpError('You are not authorized to update this product', 403);
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
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
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.sellerId;

    // Check if product exists and belongs to the seller
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new HttpError('Product not found', 404);
    }

    if (existingProduct.sellerId !== sellerId) {
      throw new HttpError('You are not authorized to delete this product', 403);
    }

    // Soft delete by changing status to DELETED
    await prisma.product.update({
      where: { id },
      data: { status: 'DELETED' },
    });

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get products by seller ID
 */
export const getProductsBySeller = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sellerId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    // Convert query parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get products count
    const totalProducts = await prisma.product.count({
      where: {
        sellerId,
        status: 'ACTIVE',
      },
    });

    // Get products
    const products = await prisma.product.findMany({
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
  } catch (error) {
    next(error);
  }
};

/**
 * Get products by category ID
 */
export const getProductsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    // Convert query parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Get products count
    const totalProducts = await prisma.product.count({
      where: {
        categoryId,
        status: 'ACTIVE',
        stock: {
          gt: 0,
        },
      },
    });

    // Get products
    const products = await prisma.product.findMany({
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
  } catch (error) {
    next(error);
  }
};

/**
 * Add product attributes
 */
export const addProductAttributes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { attributes } = req.body;
    const sellerId = req.user.sellerId;

    // Check if product exists and belongs to the seller
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new HttpError('Product not found', 404);
    }

    if (existingProduct.sellerId !== sellerId) {
      throw new HttpError('You are not authorized to update this product', 403);
    }

    // Delete existing attributes to avoid duplicates
    await prisma.productAttribute.deleteMany({
      where: { productId: id },
    });

    // Add new attributes
    await prisma.productAttribute.createMany({
      data: attributes.map((attr: { name: string; value: string }) => ({
        productId: id,
        name: attr.name,
        value: attr.value,
      })),
    });

    // Get updated product with attributes
    const updatedProduct = await prisma.product.findUnique({
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
  } catch (error) {
    next(error);
  }
};

/**
 * Add product tags
 */
export const addProductTags = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    const sellerId = req.user.sellerId;

    // Check if product exists and belongs to the seller
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new HttpError('Product not found', 404);
    }

    if (existingProduct.sellerId !== sellerId) {
      throw new HttpError('You are not authorized to update this product', 403);
    }

    // Delete existing tags to avoid duplicates
    await prisma.productTag.deleteMany({
      where: { productId: id },
    });

    // Add new tags
    await prisma.productTag.createMany({
      data: tags.map((tag: string) => ({
        productId: id,
        name: tag,
      })),
    });

    // Get updated product with tags
    const updatedProduct = await prisma.product.findUnique({
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
  } catch (error) {
    next(error);
  }
}; 