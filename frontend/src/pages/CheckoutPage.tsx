import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const totalPrice = cartItems.reduce((sum: number, item) => sum + (item.price * item.quantity), 0);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate processing order
    setTimeout(() => {
      clearCart();
      navigate('/order-success', { state: { orderId: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase() } });
    }, 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto py-8"
    >
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1 block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="mb-1 block text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="address" className="mb-1 block text-sm font-medium">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className="mb-1 block text-sm font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="mb-1 block text-sm font-medium">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="mb-1 block text-sm font-medium">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                    required
                  />
                </div>
              </div>
              
              <h2 className="mb-6 mt-8 text-xl font-semibold">Payment Information</h2>
              
              <div>
                <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">
                  Card Number
                </label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                  required
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="cardName" className="mb-1 block text-sm font-medium">
                  Name on Card
                </label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 p-2"
                  required
                />
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="expiryDate" className="mb-1 block text-sm font-medium">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                    required
                    placeholder="MM/YY"
                  />
                </div>
                
                <div>
                  <label htmlFor="cvv" className="mb-1 block text-sm font-medium">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="w-full rounded border border-gray-300 p-2"
                    required
                    placeholder="XXX"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="mt-8 w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:bg-blue-300"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center py-3">
                  <div className="h-16 w-16 flex-shrink-0 bg-gray-200"></div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-base font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Tax</span>
                <span>${(totalPrice * 0.075).toFixed(2)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
                <span>Total</span>
                <span>${(totalPrice + (totalPrice * 0.075)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage; 