import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from "prop-types";


const CartDrawer = ({ isOpen, onClose, product, quantity = 1 }) => {
  if (!product) return null;

  // Format price for calculations - handle different price formats
  const priceValue = typeof product.price === 'string' 
    ? parseFloat(product.price.replace(/,/g, '')) 
    : parseFloat(product.price || 0);
  const totalPrice = (priceValue * quantity).toLocaleString();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">ADDED TO SHOPPING BAG</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>

              {/* Product */}
              <div className="flex mb-6 pb-6 border-b border-gray-200">
                {/* Product Image */}
                <div className="w-24 h-24 bg-gray-100 mr-4">
                  <img 
                    src={product.images?.[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-base font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Quantity: {quantity}</p>
                  <p className="text-sm font-medium">₦{product.price}</p>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-between items-center mb-6 py-4">
                <span className="text-base font-medium">Total</span>
                <span className="text-base font-medium">₦{totalPrice}</span>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors">
                  PROCEED TO CHECKOUT
                </button>
                <button className="w-full bg-white text-black border border-black py-3 hover:bg-gray-100 transition-colors">
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

CartDrawer.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    product: PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string),
    }),
    quantity: PropTypes.number,
  };

export default CartDrawer;