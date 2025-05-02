import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth';
/**
 * Get all products with filtering, sorting, and pagination
 */
export declare const getAllProducts: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get featured products
 */
export declare const getFeaturedProducts: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get a product by ID
 */
export declare const getProductById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Create a new product
 */
export declare const createProduct: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Update a product
 */
export declare const updateProduct: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Delete a product
 */
export declare const deleteProduct: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get products by seller ID
 */
export declare const getProductsBySeller: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Get products by category ID
 */
export declare const getProductsByCategory: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Add product attributes
 */
export declare const addProductAttributes: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
/**
 * Add product tags
 */
export declare const addProductTags: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
