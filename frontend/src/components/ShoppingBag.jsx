/* eslint-disable no-unused-vars */
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";
import Banner from "./Banner";
import { toast } from "react-hot-toast";
import RecentlyViewedProducts from "../context/RecentlyViewedProducts";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Helper function to generate product ID (duplicated from CartContext to ensure consistency)
const generateProductId = (product) => {
  if (product.id) return product.id;

  const nameStr = product.name || "";
  const sizeStr = product.selectedSize || "default";
  const colorStr = product.color || "";
  const priceStr = String(product.price || "");

  return `${nameStr}-${sizeStr}-${colorStr}-${priceStr}`;
};

export default function ShoppingBag() {
  const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipingItem, setSwipingItem] = useState(null);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const itemId = generateProductId(item);
    const quantity = quantities[itemId] || item.quantity || 1;
    const itemPrice =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/,/g, ""))
        : parseFloat(item.price) || 0;

    return acc + (itemPrice * quantity);
  }, 0);

  const estimatedTax = subtotal * 0.05;
  const shipping = subtotal > 100000 ? 0 : 5000;
  const total = subtotal + estimatedTax + shipping;

  // Handle quantity update
  const handleQuantityUpdate = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Update local state for immediate UI response
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
    
    // Update cart context
    updateCartItemQuantity(itemId, newQuantity);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };
  
  // Generate a transaction ID 
  const transactionId = "TEMPCART-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Proceed to checkout
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }
    
    // Prepare order data to pass to checkout
    const orderData = {
      items: cartItems.map(item => {
        const itemId = generateProductId(item);
        return {
          ...item,
          quantity: quantities[itemId] || item.quantity || 1
        };
      }),
      subtotal,
      tax: estimatedTax,
      shipping,
      total,
      transactionId
    };
    
    // Store order data in sessionStorage
    sessionStorage.setItem('checkoutData', JSON.stringify(orderData));
    
    // Navigate to checkout
    navigate('/checkout');
  };

  // Handle swipe for mobile (basic implementation)
  const handleTouchStart = (e, itemId) => {
    setTouchStart(e.targetTouches[0].clientX);
    setSwipingItem(itemId);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 100;
    
    if (isLeftSwipe && swipingItem) {
      // Show remove confirmation
      if (window.confirm("Remove this item from your cart?")) {
        removeFromCart(swipingItem);
        toast.success("Item removed from cart");
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    setSwipingItem(null);
  };

  return (
    <>
      <div className="min-h-screen bg-white pb-20 md:pb-0">
        <Navbar />
        {/* Reduced banner height for mobile */}
        <div className="h-[100px] md:h-[150px] bg-gray-100 flex items-center justify-center">
          <h1 className="text-xl md:text-2xl font-medium uppercase">Shopping Bag</h1>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4 lg:mt-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Left side - Selections */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-md md:text-lg font-medium mb-3 uppercase">SELECTIONS</h2>
              <div className="border-t border-gray-200">
                {!cartItems || cartItems.length === 0 ? (
                  <p className="text-center text-gray-600 py-6">Your shopping bag is empty.</p>
                ) : (
                  cartItems.map((item) => {
                    const itemId = generateProductId(item);
                    const quantity = quantities[itemId] || item.quantity || 1;
                    const itemPrice = 
                      typeof item.price === "string"
                        ? parseFloat(item.price.replace(/,/g, ""))
                        : parseFloat(item.price) || 0;
                    
                    return (
                      <div
                        key={itemId}
                        className="flex flex-row py-4 border-b border-gray-200"
                        onTouchStart={(e) => handleTouchStart(e, itemId)}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        {/* Product Image - Smaller on mobile */}
                        <div className="w-[80px] sm:w-[120px] md:w-[150px] h-[100px] sm:h-[160px] md:h-[200px] overflow-hidden">
                          <img
                            src={
                              item.images?.[0] ||
                              item.image ||
                              "/images/placeholder.jpg"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details - More compact for mobile */}
                        <div className="ml-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-[14px] sm:text-[16px] font-medium truncate max-w-[180px] sm:max-w-full">{item.name}</h3>
                            <p className="text-[11px] text-gray-500">{item.color} • {item.selectedSize}</p>
                          </div>
                          
                          {/* Quantity Controls - Better tap targets */}
                          <div className="flex items-center mt-2">
                            <button
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded"
                              onClick={() => handleQuantityUpdate(itemId, quantity - 1)}
                              disabled={quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <span className="text-lg">−</span>
                            </button>
                            <span className="mx-3 text-[12px] min-w-[20px] text-center">{quantity}</span>
                            <button
                              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded"
                              onClick={() => handleQuantityUpdate(itemId, quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <span className="text-lg">+</span>
                            </button>
                            
                            {/* Mobile price display */}
                            <span className="ml-auto font-medium text-[14px]">
                              {formatCurrency(itemPrice * quantity)}
                            </span>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex mt-2 text-[11px] space-x-2">
                            <button 
                              className="text-gray-600 underline"
                              onClick={() => navigate(`/product/${item.id}`)}
                            >
                              EDIT
                            </button>
                            <span>|</span>
                            <button 
                              className="text-gray-600 underline"
                              onClick={() => {
                                removeFromCart(itemId);
                                toast.success("Item removed from cart");
                              }}
                            >
                              REMOVE
                            </button>
                            <button 
                              className="text-gray-600 underline ml-auto"
                              onClick={() => {
                                // Save for later functionality 
                                toast.success("Item saved for later");
                                removeFromCart(itemId);
                              }}
                            >
                              SAVE FOR LATER
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right side - Order summary (desktop) */}
            <div className="w-full lg:w-1/3 mt-6 lg:mt-0 hidden md:block">
              <div className="border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-medium mb-2">ORDER SUMMARY</h2>
                <p className="text-sm text-gray-500 mb-4">{transactionId}</p>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between py-2">
                    <p className="text-sm">Subtotal</p>
                    <p className="text-sm">{formatCurrency(subtotal)}</p>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <p className="text-sm">Shipping</p>
                    <div className="text-sm flex flex-col sm:flex-row sm:items-center">
                      <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                      <button className="mt-1 sm:mt-0 sm:ml-2 text-xs text-gray-500">
                        <span className="underline">Generate shipping cost</span> ▼
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <p className="text-sm">Estimated Tax</p>
                    <p className="text-sm">{formatCurrency(estimatedTax)}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between font-medium">
                    <p>Estimated Total</p>
                    <p>{formatCurrency(total)}</p>
                  </div>
                </div>
                
                {/* Payment buttons */}
                <div className="mt-6 space-y-4">
                  <button 
                    className="w-full bg-black text-white py-3 text-sm font-medium uppercase"
                    onClick={handleProceedToCheckout}
                  >
                    CHECKOUT
                  </button>
                  
                  <div className="text-center text-sm text-gray-500">OR</div>
                  
                  <button className="w-full border border-gray-300 py-3 flex items-center justify-center">
                    <span className="mr-2 text-sm">PAY WITH</span>
                    <img src="/icons/applepay.svg" alt="Apple Pay" className="h-8 sm:h-12" />
                  </button>
                  
                  <button className="w-full border border-gray-300 py-3 flex items-center justify-center">
                    <span className="mr-2 text-sm">PAY WITH</span>
                    <img src="/icons/googlepay.svg" alt="Google Pay" className="h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile Order Summary - Compact Version */}
            {isMobile && (
              <div className="border-t border-gray-200 mt-2 pt-3 mb-20">
                <div className="flex justify-between py-2">
                  <p className="text-sm">Subtotal</p>
                  <p className="text-sm font-medium">{formatCurrency(subtotal)}</p>
                </div>
                <div className="flex justify-between py-2">
                  <p className="text-sm">Shipping + Tax</p>
                  <p className="text-sm font-medium">{formatCurrency(shipping + estimatedTax)}</p>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
                  <p className="font-medium">Total</p>
                  <p className="font-medium">{formatCurrency(total)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating Checkout Button for Mobile */}
        {isMobile && cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 shadow-lg border-t">
            <button 
              className="w-full bg-black text-white py-3 text-sm font-medium uppercase rounded"
              onClick={handleProceedToCheckout}
            >
              CHECKOUT • {formatCurrency(total)}
            </button>
          </div>
        )}
      </div>
      <RecentlyViewedProducts />
    </>
  );
}