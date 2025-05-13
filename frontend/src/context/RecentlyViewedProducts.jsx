import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PropTypes from "prop-types";

// Create a new context for recently viewed products
import { createContext, useContext } from "react";

const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const MAX_ITEMS = 8; // Maximum number of recently viewed items to store

  // Load from localStorage on initial render
  useEffect(() => {
    const savedItems = localStorage.getItem("recentlyViewed");
    if (savedItems) {
      try {
        setRecentlyViewed(JSON.parse(savedItems));
      } catch (error) {
        console.error("Error parsing recently viewed items:", error);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Add a product to recently viewed
  const addToRecentlyViewed = (product) => {
    if (!product || !product.id) return;

    setRecentlyViewed((prev) => {
      // Remove the product if it already exists
      const filtered = prev.filter((item) => item.id !== product.id);

      // Add the product to the beginning of the array
      const updated = [product, ...filtered];

      // Limit the array to MAX_ITEMS
      return updated.slice(0, MAX_ITEMS);
    });
  };

  // Clear recently viewed
  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    localStorage.removeItem("recentlyViewed");
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error(
      "useRecentlyViewed must be used within a RecentlyViewedProvider"
    );
  }
  return context;
};

// Main component for displaying recently viewed products
const RecentlyViewedProducts = () => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const { addToCart } = useCart();

  // Don't render if there are no recently viewed products
  if (!recentlyViewed.length) return null;

  return (
    <div className="py-12 px-4 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-thin uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst">
            Recently Viewed
          </h2>
          <button
            onClick={clearRecentlyViewed}
            className="cursor-pointer text-xs text-gray-500 underline hover:text-black transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentlyViewed.slice(0, 4).map((product) => (
            <RecentlyViewedProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Individual product card
const RecentlyViewedProductCard = ({ product, addToCart }) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50 aspect-[3/4]">
          {/* Main product image */}
          <img
            src={
              product.images?.[0] || product.image || "/images/placeholder.jpg"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />

          {/* Quick add overlay */}
          <AnimatePresence>
            {isHovering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-3 px-4"
              >
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black text-white text-xs uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst py-2 hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  Quick Add
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-3">
          <h3 className="text-sm font-thin uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst truncate">
            {product.name}
          </h3>
          <p className="text-sm mt-1">₦{product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
};

RecentlyViewedProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

RecentlyViewedProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default RecentlyViewedProducts;
