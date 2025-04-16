import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import CheckoutNavbar from "../components/CheckOutNavbar";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import shippingService from "../services/shippingService";
import PackagingOptions from "../components/PackagingOptions";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [checkoutData, setCheckoutData] = useState(null);
  const [nigerianStates, setNigerianStates] = useState([]);
  const [selectedPackaging, setSelectedPackaging] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    zipCode: "",
    saveInfo: false
  });

  // Load checkout data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem('checkoutData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCheckoutData(parsedData);
      
      // Set default packaging to normal
      setSelectedPackaging({
        id: 'normal',
        name: 'Standard Packaging',
        price: 0
      });
    } else if (cartItems.length === 0) {
      // Redirect if no stored data and cart is empty
      toast.error("No items to checkout");
      navigate('/shopping-bag');
    }

    // Load saved address from localStorage if available
    const savedAddress = localStorage.getItem('savedAddress');
    if (savedAddress) {
      setFormData({...formData, ...JSON.parse(savedAddress)});
    }
    
    // Load Nigerian states from shipping service
    setNigerianStates(shippingService.getNigerianStates());
  }, [navigate, cartItems.length]);

  // Update total when packaging option changes
  useEffect(() => {
    if (checkoutData && selectedPackaging) {
      updateTotal();
    }
  }, [selectedPackaging]);

  // Trigger shipping calculation when state or city changes
  useEffect(() => {
    if (checkoutData && formData.state && formData.city) {
      calculateShipping();
    }
  }, [formData.state, formData.city, formData.address]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Update total price based on selected packaging
  const updateTotal = () => {
    if (!checkoutData) return;
    
    const packagingPrice = selectedPackaging?.price || 0;
    
    const updatedData = {
      ...checkoutData,
      packagingPrice,
      packagingOption: selectedPackaging,
      total: checkoutData.subtotal + checkoutData.tax + checkoutData.shipping + packagingPrice
    };
    
    setCheckoutData(updatedData);
    sessionStorage.setItem('checkoutData', JSON.stringify(updatedData));
  };

  // Calculate shipping based on address
  const calculateShipping = async () => {
    if (!checkoutData || !formData.state) return;
    
    try {
      setCalculatingShipping(true);
      
      // Get shipping estimate
      const estimate = await shippingService.getShippingEstimate(
        checkoutData,
        {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country
        }
      );
      
      if (estimate.success) {
        // Get packaging price
        const packagingPrice = selectedPackaging?.price || 0;
        
        // Update checkout data with new shipping cost
        const updatedData = {
          ...checkoutData,
          shipping: estimate.cost,
          shippingProvider: estimate.provider,
          estimatedDeliveryDays: estimate.estimatedDeliveryDays,
          packagingPrice,
          packagingOption: selectedPackaging,
          total: checkoutData.subtotal + checkoutData.tax + estimate.cost + packagingPrice
        };
        
        setCheckoutData(updatedData);
        sessionStorage.setItem('checkoutData', JSON.stringify(updatedData));
        
        toast.success(`Shipping calculated with ${estimate.provider}: ₦${estimate.cost.toLocaleString()}`);
      } else {
        toast.error(estimate.message || "Couldn't calculate shipping");
      }
    } catch (error) {
      console.error("Shipping calculation error:", error);
      toast.error("Failed to calculate shipping cost");
    } finally {
      setCalculatingShipping(false);
    }
  };

  // Handle packaging selection
  const handleSelectPackaging = (option) => {
    setSelectedPackaging(option);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  // Initialize Paystack payment
  const initializePaystack = async () => {
    if (!checkoutData) {
      toast.error("No checkout data available");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 1. Create order in our system first
      const orderResponse = await api.post('/orders/create', {
        items: checkoutData.items,
        subtotal: checkoutData.subtotal,
        tax: checkoutData.tax,
        shipping: checkoutData.shipping,
        packagingOption: selectedPackaging,
        packagingPrice: selectedPackaging?.price || 0,
        total: checkoutData.total,
        transactionId: checkoutData.transactionId,
        shippingProvider: checkoutData.shippingProvider,
        estimatedDeliveryDays: checkoutData.estimatedDeliveryDays,
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
      });
      
      const { orderId, reference } = orderResponse.data;
      
      // Save address if requested
      if (formData.saveInfo) {
        const addressData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
          phone: formData.phone,
          email: formData.email
        };
        localStorage.setItem('savedAddress', JSON.stringify(addressData));
      }
      
      // 2. Initialize Paystack
      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: checkoutData.total * 100, // Paystack expects amount in kobo
        ref: reference,
        onClose: () => {
          // Handle cancel
          toast.info("Payment cancelled");
          setIsLoading(false);
        },
        callback: async (response) => {
          // Handle successful payment
          try {
            // 3. Verify payment and update order
            const verifyResponse = await api.post('/orders/verify-payment', {
              orderId,
              reference: response.reference,
              transactionId: checkoutData.transactionId
            });
            
            if (verifyResponse.data.status === 'success') {
              // 4. Clear cart and redirect to success page
              clearCart();
              sessionStorage.removeItem('checkoutData');
              
              // Store order ID for success page
              sessionStorage.setItem('completedOrderId', orderId);
              
              toast.success("Payment successful!");
              navigate('/order-confirmation');
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("There was a problem verifying your payment");
          } finally {
            setIsLoading(false);
          }
        }
      });
      
      handler.openIframe();
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment");
      setIsLoading(false);
    }
  };

  // Process the payment based on selected method
  const processPayment = async (e) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Verify shipping has been calculated
    if (!checkoutData.shippingProvider) {
      toast.error("Please calculate shipping before proceeding");
      return;
    }
    
    // Verify packaging option is selected
    if (!selectedPackaging) {
      toast.error("Please select a packaging option");
      return;
    }
    
    // Process based on payment method
    if (paymentMethod === 'paystack') {
      initializePaystack();
    } else if (paymentMethod === 'applepay') {
      toast.info("Apple Pay is not implemented yet");
    } else if (paymentMethod === 'googlepay') {
      toast.info("Google Pay is not implemented yet");
    }
  };

  // If checkout data is still loading, show loading state
  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
          <p className="mt-4">Loading checkout data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CheckoutNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-medium mb-8 text-center">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Form */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={processPayment}>
              <div className="bg-white p-6 border border-gray-200 mb-6">
                <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 border border-gray-200 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Shipping Address</h2>
                  {calculatingShipping && (
                    <span className="text-sm text-gray-500 flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating shipping...
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State/Province*</label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="">Select a state</option>
                      {nigerianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option value="Nigeria">Nigeria</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
                
                {/* Shipping provider display */}
                {checkoutData.shippingProvider && (
                  <div className="mt-4 bg-gray-50 p-4 rounded">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Method</h3>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="font-medium">
                          {checkoutData.shippingProvider} Delivery
                          {checkoutData.estimatedDeliveryDays && (
                            <span className="font-normal text-sm text-gray-500 ml-2">
                              ({checkoutData.estimatedDeliveryDays} business days)
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Delivery to {formData.city}, {formData.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(checkoutData.shipping)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={calculateShipping}
                    disabled={!formData.state || !formData.city || calculatingShipping}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-800 font-medium border border-gray-300 cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {calculatingShipping ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating...
                      </span>
                    ) : (
                      checkoutData.shippingProvider 
                        ? "Recalculate Shipping" 
                        : "Calculate Shipping"
                    )}
                  </button>
                </div>
                
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Save this information for next time</span>
                  </label>
                </div>
              </div>
              
              {/* Packaging Options Section */}
              <div className="bg-white p-6 border border-gray-200 mb-6">
                <h2 className="text-lg font-medium mb-4">Packaging Options</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Select how you would like your items to be packaged. From our standard protective 
                  packaging to luxury gift options.
                </p>
                
                <PackagingOptions 
                  selectedOption={selectedPackaging}
                  onSelectPackaging={handleSelectPackaging}
                />
              </div>
              
              <div className="bg-white p-6 border border-gray-200">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paystack"
                      checked={paymentMethod === "paystack"}
                      onChange={() => setPaymentMethod("paystack")}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-2 flex-1">Paystack</span>
                    <img src="/icons/paystack-logo.png" alt="Paystack" className="h-6" />
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="applepay"
                      checked={paymentMethod === "applepay"}
                      onChange={() => setPaymentMethod("applepay")}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-2 flex-1">Apple Pay</span>
                    <img src="/icons/apple-pay.svg" alt="Apple Pay" className="h-6" />
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="googlepay"
                      checked={paymentMethod === "googlepay"}
                      onChange={() => setPaymentMethod("googlepay")}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-2 flex-1">Google Pay</span>
                    <img src="/icons/google-pay.svg" alt="Google Pay" className="h-6" />
                  </label>
                </div>
              </div>
            </form>
          </div>
          
          {/* Right side - Order summary */}
          <div className="w-full lg:w-1/3">
            <div className="border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-medium mb-2">ORDER SUMMARY</h2>
              <p className="text-sm text-gray-500 mb-4">{checkoutData.transactionId}</p>
              
              {/* Items */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h3 className="font-medium mb-2 text-sm">Items in your order</h3>
                
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {checkoutData.items.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-12 h-16 bg-gray-100 flex-shrink-0">
                        <img
                          src={item.images?.[0] || item.image || "/images/placeholder.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.color && `${item.color} • `}
                          {item.selectedSize && `${item.selectedSize} • `}
                          Qty: {item.quantity || 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Costs summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between py-2">
                  <p className="text-sm">Subtotal</p>
                  <p className="text-sm">{formatCurrency(checkoutData.subtotal)}</p>
                </div>
                
                <div className="flex justify-between py-2">
                  <p className="text-sm">Shipping</p>
                  <p className="text-sm">
                    {checkoutData.shippingProvider 
                      ? formatCurrency(checkoutData.shipping)
                      : "Calculate above"}
                  </p>
                </div>
                
                <div className="flex justify-between py-2">
                  <p className="text-sm">Packaging</p>
                  <p className="text-sm">
                    {selectedPackaging
                      ? selectedPackaging.price === 0 
                        ? "Free" 
                        : formatCurrency(selectedPackaging.price)
                      : "Select above"}
                  </p>
                </div>
                
                <div className="flex justify-between py-2">
                  <p className="text-sm">Estimated Tax</p>
                  <p className="text-sm">{formatCurrency(checkoutData.tax)}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between font-medium">
                  <p>Estimated Total</p>
                  <p>{formatCurrency(checkoutData.total)}</p>
                </div>
              </div>
              
              {/* Payment button */}
              <div className="mt-6">
                <button 
                  onClick={processPayment}
                  disabled={isLoading || !checkoutData.shippingProvider || !selectedPackaging}
                  className="w-full bg-black text-white py-3 text-sm font-medium uppercase cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                    "Complete Payment"
                  )}
                </button>
                
                {!checkoutData.shippingProvider && (
                  <p className="text-xs text-center text-red-500 mt-2">
                    Please calculate shipping before proceeding
                  </p>
                )}
                
                {!selectedPackaging && (
                  <p className="text-xs text-center text-red-500 mt-2">
                    Please select a packaging option
                  </p>
                )}
              </div>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                By completing your purchase, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}