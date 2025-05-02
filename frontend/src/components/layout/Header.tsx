import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">MarketHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600">
              Home
            </Link>
            <Link to="/products" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600">
              Products
            </Link>
            {user?.attributes['custom:role'] === 'seller' && (
              <Link to="/seller/dashboard" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-primary-600">
                Seller Dashboard
              </Link>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart" className="relative p-1 text-gray-700 hover:text-primary-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-xs text-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleMenu}
                  className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                    {user.attributes.email.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                      {user.attributes['custom:role'] === 'seller' && (
                        <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seller Dashboard</Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  Sign in
                </Link>
                <Link to="/register" className="rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700">
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600"
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-600">
                Home
              </Link>
              <Link to="/products" className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-primary-600">
                Products
              </Link>
              {user?.attributes['custom:role'] === 'seller' && (
                <Link to="/seller/dashboard" className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-primary-600">
                  Seller Dashboard
                </Link>
              )}
              {!user && (
                <>
                  <Link to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-primary-600">
                    Sign in
                  </Link>
                  <Link to="/register" className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-primary-600">
                    Sign up
                  </Link>
                </>
              )}
              {user && (
                <button
                  onClick={handleSignOut}
                  className="w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-primary-600"
                >
                  Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 