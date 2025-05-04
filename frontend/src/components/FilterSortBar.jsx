import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const FilterSortBar = ({
  onGridChange,
  onFiltersChange,
  initialFilters = {},
  activeFilters = []
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridType, setGridType] = useState(parseInt(searchParams.get("grid") || "4"));
  const [activeFilterState, setActiveFilterState] = useState(activeFilters);
  const [isSticky, setIsSticky] = useState(false);
  const filterBarRef = useRef(null);
  const stickyWrapperRef = useRef(null);
  const [currentSort, setCurrentSort] = useState(searchParams.get("sort") || "Most Popular"); // Track current sort
  const sortOptionsRef = useRef(null);

  // Filter state management
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    colour: initialFilters.colour || [],
    size: initialFilters.size || [],
    length: initialFilters.length || [],
    style: initialFilters.style || [],
    occasion: initialFilters.occasion || [],
    category: initialFilters.category || [],
    features: initialFilters.features || [],
    collection: initialFilters.collection || [],
    fabric: initialFilters.fabric || [],
    price: initialFilters.price || [0, 5000],
  });

  // Update internal state when props change
  useEffect(() => {
    // Update selectedFilters when initialFilters changes
    setSelectedFilters(prev => ({
      ...prev,
      colour: initialFilters.colour || [],
      size: initialFilters.size || [],
      category: initialFilters.category || [],
      price: initialFilters.price || [0, 5000]
    }));
    
    // Update active filters
    setActiveFilterState(activeFilters);
    
    // Update grid type from URL
    const gridParam = parseInt(searchParams.get("grid") || "4");
    setGridType(gridParam === 2 ? 2 : 4);
    
    // Update sort from URL
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      // Map API sort parameter to display sort option
      let displaySort = "Most Popular";
      switch (sortParam.toLowerCase()) {
        case "price-low-high":
          displaySort = "Price: Low to High";
          break;
        case "price-high-low":
          displaySort = "Price: High to Low";
          break;
        case "newest":
          displaySort = "Newest";
          break;
        case "alphabetical":
        case "alphabetical: a-z":
          displaySort = "Alphabetical: A-Z";
          break;
        case "best-selling":
        case "most-popular":
          displaySort = "Most Popular";
          break;
      }
      setCurrentSort(displaySort);
    }
  }, [initialFilters, activeFilters, searchParams]);

  // Filter options mock data
  const filterOptions = {
    colour: [
      "Black",
      "White",
      "Red",
      "Blue",
      "Green",
      "Beige",
      "Pink",
      "Yellow",
      "Navy",
      "Burgundy",
      "Grey",
      "Silver",
      "Gold",
      "Purple",
      "Orange",
      "Brown",
      "Cream",
      "Ivory",
    ],
    size: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"],
    length: ["Mini", "Midi", "Maxi", "Knee-Length", "Ankle-Length"],
    style: ["Casual", "Formal", "Bohemian", "Street", "Minimalist"],
    occasion: ["Everyday", "Party", "Wedding", "Business", "Vacation"],
    category: ["Tops", "Dresses", "Bottoms", "Outerwear", "Accessories"],
    features: ["Sequined", "Embroidered", "Pockets", "Cut-outs", "Open back"],
    collection: ["Spring/Summer", "Fall/Winter", "Resort", "Limited Edition"],
    fabric: ["Cotton", "Silk", "Satin", "Linen", "Wool", "Polyester", "Velvet"],
  };

  // Sort options data
  const sortOptions = [
    "Most Popular",
    "Price: Low to High",
    "Price: High to Low",
    "Newest",
    "Alphabetical: A-Z",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortOptionsRef.current &&
        !sortOptionsRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Setup scroll event listener for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!filterBarRef.current || !stickyWrapperRef.current) return;

      const navbarHeight = 100; // Approximate height of navbar
      const filterBarTop = stickyWrapperRef.current.getBoundingClientRect().top;

      if (filterBarTop <= navbarHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  // Handle grid change
  const handleGridChange = (type) => {
    setGridType(type);
    if (onGridChange) {
      onGridChange(type);
    }
  };

  // Toggle accordion sections
  const toggleAccordion = (filter) => {
    setExpandedFilter(expandedFilter === filter ? null : filter);
  };

  // Apply selected filters
  const handleApplyFilters = () => {
    const newFilters = [];

    // Build active filters list from all selected filters
    Object.entries(selectedFilters).forEach(([type, values]) => {
      if (type === "price") {
        if (values[0] > 0 || values[1] < 5000) {
          newFilters.push({
            type,
            values: [...values],
          });
        }
      } else if (type === "query") {
        // Skip query; it's managed separately
      } else if (values.length > 0) {
        newFilters.push({
          type,
          values: [...values],
        });
      }
    });

    // Update active filters state
    setActiveFilterState(newFilters);
    
    // Call the onFiltersChange callback with new filters and sort
    if (onFiltersChange) {
      onFiltersChange({
        activeFilters: newFilters,
        filters: selectedFilters,
        sort: mapSortToApiParameter(currentSort),
        gridType
      });
    }
    
    // Close the filter panel
    setIsFilterOpen(false);
  };

  // Clear all filters
  const handleClearFilters = () => {
    // Preserve the search query if it exists
    const query = selectedFilters.query;

    // Reset selected filters
    setSelectedFilters({
      query, // Keep the search query
      colour: [],
      size: [],
      length: [],
      style: [],
      occasion: [],
      category: [],
      features: [],
      collection: [],
      fabric: [],
      price: [0, 5000],
    });

    // Keep only the query in active filters if it exists
    const newActiveFilters = [];
    if (query) {
      newActiveFilters.push({
        type: "query",
        values: [query],
      });
    }

    // Update active filters state
    setActiveFilterState(newActiveFilters);
    
    // Call onFiltersChange with cleared filters
    if (onFiltersChange) {
      onFiltersChange({
        activeFilters: newActiveFilters,
        filters: {
          query,
          colour: [],
          size: [],
          length: [],
          style: [],
          occasion: [],
          category: [],
          features: [],
          collection: [],
          fabric: [],
          price: [0, 5000],
        },
        sort: "relevance",
        gridType
      });
    }
  };

  // Remove individual filter
  const handleRemoveFilter = (filterType, value) => {
    if (filterType === "price") {
      // Reset price filter
      setSelectedFilters({
        ...selectedFilters,
        price: [0, 5000],
      });

      // Remove price filter from active filters
      const updatedFilters = activeFilterState.filter(
        (filter) => filter.type !== "price"
      );
      setActiveFilterState(updatedFilters);
      
      // Call onFiltersChange with updated filters
      if (onFiltersChange) {
        onFiltersChange({
          activeFilters: updatedFilters,
          filters: {
            ...selectedFilters,
            price: [0, 5000],
          },
          sort: mapSortToApiParameter(currentSort),
          gridType
        });
      }
    } else {
      // Handle other filter types
      const newValues = selectedFilters[filterType].filter((v) => v !== value);

      setSelectedFilters({
        ...selectedFilters,
        [filterType]: newValues,
      });

      // Update active filters
      const updatedFilters = activeFilterState
        .map((filter) => {
          if (filter.type === filterType) {
            return {
              ...filter,
              values: filter.values.filter((v) => v !== value),
            };
          }
          return filter;
        })
        .filter((filter) => filter.values.length > 0);

      setActiveFilterState(updatedFilters);
      
      // Call onFiltersChange with updated filters
      if (onFiltersChange) {
        onFiltersChange({
          activeFilters: updatedFilters,
          filters: {
            ...selectedFilters,
            [filterType]: newValues,
          },
          sort: mapSortToApiParameter(currentSort),
          gridType
        });
      }
    }
  };

  // Toggle selection of a filter option
  const toggleSelection = (filterType, value) => {
    const currentValues = selectedFilters[filterType];
    let newValues;

    if (currentValues.includes(value)) {
      newValues = currentValues.filter((v) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    setSelectedFilters({
      ...selectedFilters,
      [filterType]: newValues,
    });
  };

  // Handle sort change
  const handleSortChange = (sortOption) => {
    setCurrentSort(sortOption);
    setIsDropdownOpen(false);
    
    // Call onFiltersChange with the new sort option
    if (onFiltersChange) {
      onFiltersChange({
        activeFilters: activeFilterState,
        filters: selectedFilters,
        sort: mapSortToApiParameter(sortOption),
        gridType
      });
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    return `₦${price.toLocaleString()}`;
  };

  // Convert UI sort option to API parameter
  const mapSortToApiParameter = (sortOption) => {
    switch (sortOption) {
      case "Price: Low to High":
        return "price-low-high";
      case "Price: High to Low":
        return "price-high-low";
      case "Newest":
        return "newest";
      case "Alphabetical: A-Z":
        return "alphabetical";
      case "Most Popular":
      default:
        return "relevance";
    }
  };

  // Display active filters as tags
  const renderActiveFilters = () => {
    if (activeFilterState.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center mt-3 ml-4">
        {activeFilterState.map((filter) => {
          if (filter.type === "price") {
            return (
              <div
                key="price-range"
                className="flex items-center bg-gray-100 px-3 py-1 mr-2 mb-2 text-sm"
              >
                <span className="mr-1">
                  Price: {formatPrice(filter.values[0])} -{" "}
                  {formatPrice(filter.values[1])}
                </span>
                <IoCloseOutline
                  className="cursor-pointer"
                  onClick={() => handleRemoveFilter("price")}
                />
              </div>
            );
          } else if (filter.type === "query") {
            // Don't display the query as a removable filter
            return null;
          } else {
            return filter.values.map((value) => (
              <div
                key={`${filter.type}-${value}`}
                className="flex items-center bg-gray-100 px-3 py-1 mr-2 mb-2 text-sm"
              >
                <span className="mr-1">
                  {filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}:{" "}
                  {value}
                </span>
                <IoCloseOutline
                  className="cursor-pointer"
                  onClick={() => handleRemoveFilter(filter.type, value)}
                />
              </div>
            ));
          }
        })}
        {activeFilterState.some((filter) => filter.type !== "query") && (
          <button
            className="text-xs underline ml-2 mb-2 cursor-pointer"
            onClick={handleClearFilters}
          >
            Clear All
          </button>
        )}
      </div>
    );
  };

  // Render color swatches
  const renderColorOptions = () => {
    const colorMap = {
      Black: "#000000",
      White: "#FFFFFF",
      Red: "#FF0000",
      Blue: "#0000FF",
      Green: "#008000",
      Beige: "#F5F5DC",
      Pink: "#FFC0CB",
      Yellow: "#FFFF00",
      Navy: "#000080",
      Burgundy: "#800020",
      Grey: "#808080",
      Silver: "#C0C0C0",
      Gold: "#FFD700",
      Purple: "#800080",
      Orange: "#FFA500",
      Brown: "#A52A2A",
      Cream: "#FFFDD0",
      Ivory: "#FFFFF0",
    };

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {filterOptions.colour.map((color) => (
          <button
            key={color}
            className={`flex flex-col items-center cursor-pointer ${
              selectedFilters.colour.includes(color)
                ? "opacity-100"
                : "opacity-70"
            }`}
            onClick={() => toggleSelection("colour", color)}
          >
            <div
              className={`w-8 h-8 rounded-full mb-1 ${
                selectedFilters.colour.includes(color)
                  ? "ring-2 ring-black"
                  : ""
              }`}
              style={{
                backgroundColor: colorMap[color] || color,
                border:
                  color === "White" || color === "Ivory" || color === "Cream"
                    ? "1px solid #e5e5e5"
                    : "none",
              }}
            />
            <span className="text-xs text-center">{color}</span>
          </button>
        ))}
      </div>
    );
  };

  // Render button toggle options
  const renderButtonOptions = (type) => {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {filterOptions[type].map((option) => (
          <button
            key={option}
            className={`px-3 py-2 text-xs border cursor-pointer ${
              selectedFilters[type].includes(option)
                ? "border-black bg-black text-white"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            } transition-colors`}
            onClick={() => toggleSelection(type, option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  };

  // Render filter accordion section
  const renderFilterSection = (title, type, content) => {
    const isExpanded = expandedFilter === type;

    return (
      <div className="border-b border-gray-200">
        <button
          className="w-full py-4 px-1 flex justify-between items-center text-left focus:outline-none cursor-pointer"
          onClick={() => toggleAccordion(type)}
        >
          <h4 className="text-sm font-medium uppercase tracking-wide">
            {title}
          </h4>
          <div
            className={`transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pb-4"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Calculate the height of the filter bar to use for the placeholder div
  useEffect(() => {
    if (filterBarRef.current) {
      // Set an attribute with the height that we can use for the placeholder
      filterBarRef.current.setAttribute(
        "data-height",
        `${filterBarRef.current.offsetHeight}px`
      );
    }
  }, [activeFilterState]);

  return (
    <div ref={stickyWrapperRef} className="mb-6">
      {/* This div will take up space when the filter bar becomes fixed */}
      {isSticky && (
        <div
          style={{
            height: filterBarRef.current
              ? filterBarRef.current.getAttribute("data-height")
              : "0px",
          }}
        ></div>
      )}

      <div
        ref={filterBarRef}
        className={`${
          isSticky
            ? "fixed top-[70px] left-0 right-0 z-30 bg-white shadow-md"
            : ""
        }`}
      >
        <div className="flex items-center justify-between p-4 border-y-[0.5px] border-gray-300">
          <div className="flex items-center">
            <button
              className="flex items-center text-gray-800 focus:outline-none cursor-pointer"
              onClick={toggleFilter}
            >
              <span className="tracking-wide text-sm uppercase font-thin">
                Filter
              </span>
              <span className="ml-2 text-sm leading-none">+</span>
            </button>
          </div>

          <div className="flex items-center space-x-4" ref={sortOptionsRef}>
            <img
              src="/icons/grid4.svg"
              alt="Two column grid"
              className={`cursor-pointer h-5 w-5 ${
                gridType === 2 ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => handleGridChange(2)}
            />
            <img
              src="/icons/grid8.svg"
              alt="Four column grid"
              className={`cursor-pointer h-5 w-5 ${
                gridType === 4 ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => handleGridChange(4)}
            />
            <span className="text-gray-400">|</span>
            <div className="relative">
              <button
                className="flex items-center text-gray-800 uppercase cursor-pointer text-sm font-thin tracking-wide focus:outline-none"
                onClick={toggleDropdown}
              >
                Sort <IoMdArrowDropdown className="ml-1" />
              </button>
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 bg-white shadow-lg border mt-1 w-48 z-50"
                  >
                    <ul className="text-gray-700 text-xs py-1">
                      {sortOptions.map((option) => (
                        <li
                          key={option}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors uppercase tracking-wide ${
                            currentSort === option ? "bg-gray-100" : ""
                          }`}
                          onClick={() => handleSortChange(option)}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {renderActiveFilters()}
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-thin uppercase tracking-wider">
                    Filter
                  </h3>
                  <button
                    onClick={toggleFilter}
                    className="text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <IoCloseOutline size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {renderFilterSection(
                    "Price",
                    "price",
                    <div className="px-1 mt-3">
                      <div className="flex justify-between mb-2 text-xs text-gray-600">
                        <span>{formatPrice(selectedFilters.price[0])}</span>
                        <span>{formatPrice(selectedFilters.price[1])}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={selectedFilters.price[1]}
                        onChange={(e) =>
                          setSelectedFilters({
                            ...selectedFilters,
                            price: [
                              selectedFilters.price[0],
                              parseInt(e.target.value),
                            ],
                          })
                        }
                        className="w-full accent-black"
                      />
                      <div className="mt-4 mb-2 text-xs text-gray-800 font-medium">
                        Range:
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={selectedFilters.price[1]}
                          value={selectedFilters.price[0]}
                          onChange={(e) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              price: [
                                parseInt(e.target.value),
                                selectedFilters.price[1],
                              ],
                            })
                          }
                          className="w-full border border-gray-300 p-2 text-xs"
                        />
                        <span className="text-xs">to</span>
                        <input
                          type="number"
                          min={selectedFilters.price[0]}
                          max="5000"
                          value={selectedFilters.price[1]}
                          onChange={(e) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              price: [
                                selectedFilters.price[0],
                                parseInt(e.target.value),
                              ],
                            })
                          }
                          className="w-full border border-gray-300 p-2 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  {renderFilterSection(
                    "Colour",
                    "colour",
                    renderColorOptions()
                  )}

                  {renderFilterSection(
                    "Size",
                    "size",
                    renderButtonOptions("size")
                  )}

                  {renderFilterSection(
                    "Length",
                    "length",
                    renderButtonOptions("length")
                  )}

                  {renderFilterSection(
                    "Style",
                    "style",
                    renderButtonOptions("style")
                  )}

                  {renderFilterSection(
                    "Occasion",
                    "occasion",
                    renderButtonOptions("occasion")
                  )}

                  {renderFilterSection(
                    "Category",
                    "category",
                    renderButtonOptions("category")
                  )}

                  {renderFilterSection(
                    "Features",
                    "features",
                    renderButtonOptions("features")
                  )}

                  {renderFilterSection(
                    "Collection",
                    "collection",
                    renderButtonOptions("collection")
                  )}

                  {renderFilterSection(
                    "Fabric",
                    "fabric",
                    renderButtonOptions("fabric")
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleApplyFilters}
                  className="w-full py-3 bg-black text-white text-xs uppercase tracking-wide cursor-pointer font-thin hover:bg-gray-900 transition-colors"
                >
                  See Results
                </button>
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-3 text-xs text-gray-700 underline cursor-pointer font-thin tracking-wide"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

FilterSortBar.propTypes = {
  onGridChange: PropTypes.func,
  onFiltersChange: PropTypes.func,
  initialFilters: PropTypes.object,
  activeFilters: PropTypes.array
};

FilterSortBar.defaultProps = {
  initialFilters: {},
  activeFilters: []
};

export default FilterSortBar;