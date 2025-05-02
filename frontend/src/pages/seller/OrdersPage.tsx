import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Using global types defined in vite-env.d.ts
const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AppTypes.Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setOrders([
        {
          id: 'ORD-39284',
          customer: 'John Smith',
          email: 'john.smith@example.com',
          date: '2023-05-14',
          total: 129.99,
          status: 'shipped',
          items: [
            { id: '1', name: 'Wireless Earbuds', price: 89.99, quantity: 1 },
            { id: '2', name: 'Smartphone Case', price: 24.99, quantity: 1 },
            { id: '3', name: 'USB Cable', price: 15.01, quantity: 1 }
          ]
        },
        {
          id: 'ORD-38214',
          customer: 'Emma Johnson',
          email: 'emma.j@example.com',
          date: '2023-05-12',
          total: 59.99,
          status: 'processing',
          items: [
            { id: '3', name: 'Bluetooth Speaker', price: 59.99, quantity: 1 }
          ]
        },
        {
          id: 'ORD-37192',
          customer: 'Michael Brown',
          email: 'mbrown@example.com',
          date: '2023-05-11',
          total: 89.99,
          status: 'delivered',
          items: [
            { id: '1', name: 'Wireless Earbuds', price: 89.99, quantity: 1 }
          ]
        },
        {
          id: 'ORD-36104',
          customer: 'Sarah Wilson',
          email: 'swilson@example.com',
          date: '2023-05-09',
          total: 49.98,
          status: 'delivered',
          items: [
            { id: '2', name: 'Smartphone Case', price: 24.99, quantity: 2 }
          ]
        },
      ]);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: 'processing' | 'shipped' | 'delivered') => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  // Format date to more readable form
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto"
    >
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>
      
      <div className="mb-6 flex items-center justify-between">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${selectedStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedStatus('all')}
          >
            All Orders
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedStatus === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedStatus('processing')}
          >
            Processing
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedStatus === 'shipped' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedStatus('shipped')}
          >
            Shipped
          </button>
          <button
            className={`px-4 py-2 rounded-md ${selectedStatus === 'delivered' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setSelectedStatus('delivered')}
          >
            Delivered
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading orders...</p>
        </div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No orders found with the selected status.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{order.id}</h2>
                        <p className="text-gray-600">{formatDate(order.date)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="font-medium">Status: </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as 'processing' | 'shipped' | 'delivered')}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div><span className="font-medium">Customer:</span> {order.customer}</div>
                      <div><span className="font-medium">Email:</span> {order.email}</div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="font-medium mb-2">Order Items</h3>
                      <div className="divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <div key={`${order.id}-${item.id}`} className="py-3 flex justify-between">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-600 ml-2">× {item.quantity}</span>
                            </div>
                            <div>${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default OrdersPage; 