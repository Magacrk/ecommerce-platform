import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy-loaded components for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const ProductListPage = lazy(() => import('@/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const SellerRegisterPage = lazy(() => import('@/pages/auth/SellerRegisterPage'));
const SellerDashboardPage = lazy(() => import('@/pages/seller/DashboardPage'));
const SellerProductsPage = lazy(() => import('@/pages/seller/ProductsPage'));
const SellerOrdersPage = lazy(() => import('@/pages/seller/OrdersPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Suspense fallback={<div className="flex h-96 items-center justify-center"><LoadingSpinner /></div>}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductListPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/seller/register" element={<SellerRegisterPage />} />
                  <Route path="/seller" element={
                    <ProtectedRoute roles={['seller']}>
                      <Navigate to="/seller/dashboard" replace />
                    </ProtectedRoute>
                  } />
                  <Route path="/seller/dashboard" element={
                    <ProtectedRoute roles={['seller']}>
                      <SellerDashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/seller/products" element={
                    <ProtectedRoute roles={['seller']}>
                      <SellerProductsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/seller/orders" element={
                    <ProtectedRoute roles={['seller']}>
                      <SellerOrdersPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App; 