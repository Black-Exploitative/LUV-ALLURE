import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ProductCarousel = ({ images }) => {
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [secondaryImageIndex, setSecondaryImageIndex] = useState(1);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const thumbnailsContainerRef = useRef(null);
  
  // Extend images array if it's too short
  const extendedImages = images.length < 6 
    ? [...images, ...images, ...images].slice(0, Math.max(6, images.length))
    : images;

  // Max number of thumbnails visible at once
  const maxVisibleThumbnails = 5;
  
  // Number of thumbnails (max 6 or image count, whichever is higher)
  const thumbnailCount = extendedImages.length;

  // Ensure secondary image is always different from primary
  useEffect(() => {
    if (extendedImages.length === 1) {
      setSecondaryImageIndex(0);
    } 
    else if (secondaryImageIndex >= extendedImages.length || secondaryImageIndex === primaryImageIndex) {
      setSecondaryImageIndex((primaryImageIndex + 1) % extendedImages.length);
    }
  }, [extendedImages.length, primaryImageIndex, secondaryImageIndex]);

  const handleThumbnailClick = (index) => {
    // Only update if clicking a different image than the current primary
    if (index !== primaryImageIndex) {
      setPrimaryImageIndex(index);
      
      // Update secondary image to be the next one after the clicked one
      if (extendedImages.length > 1) {
        setSecondaryImageIndex((index + 1) % extendedImages.length);
      }
    }
  };

  // Navigate thumbnails - moving one at a time
  const navigateThumbnails = (direction) => {
    if (direction > 0) {
      // Forward navigation: don't go past the end
      if (thumbnailStartIndex + maxVisibleThumbnails < thumbnailCount) {
        setThumbnailStartIndex(prev => prev + 1);
      }
    } else {
      // Backward navigation: don't go before the start
      if (thumbnailStartIndex > 0) {
        setThumbnailStartIndex(prev => prev - 1);
      }
    }
  };

  // Calculate which thumbnails to show based on start index and max visible
  const visibleThumbnails = extendedImages.slice(
    thumbnailStartIndex, 
    thumbnailStartIndex + maxVisibleThumbnails
  );

  // Animation variants for the thumbnail container
  const thumbnailContainerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col">
      {/* Main Images Section - Two side by side */}
      <div className="flex flex-col md:flex-row mb-2">
        {/* Primary Image */}
        <div className="w-full md:w-1/2 mb-2 md:mb-0 md:pr-1">
          <div className="relative h-[700px]">
            <img
              src={extendedImages[primaryImageIndex]}
              alt={`Main Image ${primaryImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Secondary Image */}
        <div className="w-full md:w-1/2 md:pl-1">
          <div className="relative h-[700px]">
            <img
              src={extendedImages[secondaryImageIndex]}
              alt={`Secondary Image ${secondaryImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Thumbnails carousel with navigation arrows */}
      <div className="relative mt-4">
        {/* Left Navigation Arrow */}
        {thumbnailStartIndex > 0 && (
          <button 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            onClick={() => navigateThumbnails(-1)}
          >
            <FaChevronLeft className="text-black text-sm" />
          </button>
        )}
        
        {/* Thumbnails Container */}
        <div 
          ref={thumbnailsContainerRef} 
          className="flex mx-10 justify-center" 
        >
          <AnimatePresence initial={false}>
            <motion.div 
              className="flex space-x-[5px] overflow-hidden"
              key={thumbnailStartIndex} 
              variants={thumbnailContainerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {visibleThumbnails.map((image, i) => {
                // Calculate the actual index in the full array
                const actualIndex = thumbnailStartIndex + i;
                
                return (
                  <div 
                    key={`thumb-${actualIndex}`}
                    className={`w-[114px] h-40 flex-shrink-0 cursor-pointer transition-all duration-200
                      ${actualIndex === primaryImageIndex || actualIndex === secondaryImageIndex 
                        ? "opacity-100 ring-2 ring-black" 
                        : "opacity-70 hover:opacity-100"}`}
                    onClick={() => handleThumbnailClick(actualIndex)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${actualIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Right Navigation Arrow */}
        {thumbnailStartIndex + maxVisibleThumbnails < thumbnailCount && (
          <button 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
            onClick={() => navigateThumbnails(1)}
          >
            <FaChevronRight className="text-black text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

ProductCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProductCarousel;