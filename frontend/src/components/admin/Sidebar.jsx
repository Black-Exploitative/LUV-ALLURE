import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Users, BarChart3, Settings, Package, CreditCard, Tag, Grid, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: <Grid className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Products', path: '/admin/products' },
    { icon: <Tag className="w-5 h-5" />, label: 'Categories', path: '/admin/categories' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users className="w-5 h-5" />, label: 'Customers', path: '/admin/customers' },
    { icon: <Package className="w-5 h-5" />, label: 'Inventory', path: '/admin/inventory' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
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
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;