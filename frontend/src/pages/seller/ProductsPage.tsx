import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';

// Using global types defined in vite-env.d.ts
const ProductsPage = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<AppTypes.Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<AppTypes.NewProductForm>({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'Wireless Earbuds',
          price: 89.99,
          description: 'High quality wireless earbuds with noise cancellation',
          category: 'Electronics',
          stock: 45,
          image: null
        },
        {
          id: '2',
          name: 'Smartphone Case',
          price: 24.99,
          description: 'Durable protective smartphone case',
          category: 'Accessories',
          stock: 120,
          image: null
        },
        {
          id: '3',
          name: 'Bluetooth Speaker',
          price: 59.99,
          description: 'Portable Bluetooth speaker with 10 hours battery life',
          category: 'Electronics',
          stock: 32,
          image: null
        },
      ]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Simulate adding a product
    const newProductWithId: AppTypes.Product = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10),
      image: null
    };
    
    setProducts(prev => [newProductWithId, ...prev]);
    setNewProduct({ name: '', price: '', description: '', category: '', stock: '' });
    setShowAddModal(false);
  };

  const handleDelete = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock} units</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">Edit</button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                    min="0"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Books">Books</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={4}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductsPage; 