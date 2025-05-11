import { motion } from "framer-motion";

const MobileProductDetailsSkeleton = () => {
  return (
    <div className="px-4">
      <div className="mt-16 flex flex-col">
        {/* Product Carousel Skeleton */}
        <div className="mb-8 w-full">
          <div className="h-[550px] w-full bg-gray-200 animate-pulse relative">
            {/* Dots indicator skeleton */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="w-full">
          {/* Product Name Skeleton */}
          <div className="h-7 w-3/4 bg-gray-200 animate-pulse mb-2"></div>

          {/* Star Rating Skeleton */}
          <div className="flex items-center my-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 mr-1 bg-gray-200 animate-pulse"></div>
              ))}
            </div>
            <div className="ml-2 w-24 h-4 bg-gray-200 animate-pulse"></div>
          </div>

          {/* Price Skeleton */}
          <div className="h-6 w-32 bg-gray-200 animate-pulse"></div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Color Selection Skeleton */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse"></div>
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
                <div key={index} className="w-10 h-10 bg-gray-200 animate-pulse"></div>
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
              <div className="h-4 w-40 bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* STYLE IT WITH Skeleton */}
      <div className="mt-8">
        <div className="h-5 w-36 bg-gray-200 animate-pulse mx-auto mb-4"></div>
        <div className="flex gap-2 overflow-x-auto px-1">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="min-w-[60%] max-w-[60%]">
              <div className="w-full h-[350px] bg-gray-200 animate-pulse"></div>
              <div className="mt-2 px-1 text-center">
                <div className="h-4 w-24 bg-gray-200 animate-pulse mx-auto mb-1"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Also Purchased Skeleton */}
      <div className="mt-8 mb-4">
        <div className="h-5 w-64 bg-gray-200 animate-pulse mx-auto mb-4"></div>
        <div className="flex gap-2 overflow-x-auto px-1">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="min-w-[70%] max-w-[70%]">
              <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
              <div className="mt-2 px-1 text-center">
                <div className="h-3 w-16 bg-gray-200 animate-pulse mx-auto mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse mx-auto mb-1"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Also Viewed Skeleton */}
      <div className="mt-8 mb-16">
        <div className="h-5 w-64 bg-gray-200 animate-pulse mx-auto mb-4"></div>
        <div className="flex gap-2 overflow-x-auto px-1">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="min-w-[70%] max-w-[70%]">
              <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
              <div className="mt-2 px-1 text-center">
                <div className="h-3 w-16 bg-gray-200 animate-pulse mx-auto mb-1"></div>
                <div className="h-4 w-24 bg-gray-200 animate-pulse mx-auto mb-1"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileProductDetailsSkeleton;