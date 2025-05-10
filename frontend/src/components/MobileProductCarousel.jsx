import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

const MobileProductCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  
  const safeImages = Array.isArray(images) && images.length > 0 
    ? images.filter(img => img)
    : ["/images/placeholder.jpg"];
  
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === safeImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? safeImages.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  return (
    <div className="relative overflow-hidden">
      {/* Main Image Carousel */}
      <div className="relative h-[550px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={safeImages[currentIndex]}
            alt={`Product view ${currentIndex + 1}`}
            className="absolute w-full h-full object-cover"
            custom={direction}
            initial={{ 
              x: direction * 300,
              opacity: 0 
            }}
            animate={{ 
              x: 0,
              opacity: 1 
            }}
            exit={{ 
              x: direction * -300,
              opacity: 0 
            }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        
        {/* Left Arrow - no background */}
        <button 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
          onClick={handlePrevious}
          aria-label="Previous image"
        >
          <FaChevronLeft className="text-black text-sm" />
        </button>
        
        {/* Right Arrow - no background */}
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
          onClick={handleNext}
          aria-label="Next image"
        >
          <FaChevronRight className="text-black text-sm" />
        </button>
        
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {safeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? "bg-black" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

MobileProductCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

MobileProductCarousel.defaultProps = {
  images: ['/images/placeholder.jpg'],
};

export default MobileProductCarousel;