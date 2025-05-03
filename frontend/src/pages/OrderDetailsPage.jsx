// OrderDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaBox, FaTruck, FaCheck } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/orders/${orderId}`);
        
        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          setError('Failed to load order details');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Unable to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-black border-t-transparent rounded-full"></div>
          <p className="mt-4">Loading your order details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
          <Link to="/user-account?tab=orders" className="text-black underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }
  
  // Determine tracking URL based on shipping provider
  const getTrackingUrl = () => {
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
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl min-h-screen">
        <div className="mb-6">
          <Link to="/user-account?tab=orders" className="flex items-center text-gray-600 hover:text-black">
            <FaArrowLeft className="mr-2" /> Back to Orders
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Order header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-medium mb-1">Order #{order.reference}</h1>
                <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
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
          </div>
          
          {/* Order timeline/tracking */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-4">Order Status</h2>
            
            <div className="relative pl-8 mb-6 border-l border-gray-200">
              {/* Order confirmed */}
              <div className="mb-6">
                <div className="absolute left-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center -translate-x-1/2">
                  <FaCheck className="text-green-500" size={12} />
                </div>
                <h4 className="font-medium">Order Confirmed</h4>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
              
              {/* Processing */}
              <div className="mb-6">
                <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 ${
                  order.status === 'pending' ? 'bg-gray-100 text-gray-400' : 'bg-blue-100'
                }`}>
                  <FaBox className={order.status === 'pending' ? 'text-gray-400' : 'text-blue-500'} size={12} />
                </div>
                <h4 className={`font-medium ${order.status === 'pending' ? 'text-gray-400' : ''}`}>Processing</h4>
                <p className="text-sm text-gray-600">
                  {order.status !== 'pending' ? 'Your order is being processed' : 'Waiting to be processed'}
                </p>
              </div>
              
              {/* Shipping */}
              <div>
                <div className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 ${
                  order.status === 'completed' ? 'bg-green-100' : 
                  order.status === 'processing' && order.trackingNumber ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <FaTruck className={
                    order.status === 'completed' ? 'text-green-500' : 
                    order.status === 'processing' && order.trackingNumber ? 'text-blue-500' : 'text-gray-400'
                  } size={12} />
                </div>
                <h4 className={`font-medium ${
                  order.status === 'pending' || (order.status === 'processing' && !order.trackingNumber) ? 'text-gray-400' : ''
                }`}>Shipping</h4>
                <p className="text-sm text-gray-600">
                  {order.status === 'completed' 
                    ? 'Your order has been delivered' 
                    : order.trackingNumber 
                      ? `Your order is on the way (${order.shippingProvider})`
                      : `Estimated delivery: ${order.estimatedDeliveryDays || '3-5'} business days`
                  }
                </p>
                
                {/* Tracking information */}
                {order.trackingNumber && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                    </p>
                    {getTrackingUrl() && (
                      <a 
                        href={getTrackingUrl()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Track Your Package
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Order items */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center border-b border-gray-100 pb-4">
                  <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₦{parseFloat(item.price).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Package details */}
            {order.packagingDetails && order.packagingDetails.packagingType !== 'normal' && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="font-medium text-sm mb-2">Packaging: {order.packagingDetails.packagingName}</h3>
                {order.packagingDetails.giftMessage && (
                  <div className="bg-gray-50 p-3 rounded-md mt-2">
                    <p className="text-sm text-gray-600 italic">"{order.packagingDetails.giftMessage}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Shipping info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm mb-2">Shipping Address</h3>
                <address className="not-italic">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address}</p>
                  {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p>{order.shippingAddress.phone}</p>
                </address>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2">Shipping Method</h3>
                <p>{order.shippingProvider || 'Standard Shipping'}</p>
                <p className="text-sm text-gray-600">
                  Estimated delivery: {order.estimatedDeliveryDays || '3-5'} business days
                </p>
              </div>
            </div>
          </div>
          
          {/* Payment details */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium mb-4">Payment Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm mb-2">Payment Method</h3>
                <p>{order.paymentDetails?.cardBrand || order.paymentGateway || 'Card'}</p>
                {order.paymentDetails?.cardLast4 && (
                  <p className="text-sm text-gray-600">Card ending in ****{order.paymentDetails.cardLast4}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2">Payment Status</h3>
                <p className={`${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 
                  order.paymentStatus === 'failed' ? 'text-red-600' :
                  order.paymentStatus === 'refunded' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </p>
                {order.paymentDetails?.paymentDate && (
                  <p className="text-sm text-gray-600">
                    {formatDate(order.paymentDetails.paymentDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>₦{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>₦{order.shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span>₦{order.tax.toLocaleString()}</span>
              </div>
              
              {/* Show packaging if not standard */}
              {order.packagingDetails && order.packagingDetails.packagingPrice > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Packaging ({order.packagingDetails.packagingName})</span>
                  <span>₦{order.packagingDetails.packagingPrice.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between mt-3 pt-3 border-t border-gray-200 font-medium">
                <span>Total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                to="/user-account?tab=orders"
                className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors"
              >
                Back to Orders
              </Link>
              
              {order.status !== 'cancelled' && order.status !== 'completed' && (
                <Link 
                  to={`/contact-us?subject=Order%20${order.reference}`}
                  className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-900 transition-colors ml-3"
                >
                  Need Help?
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;