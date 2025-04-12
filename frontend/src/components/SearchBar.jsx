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

      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Add blur class to the main content
      document.body.classList.add("search-open");

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
    } else {
      // Restore body scroll
      document.body.style.overflow = "";

      // Remove blur class
      document.body.classList.remove("search-open");
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("search-open");
    };
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

      {/* Search overlay and panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="fixed inset-0 bg-white/95 z-40"
              onClick={handleCloseSearch}
            />

            {/* Search panel - Full screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-screen-xl mx-auto">
                {/* Search input and close button */}
                <div className="flex items-center border-b border-gray-200 py-6 px-4">
                  <FaSearch className="text-gray-400 mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH..."
                    className="flex-grow text-base uppercase font-light focus:outline-none"
                    autoComplete="off"
                  />
                  <button 
                    onClick={handleCloseSearch}
                    className="text-gray-500 hover:text-black transition-colors duration-300"
                    aria-label="Close search"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row">
                  {/* Filters column */}
                  <div className="w-full md:w-1/4 p-4 border-r border-gray-200">
                    {/* Color filter */}
                    <div className="mb-8">
                      <h3 className="text-uppercase mb-4 font-medium text-sm border-b border-gray-100 pb-2">COLOUR</h3>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <button
                            key={color.id}
                            onClick={() => handleColorSelect(color.id)}
                            className={`w-10 h-10 rounded-full ${
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
                    <div className="mb-8">
                      <h3 className="text-uppercase mb-4 font-medium text-sm border-b border-gray-100 pb-2">SIZE</h3>
                      <div className="flex flex-wrap gap-2">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            className={`w-12 h-12 flex items-center justify-center border ${
                              selectedSize === size 
                                ? 'border-black bg-black text-white' 
                                : 'border-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category filter */}
                    <div className="mb-8">
                      <h3 className="text-uppercase mb-4 font-medium text-sm border-b border-gray-100 pb-2">CATEGORY</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center">
                            <input
                              type="radio"
                              id={category.id}
                              name="category"
                              checked={selectedCategory === category.id}
                              onChange={() => handleCategorySelect(category.id)}
                              className="mr-2"
                            />
                            <label htmlFor={category.id}>{category.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Results column */}
                  <div className="w-full md:w-3/4 p-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-4">
                      <h3 className="text-uppercase font-medium text-sm">PRODUCT RESULTS</h3>
                      {searchResults.length > 0 && (
                        <button 
                          onClick={goToSearchResults}
                          className="text-sm text-gray-700 hover:text-black underline"
                        >
                          See all results
                        </button>
                      )}
                    </div>

                    {/* Search suggestions */}
                    {showSuggestions && suggestions.length > 0 && !loading && (
                      <div className="mb-6">
                        <h4 className="text-xs text-gray-500 mb-2">SUGGESTIONS</h4>
                        <div className="space-y-1">
                          {suggestions.map((suggestion, index) => (
                            <div 
                              key={index}
                              className="px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <FaSearch className="text-gray-400 mr-3 text-xs" />
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {loading && (
                      <div className="text-center py-10">
                        <div className="inline-block h-6 w-6 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div>
                        <p className="mt-3 text-gray-500 text-sm">
                          Searching...
                        </p>
                      </div>
                    )}

                    {!loading && searchResults.length === 0 && searchQuery && (
                      <div className="text-center py-10">
                        <p className="text-gray-700">
                          No results found for "{searchQuery}"
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Try a different search term or browse our collections
                        </p>
                      </div>
                    )}

                    {!loading && searchResults.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {searchResults.map(product => (
                          <div 
                            key={product.id}
                            className="cursor-pointer group"
                            onClick={() => handleResultClick(product.id)}
                          >
                            {/* Product Image */}
                            <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                              <img
                                src={product.image || product.images?.[0] || "/images/placeholder.jpg"}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            
                            {/* Product Info */}
                            <div>
                              <h4 className="text-sm uppercase truncate">{product.title}</h4>
                              <p className="text-sm text-gray-800 mt-1 font-medium">₦{parseFloat(product.price).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;