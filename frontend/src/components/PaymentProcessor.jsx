// frontend/src/components/PaymentProcessor.jsx - Fixed payment amount handling
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import PAYSTACK_CONFIG, { loadPaystackScript, initializeInlinePayment, createPaymentUrl } from '../config/paystackConfig';

const PaymentProcessor = ({ orderData, onPaymentSuccess, onPaymentCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  const [scriptLoadError, setScriptLoadError] = useState(false);
  
  // Load Paystack script on component mount
  useEffect(() => {
    const loadScript = async () => {
      try {
        console.log("Loading Paystack script...");
        await loadPaystackScript();
        console.log("Paystack script loaded successfully");
        setIsPaystackLoaded(true);
        setScriptLoadError(false);
      } catch (error) {
        console.error('Failed to load Paystack:', error);
        setScriptLoadError(true);
        toast.error('Payment system failed to load. Please refresh the page.');
      }
    };

    loadScript();
  }, []);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const processPayment = async () => {
    setIsLoading(true);
    
    try {
      if (!isPaystackLoaded) {
        if (scriptLoadError) {
          toast.error('Payment system failed to load. Please refresh the page.');
        } else {
          toast.error('Payment system is still loading. Please wait a moment.');
        }
        setIsLoading(false);
        return;
      }

      // Validate orderData
      if (!orderData || !orderData.email || !orderData.total || !orderData.reference) {
        console.error("Invalid order data:", orderData);
        toast.error("Invalid order data. Please try again.");
        setIsLoading(false);
        return;
      }

      // Ensure total is a number for consistent handling
      let paymentAmount = orderData.total;
      if (typeof paymentAmount === 'string') {
        paymentAmount = parseFloat(paymentAmount.replace(/,/g, ''));
      }

      console.log("Initializing payment with data:", {
        email: orderData.email,
        amount: paymentAmount, // Will be converted to kobo in initializeInlinePayment
        reference: orderData.reference,
        orderId: orderData.id
      });

      // Prepare payment data
      const paymentData = {
        callback_url: PAYSTACK_CONFIG.callbackUrl,
        email: orderData.email,
        amount: paymentAmount, // Ensure it's a number - conversion to kobo happens in initializeInlinePayment
        reference: orderData.reference,
        orderId: orderData.id,
        customerName: `${orderData.firstName} ${orderData.lastName}`,
        items: orderData.items
      };

      // Initialize inline payment
      console.log("Calling initializeInlinePayment...");
      const success = await initializeInlinePayment(
        paymentData,
        // Success callback
        async (response) => {
          console.log("Payment success callback:", response);
          setIsLoading(false);
          try {
            // Verify the payment on our server
            console.log("Verifying payment with reference:", response.reference);
            const verificationResult = await fetch(`/api/payment/verify/${response.reference}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
            }).then(res => {
              if (!res.ok) {
                throw new Error(`Verification failed with status: ${res.status}`);
              }
              return res.json();
            });
            
            console.log("Payment verification result:", verificationResult);
            if (verificationResult.success) {
              toast.success('Payment successful!');
              onPaymentSuccess(verificationResult);
            } else {
              console.error("Payment verification failed:", verificationResult);
              toast.error(verificationResult.message || 'Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        // Close callback
        () => {
          console.log("Payment modal closed");
          setIsLoading(false);
          toast.error('Payment cancelled');
          onPaymentCancel();
        }
      );

      if (!success) {
        console.error("Failed to initialize payment");
        toast.error('Failed to initialize payment. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePopupPayment = async () => {
    setIsLoading(true);
    
    try {
      // Validate orderData
      if (!orderData || !orderData.email || !orderData.total || !orderData.reference) {
        console.error("Invalid order data:", orderData);
        toast.error("Invalid order data. Please try again.");
        setIsLoading(false);
        return;
      }

      // Ensure total is a number for consistent handling
      let paymentAmount = orderData.total;
      if (typeof paymentAmount === 'string') {
        paymentAmount = parseFloat(paymentAmount.replace(/,/g, ''));
      }

      // Prepare payment data
      const paymentData = {
        email: orderData.email,
        amount: paymentAmount, // Will be converted to kobo in createPaymentUrl
        reference: orderData.reference,
        orderId: orderData.id,
        customerName: `${orderData.firstName} ${orderData.lastName}`,
        items: orderData.items
      };

      console.log("Creating payment URL for bank transfer...");
      // Get payment URL and open in new window
      const paymentUrl = await createPaymentUrl(paymentData);
      window.open(paymentUrl, '_blank');
      
      toast.success('Payment initiated. Please complete the payment in the new window.');
      
      // Set up polling to check payment status
      let attempts = 0;
      const maxAttempts = 60; // Check for 5 minutes (5 sec intervals)
      
      const checkPaymentStatus = async () => {
        try {
          const result = await fetch(`/api/payment/verify/${orderData.reference}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          }).then(res => res.json());
          
          if (result.success && result.status === 'success') {
            clearInterval(statusCheck);
            onPaymentSuccess(result);
          } else if (attempts >= maxAttempts) {
            clearInterval(statusCheck);
            // Don't show error, as user might still be completing payment
          }
          
          attempts++;
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      };
      
      // Check every 5 seconds
      const statusCheck = setInterval(checkPaymentStatus, 5000);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If order data is not available, show error
  if (!orderData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-medium mb-6">Payment Error</h3>
        <p className="text-red-500 mb-4">Order data is not available. Please go back and try again.</p>
        <button
          className="text-sm text-gray-600 hover:text-black underline"
          onClick={onPaymentCancel}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-medium mb-6">Payment Method</h3>
      
      {/* Payment method selection */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <button
          className={`p-4 border rounded-md flex flex-col items-center justify-center transition-all ${
            paymentMethod === 'card' 
              ? 'border-black bg-gray-50' 
              : 'border-gray-200 hover:border-gray-400'
          }`}
          onClick={() => handlePaymentMethodChange('card')}
        >
          <img src="/icons/creditcard.png" alt="Credit Card" className="w-8 h-8 mb-2" />
          <span className="text-sm">Card Payment</span>
        </button>
        
        <button
          className={`p-4 border rounded-md flex flex-col items-center justify-center transition-all ${
            paymentMethod === 'bank' 
              ? 'border-black bg-gray-50' 
              : 'border-gray-200 hover:border-gray-400'
          }`}
          onClick={() => handlePaymentMethodChange('bank')}
        >
          <img src="/icons/banktransfer.svg" alt="Bank Transfer" className="w-8 h-8 mb-2" />
          <span className="text-sm">Bank Transfer</span>
        </button>
      </div>
      
      {/* Order summary */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h4 className="font-medium mb-2">Order Summary</h4>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Subtotal</span>
          <span>₦{parseFloat(orderData.subtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Shipping</span>
          <span>₦{parseFloat(orderData.shipping).toLocaleString()}</span>
        </div>
        {orderData.tax > 0 && (
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Tax</span>
            <span>₦{parseFloat(orderData.tax).toLocaleString()}</span>
          </div>
        )}
        {orderData.packaging > 0 && (
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Packaging</span>
            <span>₦{parseFloat(orderData.packaging).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>₦{parseFloat(orderData.total).toLocaleString()}</span>
        </div>
      </div>
      
      {/* Script load error message */}
      {scriptLoadError && (
        <div className="bg-red-50 text-red-600 p-4 mb-4 rounded">
          <p>Unable to load payment system. Please try refreshing the page or try again later.</p>
        </div>
      )}
      
      {/* Payment buttons */}
      <div className="flex flex-col gap-3">
        {paymentMethod === 'card' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white py-3 text-sm uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider"
            onClick={processPayment}
            disabled={isLoading || !isPaystackLoaded}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Pay with Card'
            )}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white py-3 text-sm uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider"
            onClick={handlePopupPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Pay with Bank Transfer'
            )}
          </motion.button>
        )}
        
        <button
          className="text-sm text-gray-600 hover:text-black underline"
          onClick={onPaymentCancel}
          disabled={isLoading}
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

PaymentProcessor.propTypes = {
  orderData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    reference: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    subtotal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    shipping: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    tax: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    packaging: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    items: PropTypes.array.isRequired
  }).isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  onPaymentCancel: PropTypes.func.isRequired
};

export default PaymentProcessor;