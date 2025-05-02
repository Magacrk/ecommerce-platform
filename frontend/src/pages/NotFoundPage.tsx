import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto text-center py-20"
    >
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-8">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-block rounded bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </motion.div>
  );
};

export default NotFoundPage; 