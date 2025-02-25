import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    isCartDrawerOpen, 
    setIsCartDrawerOpen, 
    selectedProduct, 
    getCartTotals 
  } = useCart();

  if (!selectedProduct) return null;

  const { subtotal } = getCartTotals();
  const formattedSubtotal = subtotal.toLocaleString();

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
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">ADDED TO SHOPPING BAG</h2>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img src="/icons/close-menu.svg" alt="Close" className="w-5 h-5" />
                </button>
              </div>

              {/* Product */}
              <div className="flex mb-6 pb-6 border-b border-gray-200">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 mr-4">
                  <img 
                    src={selectedProduct.images?.[0] || selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-base font-medium mb-1">{selectedProduct.name}</h3>
                  {selectedProduct.selectedSize && (
                    <p className="text-sm text-gray-600 mb-1">Size: {selectedProduct.selectedSize}</p>
                  )}
                  {selectedProduct.color && (
                    <p className="text-sm text-gray-600 mb-1">Color: {selectedProduct.color}</p>
                  )}
                  <p className="text-sm font-medium">₦{selectedProduct.price}</p>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-between items-center mb-6 py-4">
                <span className="text-base font-medium">Total</span>
                <span className="text-base font-medium">₦{formattedSubtotal}</span>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button 
                  className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                >
                  PROCEED TO CHECKOUT
                </button>
                <button 
                  className="w-full bg-white text-black border border-black py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/cart');
                  }}
                >
                  VIEW SHOPPING BAG
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;