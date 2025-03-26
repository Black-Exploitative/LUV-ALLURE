// components/SearchBar.jsx
import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHistory } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import searchService from "../services/searchApi";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [darkNavbar, setDarkNavbar] = useState(true);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if we're on the home page to set dark navbar
  useEffect(() => {
    setDarkNavbar(location.pathname === "/" && window.scrollY <= 50);
    
    const handleScroll = () => {
      if (location.pathname === "/") {
        setDarkNavbar(window.scrollY <= 50);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

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
      inputRef.current.focus();
    }
    
    // Load recent searches from localStorage
    if (isOpen) {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        try {
          setRecentSearches(JSON.parse(savedSearches));
        } catch (error) {
          console.error('Error parsing recent searches:', error);
          setRecentSearches([]);
        }
      }
    }
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
  }, [searchQuery, selectedCategory]);
  
  // Fetch search suggestions
  const fetchSuggestions = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    
    try {
      const suggestions = await searchService.getSearchSuggestions(searchQuery);
      setSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Call the search service
      const { products } = await searchService.searchProducts(searchQuery, {
        category: selectedCategory,
        limit: 5
      });
      
      setSearchResults(products);
      
      // Save search query to recent searches
      if (searchQuery.trim().length >= 3) {
        saveRecentSearch(searchQuery);
      }
    } catch (error) {
      console.error('Error searching products:', error);
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
      ...recentSearches.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase())
    ].slice(0, 5); // Keep only the 5 most recent
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
  };

  const handleOpenSearch = () => {
    setIsOpen(true);
  };

  const handleCloseSearch = () => {
    setIsOpen(false);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleResultClick = (productId) => {
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
  
  const handleSeeAllResults = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
      setIsOpen(false);
    }
  };
  
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={searchRef} className="relative z-50">
      {/* Search icon button */}
      <button 
        onClick={handleOpenSearch}
        className="focus:outline-none"
        aria-label="Search"
      >
        <motion.img 
          src={darkNavbar ? "/icons/search.svg" : "/icons/search-black.svg"} 
          alt="Search" 
          className="w-[15px] h-[15px] cursor-pointer" 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
      </button>

      {/* Search overlay and panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={handleCloseSearch}
            />

            {/* Search panel */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 right-0 bg-white z-50 shadow-lg max-h-[85vh] overflow-auto"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Search input and close button */}
                <div className="flex items-center border-b border-gray-300 pb-4">
                  <img 
                    src={"/icons/search-black.svg"} 
                    alt="Search" 
                    className="w-5 h-5 mr-3 text-gray-400" 
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="flex-grow focus:outline-none text-lg"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button 
                      onClick={handleClearSearch}
                      className="mr-3 text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button 
                    onClick={handleCloseSearch}
                    className="ml-2 text-gray-600 hover:text-black"
                    aria-label="Close search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Category filters */}
                <div className="flex overflow-x-auto py-3 space-x-4 no-scrollbar">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-3 py-1 text-sm whitespace-nowrap transition-colors ${
                        selectedCategory === category.id
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
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
                          <img 
                            src={"/icons/search-black.svg"} 
                            alt="Search" 
                            className="w-4 h-4 mr-3 text-gray-400" 
                          />
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
                <div className={`mt-4 ${searchResults.length > 0 ? "pb-6" : "pb-2"}`}>
                  {loading && (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-black rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-600">Searching...</p>
                    </div>
                  )}

                  {!loading && searchQuery.length >= 2 && searchResults.length === 0 && !showSuggestions && (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No results found for "{searchQuery}"</p>
                      <p className="text-sm text-gray-500 mt-1">Try a different search term or browse our categories</p>
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
                            onClick={handleSeeAllResults}
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