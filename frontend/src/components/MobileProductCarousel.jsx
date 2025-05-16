import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";
import MobileProductCarouselSkeleton from "./loadingSkeleton/MobileProductCarouselSkeleton";

const MobileProductCarousel = ({ images, loading, viewportMode = "mobile" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Check if we're in tablet portrait mode
  const isTabletPortrait = viewportMode === "tablet-portrait";
  
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

  if (loading) {
    return <MobileProductCarouselSkeleton />;
  }

  // Only adjust height for tablet portrait mode
  const carouselHeight = isTabletPortrait ? "800px" : "700px";

  return (
    <div className="relative overflow-hidden">
      {/* Main Image Carousel */}
      <div 
        className="relative overflow-hidden" 
        style={{ height: carouselHeight }}
      >
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
        
        {/* Left Arrow - only make arrows more visible on tablet portrait */}
        <button 
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 z-10 ${
            isTabletPortrait ? 'bg-white/50 rounded-full w-8 h-8 flex items-center justify-center' : ''
          }`}
          onClick={handlePrevious}
          aria-label="Previous image"
        >
          <FaChevronLeft className="text-black text-sm" />
        </button>
        
        {/* Right Arrow */}
        <button 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 z-10 ${
            isTabletPortrait ? 'bg-white/50 rounded-full w-8 h-8 flex items-center justify-center' : ''
          }`}
          onClick={handleNext}
          aria-label="Next image"
        >
          <FaChevronRight className="text-black text-sm" />
        </button>
        
        {/* Dots Indicator - slightly larger for tablet */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {safeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full ${
                isTabletPortrait ? 'w-2.5 h-2.5' : 'w-2 h-2'
              } ${
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
  loading: PropTypes.bool,
  viewportMode: PropTypes.string
};

MobileProductCarousel.defaultProps = {
  images: ['/images/placeholder.jpg'],
  loading: false,
  viewportMode: "mobile"
};

export default MobileProductCarousel;