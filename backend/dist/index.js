"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const client_1 = require("@prisma/client");
const http_1 = require("http");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const logger_1 = __importDefault(require("./utils/logger"));
// Initialize Express app
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Initialize Prisma client
exports.prisma = new client_1.PrismaClient();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Logging HTTP requests
app.use((0, morgan_1.default)('dev'));
// API routes
app.use('/api', routes_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// Error handler
app.use(errorHandler_1.default);
// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
// Handle unexpected errors
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    // In a production environment, you might want to gracefully shutdown
    // For now, we'll just log the error
});
// Graceful shutdown
const gracefulShutdown = () => {
    logger_1.default.info('Received shutdown signal, closing connections...');
    server.close(async () => {
        logger_1.default.info('HTTP server closed');
        try {
            await exports.prisma.$disconnect();
            logger_1.default.info('Database connections closed');
            process.exit(0);
        }
        catch (err) {
            logger_1.default.error('Error during shutdown:', err);
            process.exit(1);
        }
    });
    // Force shutdown after 10 seconds if graceful shutdown fails
    setTimeout(() => {
        logger_1.default.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 10000);
};
// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
exports.default = server;
//# sourceMappingURL=index.js.map