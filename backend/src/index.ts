import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import logger from './utils/logger';

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Prisma client
export const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging HTTP requests
app.use(morgan('dev'));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unexpected errors
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  // In a production environment, you might want to gracefully shutdown
  // For now, we'll just log the error
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing connections...');
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await prisma.$disconnect();
      logger.info('Database connections closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
  
  // Force shutdown after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export default server; 