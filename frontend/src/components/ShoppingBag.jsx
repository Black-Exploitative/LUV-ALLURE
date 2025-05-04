import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";
import Banner from "./Banner";
import { toast } from "react-hot-toast";
import RecentlyViewedProducts from "../context/RecentlyViewedProducts";
import { useState } from "react";
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

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Banner title="Shopping Bag" />

        <div className="container mx-[200px] mt-[50px]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side - Selections */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-lg font-medium mb-4 uppercase">SELECTIONS</h2>
              <div className="border-t border-gray-200">
                {!cartItems || cartItems.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">Your shopping bag is empty.</p>
                ) : (
                  cartItems.map((item) => {
                    const itemId = generateProductId(item);
                    const quantity = quantities[itemId] || item.quantity || 1;
                    
                    return (
                      <div
                        key={itemId}
                        className="flex py-6 border-b border-gray-200"
                      >
                        {/* Product Image */}
                        <div className="w-[190px] h-[240px] flex-shrink-0 overflow-hidden">
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

                        {/* Product Details */}
                        <div className="ml-4 flex-1 flex flex-col justify-between">
                          <div className="flex flex-col space-y-[10px]">
                            <h3 className="text-[18px] font-medium">{item.name}</h3>
                            <p className="text-[12px] text-gray-500">{item.color}</p>
                            <p className="text-[12px] text-gray-500">{item.selectedSize}</p>
                          </div>
                          <div className="flex flex-col space-y-[20px]">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-[25px]">
                              <button
                                className="text-gray-500 cursor-pointer"
                                onClick={() => handleQuantityUpdate(itemId, quantity - 1)}
                                disabled={quantity <= 1}
                              >
                                −
                              </button>
                              <span className="font-normal text-[12px]">{quantity}</span>
                              <button
                                className="text-gray-500 cursor-pointer"
                                onClick={() => handleQuantityUpdate(itemId, quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          

                            {/* Action buttons */}
                            <div className="flex flex-row space-x-2 text-sm">
                              <button 
                                className="text-[12px] text-gray-600 underline hover:text-gray-800"
                                onClick={() => {
                                  // Handle edit action
                                  navigate(`/product/${item.id}`);
                                }}
                              >
                                EDIT
                              </button>
                              <span>|</span>
                              <button 
                                className="text-[12px] text-gray-600 underline hover:text-gray-800"
                                onClick={() => {
                                  removeFromCart(itemId);
                                  toast.success("Item removed from cart");
                                }}
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right side - Order summary */}
            <div className="w-full lg:w-1/3">
              <div className="border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-2">ORDER SUMMARY</h2>
                <p className="text-sm text-gray-500 mb-4">{transactionId}</p>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between py-2">
                    <p className="text-sm">Subtotal</p>
                    <p className="text-sm">{formatCurrency(subtotal)}</p>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <p className="text-sm">Shipping</p>
                    <div className="text-sm flex items-center">
                      <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                      <button className="ml-2 text-xs text-gray-500">
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
                    <span className="mr-2">PAY WITH</span>
                    <img src="/icons/applepay.svg" alt="Apple Pay" className="h-12" />
                  </button>
                  
                  <button className="w-full border border-gray-300 py-3 flex items-center justify-center">
                    <span className="mr-2">PAY WITH</span>
                    <img src="/icons/googlepay.svg" alt="Google Pay" className="h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RecentlyViewedProducts />
    </>
  );
}