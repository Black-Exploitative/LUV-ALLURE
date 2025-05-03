// frontend/src/components/PaymentProcessor.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import PAYSTACK_CONFIG, { loadPaystackScript, initializeInlinePayment, createPaymentUrl } from '../config/paystackConfig';

const PaymentProcessor = ({ orderData, onPaymentSuccess, onPaymentCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isPaystackLoaded, setIsPaystackLoaded] = useState(false);
  
  // Load Paystack script on component mount
  useEffect(() => {
    const loadScript = async () => {
      try {
        await loadPaystackScript();
        setIsPaystackLoaded(true);
      } catch (error) {
        console.error('Failed to load Paystack:', error);
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
        toast.error('Payment system is still loading. Please wait a moment.');
        setIsLoading(false);
        return;
      }

      // Prepare payment data
      const paymentData = {
        callback_url: PAYSTACK_CONFIG.callbackUrl,
        email: orderData.email,
        amount: orderData.total,
        reference: orderData.reference,
        orderId: orderData.id,
        customerName: `${orderData.firstName} ${orderData.lastName}`,
        items: orderData.items
      };

      // Initialize inline payment
      const success = await initializeInlinePayment(
        paymentData,
        // Success callback
        async (response) => {
          setIsLoading(false);
          try {
            // Verify the payment on our server
            const verificationResult = await fetch(`/api/payment/verify/${response.reference}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }).then(res => res.json());
            
            if (verificationResult.success) {
              toast.success('Payment successful!');
              onPaymentSuccess(verificationResult);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        // Close callback
        () => {
          setIsLoading(false);
          toast.error('Payment cancelled');
          onPaymentCancel();
        }
      );

      if (!success) {
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
      // Prepare payment data
      const paymentData = {
        email: orderData.email,
        amount: orderData.total,
        reference: orderData.reference,
        orderId: orderData.id,
        customerName: `${orderData.firstName} ${orderData.lastName}`,
        items: orderData.items
      };

      // Get payment URL and open in new window
      const paymentUrl = await createPaymentUrl(paymentData);
      window.open(paymentUrl, '_blank');
      
      toast.success('Payment initiated. Please complete the payment in the new window.');
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <img src="/icons/credit-card.svg" alt="Credit Card" className="w-8 h-8 mb-2" />
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
          <img src="/icons/bank.svg" alt="Bank Transfer" className="w-8 h-8 mb-2" />
          <span className="text-sm">Bank Transfer</span>
        </button>
      </div>
      
      {/* Order summary */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h4 className="font-medium mb-2">Order Summary</h4>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Subtotal</span>
          <span>₦{orderData.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Shipping</span>
          <span>₦{orderData.shipping.toLocaleString()}</span>
        </div>
        {orderData.tax > 0 && (
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Tax</span>
            <span>₦{orderData.tax.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>₦{orderData.total.toLocaleString()}</span>
        </div>
      </div>
      
      {/* Payment buttons */}
      <div className="flex flex-col gap-3">
        {paymentMethod === 'card' ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white py-3 text-sm uppercase tracking-wide"
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
            className="w-full bg-black text-white py-3 text-sm uppercase tracking-wide"
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
    subtotal: PropTypes.number.isRequired,
    shipping: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.array.isRequired
  }).isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  onPaymentCancel: PropTypes.func.isRequired
};

export default PaymentProcessor;