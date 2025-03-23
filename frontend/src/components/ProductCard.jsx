import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, gridType, onProductClick }) => {
  // Add safe defaults and error handling
  const { 
    id,
    name = "Product Name", 
    price = 0, 
    sizes = [], 
    images = ["/images/placeholder.jpg"],
    color
  } = product || {};

  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const cardRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Safe image handling
  const validImages = Array.isArray(images) ? images : ["/images/placeholder.jpg"];
  const hasMultipleImages = validImages.length > 1;

  // Responsive sizing based on grid type
  const cardWidthClass = "w-full"; // Always use full width of container
  const imageHeightClass = gridType === 2 ? "h-[1300px] md:h-[1300px]" : "h-[700px] md:h-[700px]";

  // Tracking manual navigation to pause auto-play
  const [manuallyNavigated, setManuallyNavigated] = useState(false);
  
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
    
    const productToAdd = {
      id,
      name,
      price,
      color,
      selectedSize,
      images: validImages
    };
    
    addToCart(productToAdd);
    setSelectedSize("");
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

  return (
    <motion.div
      className={`${cardWidthClass} relative overflow-hidden group`}
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onProductClick?.(product)}
    >
      {/* Image Carousel Section */}
      <div 
        className={`relative overflow-hidden cursor-pointer ${imageHeightClass}`}
      >
        <AnimatePresence initial={false} custom={1}>
          <motion.img
            key={currentImage}
            src={validImages[currentImage]?.src || validImages[currentImage] || '/images/placeholder.jpg'}
            alt={name}
            className={`w-full ${imageHeightClass} object-cover absolute top-0 left-0`}
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

        {/* Image Indicator */}
        {hasMultipleImages && (
          <motion.div 
            className="absolute bottom-4 right-4 bg-white/80 px-2 py-1 text-xs font-medium rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentImage + 1}/{validImages.length}
          </motion.div>
        )}

        {/* Navigation Arrows - Made more visible */}
        {hasMultipleImages && (
          <>
            <motion.div
              className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white/60 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center"
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
              <FaChevronLeft className="text-black text-lg" />
            </motion.div>

            <motion.div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white/60 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center"
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
              <FaChevronRight className="text-black text-lg" />
            </motion.div>
          </>
        )}
        
        {/* Quick add button on hover */}
        {selectedSize && (
          <motion.div 
            className="absolute left-0 right-0 bottom-0 bg-black text-white text-center py-3 cursor-pointer"
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

      {/* Product Details Section */}
      <div className="cursor-pointer mt-3">
        <motion.h3 
          className="text-sm md:text-base font-medium text-gray-900 hover:underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {name}
        </motion.h3>
        
        <motion.p 
          className="text-gray-700 text-sm md:text-base mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {typeof price === 'number' ? 
            `₦${price.toLocaleString()}` : 
            'Price unavailable'}
        </motion.p>
      </div>

      {/* Size Selection */}
      {sizes.length > 0 && (
        <motion.div 
          className="flex flex-wrap mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {sizes.map((size) => (
            <motion.div
              key={size}
              className={`px-2 py-1 border mr-2 mb-2 cursor-pointer text-xs md:text-sm
                ${selectedSize === size 
                  ? "border-black bg-black text-white" 
                  : "border-gray-300 hover:border-gray-400"}`}
              whileHover={{ backgroundColor: selectedSize === size ? "#000" : "#f7f7f7", scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleSizeClick(size, e)}
            >
              {size}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  }),
  gridType: PropTypes.oneOf([2, 4]),
  onProductClick: PropTypes.func,
};

ProductCard.defaultProps = {
  product: {
    name: "Product Name",
    price: 0,
    sizes: [],
    images: ["/images/placeholder.jpg"]
  },
  gridType: 4
};

export default ProductCard;