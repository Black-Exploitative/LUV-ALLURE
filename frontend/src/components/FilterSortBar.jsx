import PropTypes from "prop-types";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const FilterSortBar = ({ onGridChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridType, setGridType] = useState(4);
  const [activeFilters, setActiveFilters] = useState([]);

  // Filter state management
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
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

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleGridChange = (type) => {
    setGridType(type);
    onGridChange(type);
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
    setSelectedFilters({
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
    setActiveFilters([]);
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

  const formatPrice = (price) => {
    return `$${price}`;
  };

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
        {activeFilters.length > 0 && (
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
    ],
    size: ["XS", "S", "M", "L", "XL"],
    length: ["Mini", "Midi", "Maxi", "Knee-Length", "Ankle-Length"],
    style: ["Casual", "Formal", "Bohemian", "Street", "Minimalist"],
    occasion: ["Everyday", "Party", "Wedding", "Business", "Vacation"],
    category: ["Tops", "Dresses", "Bottoms", "Outerwear", "Accessories"],
    features: ["Sequined", "Embroidered", "Pockets", "Cut-outs", "Open back"],
    collection: ["Spring/Summer", "Fall/Winter", "Resort", "Limited Edition"],
    fabric: ["Cotton", "Silk", "Satin", "Linen", "Wool", "Polyester", "Velvet"],
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
                border: color === "White" ? "1px solid #e5e5e5" : "none",
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

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center">
          <button
            className="flex items-center text-gray-800 focus:outline-none cursor-pointer"
            onClick={toggleFilter}
          >
            <span className="tracking-wider text-sm uppercase font-thin">
              Filter
            </span>
            <span className="ml-2 text-sm leading-none">+</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <img
            src="./icons/grid4.svg"
            alt="Two column grid"
            className={`cursor-pointer h-5 w-5 ${
              gridType === 2 ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => handleGridChange(2)}
          />
          <img
            src="./icons/grid8.svg"
            alt="Four column grid"
            className={`cursor-pointer h-5 w-5 ${
              gridType === 4 ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => handleGridChange(4)}
          />
          <span className="text-gray-400">|</span>
          <div className="relative">
            <button
              className="flex items-center text-gray-800 uppercase cursor-pointer text-sm font-thin tracking-wider focus:outline-none"
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
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors uppercase tracking-wide">
                      Most Popular
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors uppercase tracking-wide">
                      Price: Low to High
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors uppercase tracking-wide">
                      Price: High to Low
                    </li>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors uppercase tracking-wide">
                      Newest
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {renderActiveFilters()}

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
                  <h3 className="text-sm font-light uppercase tracking-widest">
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
                  className="w-full py-3 bg-black text-white text-xs uppercase tracking-widest cursor-pointer font-light hover:bg-gray-900 transition-colors"
                >
                  See Results
                </button>
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-3 text-xs text-gray-700 underline cursor-pointer font-light tracking-wide"
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
  onGridChange: PropTypes.func.isRequired,
};

export default FilterSortBar;
