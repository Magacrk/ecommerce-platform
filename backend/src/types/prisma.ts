/**
 * Custom types for Prisma queries to avoid importing from @prisma/client directly
 */

// Product filter type for query building
export interface ProductFilter {
  status?: string;
  stock?: { gt: number };
  OR?: Array<
    | { name?: { contains: string; mode: string } }
    | { description?: { contains: string; mode: string } }
  >;
  price?: { gte?: number; lte?: number };
  categoryId?: string;
}

// User roles - must match Prisma's UserRole exactly 
export enum UserRole {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  CUSTOMER = "CUSTOMER"
} 