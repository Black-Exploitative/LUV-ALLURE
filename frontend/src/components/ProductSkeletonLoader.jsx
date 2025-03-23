import { motion } from "framer-motion";
import PropTypes from "prop-types";

const ProductSkeletonLoader = ({ gridType, count = 8 }) => {
  // Create an array with the desired number of skeleton cards
  const skeletons = Array.from({ length: count }, (_, i) => i);
  
  // Match the dimensions from the ProductCard component
  const imageHeightClass = gridType === 2 ? "h-[1300px] md:h-[1300px]" : "h-[700px] md:h-[700px]";
  
  // Animation for shimmer effect
  const shimmer = {
    hidden: { backgroundPosition: "200% 0" },
    visible: { 
      backgroundPosition: "-200% 0",
      transition: { 
        repeat: Infinity, 
        duration: 1.5,
        ease: "linear"
      }
    }
  };

  return (
    <div 
      className={`
        mx-[20px]
        ${gridType === 2 
          ? "grid grid-cols-1 md:grid-cols-2 gap-x-[10px] gap-y-[30px]" 
          : "grid grid-cols-2 md:grid-cols-4 gap-x-[10px] md:gap-x-[10px] gap-y-[30px]"}
      `}
    >
      {skeletons.map((index) => (
        <div key={index} className="w-full overflow-hidden">
          <div className="relative">
            {/* Image skeleton */}
            <motion.div
              className={`w-full ${imageHeightClass} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-none`}
              initial="hidden"
              animate="visible"
              variants={shimmer}
              style={{
                backgroundSize: "200% 100%"
              }}
            />
            
            {/* Title skeleton */}
            <motion.div
              className="mt-3 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"
              initial="hidden"
              animate="visible"
              variants={shimmer}
              style={{
                backgroundSize: "200% 100%"
              }}
            />
            
            {/* Price skeleton */}
            <motion.div
              className="mt-2 h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/3"
              initial="hidden"
              animate="visible"
              variants={shimmer}
              style={{
                backgroundSize: "200% 100%"
              }}
            />
            
            {/* Size options skeleton */}
            <div className="flex flex-wrap mt-4 gap-2">
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-10 h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                  initial="hidden"
                  animate="visible"
                  variants={shimmer}
                  style={{
                    backgroundSize: "200% 100%"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ProductSkeletonLoader.propTypes = {
  gridType: PropTypes.oneOf([2, 4]).isRequired,
  count: PropTypes.number
};

export default ProductSkeletonLoader;