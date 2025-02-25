import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProductCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [thumbnailHoveredIndex, setThumbnailHoveredIndex] = useState(null);

  const slideVariants = {
    enter: (direction) => ({
      x: direction === "right" ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction === "right" ? -500 : 500,
      opacity: 0
    })
  };

  const handleNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleThumbnailClick = (index) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Main image carousel */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full object-cover"
            alt={`Product image ${currentIndex + 1}`}
          />
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 hover:bg-opacity-100 transition-all"
          aria-label="Previous image"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10 hover:bg-opacity-100 transition-all"
          aria-label="Next image"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            className={`relative w-16 h-16 border-2 cursor-pointer overflow-hidden transition-all ${
              currentIndex === idx ? "border-black" : "border-transparent"
            }`}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => setThumbnailHoveredIndex(idx)}
            onMouseLeave={() => setThumbnailHoveredIndex(null)}
            onClick={() => handleThumbnailClick(idx)}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {thumbnailHoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                className="absolute inset-0 bg-black"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;