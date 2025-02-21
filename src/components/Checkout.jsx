import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import { toast } from "react-hot-toast";

export default function Checkout() {
  const { cart, updateQuantity, removeFromCart } = useCart();


  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.05; 
  const shipping = subtotal > 100 ? 0 : 5;
  const total = subtotal + estimatedTax + shipping;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Banner title="Checkout" />

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Cart Items */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {cart.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b py-4">
                {/* Product Image */}
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />

                {/* Product Details */}
                <div className="ml-4 flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Color: {item.color}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-300 rounded"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-300 rounded"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  className="text-red-500 ml-4"
                  onClick={() => {
                    removeFromCart(item.id);
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>
          <hr className="my-2" />

          <div className="flex justify-between py-2">
            <p>Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Estimated Tax</p>
            <p>${estimatedTax.toFixed(2)}</p>
          </div>

          <div className="flex justify-between py-2">
            <p>Shipping</p>
            <p>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
          </div>

          <hr className="my-2" />
          <div className="flex justify-between font-semibold py-2">
            <p>Estimated Total</p>
            <p>${total.toFixed(2)}</p>
          </div>

          <button className="w-full bg-black text-white py-3 mt-4 hover:bg-gray-800">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
