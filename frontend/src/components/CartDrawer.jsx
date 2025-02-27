import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    cartItems,
    selectedProduct, 
    getCartTotals,
    removeFromCart
  } = useCart();

  // If drawer is closed, don't render anything
  if (!isCartDrawerOpen) return null;

  const { subtotal } = getCartTotals();
  const formattedSubtotal = subtotal.toLocaleString();
  
  // Show recently added product if available, otherwise show all cart items
  const displayItems = selectedProduct ? [selectedProduct] : cartItems;

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setIsCartDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-96 z-50 bg-white shadow-lg flex flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium tracking-wide">
                    {selectedProduct ? 'ADDED TO BAG' : 'SHOPPING BAG'}
                  </h2>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <img src="/icons/close-menu.svg" alt="Close" className="w-5 h-5" />
                  </button>
                </div>
                {selectedProduct && (
                  <p className="text-sm text-gray-500 mt-1">Item successfully added to your bag</p>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {displayItems.length > 0 ? (
                  <>
                    {/* Products */}
                    <div className="space-y-6 mb-6">
                      {displayItems.map((product, index) => (
                        <div key={product.id || index} className="flex space-x-4 pb-6 border-b border-gray-100">
                          {/* Product Image */}
                          <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
                            <img 
                              src={product.images?.[0] || product.image || "/images/placeholder.jpg"} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-sm font-medium uppercase mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">₦{product.price}</p>
                              </div>
                              {!selectedProduct && (
                                <button 
                                  onClick={() => removeFromCart(product.id)}
                                  className="text-gray-400 hover:text-gray-700"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            
                            <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-gray-500">
                              {product.selectedSize && (
                                <div>
                                  <span className="uppercase">Size: </span>
                                  <span>{product.selectedSize}</span>
                                </div>
                              )}
                              {product.color && (
                                <div>
                                  <span className="uppercase">Color: </span>
                                  <span>{product.color}</span>
                                </div>
                              )}
                              {product.quantity && (
                                <div>
                                  <span className="uppercase">Qty: </span>
                                  <span>{product.quantity}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View all items link */}
                    {selectedProduct && cartItems.length > 1 && (
                      <button 
                        onClick={() => {
                          // Clear selected product to show all items
                          setIsCartDrawerOpen(true);
                        }}
                        className="text-sm underline text-gray-600 hover:text-black mb-6 block"
                      >
                        View all items ({cartItems.length})
                      </button>
                    )}
                  </>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-gray-500">Your shopping bag is empty</p>
                  </div>
                )}
              </div>
            </div>

            {displayItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-white">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase">Subtotal</span>
                  <span className="text-base font-medium">₦{formattedSubtotal}</span>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button 
                    className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors text-sm uppercase tracking-wide"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate('/checkout');
                    }}
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    className="w-full bg-white text-black border border-black py-3 hover:bg-gray-50 transition-colors text-sm uppercase tracking-wide"
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      navigate('/shopping-bag');
                    }}
                  >
                    View Shopping Bag
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;