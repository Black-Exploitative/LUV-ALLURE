import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ product, gridType, onProductClick }) => {
  const { name, price, sizes = [], images } = product;
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const cardWidthClass = gridType === 2 ? "w-[655px]" : "w-full";
  const imageHeightClass = gridType === 2 ? "h-[751px]" : "h-[500px]";

  const handlePrev = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  // Image slide variants - slower, smoother transition
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

  // Direction tracking for animations
  const [[page, direction], setPage] = useState([0, 0]);

  return (
    <motion.div
      className={`${cardWidthClass} p-4 relative overflow-hidden group`}
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
        style={{ height: gridType === 2 ? "751px" : "500px" }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentImage}
            src={images[currentImage]}
            alt={name}
            className={`w-full ${imageHeightClass} object-cover absolute top-0 left-0`}
            custom={direction}
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

        {/* Image number indicator */}
        <motion.div 
          className="absolute bottom-4 right-4 bg-white/80 px-2 py-1 text-xs font-medium rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentImage + 1}/{images.length}
        </motion.div>

        {/* Navigation Arrows - lighter, no background */}
        <motion.div
          className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
          onClick={handlePrev}
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
          onClick={handleNext}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isHovered ? 0.7 : 0, x: isHovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaChevronRight className="text-white text-lg" />
        </motion.div>
      </div>

      {/* Product Details Section */}
      <div onClick={handleProductClick} className="cursor-pointer">
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
          &#8358;{price.toLocaleString()}
        </motion.p>
      </div>

      {/* Size Selection - smaller on mobile */}
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
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    sizes: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  gridType: PropTypes.oneOf([2, 4]).isRequired,
  onProductClick: PropTypes.func,
};

export default ProductCard;