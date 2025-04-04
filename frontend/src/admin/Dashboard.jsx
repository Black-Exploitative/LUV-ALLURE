// frontend/src/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiImage, FiGrid, FiLayers, FiLayout, FiSettings, FiLogOut, FiEdit, FiTrash, FiPlus } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('homepage');
  const [layouts, setLayouts] = useState([]);
  const [sections, setSections] = useState([]);
  const [banners, setBanners] = useState([]);
  const [navImages, setNavImages] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    // Load initial data based on active section
    loadData(activeSection);
  }, [activeSection, navigate]);

  // Function to load data based on selected section
  const loadData = async (section) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (section) {
        case 'homepage':
          response = await axios.get('/api/cms/layouts');
          setLayouts(response.data.data);
          break;
        case 'sections':
          response = await axios.get('/api/cms/sections');
          setSections(response.data.data);
          break;
        case 'banners':
          response = await axios.get('/api/cms/banners');
          setBanners(response.data.data);
          break;
        case 'navigation':
          response = await axios.get('/api/cms/nav-images');
          setNavImages(response.data.data);
          break;
        case 'media':
          response = await axios.get('/api/cms/media');
          setMedia(response.data.data);
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete item handler
  const handleDelete = async (section, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      let endpoint;
      switch (section) {
        case 'homepage':
          endpoint = `/api/cms/layouts/${id}`;
          break;
        case 'sections':
          endpoint = `/api/cms/sections/${id}`;
          break;
        case 'banners':
          endpoint = `/api/cms/banners/${id}`;
          break;
        case 'navigation':
          endpoint = `/api/cms/nav-images/${id}`;
          break;
        case 'media':
          endpoint = `/api/cms/media/${id}`;
          break;
        default:
          throw new Error('Invalid section');
      }

      await axios.delete(endpoint);
      loadData(section); // Reload data after deletion
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  // Sidebar navigation items
  const navItems = [
    { id: 'homepage', label: 'Homepage Layouts', icon: FiHome },
    { id: 'sections', label: 'Content Sections', icon: FiGrid },
    { id: 'banners', label: 'Banners', icon: FiLayers },
    { id: 'navigation', label: 'Navigation Images', icon: FiLayout },
    { id: 'media', label: 'Media Library', icon: FiImage },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  // Animation variants
  const sidebarItemVariants = {
    hover: { x: 10, transition: { duration: 0.2 } }
  };

  // Determine content to render based on active section
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => loadData(activeSection)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case 'homepage':
        return renderLayouts();
      case 'sections':
        return renderSections();
      case 'banners':
        return renderBanners();
      case 'navigation':
        return renderNavImages();
      case 'media':
        return renderMedia();
      case 'settings':
        return renderSettings();
      default:
        return <p>Select a section from the sidebar</p>;
    }
  };

  // Render functions for each section
  const renderLayouts = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Homepage Layouts</h2>
        <Link
          to="/admin/layouts/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Layout
        </Link>
      </div>

      {layouts.length === 0 ? (
        <p>No layouts found. Create your first layout.</p>
      ) : (
        <div className="grid gap-4">
          {layouts.map(layout => (
            <div
              key={layout._id}
              className={`border p-4 ${layout.isActive ? 'border-black' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{layout.name}</h3>
                  <p className="text-sm text-gray-600">
                    {layout.isActive ? 'Active' : 'Inactive'} • {layout.sections.length} sections
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(layout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to={`/admin/layouts/edit/${layout._id}`}
                    className="p-2 text-gray-600 hover:text-black"
                  >
                    <FiEdit />
                  </Link>
                  <button 
                    onClick={() => handleDelete('homepage', layout._id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSections = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Content Sections</h2>
        <Link
          to="/admin/sections/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Section
        </Link>
      </div>

      {sections.length === 0 ? (
        <p>No content sections found. Create your first section.</p>
      ) : (
        <div className="grid gap-4">
          {sections.map(section => (
            <div
              key={section._id}
              className="border border-gray-200 p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{section.name}</h3>
                  <p className="text-sm text-gray-600">
                    Type: {section.type} • {section.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to={`/admin/sections/edit/${section._id}`}
                    className="p-2 text-gray-600 hover:text-black"
                  >
                    <FiEdit />
                  </Link>
                  <button 
                    onClick={() => handleDelete('sections', section._id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBanners = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Banners</h2>
        <Link
          to="/admin/banners/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <p>No banners found. Create your first banner.</p>
      ) : (
        <div className="grid gap-4">
          {banners.map(banner => (
            <div
              key={banner._id}
              className="border border-gray-200 p-4"
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{banner.name}</h3>
                  <p className="text-sm text-gray-600">
                    Page: {banner.page} • {banner.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="w-24 h-24 bg-gray-100">
                  {banner.imageUrl && (
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.altText || banner.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <Link 
                  to={`/admin/banners/edit/${banner._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('banners', banner._id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNavImages = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Navigation Images</h2>
        <Link
          to="/admin/nav-images/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Add New Image
        </Link>
      </div>

      {navImages.length === 0 ? (
        <p>No navigation images found. Add your first image.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navImages.map(image => (
            <div
              key={image._id}
              className="border border-gray-200 p-4"
            >
              <div>
                <div className="w-full h-40 bg-gray-100 mb-2">
                  {image.imageUrl && (
                    <img 
                      src={image.imageUrl} 
                      alt={image.altText || image.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="font-medium">{image.name}</h3>
                <p className="text-sm text-gray-600">
                  Category: {image.category}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {image.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <Link 
                  to={`/admin/nav-images/edit/${image._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('navigation', image._id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMedia = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Media Library</h2>
        <Link
          to="/admin/media/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Upload Media
        </Link>
      </div>

      {media.length === 0 ? (
        <p>No media found. Upload your first file.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div
              key={item._id}
              className="border border-gray-200"
            >
              <div className="w-full h-40 bg-gray-100">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.altText || item.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl">📹</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <p className="text-xs text-gray-500">
                  {item.type} • {(item.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className="flex justify-end space-x-2 p-2 border-t">
                <Link 
                  to={`/admin/media/edit/${item._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('media', item._id)}
                  className="p-2 text-gray-600 hover:text-red-600"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div>
      <h2 className="text-xl font-medium mb-6">Settings</h2>
      <div className="border border-gray-200 p-6">
        <h3 className="font-medium mb-4">Admin Account</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300"
              placeholder="admin@example.com"
              disabled
            />
          </div>
          
          <div>
            <Link
              to="/admin/change-password"
              className="px-4 py-2 bg-black text-white hover:bg-gray-800 inline-block"
            >
              Change Password
            </Link>
          </div>
        </div>
        
        <hr className="my-6" />
        
        <h3 className="font-medium mb-4">Site Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300"
              defaultValue="Luv's Allure"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300"
              defaultValue="contact@luvsallure.com"
            />
          </div>
          
          <div className="pt-4">
            <button
              className="px-4 py-2 bg-black text-white hover:bg-gray-800"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="bg-white w-64 border-r border-gray-200">
        <div className="p-6 flex items-center space-x-4 border-b">
          <img src="/images/logo-black.svg" alt="Luv's Allure" className="h-8" />
          <div>
            <h1 className="font-medium text-sm">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Content Management</p>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.id}>
                <motion.button
                  variants={sidebarItemVariants}
                  whileHover="hover"
                  className={`flex items-center w-full p-3 rounded-md ${
                    activeSection === item.id
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-600 hover:text-black'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="mr-3" />
                  <span>{item.label}</span>
                </motion.button>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-gray-200 mt-6 pt-6">
            <motion.button
              variants={sidebarItemVariants}
              whileHover="hover"
              className="flex items-center w-full p-3 rounded-md text-gray-600 hover:text-black"
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/signin');
              }}
            >
              <FiLogOut className="mr-3" />
              <span>Logout</span>
            </motion.button>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;