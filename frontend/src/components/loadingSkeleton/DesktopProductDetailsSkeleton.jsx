import { motion } from "framer-motion";

const DesktopProductDetailsSkeleton = () => {
  return (
    <div className="mx-4 sm:mx-6 md:mx-[40px] lg:mx-[80px]">
      <div className="mt-[60px] md:mt-[100px] flex flex-row">
        {/* Left Side: Product Carousel Skeleton */}
        <div className="mb-8 md:mb-0 mr-[50px]">
          {/* Main Image Skeleton */}
          <div className="relative mb-[5px] overflow-hidden" style={{ width: "1040px", height: "800px" }}>
            <div className="absolute top-0 left-0 flex w-[1040px]">
              {/* Primary Image Skeleton */}
              <div className="w-[520px]">
                <div className="relative h-[800px] bg-gray-200 animate-pulse"></div>
              </div>
              {/* Secondary Image Skeleton */}
              <div className="w-[520px]">
                <div className="relative h-[800px] bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Thumbnails Skeleton */}
          <div className="flex space-x-[5px] mt-2">
            {[...Array(7)].map((_, index) => (
              <div 
                key={index}
                className="w-[144.5px] h-[200px] bg-gray-200 animate-pulse"
              />
            ))}
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-[50px]">
            <div className="h-6 w-48 bg-gray-200 animate-pulse mx-auto mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="flex flex-row items-center">
                  <div className="w-[140px] h-[200px] bg-gray-200 animate-pulse"></div>
                  <div className="flex flex-col ml-[50px] mr-[170px] space-y-[15px]">
                    <div className="h-4 w-32 bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="w-[154px] h-[50px] border border-gray-200 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Product Details Skeleton */}
        <div className="w-[500px] flex flex-col justify-start">
          {/* Product Name Skeleton */}
          <div className="h-8 w-72 bg-gray-200 animate-pulse mb-2"></div>
          
          {/* Star Rating Skeleton */}
          <div className="flex items-center my-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 mr-1 bg-gray-200 animate-pulse"></div>
              ))}
            </div>
            <div className="ml-2 w-24 h-4 bg-gray-200 animate-pulse"></div>
          </div>
          
          {/* Product Price Skeleton */}
          <div className="h-6 w-32 bg-gray-200 animate-pulse mt-2"></div>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          {/* Color Selection Skeleton */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-8 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Size Selection Skeleton */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-14 bg-gray-200 animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border w-10 h-10 bg-gray-200 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Add to Cart Button Skeleton */}
          <div className="w-full h-12 bg-gray-300 animate-pulse"></div>
          
          {/* Wishlist Button Skeleton */}
          <div className="flex items-center gap-2 mt-4 mb-2">
            <div className="h-4 w-4 bg-gray-200 animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 animate-pulse"></div>
          </div>
          
          <div className="border-t border-gray-200 my-4"></div>
          
          {/* Expandable Sections Skeleton */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="py-4 border-b border-gray-200">
              <div className="h-5 w-40 bg-gray-200 animate-pulse mb-4"></div>
              {index === 0 && (
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-4/5 bg-gray-200 animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-200 animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopProductDetailsSkeleton;