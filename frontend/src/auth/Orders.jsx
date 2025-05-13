import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import api from "../services/api";

const Orders = ({ dashboard = false, limit = null }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders directly from Shopify when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Use the new endpoint that fetches from Shopify
        const response = await api.get('/orders/shopify');
        
        if (response.data && response.data.success) {
          // Apply limit if provided
          const ordersData = limit 
            ? response.data.orders.slice(0, limit) 
            : response.data.orders;
            
          setOrders(ordersData);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Unable to fetch your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [limit]);


  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate tracking URL based on shipping provider
  const getTrackingUrl = (order) => {
    if (!order.trackingNumber) return null;
    
    if (order.shippingProvider === 'Bolt') {
      // Bolt tracking URL
      return order.trackingUrl || `https://bolt.eu/tracking/${order.trackingNumber}`;
    } else if (order.shippingProvider === 'GIGL') {
      // GIGL tracking URL
      return order.trackingUrl || `https://giglogistics.com/tracking?code=${order.trackingNumber}`;
    }
    
    return order.trackingUrl;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
        <p className="ml-3">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!dashboard && (
        <>
          <h2 className="text-xl font-medium mb-4">ORDER HISTORY</h2>
          <p className="text-xs text-gray-800 font-base font-[Raleway] mb-6">View and track all your orders.</p>
        </>
      )}

      {orders.length > 0 ? (
        <div className="border border-gray-200">
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className={`p-6 ${
                index !== orders.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex flex-col  md:flex-row justify-between mb-4">
                <div>
                  <p className="font-medium">{order.reference}</p>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
                <div className="mt-2  md:mt-0">
                  <span className={`inline-block px-3 py-1 text-xs ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                  </span>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium">Items:</p>
                <ul className="ml-4 list-disc font-normal font-[Raleway]">
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.title} x{item.quantity} - ₦{parseFloat(item.price).toLocaleString()}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-medium">Total: ₦{order.total.toLocaleString()}</p>
              </div>
              <div className="mt-4 flex space-x-4">
                <Link
                  to={`/order-details/${order._id}`}
                  className="text-xs underline cursor-pointer hover:text-gray-700"
                >
                  VIEW ORDER DETAILS
                </Link>
                
                {order.trackingNumber && (
                  <a
                    href={getTrackingUrl(order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline cursor-pointer hover:text-gray-700"
                  >
                    TRACK PACKAGE
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-gray-200">
          <p className="text-gray-600 mb-4">
            You have not placed any orders yet.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-black text-white text-sm"
          >
            EXPLORE COLLECTIONS
          </Link>
        </div>
      )}
      
      {dashboard && orders.length > 2 && (
        <div className="text-right">
          <Link
            to="/user-account?tab=orders"
            className="text-sm underline cursor-pointer hover:text-gray-700"
          >
            VIEW ALL ORDERS
          </Link>
        </div>
      )}
    </div>
  );
};

Orders.propTypes = {
  dashboard: PropTypes.bool,
  limit: PropTypes.number
};

export default Orders;