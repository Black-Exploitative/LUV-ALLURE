import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    setSearchQuery("");
    setSearchResults([]);
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
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={searchPanelVariants}
              className="fixed left-0 right-0 top-[70px] bg-white z-50 overflow-hidden border-t border-gray-200"
            >
              {/* Search input container */}
              <div className="container mx-auto border-b border-gray-200">
                <div className="px-6 py-4 flex items-center">
                  <FaSearch className="text-gray-400 mr-4 text-lg" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="flex-grow text-base font-light focus:outline-none"
                    autoComplete="off"
                  />
                  <button
                    onClick={handleCloseSearch}
                    className="ml-4 text-gray-500 hover:text-black transition-colors duration-300"
                    aria-label="Close search"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Results container with scrolling */}
              <div className="container mx-auto">
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  {/* Search suggestions */}
                  {showSuggestions && suggestions.length > 0 && !loading && (
                    <div className="mb-8">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-sm transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent searches */}
                  {searchQuery.length < 2 && recentSearches.length > 0 && (
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                          Recent Searches
                        </h3>
                        <button
                          className="text-xs text-gray-500 hover:text-black transition-colors"
                          onClick={clearRecentSearches}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm rounded-sm transition-colors"
                          >
                            {search}
                          </button>
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
                      <div>
                        <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4 font-medium">
                          Results
                        </h3>

                        {/* Replace the existing search results section with this */}
                        <div>
                          {/* Top divider line */}
                          <div className="border-t border-gray-200 my-4"></div>

                          {/* Filter sections */}
                          <div className="mb-8">
                            {/* Color filter */}
                            <div className="mb-6">
                              <h3 className="text-xs uppercase tracking-wider font-medium pb-2 inline-block border-b border-black">
                                COLOUR
                              </h3>

                              <div className="mt-4 grid grid-cols-3 gap-6 max-w-[320px]">
                                {/* Color circles - first row */}
                                <button className="w-12 h-12 rounded-full bg-black border border-gray-200 hover:ring-2 hover:ring-offset-2 hover:ring-black transition-all duration-200"></button>
                                <button className="w-12 h-12 rounded-full bg-white border border-gray-200 hover:ring-2 hover:ring-offset-2 hover:ring-black transition-all duration-200"></button>
                                <button className="w-12 h-12 rounded-full bg-red-500 border border-gray-200 hover:ring-2 hover:ring-offset-2 hover:ring-black transition-all duration-200"></button>

                                {/* Color circles - second row */}
                                <button className="w-12 h-12 rounded-full bg-blue-500 border border-gray-200 hover:ring-2 hover:ring-offset-2 hover:ring-black transition-all duration-200"></button>
                                <button className="w-12 h-12 rounded-full bg-green-500 border border-gray-200 hover:ring-2 hover:ring-offset-2 hover:ring-black transition-all duration-200"></button>
                                <button className="w-12 h-12 rounded-full bg-yellow-400 border border-gray-200 hover:ring-2 hover:ring-offset-2 hover:ring-black transition-all duration-200"></button>
                              </div>
                            </div>

                            {/* Divider line between filters */}
                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Size filter */}
                            <div>
                              <h3 className="text-xs uppercase tracking-wider font-medium pb-2">
                                SIZE
                              </h3>

                              <div className="mt-4 grid grid-cols-3 gap-4 max-w-[320px]">
                                {/* Size options - first row */}
                                <button className="py-2 px-4 border border-gray-300 text-sm hover:border-black transition-colors duration-200">
                                  XS
                                </button>
                                <button className="py-2 px-4 border border-gray-300 text-sm hover:border-black transition-colors duration-200">
                                  S
                                </button>
                                <button className="py-2 px-4 border border-gray-300 text-sm hover:border-black transition-colors duration-200">
                                  M
                                </button>

                                {/* Size options - second row */}
                                <button className="py-2 px-4 border border-gray-300 text-sm hover:border-black transition-colors duration-200">
                                  L
                                </button>
                                <button className="py-2 px-4 border border-gray-300 text-sm hover:border-black transition-colors duration-200">
                                  XL
                                </button>
                                <button className="py-2 px-4 border border-gray-300 text-sm hover:border-black transition-colors duration-200">
                                  XXL
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Search results title with View All button on right */}
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                              RESULTS
                            </h3>

                            {searchResults.length > 0 && (
                              <button
                                className="text-xs uppercase tracking-wider text-black hover:text-gray-700 transition-colors duration-200 flex items-center"
                                onClick={() => {
                                  navigate(
                                    `/search?q=${encodeURIComponent(
                                      searchQuery
                                    )}`
                                  );
                                  handleCloseSearch();
                                }}
                              >
                                View All Results
                                <svg
                                  className="ml-1 w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                  ></path>
                                </svg>
                              </button>
                            )}
                          </div>

                          {/* Products grid - 6 per row on desktop */}
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {searchResults.map((product) => (
                              <div
                                key={product.id}
                                className="cursor-pointer group"
                                onClick={() => handleResultClick(product.id)}
                              >
                                {/* Product Image */}
                                <div className="aspect-[3/4] overflow-hidden mb-2">
                                  <img
                                    src={
                                      product.image ||
                                      product.images?.[0] ||
                                      "/images/placeholder.jpg"
                                    }
                                    alt={product.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                                  />
                                </div>

                                {/* Product Info */}
                                <div>
                                  <h4 className="text-xs text-gray-800 line-clamp-1">
                                    {product.title}
                                  </h4>
                                  <p className="text-xs text-black font-medium mt-1">
                                    ₦
                                    {parseFloat(product.price).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {searchResults.length > 0 && (
                          <div className="text-center mt-8">
                            <button
                              className="text-black border-b border-black hover:text-gray-600 text-sm transition-colors duration-300 pb-1"
                              onClick={() => {
                                navigate(
                                  `/search?q=${encodeURIComponent(searchQuery)}`
                                );
                                handleCloseSearch();
                              }}
                            >
                              View All Results
                            </button>
                          </div>
                        )}
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


    

