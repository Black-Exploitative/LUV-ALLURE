import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHistory } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaTimes, FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import searchService from "../services/searchApi";

const SearchBar = ({ darkNavbar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
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
  }, [searchQuery]);

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
      // Call the search service
      const { products } = await searchService.searchProducts(searchQuery, {
        limit: 8,
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
  };

  const handleResultClick = (productId) => {
    setIsOpen(false);
    
    // Save search before navigating
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }

    navigate(`/product/${productId}`);
    setIsOpen(false);
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

  // Animation variants for the search panel
  const searchPanelVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // Backdrop blur animation
  const backdropVariants = {
    hidden: {
      opacity: 0.5,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
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
              variants={backdropVariants}
              className="fixed inset-0 bg-black/70 z-40 mt-[70px]"
              onClick={handleCloseSearch}
            />

            {/* Search panel - Fixed position below navbar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 right-0 bg-white z-50 shadow-lg"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Search input and close button */}
                <div className="flex items-center border-b border-gray-300 pb-4">
                  <FaSearch className="text-gray-400 mr-3" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="flex-grow text-base font-light focus:outline-none"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button 
                      onClick={handleClearSearch}
                      className="mr-3 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                  <button 
                    onClick={handleCloseSearch}
                    className="ml-4 text-gray-500 hover:text-black transition-colors duration-300"
                    aria-label="Close search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

                {/* Search suggestions */}
                {showSuggestions && suggestions.length > 0 && !loading && (
                  <div className="mt-2">
                    <h3 className="text-xs font-medium text-gray-500 mb-2">SUGGESTIONS</h3>
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
                
                {/* Recent searches */}
                {searchQuery.length < 2 && recentSearches.length > 0 && (
                  <div className="mt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xs font-medium text-gray-500">RECENT SEARCHES</h3>
                      <button 
                        className="text-xs text-gray-500 hover:text-black"
                        onClick={clearRecentSearches}
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <div 
                          key={index}
                          className="px-2 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleRecentSearchClick(search)}
                        >
                          <FaHistory className="text-gray-400 mr-3 text-xs" />
                          <span className="text-sm">{search}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                  {/* Search results */}
                  <div className="mb-6">
                    {loading && (
                      <div className="text-center py-10">
                        <div className="inline-block h-6 w-6 border-2 border-t-black border-gray-200 rounded-full animate-spin"></div>
                        <p className="mt-3 text-gray-500 text-sm">
                          Searching...
                        </p>
                      </div>
                    )}

                    {!loading &&
                      searchQuery.length >= 2 &&
                      searchResults.length === 0 &&
                      !showSuggestions && (
                        <div className="text-center py-10">
                          <p className="text-gray-700">
                            No results found for `{searchQuery}`
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            Try a different search term or browse our
                            collections
                          </p>
                        </div>
                      )}

                  {!loading && searchResults.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-500">SEARCH RESULTS</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.map(product => (
                          <div 
                            key={product.id}
                            className="flex items-center border border-gray-200 p-3 cursor-pointer hover:border-gray-400 transition-colors"
                            onClick={() => handleResultClick(product.id)}
                          >
                            {/* Product Image */}
                            <div className="w-16 h-20 bg-gray-100 mr-3 flex-shrink-0">
                              <img
                                src={product.image || product.images?.[0] || "/images/placeholder.jpg"}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">{product.title}</h4>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.productType}</p>
                              <p className="text-sm text-gray-800 mt-1 font-medium">₦{parseFloat(product.price).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {searchResults.length > 0 && (
                        <div className="text-center mt-6">
                          <button 
                            className="text-black underline hover:text-gray-600 text-sm"
                            onClick={() => {
                              navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
                              handleCloseSearch();
                            }}
                          >
                            See all results
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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


    

