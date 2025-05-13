import { motion } from "framer-motion";

const CustomerReviewsSkeleton = ({ reviewCount = 3 }) => {
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
    <div className="py-12  md:py-16 bg-gray-50">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.div 
          className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 w-48 mx-auto"
          variants={shimmer}
          initial="hidden"
          animate="visible"
          style={{ backgroundSize: "200% 100%" }}
        />
        
        {/* Rating Summary */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <motion.div 
            className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            variants={shimmer}
            initial="hidden"
            animate="visible"
            style={{ backgroundSize: "200% 100%" }}
          />
          
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                variants={shimmer}
                initial="hidden"
                animate="visible"
                style={{ backgroundSize: "200% 100%" }}
              />
            ))}
          </div>
          
          <motion.div 
            className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
            variants={shimmer}
            initial="hidden"
            animate="visible"
            style={{ backgroundSize: "200% 100%" }}
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {[...Array(reviewCount)].map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              {/* Review Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <motion.div 
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                    variants={shimmer}
                    initial="hidden"
                    animate="visible"
                    style={{ backgroundSize: "200% 100%" }}
                  />
                  <div className="ml-3">
                    <motion.div 
                      className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                    <motion.div 
                      className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mt-1"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 mr-1"
                      variants={shimmer}
                      initial="hidden"
                      animate="visible"
                      style={{ backgroundSize: "200% 100%" }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Review Content */}
              <motion.div 
                className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 w-3/4 mb-3"
                variants={shimmer}
                initial="hidden"
                animate="visible"
                style={{ backgroundSize: "200% 100%" }}
              />
              
              <div className="space-y-2">
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 w-full"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 w-full"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <motion.div 
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 w-4/5"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                />
              </div>
              
              {/* Review Footer */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <motion.div 
                  className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <motion.div 
                  className="h-8 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded"
                  variants={shimmer}
                  initial="hidden"
                  animate="visible"
                  style={{ backgroundSize: "200% 100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviewsSkeleton;