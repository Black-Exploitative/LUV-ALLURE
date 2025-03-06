import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingBag, FaUsers, FaChartBar, FaCog, FaBox, FaCreditCard, FaTag, FaThLarge, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <FaThLarge className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <FaShoppingBag className="w-5 h-5" />, label: 'Products', path: '/admin/products' },
    { icon: <FaTag className="w-5 h-5" />, label: 'Categories', path: '/admin/categories' },
    { icon: <FaCreditCard className="w-5 h-5" />, label: 'Orders', path: '/admin/orders' },
    { icon: <FaUsers className="w-5 h-5" />, label: 'Customers', path: '/admin/customers' },
    { icon: <FaBox className="w-5 h-5" />, label: 'Inventory', path: '/admin/inventory' },
    { icon: <FaChartBar className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <FaCog className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-black text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold">LUXURY ADMIN</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-4 hover:bg-gray-900 transition-colors ${
                  location.pathname === item.path ? 'bg-gray-900 border-l-4 border-white' : ''
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full p-6">
        <button className="flex items-center text-gray-400 hover:text-white transition-colors">
          <FaSignOutAlt className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;