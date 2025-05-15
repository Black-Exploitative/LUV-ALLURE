/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const SearchFiltersAndResults = ({
  searchQuery,
  searchResults,
  loading,
  selectedCategory,
  selectedColor,
  selectedSize,
  handleColorSelect,
  handleSizeSelect,
  handleCategorySelect,
  handleResultClick,
  goToSearchResults
}) => {
  // State for collapsible sections
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const resultsContainerRef = useRef(null);

  // Scroll to top of results when results change
  useEffect(() => {
    if (resultsContainerRef.current && searchResults.length > 0) {
      resultsContainerRef.current.scrollTop = 0;
    }
  }, [searchResults]);

  // Categories for filtering results
  const categories = [
    { id: "all", name: "All" },
    { id: "dresses", name: "Dresses" },
    { id: "tops", name: "Tops" },
    { id: "bottoms", name: "Bottoms" },
    { id: "accessories", name: "Accessories" },
    { id: "outerwear", name: "Outerwear" },
    { id: "shoes", name: "Shoes" }
  ];

  // Color options with actual color values
  const colorOptions = [
    { id: "white", name: "White", color: "#FFFFFF", border: true },
    { id: "black", name: "Black", color: "#000000" },
    { id: "beige", name: "Beige", color: "#F5F5DC", border: true },
    { id: "ivory", name: "Ivory", color: "#FFFFF0", border: true },
    { id: "cream", name: "Cream", color: "#FFFDD0", border: true },
    { id: "navy", name: "Navy", color: "#000080" },
    { id: "burgundy", name: "Burgundy", color: "#800020" },
    { id: "emerald", name: "Emerald", color: "#50C878" },
    { id: "gold", name: "Gold", color: "#FFD700" },
    { id: "silver", name: "Silver", color: "#C0C0C0", border: true },
    { id: "charcoal", name: "Charcoal", color: "#36454F" },
    { id: "red", name: "Red", color: "#FF0000" },
    { id: "blue", name: "Blue", color: "#0000FF" },
    { id: "green", name: "Green", color: "#008000" },
    { id: "yellow", name: "Yellow", color: "#FFFF00" },
    { id: "pink", name: "Pink", color: "#FFC0CB" },
    { id: "purple", name: "Purple", color: "#800080" },
    { id: "camel", name: "Camel", color: "#C19A6B" }
  ];

  // Size options (common clothing sizes)
  const sizeOptions = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"];

  // Animation variants for collapsible sections
  const contentVariants = {
    open: { 
      height: "auto", 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    closed: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      price = parseFloat(price);
    }
    // Format as Naira currency
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Top bar with border and subtle shadow */}
      <div className="w-full bg-white border-t border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-gray-800">Filter Results</h2>
            <p className="text-sm text-gray-500">
              Searching for "{searchQuery}"
            </p>
          </div>
          {searchResults.length > 0 && (
            <button 
              onClick={goToSearchResults}
              className="text-sm text-gray-600 hover:text-black px-4 py-2 border border-gray-200 hover:border-gray-400 rounded transition-colors"
            >
              See all results
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <div className="mx-auto px-6 md:px-16 lg:px-24 max-w-screen-2xl py-6">
          {/* Flex column on mobile that reverses the order, flex row on desktop with normal order */}
          <div className="flex flex-col-reverse md:flex-row gap-8">
            {/* Filters column - now shows second on mobile, first on desktop */}
            <div className="w-full md:w-64 p-6 bg-white shadow-sm mt-8 md:mt-0">
              {/* Color filter */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => setIsColorOpen(!isColorOpen)}
                >
                  <h3 className="font-medium text-sm text-gray-800 md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider">COLOUR</h3>
                  {isColorOpen ? 
                    <FaChevronUp className="text-gray-500" /> : 
                    <FaChevronDown className="text-gray-500" />
                  }
                </div>
                <div className="w-full h-px bg-gray-200 mb-3"></div>
                
                <AnimatePresence>
                  {isColorOpen && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={contentVariants}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-3">
                        {colorOptions.map((color) => (
                          <div key={color.id} className="flex flex-col items-center">
                            <button
                              onClick={() => handleColorSelect(color.id)}
                              className={`w-8 h-8 rounded-full ${
                                color.border ? 'border border-gray-300' : ''
                              } ${
                                selectedColor === color.id ? 'ring-2 ring-black ring-offset-1' : ''
                              } hover:opacity-90 transition-opacity duration-200`}
                              style={{ backgroundColor: color.color }}
                              aria-label={`Select ${color.name} color`}
                            />
                            <span className="text-xs text-gray-600 mt-1">{color.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Size filter */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => setIsSizeOpen(!isSizeOpen)}
                >
                  <h3 className="font-medium text-sm text-gray-800 md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider">SIZE</h3>
                  {isSizeOpen ? 
                    <FaChevronUp className="text-gray-500" /> : 
                    <FaChevronDown className="text-gray-500" />
                  }
                </div>
                <div className="w-full h-px bg-gray-200 mb-3"></div>
                
                <AnimatePresence>
                  {isSizeOpen && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={contentVariants}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-4 gap-2">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            className={`h-10 flex items-center justify-center border hover:shadow-sm transition-all duration-200 ${
                              selectedSize === size 
                                ? 'border-black bg-black text-white' 
                                : 'border-gray-300 hover:border-gray-500 text-gray-700'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <div 
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  <h3 className="font-medium text-sm text-gray-800 md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider">CATEGORY</h3>
                  {isCategoryOpen ? 
                    <FaChevronUp className="text-gray-500" /> : 
                    <FaChevronDown className="text-gray-500" />
                  }
                </div>
                <div className="w-full h-px bg-gray-200 mb-3"></div>
                
                <AnimatePresence>
                  {isCategoryOpen && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={contentVariants}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <button
                              onClick={() => handleCategorySelect(category.id)}
                              className={`text-gray-700 hover:text-black transition-colors duration-200 ${
                                selectedCategory === category.id 
                                ? 'font-medium text-black' 
                                : ''
                              }`}
                            >
                              <span className={selectedCategory === category.id ? 'border-b-2 border-black pb-px' : 'hover:border-b-2 hover:border-gray-300 pb-px'}>
                                {category.name}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Results column - now shows first on mobile, second on desktop */}
            <div className="w-full md:flex-1 p-6 bg-white shadow-sm" ref={resultsContainerRef}>
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
                <h3 className="font-medium text-sm text-gray-800 md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider">PRODUCT RESULTS</h3>
                <span className="text-xs text-gray-500">
                  {searchResults.length} item{searchResults.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-7 w-7 border-2 border-t-black border-r-black border-gray-200 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">
                    Searching for exquisite items...
                  </p>
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center py-12">
                  <p className="text-gray-700 text-lg">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto mb-6">
                    We couldn't find any products matching your search. Try adjusting your filters or browse our curated collections.
                  </p>
                  <a 
                    href="/shop"
                    className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    Browse All Products
                  </a>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {searchResults.map(product => (
                    <div 
                      key={product.id}
                      className="cursor-pointer group"
                      onClick={() => handleResultClick(product.id)}
                    >
                      {/* Product Image with hover effect */}
                      <div className="aspect-[3/4] overflow-hidden bg-gray-50 mb-3 relative">
                        <img
                          src={product.image || (product.images && product.images.length > 0 ? product.images[0] : "/images/placeholder.jpg")}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {/* Quick view overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="bg-white bg-opacity-90 px-4 py-2 text-xs uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider text-black">
                            Quick View
                          </span>
                        </div>
                      </div>
                      
                      {/* Product Info with elegant typography */}
                      <div>
                        <h4 className="text-sm uppercase md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider text-gray-800 group-hover:text-black transition-colors duration-200">{product.title}</h4>
                        {product.productType && (
                          <p className="text-xs text-gray-500 mt-1">{product.productType}</p>
                        )}
                        <p className="text-sm font-medium mt-1">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              
              {/* Show "See All Results" button at the bottom too if there are enough results */}
              {searchResults.length > 8 && (
                <div className="mt-8 text-center">
                  <button 
                    onClick={goToSearchResults}
                    className="px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
                  >
                    See All Results
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFiltersAndResults;