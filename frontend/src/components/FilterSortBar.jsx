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
  const [selectedSize, setSelectedSize] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const handleGridChange = (type) => {
    setGridType(type);
    onGridChange(type);
  };

  const handleApplyFilters = () => {
    const newFilters = [];

    if (selectedSize.length > 0) {
      newFilters.push({
        type: "size",
        values: [...selectedSize],
      });
    }

    if (priceRange[0] > 0 || priceRange[1] < 5000) {
      newFilters.push({
        type: "price",
        values: [...priceRange],
      });
    }

    setActiveFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedSize([]);
    setPriceRange([0, 5000]);
    setActiveFilters([]);
  };

  const handleRemoveFilter = (filterType, value) => {
    if (filterType === "size") {
      const newSizes = selectedSize.filter((size) => size !== value);
      setSelectedSize(newSizes);

      // Update active filters
      const updatedFilters = activeFilters
        .map((filter) => {
          if (filter.type === "size") {
            return {
              ...filter,
              values: filter.values.filter((v) => v !== value),
            };
          }
          return filter;
        })
        .filter((filter) => filter.values.length > 0);

      setActiveFilters(updatedFilters);
    } else if (filterType === "price") {
      setPriceRange([0, 5000]);

      // Remove price filter from active filters
      const updatedFilters = activeFilters.filter(
        (filter) => filter.type !== "price"
      );
      setActiveFilters(updatedFilters);
    }
  };

  const toggleSizeSelection = (size) => {
    if (selectedSize.includes(size)) {
      setSelectedSize(selectedSize.filter((s) => s !== size));
    } else {
      setSelectedSize([...selectedSize, size]);
    }
  };

  const formatPrice = (price) => {
    return `$${price}`;
  };

  const renderActiveFilters = () => {
    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center mt-3 ml-4">
        {activeFilters.map((filter) => {
          if (filter.type === "size") {
            return filter.values.map((size) => (
              <div
                key={`size-${size}`}
                className="flex items-center bg-gray-100 px-3 py-1 mr-2 mb-2 text-sm"
              >
                <span className="mr-1">Size: {size}</span>
                <IoCloseOutline
                  className="cursor-pointer"
                  onClick={() => handleRemoveFilter("size", size)}
                />
              </div>
            ));
          } else if (filter.type === "price") {
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
          }
          return null;
        })}
        {activeFilters.length > 0 && (
          <button
            className="text-xs underline ml-2 mb-2"
            onClick={handleClearFilters}
          >
            Clear All
          </button>
        )}
      </div>
    );
  };

  // Available sizes for the filter
  const availableSizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center">
          <button
            className="flex items-center text-gray-700 font-thin focus:outline-none"
            onClick={toggleFilter}
          >
            <div>
              <span className="mr-2 tracking-wider text-sm">FILTER</span>
              <span className="inline-flex">+</span>
            </div>
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
              className="flex items-center text-gray-700 font-semibold focus:outline-none"
              onClick={toggleDropdown}
            >
              SORT <IoMdArrowDropdown className="ml-1" />
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
                  <ul className="text-gray-700 text-sm py-1">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                      Most Popular
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                      Price: Low to High
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
                      Price: High to Low
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors">
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
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">FILTER</h3>
                <button
                  onClick={toggleFilter}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-medium mb-4 uppercase tracking-wide">
                  Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border ${
                        selectedSize.includes(size)
                          ? "border-black bg-black text-white"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      } transition-colors`}
                      onClick={() => toggleSizeSelection(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-sm font-medium mb-4 uppercase tracking-wide">
                  Price
                </h4>
                <div className="px-2">
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="mt-4 mb-2 text-sm font-medium">Range:</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([parseInt(e.target.value), priceRange[1]])
                      }
                      className="w-full border border-gray-300 p-2 text-sm"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full border border-gray-300 p-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleApplyFilters}
                  className="w-full py-3 bg-black text-white text-sm uppercase tracking-wide hover:bg-gray-900 transition-colors"
                >
                  See Results
                </button>
                <button
                  onClick={handleClearFilters}
                  className="w-full mt-3 text-sm text-gray-700 underline"
                >
                  Clear Filters
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
