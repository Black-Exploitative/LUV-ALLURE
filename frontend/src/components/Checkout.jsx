import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";
import Banner from "./Banner";
import { toast } from "react-hot-toast";

// Helper function to generate product ID (duplicated from CartContext to ensure consistency)
const generateProductId = (product) => {
  if (product.id) return product.id;
  
  const nameStr = product.name || '';
  const sizeStr = product.selectedSize || 'default';
  const colorStr = product.color || '';
  const priceStr = String(product.price || '');
  
  return `${nameStr}-${sizeStr}-${colorStr}-${priceStr}`;
};

export default function Checkout() {
  const { cartItems, removeFromCart } = useCart();

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = typeof item.price === 'string'
      ? parseFloat(item.price.replace(/,/g, ''))
      : (parseFloat(item.price) || 0);
    
    return acc + itemPrice;
  }, 0);

  const estimatedTax = subtotal * 0.05;
  const shipping = subtotal > 100 ? 0 : 5;
  const total = subtotal + estimatedTax + shipping;

  // Handle quantity update (placeholder function as it's not implemented in your context)
  const updateQuantity = (itemId, quantity) => {
    console.log(`Update quantity for ${itemId} to ${quantity}`);
    // This function doesn't exist in your context, so you'd need to implement it
    toast.info("Quantity update functionality not implemented yet");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Banner title="Checkout" />

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Cart Items */}
        <div className="md:col-span-2 bg-white p-6 shadow-md">
          {!cartItems || cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={generateProductId(item)} className="flex items-center justify-between border-b py-4">
                {/* Product Image */}
                <img 
                  src={item.images?.[0] || item.image || "/images/placeholder.jpg"} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover" 
                />

                {/* Product Details */}
                <div className="ml-4 flex-1">
                  <p className="font-semibold">{item.name}</p>
                  {item.selectedSize && (
                    <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
                  )}
                  {item.color && (
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-300"
                    onClick={() => updateQuantity(generateProductId(item), (item.quantity || 1) - 1)}
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{item.quantity || 1}</span>
                  <button
                    className="px-3 py-1 bg-gray-300"
                    onClick={() => updateQuantity(generateProductId(item), (item.quantity || 1) + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  className="text-red-500 ml-4"
                  onClick={() => {
                    removeFromCart(generateProductId(item));
                    toast.success("Item removed from cart");
                  }}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
          <hr className="my-2" />

          <div className="flex justify-between py-2">
            <p>Subtotal</p>
            <p>₦{subtotal.toFixed(2)}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Estimated Tax</p>
            <p>₦{estimatedTax.toFixed(2)}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Shipping</p>
            <p>{shipping === 0 ? "Free" : `₦${shipping.toFixed(2)}`}</p>
          </div>

          <hr className="my-2" />
          <div className="flex justify-between font-semibold py-2">
            <p>Estimated Total</p>
            <p>₦{total.toFixed(2)}</p>
          </div>

          <button className="w-full bg-black text-white py-3 mt-4">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}