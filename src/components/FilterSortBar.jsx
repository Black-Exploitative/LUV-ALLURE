import PropTypes from "prop-types";
import { useState } from "react";
import { FaThLarge, FaTh } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

const FilterSortBar = ({ onGridChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [gridType, setGridType] = useState(4); // Default grid

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleGridChange = (type) => {
    setGridType(type); 
    onGridChange(type); 
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300">
      <div className="flex items-center">
        <span className="text-gray-700 font-semibold mr-2">+</span>
        <span className="text-gray-700 font-semibold cursor-pointer">Filter</span>
      </div>

      <div className="flex items-center space-x-4">
        <FaThLarge
          className={`cursor-pointer ${gridType === 2 ? "text-gray-900" : "text-gray-400"}`}
          onClick={() => handleGridChange(2)}
        />
        <FaTh
          className={`cursor-pointer ${gridType === 4 ? "text-gray-900" : "text-gray-400"}`}
          onClick={() => handleGridChange(4)}
        />
        <span className="text-gray-400">|</span>
        <div className="relative">
          <button className="flex items-center text-gray-700 font-semibold" onClick={toggleDropdown}>
            Sort <IoMdArrowDropdown className="ml-1" />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 bg-white shadow-lg border mt-1 w-40">
              <ul className="text-gray-700">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Most Popular</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Price: Low to High</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Price: High to Low</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FilterSortBar.propTypes = {
    onGridChange: PropTypes.func.isRequired,
};

export default FilterSortBar;
