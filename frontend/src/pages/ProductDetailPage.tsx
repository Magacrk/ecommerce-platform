import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ReactImageZoom from 'react-image-zoom';
import { useCart } from '@/contexts/CartContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mock product data (would be fetched from API)
const mockProduct = {
  id: '1',
  name: 'Premium Wireless Headphones',
  description: 'Experience crystal-clear sound with these premium wireless headphones. Featuring noise cancellation technology, Bluetooth 5.0 connectivity, and up to it 20 hours of battery life. The comfortable over-ear design makes these perfect for long listening sessions.',
  price: 199.99,
  discountPrice: 169.99,
  rating: 4.5,
  reviewCount: 128,
  stock: 25,
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhlYWRwaG9uZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&w=1000&q=80',
  ],
  category: 'Electronics',
  tags: ['wireless', 'headphones', 'audio', 'bluetooth'],
  sellerId: 'seller1',
  sellerName: 'AudioTech Inc.',
  sellerRating: 4.8,
  features: [
    'Noise cancellation technology',
    'Bluetooth 5.0 connectivity',
    '20-hour battery life',
    'Quick charge capability (3 hours of playback from 15-minute charge)',
    'Comfortable over-ear design',
    'Built-in microphone for calls',
  ],
  specifications: {
    'Brand': 'AudioTech',
    'Model': 'AT-WH100',
    'Color': 'Matte Black',
    'Connectivity': 'Bluetooth 5.0',
    'Battery Life': '20 hours',
    'Charging Time': '2 hours',
    'Weight': '250g',
    'Warranty': '1 year',
  },
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<typeof mockProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Simulate fetching product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // In a real app, this would be an API call like:
        // const response = await api.getProduct(id);
        // setProduct(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setProduct(mockProduct);
          setSelectedImage(mockProduct.images[0]);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.discountPrice || product.price,
          image: product.images[0],
          sellerId: product.sellerId,
          sellerName: product.sellerName,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="mt-6 rounded-md bg-primary-600 px-6 py-2 text-white hover:bg-primary-700">
          Back to Products
        </Link>
      </div>
    );
  }

  // Calculate savings percentage
  const savingsPercentage = product.discountPrice 
    ? Math.round((1 - product.discountPrice / product.price) * 100) 
    : 0;

  // Image zoom props
  const zoomProps = {
    width: 400,
    height: 400,
    zoomWidth: 500,
    img: selectedImage,
    zoomPosition: 'right' as 'right',
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Helmet>
        <title>{product.name} | MarketHub</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Helmet>

      {/* Breadcrumbs */}
      <nav className="mb-8 flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">Home</Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
            <Link to="/products" className="ml-2 text-sm text-gray-500 hover:text-gray-700">Products</Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
            <Link to={`/products?category=${product.category.toLowerCase()}`} className="ml-2 text-sm text-gray-500 hover:text-gray-700">
              {product.category}
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" clipRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
            <span className="ml-2 text-sm font-medium text-gray-900">{product.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-200">
            <div className="relative h-[400px]">
              <ReactImageZoom {...zoomProps} />
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-md border ${selectedImage === image ? 'border-primary-600' : 'border-gray-200'}`}
              >
                <img src={image} alt={`${product.name} - Image ${index + 1}`} className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            {product.name}
          </motion.h1>
          
          {/* Rating */}
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <svg
                  key={rating}
                  className={`h-5 w-5 ${
                    product.rating > rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviewCount} reviews)</p>
          </div>
          
          {/* Seller Info */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Sold by <Link to={`/seller/${product.sellerId}`} className="text-primary-600 hover:underline">{product.sellerName}</Link> 
              <span className="ml-2 inline-flex items-center">
                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-xs">{product.sellerRating}</span>
              </span>
            </p>
          </div>
          
          {/* Price */}
          <div className="mt-6">
            {product.discountPrice ? (
              <div className="flex items-end">
                <p className="text-3xl font-bold text-gray-900">${product.discountPrice.toFixed(2)}</p>
                <p className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</p>
                <span className="ml-2 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                  Save {savingsPercentage}%
                </span>
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
            )}
            <p className="mt-1 text-sm text-gray-600">
              {product.stock > 0 ? (
                <>
                  <span className="text-green-600">In Stock</span> - {product.stock} available
                </>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>
          
          {/* Add to Cart */}
          <div className="mt-8">
            <div className="flex items-center">
              <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                name="quantity"
                className="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={quantity}
                onChange={handleQuantityChange}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="mt-4 w-full rounded-md bg-primary-600 py-3 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
          </div>
          
          {/* Description */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-4 text-gray-700">{product.description}</p>
          </div>
          
          {/* Features */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Features</h2>
            <ul className="mt-4 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Specifications */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
            <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="whitespace-nowrap bg-gray-50 py-2 px-4 text-sm font-medium text-gray-900">
                        {key}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Tags */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/products?tag=${tag}`}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 