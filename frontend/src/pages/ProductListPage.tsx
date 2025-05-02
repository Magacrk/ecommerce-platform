import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ProductListPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto"
    >
      <h1 className="mb-8 text-3xl font-bold">All Products</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="h-48 bg-gray-200 mb-4"></div>
            <h2 className="text-lg font-semibold">Product 1</h2>
            <p className="text-gray-600">$19.99</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="h-48 bg-gray-200 mb-4"></div>
            <h2 className="text-lg font-semibold">Product 2</h2>
            <p className="text-gray-600">$29.99</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="h-48 bg-gray-200 mb-4"></div>
            <h2 className="text-lg font-semibold">Product 3</h2>
            <p className="text-gray-600">$39.99</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductListPage; 