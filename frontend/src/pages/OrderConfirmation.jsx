// frontend/src/pages/OrderConfirmation.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTruck, FaBox } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const isReference = orderId.includes("-");
  const endpoint = isReference
    ? `/api/orders/reference/${orderId}`
    : `/api/orders/${orderId}`;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 404) {
          setNotFound(true);
        } else {
          setError("Unable to load your order. Please try again later.");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError("Unable to load your order. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="mt-4">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/account/orders" className="text-black underline">
            View all orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {notFound && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
              <h2 className="text-2xl font-medium mb-4">Order Not Found</h2>
              <p className="mb-4">
                We couldn't find the order you're looking for. It may have been
                created with a different account or the URL might be incorrect.
              </p>
              <Link to="/account/orders" className="text-black underline">
                View all orders
              </Link>
            </div>
          </div>
        )}
        {/* Order confirmation header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-green-500 mb-4"
          >
            <FaCheckCircle size={56} />
          </motion.div>
          <h1 className="text-3xl font-thin uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst mb-3">
            Thank You For Your Order
          </h1>
          <p className="text-gray-600">
            Order #{order.reference} has been successfully placed
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-medium mb-1">Order Details</h2>
            <p className="text-sm text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Order status */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div
                className={`h-3 w-3 rounded-full mr-2 ${
                  order.status === "pending"
                    ? "bg-yellow-500"
                    : order.status === "processing"
                    ? "bg-blue-500"
                    : order.status === "completed"
                    ? "bg-green-500"
                    : order.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              ></div>
              <h3 className="font-medium">
                Status:{" "}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              We'll email you an update when your order ships.
            </p>
          </div>

          {/* Order timeline */}
          <div className="relative mb-8 pl-8 border-l border-gray-200">
            <div className="mb-6">
              <div className="absolute left-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center -translate-x-1/2">
                <FaCheckCircle className="text-green-500" size={12} />
              </div>
              <h4 className="font-medium">Order Confirmed</h4>
              <p className="text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <div className="absolute left-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center -translate-x-1/2">
                <FaBox className="text-blue-500" size={12} />
              </div>
              <h4 className="font-medium">Processing Order</h4>
              <p className="text-sm text-gray-600">
                Your order is being prepared
              </p>
            </div>

            <div>
              <div className="absolute left-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center -translate-x-1/2">
                <FaTruck className="text-gray-400" size={12} />
              </div>
              <h4 className="font-medium text-gray-400">Shipping</h4>
              <p className="text-sm text-gray-500">
                Estimated delivery: {order.estimatedDeliveryDays || "3-5"}{" "}
                business days
              </p>
            </div>
          </div>

          {/* Shipping info */}
          <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-medium mb-2">Shipping Information</h3>
              <p>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              {order.shippingAddress.apartment && (
                <p>{order.shippingAddress.apartment}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Payment Information</h3>
              <p>Payment Method: {order.paymentDetails?.cardBrand || "Card"}</p>
              {order.paymentDetails?.cardLast4 && (
                <p>Card ending in ****{order.paymentDetails.cardLast4}</p>
              )}
              <p>
                Status:{" "}
                {order.paymentStatus.charAt(0).toUpperCase() +
                  order.paymentStatus.slice(1)}
              </p>
            </div>
          </div>

          {/* Order items */}
          <div>
            <h3 className="font-medium mb-4 pb-2 border-b border-gray-100">
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border-b border-gray-50 pb-4"
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₦{parseFloat(item.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-8 pt-6 border-t border-gray-100">
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

            {/* Show packaging cost if applicable */}
            {order.packagingDetails &&
              order.packagingDetails.packagingPrice > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Packaging ({order.packagingDetails.packagingName})
                  </span>
                  <span>
                    ₦{order.packagingDetails.packagingPrice.toLocaleString()}
                  </span>
                </div>
              )}

            <div className="flex justify-between font-medium text-lg mt-3 pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link
            to="/account/orders"
            className="px-6 py-3 border border-black text-black text-center hover:bg-black hover:text-white transition-colors"
          >
            View All Orders
          </Link>
          <Link
            to="/shop"
            className="px-6 py-3 bg-black text-white text-center hover:bg-gray-900 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Need help section */}
        <div className="text-center">
          <h3 className="font-medium mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our
            customer support.
          </p>
          <Link
            to="/contact-us"
            className="text-black underline hover:text-gray-700"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
