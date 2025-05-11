import { motion } from "framer-motion";

const ProductCarouselSkeleton = () => {
  // Shimmer animation variant
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
    <div className="flex flex-col">
      {/* Main Images Section */}
      <div className="relative mb-[5px] overflow-hidden" style={{ width: "1040px", height: "800px" }}>
        <div className="absolute top-0 left-0 flex w-[1040px]">
          {/* Primary Image Skeleton */}
          <motion.div 
            className="w-[520px] h-[800px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            variants={shimmer}
            initial="hidden"
            animate="visible"
            style={{ backgroundSize: "200% 100%" }}
          />
          
          {/* Secondary Image Skeleton */}
          <motion.div 
            className="w-[520px] h-[800px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            variants={shimmer}
            initial="hidden"
            animate="visible"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>

      {/* Thumbnails carousel */}
      <div className="relative">
        {/* Thumbnail container */}
        <div className="relative overflow-hidden" style={{ height: "202px" }}>
          <div className="flex space-x-[5px]">
            {/* Generate 7 thumbnail skeletons */}
            {[...Array(7)].map((_, index) => (
              <motion.div 
                key={index}
                className="w-[144.5px] h-[200px] flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                variants={shimmer}
                initial="hidden"
                animate="visible"
                style={{ backgroundSize: "200% 100%" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCarouselSkeleton;