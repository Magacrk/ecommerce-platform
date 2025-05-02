import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '@/contexts/AuthContext';

const SellerRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    phoneNumber: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        'custom:role': 'seller',
        'custom:storeName': formData.storeName,
        'custom:phoneNumber': formData.phoneNumber,
        'custom:address': formData.address,
      });
      
      navigate('/login', { 
        state: { 
          message: 'Seller registration successful! Please check your email to verify your account. Once verified, you can login to access your seller dashboard.' 
        } 
      });
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto max-w-2xl py-12"
    >
      <Helmet>
        <title>Become a Seller - MarketHub</title>
        <meta name="description" content="Register as a seller on MarketHub and start selling your products" />
      </Helmet>
      
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">Become a Seller</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                  minLength={8}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Store Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="storeName" className="mb-2 block text-sm font-medium">
                  Store Name
                </label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="mb-2 block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="mb-2 block text-sm font-medium">
                  Business Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="mb-4 text-sm text-gray-600">
              By creating an account, you agree to our <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            </p>
            
            <button
              type="submit"
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Seller Account'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm">
          Already have a seller account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerRegisterPage; 