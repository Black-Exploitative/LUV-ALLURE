import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ product, gridType, onProductClick }) => {
  // Add safe defaults and error handling
  const { 
    name = "Product Name", 
    price = 0, 
    sizes = [], 
    images = ["/images/placeholder.jpg"] 
  } = product || {};

  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Safe image handling
  const validImages = Array.isArray(images) ? images : ["/images/placeholder.jpg"];
  const hasMultipleImages = validImages.length > 1;

  const cardWidthClass = gridType === 2 ? "w-[655px]" : "w-full";
  const imageHeightClass = gridType === 2 ? "h-[751px]" : "h-[500px]";

  const handleImageChange = (direction) => {
    if (!hasMultipleImages) return;
    
    setCurrentImage(prev => {
      if (direction > 0) {
        return (prev + 1) % validImages.length;
      }
      return prev === 0 ? validImages.length - 1 : prev - 1;
    });
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
    >
      {/* Image Carousel Section */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          height: gridType === 2 ? "751px" : "500px", 
          width: gridType === 2 ? "655px" : "325px"  
        }}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={currentImage}
            src={validImages[currentImage]?.src || validImages[currentImage] || '/images/placeholder.jpg'}
            alt={name}
            className={`w-full ${imageHeightClass} object-cover absolute top-0 left-0`}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
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

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <motion.div
              className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleImageChange(-1);
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 0.7 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronLeft className="text-white text-lg" />
            </motion.div>

            <motion.div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleImageChange(1);
              }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 0.7 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronRight className="text-white text-lg" />
            </motion.div>
          </>
        )}
      </div>

      {/* Product Details Section */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onProductClick?.(product);
        }} 
        className="cursor-pointer"
      >
        <motion.h3 
          className="text-lg md:text-lg font-medium text-gray-900 mt-4 hover:underline text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {name}
        </motion.h3>
        
        <motion.p 
          className="text-gray-700 text-sm sm:text-base md:text-lg mt-2"
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
              className="px-1 py-0.5 sm:px-2 sm:py-1 border border-gray-300 mr-1 sm:mr-2 mb-1 sm:mb-2 cursor-pointer text-xs sm:text-sm"
              whileHover={{ backgroundColor: "#f7f7f7", scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
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