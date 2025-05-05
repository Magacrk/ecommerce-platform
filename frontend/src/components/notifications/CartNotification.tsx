import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '@/contexts/CartContext';

interface CartNotificationProps {
  item: CartItem | null;
  isVisible: boolean;
  onClose: () => void;
}

const CartNotification = ({ item, isVisible, onClose }: CartNotificationProps) => {
  const [progress, setProgress] = useState(100);
  
  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (isVisible) {
      setProgress(100);
      
      // Reset progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1.25; // 100% / (4 seconds * 20 fps)
        });
      }, 50);
      
      // Clean up
      return () => clearInterval(interval);
    }
  }, [isVisible, onClose]);
  
  return (
    <AnimatePresence>
      {isVisible && item && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed left-1/2 top-6 z-50 w-full max-w-md transform rounded-lg bg-white shadow-lg"
        >
          <div className="p-4">
            <div className="flex items-start">
              {/* Product image */}
              <div className="mr-3 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="h-16 w-16 rounded-md object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Added to Cart</h3>
                  
                  {/* Close button */}
                  <button
                    type="button"
                    className="ml-4 inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="mt-1 text-sm text-gray-600">{item.name}</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={onClose}
              >
                Continue Shopping
              </button>
              
              <Link
                to="/cart"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={onClose}
              >
                View Cart
              </Link>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 w-full overflow-hidden rounded-b-lg bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification; 