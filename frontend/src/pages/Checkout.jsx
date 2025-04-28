// frontend/src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PaymentProcessor from "../components/PaymentProcessor";
import shippingService from "../services/shippingService";
import api from "../services/api";

const Checkout = () => {
  const { cartItems, getCartTotals, checkStockAvailability, clearCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [packagingOptions, setPackagingOptions] = useState([
    { id: 'normal', name: 'Normal Packaging', price: 0, description: 'Standard eco-friendly packaging' },
    { id: 'luxe', name: 'Luxe Packaging', price: 2000, description: 'Premium gift box with satin ribbon' },
    { id: 'gift', name: 'Gift Packaging', price: 3000, description: 'Luxury gift box with personalized note card' }
  ]);
  const [selectedPackaging, setSelectedPackaging] = useState(packagingOptions[0]);
  const [giftMessage, setGiftMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || '',
    address: '',
    city: '',
    state: 'Lagos',
    country: 'Nigeria',
    zipCode: '',
  });
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    packaging: 0,
    total: 0
  });
  const [createdOrder, setCreatedOrder] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  // Calculate order summary when cart items, shipping method, or packaging change
  useEffect(() => {
    const { subtotal } = getCartTotals();
    const shippingCost = selectedShippingMethod ? selectedShippingMethod.cost : 0;
    const packagingCost = selectedPackaging ? selectedPackaging.price : 0;
    const taxRate = 0.05; // 5% VAT for Nigeria
    const taxAmount = subtotal * taxRate;
    
    setOrderSummary({
      subtotal,
      shipping: shippingCost,
      packaging: packagingCost,
      tax: taxAmount,
      total: subtotal + shippingCost + packagingCost + taxAmount
    });
  }, [cartItems, selectedShippingMethod, selectedPackaging, getCartTotals]);

  // Fetch shipping methods when address is updated
  useEffect(() => {
    const fetchShippingEstimates = async () => {
      // Only fetch if we have at least city and state
      if (formData.city && formData.state) {
        try {
          setLoading(true);
          
          // Create simplified cart for shipping calculation
          const cartSummary = {
            items: cartItems.map(item => ({
              id: item.id,
              quantity: item.quantity || 1,
              category: item.category || 'default'
            }))
          };
          
          // Get shipping estimates
          const shippingAddress = {
            city: formData.city,
            state: formData.state,
            country: formData.country
          };
          
          const giglEstimate = await shippingService.calculateGIGLShipping(cartSummary, shippingAddress);
          const boltEstimate = await shippingService.calculateBoltShipping(cartSummary, shippingAddress);
          
          // Format shipping methods
          const methods = [];
          
          if (giglEstimate.success) {
            methods.push({
              id: 'gigl',
              name: 'GIGL Delivery',
              description: `Estimated delivery time: ${giglEstimate.estimatedDeliveryDays} days`,
              cost: giglEstimate.cost,
              provider: 'GIGL',
              estimatedDays: giglEstimate.estimatedDeliveryDays
            });
          }
          
          if (boltEstimate.success) {
            methods.push({
              id: 'bolt',
              name: 'Bolt Express',
              description: `Estimated delivery time: ${boltEstimate.estimatedDeliveryDays} days`,
              cost: boltEstimate.cost,
              provider: 'Bolt',
              estimatedDays: boltEstimate.estimatedDeliveryDays
            });
          }
          
          setShippingMethods(methods);
          
          // Auto-select the first method if none is selected
          if (methods.length > 0 && !selectedShippingMethod) {
            setSelectedShippingMethod(methods[0]);
          }
        } catch (error) {
          console.error('Error fetching shipping estimates:', error);
          toast.error('Failed to calculate shipping. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchShippingEstimates();
  }, [formData.city, formData.state, formData.country, cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSelectShippingMethod = (method) => {
    setSelectedShippingMethod(method);
  };

  const handleSelectPackaging = (packaging) => {
    setSelectedPackaging(packaging);
  };

  const handleGiftMessageChange = (e) => {
    setGiftMessage(e.target.value);
  };

  const validateShippingForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Check if shipping method is selected
    if (!selectedShippingMethod) {
      toast.error('Please select a shipping method');
      return false;
    }
    
    return true;
  };

  const handleProceedToPayment = async () => {
    // Validate form
    if (!validateShippingForm()) return;
    
    // Check stock availability
    setLoading(true);
    const stockAvailable = await checkStockAvailability();
    if (!stockAvailable) {
      setLoading(false);
      return; // Error toast is shown by the checkStockAvailability function
    }
    
    try {
      // Create a unique order reference
      const reference = `LA-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      
      // Format order items
      const orderItems = cartItems.map(item => ({
        variantId: item.variantId || item.id,
        quantity: item.quantity || 1,
        title: item.name || item.title,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/,/g, '')) : item.price,
        image: item.image || (item.images && item.images[0])
      }));
      
      // Create order in database
      const orderData = {
        items: orderItems,
        subtotal: orderSummary.subtotal,
        tax: orderSummary.tax,
        shipping: orderSummary.shipping,
        packagingOption: selectedPackaging,
        giftMessage: giftMessage,
        total: orderSummary.total,
        transactionId: reference, // Use same reference as transaction ID for now
        reference,
        shippingProvider: selectedShippingMethod.provider,
        estimatedDeliveryDays: selectedShippingMethod.estimatedDays,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          phone: formData.phone,
          email: formData.email
        }
      };
      
      const response = await api.post('/orders/create', orderData);
      
      if (response.data.success) {
        // Store created order for payment
        setCreatedOrder({
          ...response.data,
          ...orderData,
          id: response.data.orderId
        });
        
        // Move to payment step
        setStep(2);
      } else {
        toast.error('Error creating order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentResult) => {
    setPaymentComplete(true);
    toast.success('Payment successful!');
    clearCart(); // Clear the cart
    setStep(3); // Move to confirmation step
  };

  const handlePaymentCancel = () => {
    toast.error('Payment cancelled');
    // Stay on payment step, user can try again
  };

  const handleGoToOrders = () => {
    navigate('/user-account?tab=orders');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (cartItems.length === 0 && !paymentComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-medium mb-6">Your cart is empty</h1>
        <p className="mb-8">You don't have any items in your cart to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Checkout progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center max-w-3xl mx-auto">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm">Shipping</span>
          </div>
          <div className={`h-1 flex-1 mx-4 ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm">Payment</span>
          </div>
          <div className={`h-1 flex-1 mx-4 ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="text-sm">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main content */}
        <div className="md:w-2/3">
          {/* Step 1: Shipping information */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-medium mb-6">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">State</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  >
                    {shippingService.getNigerianStates().map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Shipping Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Shipping Method</h3>
                {loading ? (
                  <div className="p-4 border border-gray-200 rounded">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-gray-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Calculating shipping options...</span>
                    </div>
                  </div>
                ) : shippingMethods.length === 0 ? (
                  <div className="p-4 border border-gray-200 rounded text-center">
                    <p>Please enter your shipping address to see delivery options.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingMethods.map(method => (
                      <div 
                        key={method.id} 
                        className={`p-4 border rounded cursor-pointer transition-colors ${
                          selectedShippingMethod?.id === method.id 
                            ? 'border-black bg-gray-50' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => handleSelectShippingMethod(method)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input 
                              type="radio" 
                              checked={selectedShippingMethod?.id === method.id}
                              onChange={() => handleSelectShippingMethod(method)}
                              className="mr-3"
                            />
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-600">{method.description}</div>
                            </div>
                          </div>
                          <div className="font-medium">₦{method.cost.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Packaging Options */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Packaging Options</h3>
                <div className="space-y-3">
                  {packagingOptions.map(option => (
                    <div 
                      key={option.id} 
                      className={`p-4 border rounded cursor-pointer transition-colors ${
                        selectedPackaging?.id === option.id 
                          ? 'border-black bg-gray-50' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      onClick={() => handleSelectPackaging(option)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            checked={selectedPackaging?.id === option.id}
                            onChange={() => handleSelectPackaging(option)}
                            className="mr-3"
                          />
                          <div>
                            <div className="font-medium">{option.name}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </div>
                        </div>
                        <div className="font-medium">
                          {option.price > 0 ? `₦${option.price.toLocaleString()}` : 'Free'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gift Message */}
              {selectedPackaging?.id === 'gift' && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Gift Message</h3>
                  <textarea
                    value={giftMessage}
                    onChange={handleGiftMessageChange}
                    placeholder="Enter your gift message here..."
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                    rows={4}
                    maxLength={200}
                  ></textarea>
                  <div className="text-right text-sm text-gray-500">
                    {giftMessage.length}/200 characters
                  </div>
                </div>
              )}

              {/* Continue button */}
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white py-3 text-sm uppercase tracking-wide"
                  onClick={handleProceedToPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Proceed to Payment'
                  )}
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && createdOrder && (
            <PaymentProcessor
              orderData={{
                id: createdOrder.id,
                reference: createdOrder.reference,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                subtotal: orderSummary.subtotal,
                shipping: orderSummary.shipping,
                tax: orderSummary.tax,
                packaging: orderSummary.packaging,
                total: orderSummary.total,
                items: cartItems
              }}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentCancel={handlePaymentCancel}
            />
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-4">Thank you for your order!</h2>
              <p className="text-gray-600 mb-8">
                Your order has been received and is now being processed. You will receive an email confirmation shortly.
              </p>
              <p className="text-gray-700 mb-2">
                Order reference: <span className="font-medium">{createdOrder?.reference}</span>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <button
                  onClick={handleGoToOrders}
                  className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
                >
                  View My Orders
                </button>
                <button
                  onClick={handleGoToHome}
                  className="border border-black px-6 py-3 rounded hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
            <h2 className="text-xl font-medium mb-6">Order Summary</h2>
            
            {/* Items */}
            <div className="mb-6">
              <h3 className="font-medium mb-3 pb-3 border-b">Items ({cartItems.length})</h3>
              <div className="space-y-4 max-h-60 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || (item.images && item.images[0]) || "/images/placeholder.jpg"}
                        alt={item.name || item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="text-sm font-medium truncate">{item.name || item.title}</div>
                      <div className="text-xs text-gray-500">
                        Qty: {item.quantity || 1}
                      </div>
                      <div className="text-sm">
                        ₦{typeof item.price === 'string' 
                          ? parseFloat(item.price.replace(/,/g, '')).toLocaleString() 
                          : item.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₦{orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{selectedShippingMethod ? `₦${orderSummary.shipping.toLocaleString()}` : '-'}</span>
              </div>
              {selectedPackaging && selectedPackaging.price > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Packaging ({selectedPackaging.name})</span>
                  <span>₦{selectedPackaging.price.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">VAT (5%)</span>
                <span>₦{orderSummary.tax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>₦{orderSummary.total.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Return to cart */}
            {step === 1 && (
              <button
                onClick={() => navigate('/shopping-bag')}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                Return to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;