import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const FilterSortBar = ({
  onGridChange,
  onFiltersChange,
  initialFilters = {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridType, setGridType] = useState(4);
  const [activeFilters, setActiveFilters] = useState([]);
  const [isSticky, setIsSticky] = useState(false);
  const filterBarRef = useRef(null);
  const stickyWrapperRef = useRef(null);
  const [currentSort, setCurrentSort] = useState("Most Popular"); // Track current sort
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

  // Parse query parameters on mount and when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // Parse query parameters for filters
    let updatedFilters = { ...selectedFilters };
    let hasUpdates = false;

    // Parse each filter type from URL
    for (const filterType of Object.keys(selectedFilters)) {
      if (filterType === "price") {
        const priceRange = searchParams.get("price");
        if (priceRange) {
          const [min, max] = priceRange.split("-").map(Number);
          updatedFilters.price = [min || 0, max || 5000];
          hasUpdates = true;
        }
      } else {
        const filterParams = searchParams.getAll(filterType);
        if (filterParams.length > 0) {
          updatedFilters[filterType] = filterParams;
          hasUpdates = true;
        }
      }
    }

    // Special handling for query parameter
    const query = searchParams.get("q");
    if (query) {
      // If there's a search query, add it as a special filter
      updatedFilters.query = query;
      hasUpdates = true;
    }

    // Special handling for color parameter (which might be spelled differently than 'colour')
    const colorParam = searchParams.get("color");
    if (colorParam && !updatedFilters.colour.includes(colorParam)) {
      updatedFilters.colour = [...updatedFilters.colour, colorParam];
      hasUpdates = true;
    }

    // Get sort parameter
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
        case "most popular":
          displaySort = "Most Popular";
          break;
      }
      setCurrentSort(displaySort);
    }

    // Get grid type
    const gridParam = parseInt(searchParams.get("grid") || "0");
    if (gridParam === 2 || gridParam === 4) {
      setGridType(gridParam);
      if (onGridChange) {
        onGridChange(gridParam);
      }
    }

    // Update states if we found any filters in URL
    if (hasUpdates) {
      setSelectedFilters(updatedFilters);

      // Generate active filters from the URL parameters
      const newActiveFilters = [];

      for (const [type, values] of Object.entries(updatedFilters)) {
        if (type === "price") {
          if (values[0] > 0 || values[1] < 5000) {
            newActiveFilters.push({
              type,
              values: [...values],
            });
          }
        } else if (type === "query" && values) {
          newActiveFilters.push({
            type,
            values: [values],
          });
        } else if (Array.isArray(values) && values.length > 0) {
          newActiveFilters.push({
            type,
            values: [...values],
          });
        }
      }

      setActiveFilters(newActiveFilters);
    }
  }, [location.search]);

  // Setup scroll event listener to detect when to make the filter bar sticky
  useEffect(() => {
    const handleScroll = () => {
      if (!filterBarRef.current || !stickyWrapperRef.current) return;

      const navbarHeight = 100; // Approximate height of your navbar
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

  // Update URL when filters or sort change
  useEffect(() => {
    if (
      activeFilters.length === 0 &&
      currentSort === "Most Popular" &&
      gridType === 4
    ) {
      return; // Don't update URL if using default values
    }

    // Get current search parameters to preserve search query
    const currentParams = new URLSearchParams(location.search);
    const searchQuery = currentParams.get("q");

    // Build new search params
    const searchParams = new URLSearchParams();

    // Keep original search query if it exists
    if (searchQuery) {
      searchParams.set("q", searchQuery);
    }

    // Add active filters to URL
    activeFilters.forEach((filter) => {
      if (filter.type === "price") {
        searchParams.set("price", `${filter.values[0]}-${filter.values[1]}`);
      } else if (filter.type !== "query") {
        // Don't duplicate the query parameter
        filter.values.forEach((value) => {
          // Special handling for colour/color
          if (filter.type === "colour") {
            searchParams.append("color", value);
          } else {
            searchParams.append(filter.type, value);
          }
        });
      }
    });

    // Add sort parameter
    if (currentSort !== "Most Popular") {
      // Convert display sort option to API sort parameter
      let sortParam = "";
      switch (currentSort) {
        case "Price: Low to High":
          sortParam = "price-low-high";
          break;
        case "Price: High to Low":
          sortParam = "price-high-low";
          break;
        case "Newest":
          sortParam = "newest";
          break;
        case "Alphabetical: A-Z":
          sortParam = "alphabetical";
          break;
        default:
          sortParam = "most-popular";
      }
      searchParams.set("sort", sortParam);
    }

    // Add grid type
    if (gridType !== 4) {
      searchParams.set("grid", gridType.toString());
    }

    // Update URL without reload
    const queryString = searchParams.toString();
    const newUrl = queryString
      ? `${location.pathname}?${queryString}`
      : location.pathname;

    navigate(newUrl, { replace: true });

    // Call the filter change callback if provided
    if (onFiltersChange) {
      // Convert the filter data to the format expected by the API
      const filterData = {
        filters: selectedFilters,
        activeFilters,
        sort: mapSortToApiParameter(currentSort),
        gridType,
      };

      onFiltersChange(filterData);
    }
  }, [
    activeFilters,
    currentSort,
    gridType,
    location.pathname,
    navigate,
    onFiltersChange,
  ]);

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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleGridChange = (type) => {
    setGridType(type);
    if (onGridChange) {
      onGridChange(type);
    }
  };

  const toggleAccordion = (filter) => {
    setExpandedFilter(expandedFilter === filter ? null : filter);
  };

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

    setActiveFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    // Preserve the search query if it exists
    const query = selectedFilters.query;

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

    setActiveFilters(newActiveFilters);
  };

  const handleRemoveFilter = (filterType, value) => {
    if (filterType === "price") {
      setSelectedFilters({
        ...selectedFilters,
        price: [0, 5000],
      });

      // Remove price filter from active filters
      const updatedFilters = activeFilters.filter(
        (filter) => filter.type !== "price"
      );
      setActiveFilters(updatedFilters);
    } else {
      // Handle other filter types
      const newValues = selectedFilters[filterType].filter((v) => v !== value);

      setSelectedFilters({
        ...selectedFilters,
        [filterType]: newValues,
      });

      // Update active filters
      const updatedFilters = activeFilters
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

      setActiveFilters(updatedFilters);
    }
  };

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

  const handleSortChange = (sortOption) => {
    setCurrentSort(sortOption);
    setIsDropdownOpen(false);
  };

  const formatPrice = (price) => {
    return `NGN${price}`;
  };

  // Display active filters as tags
  const renderActiveFilters = () => {
    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center mt-3 ml-4">
        {activeFilters.map((filter) => {
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
                key={`${filter.type}-{value}`}
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
        {activeFilters.some((filter) => filter.type !== "query") && (
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
  }, [activeFilters]);

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
};

export default FilterSortBar;
