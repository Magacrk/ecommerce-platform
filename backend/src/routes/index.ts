import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import userRoutes from './user.routes';
import sellerRoutes from './seller.routes';
import orderRoutes from './order.routes';
import cartRoutes from './cart.routes';
import reviewRoutes from './review.routes';
import paymentRoutes from './payment.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
  });
});

// API versioning (future-proofing)
const v1Router = Router();

// Register all API routes
v1Router.use('/auth', authRoutes);
v1Router.use('/products', productRoutes);
v1Router.use('/categories', categoryRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/sellers', sellerRoutes);
v1Router.use('/orders', orderRoutes);
v1Router.use('/cart', cartRoutes);
v1Router.use('/reviews', reviewRoutes);
v1Router.use('/payments', paymentRoutes);
v1Router.use('/uploads', uploadRoutes);

// Use v1 router
router.use('/v1', v1Router);

export default router; 