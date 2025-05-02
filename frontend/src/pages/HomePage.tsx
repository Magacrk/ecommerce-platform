import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mock data for featured products (would come from API in real app)
const mockFeaturedProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    sellerId: 'seller1',
    sellerName: 'AudioTech Inc.',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Ultra-Slim Laptop',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    sellerId: 'seller2',
    sellerName: 'TechGadgets',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Eco-Friendly Water Bottle',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    sellerId: 'seller3',
    sellerName: 'EcoLiving',
    rating: 4.2,
  },
  {
    id: '4',
    name: 'Artisan Coffee Maker',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29mZmVlJTIwbWFrZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    sellerId: 'seller4',
    sellerName: 'BrewMasters',
    rating: 4.6,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<typeof mockFeaturedProducts>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  // Simulate fetching data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In real app, this would be an API call
        // const response = await api.getFeaturedProducts();
        // setFeaturedProducts(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setFeaturedProducts(mockFeaturedProducts);
          setIsLoading(false);
        }, 800); // Simulate network delay
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: typeof mockFeaturedProducts[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    });
  };

  return (
    <>
      <Helmet>
        <title>MarketHub - Multi-Vendor Marketplace</title>
        <meta name="description" content="Discover unique products from independent sellers on our multi-vendor marketplace." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
              >
                <span className="block">Shop the best from</span>
                <span className="block text-primary-600">independent sellers</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 max-w-md text-lg text-gray-500"
              >
                Discover unique products from sellers around the world. Support small businesses and find your next favorite item.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex gap-4"
              >
                <Link to="/products" className="btn btn-primary px-6 py-3">
                  Shop Now
                </Link>
                <Link to="/seller/register" className="btn btn-outline px-6 py-3">
                  Become a Seller
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center"
            >
              <img
                src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNob3BwaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                alt="Shopping"
                className="rounded-lg object-cover shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Featured Products</h2>
          <p className="mx-auto mt-4 max-w-md text-base text-gray-500">
            Hand-picked selection of top products from our best sellers
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <Link to={`/products/${product.id}`} className="block overflow-hidden">
                  <div className="aspect-h-1 aspect-w-1 h-64 w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/products/${product.id}`} className="block">
                    <h3 className="mb-1 text-lg font-semibold text-gray-900">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500">by {product.sellerName}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <div className="flex items-center">
                      <span className="mr-1 text-sm text-gray-600">{product.rating}</span>
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 w-full rounded-md bg-primary-600 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            View All Products
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
            <p className="mx-auto mt-4 max-w-md text-base text-gray-500">
              Browse our wide selection of categories to find what you're looking for
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {['Electronics', 'Clothing', 'Home', 'Beauty', 'Books', 'Sports'].map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex flex-col items-center"
              >
                <Link
                  to={`/products?category=${category.toLowerCase()}`}
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <span className="text-xl font-medium text-primary-600">{category.charAt(0)}</span>
                </Link>
                <span className="mt-2 text-sm font-medium text-gray-900">{category}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="bg-primary-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start selling on MarketHub today
              </h2>
              <p className="mt-4 max-w-md text-lg text-primary-100">
                Join thousands of successful sellers already on our platform. Low fees, powerful tools, and a supportive community.
              </p>
              <div className="mt-8">
                <Link
                  to="/seller/register"
                  className="inline-flex items-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-primary-600 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                >
                  Become a Seller
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2VsbGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                alt="Seller success"
                className="rounded-lg object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage; 