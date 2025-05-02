import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext, CartItem } from '@/contexts/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  
  const totalPrice = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto text-center py-12"
      >
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty</p>
        <Link 
          to="/products"
          className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto"
    >
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="flex p-4">
                  <div className="h-24 w-24 flex-shrink-0 bg-gray-200"></div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <h2 className="text-lg font-medium">{item.name}</h2>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button 
                          className="px-3 py-1 border-r"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          className="px-3 py-1 border-l"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
          <div className="mb-4 flex justify-between">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="mb-4 flex justify-between">
            <span>Shipping</span>
            <span>$0.00</span>
          </div>
          <div className="mb-4 border-t border-gray-200 pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="block w-full rounded bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage; 