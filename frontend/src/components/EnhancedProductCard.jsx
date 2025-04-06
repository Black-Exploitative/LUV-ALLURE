import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import AnimatedImage from "./AnimatedImage";
import PropTypes from "prop-types";

const EnhancedProductCard = ({ product, index, onProductClick }) => {
  const { id, title, images = [], price } = product;
  
  // Animation controls
  const controls = useAnimation();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  // Image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const carouselTimerRef = useRef(null);
  
  // Auto-carousel effect when not hovered
  useEffect(() => {
    if (images.length <= 1) return;
    
    // If not hovered, start the carousel
    if (!isHovered) {
      carouselTimerRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 3000); // Change image every 3 seconds
    }
    
    // Cleanup on unmount or when effect reruns
    return () => {
      if (carouselTimerRef.current) {
        clearInterval(carouselTimerRef.current);
      }
    };
  }, [isHovered, images.length]);
  
  // Animation when card comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Helper function to get the correct image source
  const getImageSrc = (image) => {
    if (typeof image === 'string') {
      return image;
    } else if (image && typeof image === 'object' && image.src) {
      return image.src;
    }
    return ''; // Return empty string or a placeholder image URL
  };

  // Prepare product data in the same format as ProductGrid
  const handleClick = () => {
    // First, ensure the images are properly formatted
    const formattedImages = [];
    
    if (images && images.length > 0) {
      // Make sure we're adding properly formatted images
      images.forEach(img => {
        if (typeof img === 'string') {
          formattedImages.push(img);
        } else if (img && img.src) {
          formattedImages.push(img.src);
        }
      });
    }
    
    // If we still have no images, add a placeholder
    if (formattedImages.length === 0) {
      formattedImages.push("/images/placeholder.jpg");
    }
    
    // Log the formatted images for debugging
    console.log("EnhancedProductCard - Formatted Images:", formattedImages);
    
    // Transform the product to match the expected format in product detail page
    const formattedProduct = {
      id: id,
      title: title,
      description: product.description || "",
      priceValue: typeof price === 'number' ? price : (parseFloat(price) || 0),
      // Add default variants if none exist
      variants: product.variants || [
        { 
          id: `${id}-default`, 
          color: "Default", 
          size: "One Size", 
          fullOption: "Default", 
          values: ["Default"] 
        }
      ],
      // Use our carefully formatted images
      images: formattedImages,
      // Do NOT spread product at the end, as it might override our formatted properties
    };
    
    // Add any additional properties that don't conflict with what we've set
    Object.keys(product).forEach(key => {
      if (!formattedProduct.hasOwnProperty(key) && key !== 'images') {
        formattedProduct[key] = product[key];
      }
    });
    
    if (onProductClick) {
      onProductClick(formattedProduct);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="w-[380px] h-auto rounded-none overflow-hidden cursor-pointer"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative w-full h-[500px]">
        {/* Image carousel */}
        {images.length > 0 ? (
          images.map((image, imgIndex) => (
            <motion.div
              key={`${id}-img-${imgIndex}`}
              className="absolute top-0 left-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentImageIndex === imgIndex ? 1 : 0,
                zIndex: currentImageIndex === imgIndex ? 1 : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <AnimatedImage
                src={getImageSrc(image)}
                alt={typeof image === 'object' && image.alt ? image.alt : `${title} - View ${imgIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))
        ) : (
          // Placeholder when no images are available
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        {/* Image indicator dots (only show if multiple images and hovering) */}
        {images.length > 1 && isHovered && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, imgIndex) => (
              <motion.div
                key={`dot-${imgIndex}`}
                className={`w-2 h-2 rounded-full ${
                  currentImageIndex === imgIndex ? "bg-white" : "bg-white/50"
                }`}
                whileHover={{ scale: 1.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(imgIndex);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <motion.h3
        className="text-[15px] text-center font-medium text-black mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.15 }}
      >
        {title}
      </motion.h3>
      
      {/*{price && (
        <motion.p
          className="text-[14px] text-center font-normal text-gray-700 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + index * 0.15 }}
        >
          {typeof price === 'number' ? `₦${price.toLocaleString()}` : price}
        </motion.p>
      )}*/}
    </motion.div>
  );
};

EnhancedProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    images: PropTypes.oneOfType([
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.arrayOf(PropTypes.shape({
            src: PropTypes.string,
            alt: PropTypes.string
          }))
        ]),
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    variants: PropTypes.array
  }).isRequired,
  index: PropTypes.number.isRequired,
  onProductClick: PropTypes.func,
};

export default EnhancedProductCard;