// frontend/src/pages/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PaymentProcessor from "../components/PaymentProcessor";
import ShippingForm from "../components/ShippingForm";
import OrderSummary from "../components/OrderSummary";
import PackagingSelection from "../components/PackagingSelection";
import CheckoutNavbar from "../components/CheckOutNavbar";
import packagingOptions from "../config/packagingOptions";
import paymentService from "../services/paymentService";
import shippingService from "../services/shippingService";

const Checkout = () => {
  // Navigation and hooks
  const navigate = useNavigate();
  const { cartItems, getCartTotals, clearCart, checkStockAvailability } =
    useCart();
  const { currentUser, isAuthenticated } = useAuth();

  // State management
  const [currentStep, setCurrentStep] = useState("shipping");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedPackaging, setSelectedPackaging] = useState(
    packagingOptions[0]
  ); // Default to standard
  const [giftMessage, setGiftMessage] = useState("");
  const [showGiftMessage, setShowGiftMessage] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect to cart if empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/shopping-bag");
      toast.error("Your cart is empty. Please add items before checkout.");
    }
  }, [cartItems, navigate]);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin?redirect=checkout");
      toast.error("Please sign in to continue with checkout.");
    }
  }, [isAuthenticated, navigate]);

  // Handle shipping form submission
  const handleShippingSubmit = async (formData) => {
    try {
      // Check stock availability before proceeding
      const stockCheck = await checkStockAvailability();
      if (!stockCheck) {
        toast.error(
          "Some items in your cart are out of stock or quantities have been adjusted"
        );
        navigate("/shopping-bag");
        return;
      }

      // Save shipping address
      setShippingAddress(formData);

      // Calculate shipping cost based on address
      const { subtotal } = getCartTotals();

      const shippingEstimate = await shippingService.getShippingEstimate(
        { items: cartItems, total: subtotal },
        formData
      );

      if (shippingEstimate.success) {
        setShippingMethod(shippingEstimate.provider);
        setShippingCost(shippingEstimate.cost);

        // Move to packaging selection
        setCurrentStep("packaging");
      } else {
        toast.error(
          shippingEstimate.message || "Failed to calculate shipping cost"
        );
      }
    } catch (error) {
      console.error("Error processing shipping:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Handle packaging selection
  const handlePackagingSubmit = () => {
    // If gift packaging is selected but no message is provided, show prompt
    if (
      selectedPackaging.id === "gift" &&
      !giftMessage.trim() &&
      !showGiftMessage
    ) {
      setShowGiftMessage(true);
      toast("Would you like to add a gift message?", { icon: "🎁" });
      return;
    }

    // Proceed to review
    setCurrentStep("review");
  };

  // Handle review submission and create order
  const handleReviewSubmit = async () => {
    setIsProcessingOrder(true);

    try {
      // Generate a unique reference for the transaction
      const reference = paymentService.generateTransactionReference();

      // Get cart totals
      const { subtotal } = getCartTotals();
      const tax = Math.round(subtotal * 0.05); // 5% tax

      // Add packaging cost
      const packagingCost = selectedPackaging.price;

      // Calculate total
      const total = subtotal + shippingCost + tax + packagingCost;

      // Create order on backend
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            variantId: item.variantId || item.id,
            quantity: item.quantity || 1,
            title: item.name || item.title,
            price:
              typeof item.price === "string"
                ? parseFloat(item.price)
                : item.price,
            image: item.image || (item.images && item.images[0]),
          })),
          subtotal,
          tax,
          shipping: shippingCost,
          packagingOption: selectedPackaging,
          giftMessage: giftMessage.trim() || null,
          total,
          transactionId: reference,
          reference,
          shippingProvider: shippingMethod,
          estimatedDeliveryDays: "3-5", // Default estimate
          shippingAddress: {
            ...shippingAddress,
            email: currentUser.email,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Prepare order data for payment processing
        setOrderData({
          id: data.orderId,
          reference: reference,
          email: currentUser.email,
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          subtotal,
          shipping: shippingCost,
          packaging: packagingCost,
          tax,
          total,
          items: cartItems,
        });

        // Move to payment step
        setCurrentStep("payment");
      } else {
        toast.error(
          data.message || "Failed to create order. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        "An error occurred while processing your order. Please try again."
      );
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentResult) => {
    setIsRedirecting(true);
    try {
      // Verify that the order was created in Shopify (additional server call)
      const orderResponse = await fetch(
        `/api/orders/${paymentResult.order.id}/verify-shopify`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      clearCart();
      localStorage.removeItem('cart');
      

      const orderData = await orderResponse.json();

      // If Shopify order wasn't created yet, trigger creation
      if (!orderData.shopifyOrderId) {
        await fetch(`/api/orders/${paymentResult.order.id}/create-shopify`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      // Clear the cart
      

      // Show success message
      toast.success("Your order has been placed successfully!");

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${paymentResult.order.id}`);
    } catch (error) {
      console.error("Error finalizing order:", error);
      // Even if Shopify sync fails, the order was still placed in our system
      setIsRedirecting(false);
      clearCart();
      localStorage.removeItem('cart');
      toast.success("Your order has been placed successfully!");
      navigate(`/order-confirmation/${paymentResult.order.id}`);
    }
  };

  // Handle payment cancellation
  const handlePaymentCancel = () => {
    // Go back to review step
    setCurrentStep("review");
    toast.error("Payment cancelled. You can try again.");
  };

  // Handle back button navigation
  const handleBackClick = () => {
    switch (currentStep) {
      case "packaging":
        setCurrentStep("shipping");
        break;
      case "review":
        setCurrentStep("packaging");
        break;
      case "payment":
        setCurrentStep("review");
        break;
      default:
        navigate("/shopping-bag");
        break;
    }
  };

  // Render progress steps indicator
  const renderProgressSteps = () => {
    const steps = [
      { id: "shipping", label: "Shipping" },
      { id: "packaging", label: "Packaging" },
      { id: "review", label: "Review" },
      { id: "payment", label: "Payment" },
    ];

    return (
      <div className="flex justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step.id
                  ? "bg-black text-white"
                  : steps.indexOf(steps.find((s) => s.id === currentStep)) >
                    index
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {steps.indexOf(steps.find((s) => s.id === currentStep)) >
              index ? (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Step label */}
            <div
              className={`text-sm ml-2 ${
                currentStep === step.id
                  ? "text-black font-medium"
                  : "text-gray-600"
              }`}
            >
              {step.label}
            </div>

            {/* Connector line (except after last step) */}
            {index < steps.length - 1 && (
              <div className="w-16 h-[1px] bg-gray-300 mx-4"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Calculate order summary for the current state
  const getOrderSummary = () => {
    const { subtotal, itemCount } = getCartTotals();
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const packagingCost = selectedPackaging ? selectedPackaging.price : 0;
    const total = subtotal + (shippingCost || 0) + tax + packagingCost;

    return {
      subtotal,
      itemCount,
      shipping: shippingCost || 0,
      tax,
      packaging: packagingCost,
      total,
    };
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    const summary = getOrderSummary();

    switch (currentStep) {
      case "shipping":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ShippingForm
                onSubmit={handleShippingSubmit}
                isLoading={isProcessingOrder}
                initialData={shippingAddress}
              />
            </div>
            <div>
              <OrderSummary {...summary} />
            </div>
          </div>
        );

      case "packaging":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PackagingSelection
                selectedPackaging={selectedPackaging}
                onSelectPackaging={setSelectedPackaging}
                giftMessage={giftMessage}
                onGiftMessageChange={setGiftMessage}
              />

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBackClick}
                  className="text-gray-600 hover:text-black flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                  Back to Shipping
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePackagingSubmit}
                  className="px-6 py-2 bg-black text-white"
                >
                  Continue to Review
                </motion.button>
              </div>
            </div>
            <div>
              <OrderSummary {...summary} />
            </div>
          </div>
        );

      case "review":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Order review section */}
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    Review Your Order
                  </h3>

                  {/* Shipping information */}
                  <div className="border rounded-lg p-6 mb-6">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-medium">Shipping Information</h4>
                      <button
                        onClick={() => setCurrentStep("shipping")}
                        className="text-sm text-gray-600 hover:text-black underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Contact</p>
                        <p>{currentUser.email}</p>
                        <p>{shippingAddress.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Ship to</p>
                        <p>
                          {shippingAddress.firstName} {shippingAddress.lastName}
                        </p>
                        <p>{shippingAddress.address}</p>
                        <p>
                          {shippingAddress.city}, {shippingAddress.state}
                        </p>
                        <p>{shippingAddress.country}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 text-sm">Shipping Method</p>
                      <p>
                        {shippingMethod} (₦{shippingCost.toLocaleString()}) -
                        Estimated delivery: 3-5 business days
                      </p>
                    </div>
                  </div>

                  {/* Packaging information */}
                  <div className="border rounded-lg p-6 mb-6">
                    <div className="flex justify-between mb-4">
                      <h4 className="font-medium">Packaging</h4>
                      <button
                        onClick={() => setCurrentStep("packaging")}
                        className="text-sm text-gray-600 hover:text-black underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={selectedPackaging.imageUrl}
                        alt={selectedPackaging.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <p className="font-medium">{selectedPackaging.name}</p>
                        <p className="text-sm text-gray-600">
                          {selectedPackaging.description}
                        </p>
                        {selectedPackaging.price > 0 ? (
                          <p className="text-sm">
                            ₦{selectedPackaging.price.toLocaleString()}
                          </p>
                        ) : (
                          <p className="text-sm text-green-600">Free</p>
                        )}
                      </div>
                    </div>
                    {selectedPackaging.id === "gift" && giftMessage && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-sm mb-2">
                          Gift Message:
                        </p>
                        <p className="text-sm italic bg-gray-50 p-3 rounded">
                          {giftMessage}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Items */}
                  <div className="border rounded-lg p-6">
                    <h4 className="font-medium mb-4">
                      Order Items ({cartItems.length})
                    </h4>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center border-b border-gray-100 pb-4"
                        >
                          <img
                            src={item.image || (item.images && item.images[0])}
                            alt={item.name || item.title}
                            className="w-16 h-16 object-cover rounded mr-4"
                          />
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.name || item.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity || 1}
                            </p>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium">
                              ₦
                              {(
                                (typeof item.price === "string"
                                  ? parseFloat(item.price) * 1000
                                  : item.price) * (item.quantity || 1)
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={handleBackClick}
                    className="text-gray-600 hover:text-black flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                    Back to Packaging
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReviewSubmit}
                    disabled={isProcessingOrder}
                    className="px-6 py-2 bg-black text-white flex items-center justify-center min-w-[150px]"
                  >
                    {isProcessingOrder ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
            <div>
              <OrderSummary {...summary} />
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PaymentProcessor
                orderData={orderData}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentCancel={handlePaymentCancel}
              />
            </div>
            <div>
              <OrderSummary {...summary} />
            </div>
          </div>
        );

      default:
        return <p>Loading...</p>;
    }
  };

  // If cart is empty, don't render the checkout page
  if (cartItems.length === 0 || !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <CheckoutNavbar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-thin mb-8 text-center uppercase tracking-wider">
          Checkout
        </h1>

        {/* Progress steps indicator */}
        {renderProgressSteps()}

        {/* Main content */}
        <div className="mb-16">{renderStepContent()}</div>
      </div>
      {isRedirecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <div className="animate-spin w-16 h-16 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-medium mb-2">Processing Your Order</h2>
            <p>Please wait while we complete your purchase...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
