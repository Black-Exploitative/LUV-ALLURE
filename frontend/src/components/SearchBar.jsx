/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaTimes, FaHistory } from "react-icons/fa";
import searchService from "../services/searchApi";

const SearchBar = ({ darkNavbar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Categories for filtering results
  const categories = [
    { id: "all", name: "All" },
    { id: "dresses", name: "Dresses" },
    { id: "tops", name: "Tops" },
    { id: "bottoms", name: "Bottoms" },
    { id: "accessories", name: "Accessories" },
  ];

  // Color options
  const colorOptions = [
    { id: "white", color: "#FFFFFF", border: true },
    { id: "black", color: "#000000" },
    { id: "beige", color: "#F5F5DC", border: true },
    { id: "pink", color: "#FFC0CB" },
    { id: "purple", color: "#800080" },
  ];

  // Size options
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300); // Small delay to ensure animation has started

      // Load recent searches from localStorage
      const savedSearches = localStorage.getItem("recentSearches");
      if (savedSearches) {
        try {
          setRecentSearches(JSON.parse(savedSearches));
        } catch (error) {
          console.error("Error parsing recent searches:", error);
          setRecentSearches([]);
        }
      }
    }

    // Cleanup function
    return () => {};
  }, [isOpen]);

  // Search functionality with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
        fetchSuggestions();
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedColor, selectedSize, selectedCategory]);

  // Fetch search suggestions
  const fetchSuggestions = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

    try {
      const suggestions = await searchService.getSearchSuggestions(searchQuery);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Call the search service with filters
      const { products } = await searchService.searchProducts(searchQuery, {
        limit: 8,
        color: selectedColor,
        size: selectedSize,
        category: selectedCategory !== "all" ? selectedCategory : undefined
      });

      setSearchResults(products);

      // Save search query to recent searches
      if (searchQuery.trim().length >= 3) {
        saveRecentSearch(searchQuery);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Save search to recent searches
  const saveRecentSearch = (query) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    // Add to recent searches, avoiding duplicates
    const updatedRecentSearches = [
      trimmedQuery,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
      ),
    ].slice(0, 5); // Keep only the 5 most recent

    setRecentSearches(updatedRecentSearches);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(updatedRecentSearches)
    );
  };

  const handleOpenSearch = () => {
    setIsOpen(true);
  };

  const handleCloseSearch = () => {
    setIsOpen(false);
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedCategory("all");
  };

  const handleResultClick = (productId) => {
    setIsOpen(false);
    
    // Save search before navigating
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }

    navigate(`/product/${productId}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    performSearch();
  };

  const handleRecentSearchClick = (searchTerm) => {
    setSearchQuery(searchTerm);
    performSearch();
  };
  
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId === selectedColor ? null : colorId);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Navigate to category page
    navigate(`/category/${categoryId}`);
    handleCloseSearch();
  };

  const goToSearchResults = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
    handleCloseSearch();
  };

  return (
    <div ref={searchRef} className="relative z-40">
      {/* Search icon button */}
      <button
        onClick={isOpen ? handleCloseSearch : handleOpenSearch}
        className="focus:outline-none transition-opacity duration-300"
        aria-label="Search"
      >
        <motion.img 
          src={darkNavbar ? "/icons/search.svg" : "/icons/search-black.svg"} 
          alt="Search" 
          className="w-5 h-5 cursor-pointer" 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </button>

      {/* Search dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 top-[60px] w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 z-50 overflow-hidden"
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="max-w-screen-xl mx-auto">
              {/* Search input */}
              <div className="flex items-center border-b border-gray-200 py-4 px-4">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH..."
                  className="flex-grow text-base uppercase font-light focus:outline-none text-gray-700"
                  autoComplete="off"
                />
                <button 
                  onClick={searchQuery ? handleClearSearch : handleCloseSearch}
                  className="text-gray-500 hover:text-black transition-colors duration-300"
                  aria-label={searchQuery ? "Clear search" : "Close search"}
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Recent searches - shown when no query */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="max-w-screen-xl mx-auto p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs text-gray-500">RECENT SEARCHES</h4>
                  <button 
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-black"
                  >
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 pb-3 border-b border-gray-200">
                  {recentSearches.map((search, index) => (
                    <div 
                      key={index}
                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center rounded-full"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      <FaHistory className="text-gray-400 mr-2 text-xs" />
                      <span className="text-sm text-gray-600">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="max-w-screen-xl mx-auto p-4">
                <h4 className="text-xs text-gray-500 mb-2">SUGGESTIONS</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="px-3 py-1 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center rounded-full"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <FaSearch className="text-gray-400 mr-2 text-xs" />
                      <span className="text-sm text-gray-600">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Only show filters and results if there's a search query */}
            {searchQuery && (
              <>
                {/* Empty spacer div for separation */}
                <div className="h-16 bg-gray-50"></div>
                
                <div className="max-w-screen-xl mx-auto">
                  <div className="flex flex-col md:flex-row">
                    {/* Filters column */}
                    <div className="w-full md:w-64 p-4">
                      {/* Color filter */}
                      <div className="mb-6">
                        <h3 className="text-uppercase mb-2 font-medium text-sm text-gray-700">COLOUR</h3>
                        <div className="w-full h-px bg-gray-200 mb-3"></div>
                        <div className="grid grid-cols-3 gap-x-1 gap-y-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.id}
                              onClick={() => handleColorSelect(color.id)}
                              className={`w-8 h-8 rounded-full mx-auto ${
                                color.border ? 'border border-gray-300' : ''
                              } ${
                                selectedColor === color.id ? 'ring-1 ring-black' : ''
                              }`}
                              style={{ backgroundColor: color.color }}
                              aria-label={`Select ${color.id} color`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Size filter */}
                      <div className="mb-6">
                        <h3 className="text-uppercase mb-2 font-medium text-sm text-gray-700">SIZE</h3>
                        <div className="w-full h-px bg-gray-200 mb-3"></div>
                        <div className="grid grid-cols-3 gap-y-2">
                          {sizeOptions.map((size) => (
                            <button
                              key={size}
                              onClick={() => handleSizeSelect(size)}
                              className={`w-10 h-10 flex items-center justify-center border ${
                                selectedSize === size 
                                  ? 'border-black bg-black text-gray-200' 
                                  : 'border-gray-300 hover:border-gray-500 text-gray-700'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Category filter */}
                      <div className="mb-6">
                        <h3 className="text-uppercase mb-2 font-medium text-sm text-gray-700">CATEGORY</h3>
                        <div className="w-full h-px bg-gray-200 mb-3"></div>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center">
                              <button
                                onClick={() => handleCategorySelect(category.id)}
                                className={`text-gray-700 hover:text-black ${
                                  selectedCategory === category.id 
                                  ? 'font-medium underline' 
                                  : 'hover:underline'
                                }`}
                              >
                                {category.name}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Empty spacer div for separation between filters and results */}
                    <div className="hidden md:block w-6 bg-gray-50"></div>

                    {/* Results column */}
                    <div className="w-full md:flex-1 p-4">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                        <h3 className="text-uppercase font-medium text-sm text-gray-700">PRODUCT RESULTS</h3>
                        {searchResults.length > 0 && (
                          <button 
                            onClick={goToSearchResults}
                            className="text-sm text-gray-600 hover:text-black underline"
                          >
                            See all results
                          </button>
                        )}
                      </div>

                      {loading && (
                        <div className="text-center py-6">
                          <div className="inline-block h-6 w-6 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div>
                          <p className="mt-3 text-gray-600">
                            Searching...
                          </p>
                        </div>
                      )}

                      {!loading && searchResults.length === 0 && searchQuery && (
                        <div className="text-center py-6">
                          <p className="text-gray-600">
                            No results found for "{searchQuery}"
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Try a different search term or browse our collections
                          </p>
                        </div>
                      )}

                      {!loading && searchResults.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {searchResults.map(product => (
                            <div 
                              key={product.id}
                              className="cursor-pointer group"
                              onClick={() => handleResultClick(product.id)}
                            >
                              {/* Product Image */}
                              <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-2">
                                <img
                                  src={product.image || product.images?.[0] || "/images/placeholder.jpg"}
                                  alt={product.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              
                              {/* Product Info */}
                              <div>
                                <h4 className="text-xs uppercase truncate text-gray-700">{product.title}</h4>
                                <p className="text-xs text-gray-600 mt-1 font-medium">₦{parseFloat(product.price).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;