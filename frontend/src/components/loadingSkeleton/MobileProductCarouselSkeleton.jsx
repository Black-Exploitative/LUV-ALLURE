import { motion } from "framer-motion";

const MobileProductCarouselSkeleton = () => {
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
    <div className="relative overflow-hidden">
      {/* Main Image Carousel */}
      <div className="relative h-[550px] overflow-hidden">
        <motion.div
          className="absolute w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
          variants={shimmer}
          initial="hidden"
          animate="visible"
          style={{ backgroundSize: "200% 100%" }}
        />
        
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {[...Array(5)].map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === 0 ? "bg-gray-500" : "bg-gray-300"
              }`}
              animate={{ 
                opacity: [0.5, 0.8, 0.5],
                scale: index === 0 ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
        
        {/* Left/Right Arrows (subtle indicators) */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 opacity-40">
          <motion.div 
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.div>
        </div>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 opacity-40">
          <motion.div 
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MobileProductCarouselSkeleton;