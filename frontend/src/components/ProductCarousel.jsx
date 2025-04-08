import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const ProductCarousel = ({ images }) => {
  const [currentPair, setCurrentPair] = useState([0, 1]);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 for right, -1 for left
  const [showArrows, setShowArrows] = useState(false);
  const thumbnailsContainerRef = useRef(null);
  const dragX = useMotionValue(0);
  const opacity = useTransform(dragX, [-100, 0, 100], [0.5, 1, 0.5]);
  
  // Safely handle the images array
  const safeImages = Array.isArray(images) && images.length > 0 
    ? images.filter(img => img) // Filter out null/undefined images
    : ["/images/placeholder.jpg"];
  
  // Extend images array if it's too short
  const extendedImages = safeImages.length < 6 
    ? [...safeImages, ...safeImages, ...safeImages].slice(0, Math.max(6, safeImages.length))
    : safeImages;

  // Max number of thumbnails visible at once
  const maxVisibleThumbnails = 7;
  
  // Number of thumbnails
  const thumbnailCount = extendedImages.length;

  // Reset current pair when images change to ensure we start with the first image
  useEffect(() => {
    if (extendedImages.length === 1) {
      setCurrentPair([0, 0]);
    } else {
      // Always start with the first two images when the images array changes
      setCurrentPair([0, 1]);
    }
  }, [images, extendedImages.length]);

  const handleThumbnailClick = (index) => {
    // Only update if clicking a different image than the current primary
    if (index !== currentPair[0]) {
      // Determine slide direction based on the clicked index
      if (index > currentPair[0] && !(currentPair[0] === extendedImages.length - 1 && index === 0)) {
        setSlideDirection(1); // slide from right
      } else if (index < currentPair[0] && !(currentPair[0] === 0 && index === extendedImages.length - 1)) {
        setSlideDirection(-1); // slide from left
      } else if (currentPair[0] === extendedImages.length - 1 && index === 0) {
        setSlideDirection(1); // Wrap forward
      } else if (currentPair[0] === 0 && index === extendedImages.length - 1) {
        setSlideDirection(-1); // Wrap backward
      }
      
      // Update current pair - make the selected image the primary, and the next one secondary
      const nextIndex = (index + 1) % extendedImages.length;
      setCurrentPair([index, nextIndex]);
    }
  };

  // Navigate thumbnails with smooth continuous flow
  const navigateThumbnails = (direction) => {
    setSlideDirection(direction);
    
    setThumbnailStartIndex((prevIndex) => {
      let nextIndex = prevIndex + direction;
      
      // Create a circular buffer effect
      if (nextIndex < 0) {
        nextIndex = thumbnailCount - 1;
      } else if (nextIndex >= thumbnailCount) {
        nextIndex = 0;
      }
      
      return nextIndex;
    });
  };

  // Handle drag end for thumbnail carousel
  const handleDragEnd = (info) => {
    const dragThreshold = 50;
    if (Math.abs(info.offset.x) > dragThreshold) {
      navigateThumbnails(info.offset.x > 0 ? -1 : 1);
    }
    dragX.set(0);
  };

  // Calculate visible thumbnails with a circular buffer approach
  const getVisibleThumbnails = () => {
    const visibleThumbs = [];
    
    for (let i = 0; i < maxVisibleThumbnails; i++) {
      const index = (thumbnailStartIndex + i) % thumbnailCount;
      visibleThumbs.push({
        image: extendedImages[index],
        index: index
      });
    }
    
    return visibleThumbs;
  };

  const visibleThumbnails = getVisibleThumbnails();

  return (
    <div 
      className="flex flex-col"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Main Images Section */}
      <div className="relative mb-[5px] overflow-hidden" style={{ width: "1040px", height: "800px" }}>
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={`pair-${currentPair[0]}`}
            className="absolute top-0 left-0 flex"
            custom={slideDirection}
            initial={{ x: slideDirection * 1040 }}
            animate={{ x: 0 }}
            exit={{ x: -slideDirection * 1040 }}
            transition={{ duration: 2, ease: [0.25, 0.8, 0.25, 1] }}
            style={{ width: "1040px" }}
          >
            {/* Primary Image */}
            <div className="w-[520px]">
              <div className="relative h-[800px]">
                <img
                  src={extendedImages[currentPair[0]]}
                  alt={`Main Image ${currentPair[0] + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Secondary Image */}
            <div className="w-[520px]">
              <div className="relative h-[800px]">
                <img
                  src={extendedImages[currentPair[1]]}
                  alt={`Secondary Image ${currentPair[1] + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails carousel with navigation arrows */}
      <div className="relative">
        {/* Left Navigation Arrow */}
        <AnimatePresence>
          {showArrows && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              onClick={() => navigateThumbnails(-1)}
            >
              <FaChevronLeft className="text-black text-sm" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Thumbnails Container with drag functionality */}
        <div 
          ref={thumbnailsContainerRef} 
          className="relative overflow-hidden" 
          style={{ height: "202px" }}
        >
          <motion.div 
            className="flex space-x-[5px]"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            style={{ x: dragX, opacity }}
            onDragEnd={handleDragEnd}
          >
            {visibleThumbnails.map((item, i) => (
              <motion.div 
                key={`thumb-${i}-${item.index}`}
                className={`w-[144.5px] flex-shrink-0 cursor-pointer transition-all duration-200
                  ${item.index === currentPair[0]
                    ? "border-[0.3px] border-black h-[202px]" 
                    : "border-transparent h-[200px]"}`}
                onClick={() => handleThumbnailClick(item.index)}
                whileHover={{ scale: 1.02, transition: { duration: 0.5 } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.3 } }}
              >
                <img
                  src={item.image}
                  alt={`Thumbnail ${item.index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Right Navigation Arrow */}
        <AnimatePresence>
          {showArrows && (
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
              onClick={() => navigateThumbnails(1)}
            >
              <FaChevronRight className="text-black text-sm" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

ProductCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ProductCarousel.defaultProps = {
  images: ['/images/placeholder.jpg'],
};

export default ProductCarousel;