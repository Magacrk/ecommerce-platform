import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalSales: 24500,
        totalOrders: 152,
        totalProducts: 48,
        pendingOrders: 7
      });
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
      <h1 className="mb-8 text-3xl font-bold">Seller Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-gray-500 text-sm font-medium">Total Sales</h2>
              <p className="mt-2 text-3xl font-bold">${stats.totalSales.toLocaleString()}</p>
              <div className="mt-2 text-sm text-green-600">↑ 12% from last month</div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-gray-500 text-sm font-medium">Total Orders</h2>
              <p className="mt-2 text-3xl font-bold">{stats.totalOrders}</p>
              <div className="mt-2 text-sm text-green-600">↑ 8% from last month</div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-gray-500 text-sm font-medium">Products</h2>
              <p className="mt-2 text-3xl font-bold">{stats.totalProducts}</p>
              <div className="mt-2 text-sm text-blue-600">
                <Link to="/seller/products">Manage Products</Link>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-gray-500 text-sm font-medium">Pending Orders</h2>
              <p className="mt-2 text-3xl font-bold">{stats.pendingOrders}</p>
              <div className="mt-2 text-sm text-blue-600">
                <Link to="/seller/orders">View Orders</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-39284</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 14, 2023</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$129.99</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Shipped</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-38214</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 12, 2023</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$59.99</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ORD-37192</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">May 11, 2023</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$89.99</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Delivered</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-right">
                <Link to="/seller/orders" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View All Orders →
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">Top Selling Products</h2>
              <ul className="divide-y divide-gray-200">
                <li className="py-4 flex">
                  <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium">Wireless Earbuds</h3>
                      <p className="text-base font-medium">$89.99</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Sold: 42 units</p>
                  </div>
                </li>
                <li className="py-4 flex">
                  <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium">Smartphone Case</h3>
                      <p className="text-base font-medium">$24.99</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Sold: 36 units</p>
                  </div>
                </li>
                <li className="py-4 flex">
                  <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium">Bluetooth Speaker</h3>
                      <p className="text-base font-medium">$59.99</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Sold: 28 units</p>
                  </div>
                </li>
              </ul>
              <div className="mt-4 text-right">
                <Link to="/seller/products" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  View All Products →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DashboardPage; 