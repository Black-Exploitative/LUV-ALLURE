import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight, FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const ProductCard = ({ product, gridType, onProductClick }) => {
  const { 
    id,
    name = "Product Name", 
    price = 0, 
    sizes = [], 
    images = ["/images/placeholder.jpg"],
    color,
    inventory = {}
  } = product || {};

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const cardRef = useRef(null);
  const autoPlayRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  const isMobile = windowWidth < 768;

 
  const validImages = Array.isArray(images) ? images : ["/images/placeholder.jpg"];
  const hasMultipleImages = validImages.length > 1;

  const cardWidthClass = "w-full";   
  
  const getImageHeightClass = () => {
    if (isMobile) {
      return "h-[300px]";
    } else {
      return gridType === 2 ? "h-[1300px]" : "h-[700px]";
    }
  };

  // Tracking manual navigation to pause auto-play
  const [manuallyNavigated, setManuallyNavigated] = useState(false);
  
  // Initialize wishlist state
  useEffect(() => {
    setIsInWishlistState(isInWishlist(id));
  }, [id, isInWishlist]);
  
  // Auto play carousel on hover
  useEffect(() => {
    // Only auto-play if hovered and not manually navigated
    if (isHovered && hasMultipleImages && !manuallyNavigated) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % validImages.length);
      }, 2000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, hasMultipleImages, validImages.length, manuallyNavigated]);
  
  // Reset manual navigation flag when un-hovering
  useEffect(() => {
    if (!isHovered) {
      setManuallyNavigated(false);
    }
  }, [isHovered]);

  const handleImageChange = (direction, e) => {
    if (!hasMultipleImages) return;
    
    // Stop propagation to prevent triggering onProductClick
    if (e) {
      e.stopPropagation();
    }
    
    // Set flag to pause auto-play
    setManuallyNavigated(true);
    
    setCurrentImage(prev => {
      if (direction > 0) {
        return (prev + 1) % validImages.length;
      }
      return prev === 0 ? validImages.length - 1 : prev - 1;
    });
  };

  const handleSizeClick = (size, e) => {
    e.stopPropagation();
    setSelectedSize(selectedSize === size ? "" : size);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    if (!selectedSize) return;
    
    // Check inventory for the selected size
    const availableQuantity = inventory[selectedSize] || 999; // Default to 999 if not specified
    
    const productToAdd = {
      id,
      name,
      price,
      color,
      selectedSize,
      availableQuantity,
      images: validImages
    };
    
    addToCart(productToAdd);
    setSelectedSize("");
  };
  
  const handleWishlistToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    
    const productForWishlist = {
      id,
      name,
      price,
      color,
      images: validImages
    };
    
    const isNowInWishlist = toggleWishlist(productForWishlist);
    setIsInWishlistState(isNowInWishlist);
  };

  // Simplified Product Click - just pass the ID
  const handleProductClick = () => {
    if (onProductClick) {
      // Pass both id and name for the URL slug
      onProductClick(id, name.toLowerCase().replace(/\s+/g, '-'));
    }
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  // Check if item is out of stock
  const isSizeAvailable = (size) => {
    return !inventory[size] || inventory[size] > 0;
  };

  return (
    <motion.div
      className={`${cardWidthClass} relative overflow-hidden group`}
      ref={cardRef} 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {/* Image Carousel Section */}
      <div 
        className={`relative overflow-hidden cursor-pointer ${getImageHeightClass()}`}
      >
        <AnimatePresence initial={false} custom={1}>
          <motion.img
            key={currentImage}
            src={validImages[currentImage]?.src || validImages[currentImage] || '/images/placeholder.jpg'}
            alt={name}
            className={`w-full ${getImageHeightClass()} object-cover absolute top-0 left-0`}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            transition={{
              x: { type: "spring", stiffness: 200, damping: 25 },
              opacity: { duration: 0.3 }
            }}
          />
        </AnimatePresence>

        {/* Wishlist Heart Icon - Adjusted position and size for mobile */}
        <motion.button
          onClick={handleWishlistToggle}
          className={`absolute ${isMobile ? 'top-2 right-2 w-6 h-6' : 'top-4 right-4 w-8 h-8'} z-20 bg-white/70 hover:bg-white rounded-full flex items-center justify-center shadow-md`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered || isInWishlistState ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isInWishlistState ? (
            <FaHeart className="text-red-500" size={isMobile ? 12 : 16} />
          ) : (
            <FiHeart className="text-gray-700" size={isMobile ? 12 : 16} />
          )}
        </motion.button>

        {/* Image Indicator - Smaller on mobile */}
        {hasMultipleImages && (
          <motion.div 
            className={`absolute bottom-4 right-4 bg-white/80 px-2 py-1 ${isMobile ? 'text-[10px]' : 'text-xs'} font-medium rounded`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentImage + 1}/{validImages.length}
          </motion.div>
        )}

        {/* Navigation Arrows - Resized for mobile */}
        {hasMultipleImages && (
          <>
            <motion.div
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white/60 hover:bg-white/90 rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center`}
              onClick={(e) => {
                e.stopPropagation();
                handleImageChange(-1, e);
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronLeft className={`text-black ${isMobile ? 'text-sm' : 'text-lg'}`} />
            </motion.div>

            <motion.div
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white/60 hover:bg-white/90 rounded-full ${isMobile ? 'w-6 h-6' : 'w-8 h-8'} flex items-center justify-center`}
              onClick={(e) => {
                e.stopPropagation();
                handleImageChange(1, e);
              }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronRight className={`text-black ${isMobile ? 'text-sm' : 'text-lg'}`} />
            </motion.div>
          </>
        )}
        
        {/* Quick add button on hover - Smaller text on mobile */}
        {selectedSize && (
          <motion.div 
            className={`absolute left-0 right-0 bottom-0 bg-black text-white text-center ${isMobile ? 'py-2 text-xs' : 'py-3 text-sm'} cursor-pointer`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={handleAddToCart}
          >
            ADD TO BAG
          </motion.div>
        )}
      </div>


      <div className="cursor-pointer mt-2">
        <motion.h3 
          className={`${isMobile ? 'text-xs' : 'text-sm md:text-base'} font-medium text-gray-900 hover:underline line-clamp-1`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {name}
        </motion.h3>
        
        <motion.p 
          className={`text-gray-700 ${isMobile ? 'text-xs mt-1' : 'text-sm md:text-base mt-2'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {typeof price === 'number' ? 
            `₦${price.toLocaleString()}` : 
            'Price unavailable'}
        </motion.p>
      </div>


      {sizes.length > 0 && (
        <motion.div 
          className={`flex flex-wrap ${isMobile ? 'mt-1 gap-1' : 'mt-4'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {sizes.map((size) => (
            <motion.div
              key={size}
              className={`${isMobile ? 'px-1 py-0.5 text-[8px] mr-1 mb-1' : 'px-2 py-1 text-xs md:text-sm mr-2 mb-2'} border cursor-pointer
                ${selectedSize === size 
                  ? "border-black bg-black text-white" 
                  : "border-gray-300 hover:border-gray-400"}
                ${!isSizeAvailable(size) ? "opacity-50 cursor-not-allowed line-through" : ""}`}
              whileHover={{ 
                backgroundColor: isSizeAvailable(size) ? (selectedSize === size ? "#000" : "#f7f7f7") : "", 
                scale: isSizeAvailable(size) ? 1.05 : 1 
              }}
              whileTap={{ scale: isSizeAvailable(size) ? 0.95 : 1 }}
              onClick={(e) => isSizeAvailable(size) && handleSizeClick(size, e)}
            >
              {size}
              {!isSizeAvailable(size) && isMobile && <span className="ml-0.5 text-[6px]">(Out)</span>}
              {!isSizeAvailable(size) && !isMobile && <span className="ml-1 text-xs">(Out of stock)</span>}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
    sizes: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.string,
    images: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string
      }))
    ]),
    inventory: PropTypes.object
  }),
  gridType: PropTypes.oneOf([2, 4]),
  onProductClick: PropTypes.func,
};

ProductCard.defaultProps = {
  product: {
    name: "Product Name",
    price: 0,
    sizes: [],
    images: ["/images/placeholder.jpg"],
    inventory: {}
  },
  gridType: 4
};

export default ProductCard;