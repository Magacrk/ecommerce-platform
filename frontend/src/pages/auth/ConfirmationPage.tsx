import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '@/contexts/AuthContext';

const ConfirmationPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { confirmSignUp } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get email from location state if available
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      setError('Email and confirmation code are required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await confirmSignUp(email, code);
      setSuccess('Account verified successfully!');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Your account has been verified. You can now log in.' } });
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
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
      className="container mx-auto max-w-md py-12"
    >
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Verify Your Account</h1>
        
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}
        
        <p className="mb-6 text-gray-600">
          Please enter the verification code sent to your email address.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="code" className="mb-2 block text-sm font-medium">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
              required
              placeholder="Enter your verification code"
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <div className="mb-2">
            Didn't receive a code?{' '}
            <button 
              onClick={() => confirmSignUp(email, 'resend')}
              className="text-blue-600 hover:underline"
              disabled={loading || !email}
            >
              Resend Code
            </button>
          </div>
          <div>
            Already verified?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmationPage; 