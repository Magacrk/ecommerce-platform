/**
 * Custom types for Prisma queries to avoid importing from @prisma/client directly
 */
export interface ProductFilter {
    status?: string;
    stock?: {
        gt: number;
    };
    OR?: Array<{
        name?: {
            contains: string;
            mode: string;
        };
    } | {
        description?: {
            contains: string;
            mode: string;
        };
    }>;
    price?: {
        gte?: number;
        lte?: number;
    };
    categoryId?: string;
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    SELLER = "SELLER",
    CUSTOMER = "CUSTOMER"
}
