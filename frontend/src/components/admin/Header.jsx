import PropTypes from "prop-types";

import { useState } from "react";
import { FaBell, FaSearch, FaUser } from "react-icons/fa";

const Header = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 bg-white shadow-sm px-6 flex items-center justify-between">
      <div className="w-96">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <FaBell className="w-6 h-6 text-gray-500 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
            3
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <FaUser className="w-5 h-5 text-gray-500" />
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default Header;
