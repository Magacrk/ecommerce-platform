import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined, import("@prisma/client/runtime").DefaultArgs>;
export default server;
