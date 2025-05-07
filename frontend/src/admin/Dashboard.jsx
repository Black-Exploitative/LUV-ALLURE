/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, FiImage, FiGrid, FiLayers, FiLayout, 
  FiSettings, FiLogOut, FiEdit, FiTrash, FiPlus,
  FiLink, FiShoppingBag, FiEye, FiStar, FiAward,
  FiBookOpen, FiDatabase, FiTarget, FiFolder
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('homepage');
  const [layouts, setLayouts] = useState([]);
  const [sections, setSections] = useState([]);
  const [banners, setBanners] = useState([]);
  const [navImages, setNavImages] = useState([]);
  const [media, setMedia] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [collectionHeroes, setCollectionHeroes] = useState([]);
  const [promoSections, setPromoSections] = useState([]);
  const [shopHeaders, setShopHeaders] = useState([]);
  const [featuredSections, setFeaturedSections] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relationshipType, setRelationshipType] = useState('style-with');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial data based on active section
    loadData(activeSection);
  }, [activeSection]);

  // Function to load data based on selected section
  const loadData = async (section) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      switch (section) {
        case 'homepage':
          response = await api.get('/cms/layouts');
          setLayouts(response.data.data || []);
          break;
        case 'sections':
          response = await api.get('/cms/sections');
          setSections(response.data.data || []);
          break;
        case 'banners':
          response = await api.get('/cms/banners');
          setBanners(response.data.data || []);
          break;
        case 'navigation':
          response = await api.get('/cms/nav-images');
          setNavImages(response.data.data || []);
          break;
        case 'media':
          response = await api.get('/cms/media');
          setMedia(response.data.data || []);
          break;
        case 'relationships':
          response = await api.get(`/cms/product-relationships?relationType=${relationshipType}`);
          setRelationships(response.data.data || []);
          break;
        case 'collection-hero':
          response = await api.get('/cms/sections?type=collection-hero');
          setCollectionHeroes(response.data.data || []);
          break;
        case 'promo-section':
          response = await api.get('/cms/sections?type=promo-section');
          setPromoSections(response.data.data || []);
          break;
        case 'shop-header':
          response = await api.get('/cms/sections?type=shop-header');
          setShopHeaders(response.data.data || []);
          break;
        case 'featured-products':
          response = await api.get('/cms/featured-products/sections');
          setFeaturedSections(response.data.sections || []);
          break;
        case 'collections': // New case for collections
          response = await api.get('/collections');
          setCollections(response.data.data || []);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
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
          endpoint = `/cms/layouts/${id}`;
          break;
        case 'sections':
          endpoint = `/cms/sections/${id}`;
          break;
        case 'banners':
          endpoint = `/cms/banners/${id}`;
          break;
        case 'navigation':
          endpoint = `/cms/nav-images/${id}`;
          break;
        case 'media':
          endpoint = `/cms/media/${id}`;
          break;
        case 'relationships':
          endpoint = `/cms/product-relationships/${id}`;
          break;
        case 'collection-hero':
        case 'promo-section':
        case 'shop-header':
          endpoint = `/cms/sections/${id}`;
          break;
        case 'featured-products':
          endpoint = `/cms/featured-products/${id}`;
          break;
        case 'collections': // New case for collections
          endpoint = `/collections/${id}`;
          break;
        default:
          throw new Error('Invalid section');
      }

      await api.delete(endpoint);
      toast.success('Item deleted successfully');
      loadData(section); // Reload data after deletion
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Failed to delete item. Please try again.');
    }
  };

  // Toggle active state for an item
  const toggleActive = async (section, id, currentState) => {
    try {
      let endpoint;
      let data = { isActive: !currentState };
      
      switch (section) {
        case 'banners':
          endpoint = `/cms/banners/${id}`;
          break;
        case 'sections':
        case 'collection-hero':
        case 'promo-section':
        case 'shop-header':
          endpoint = `/cms/sections/${id}`;
          break;
        case 'navigation':
          endpoint = `/cms/nav-images/${id}`;
          break;
        case 'relationships':
          endpoint = `/cms/product-relationships/${id}`;
          break;
        case 'featured-products':
          endpoint = `/cms/featured-products/${id}`;
          break;
        case 'collections': // New case for collections
          endpoint = `/collections/${id}`;
          break;
        default:
          throw new Error('Invalid section');
      }

      await api.put(endpoint, data);
      toast.success(`Item ${!currentState ? 'activated' : 'deactivated'} successfully`);
      loadData(section); // Reload data
    } catch (err) {
      console.error('Error updating item:', err);
      toast.error('Failed to update item. Please try again.');
    }
  };

  // Set a layout as active
  const setLayoutActive = async (id) => {
    try {
      await api.put(`/cms/layouts/${id}`, { isActive: true });
      toast.success('Layout set as active');
      loadData('homepage'); // Reload data
    } catch (err) {
      console.error('Error updating layout:', err);
      toast.error('Failed to update layout. Please try again.');
    }
  };

  // Handle relationship type change
  const handleRelationshipTypeChange = (type) => {
    setRelationshipType(type);
    loadData('relationships');
  };

  // Sidebar navigation items
  const navItems = [
    { id: 'homepage', label: 'Homepage Layouts', icon: FiHome },
    { id: 'sections', label: 'Content Sections', icon: FiGrid },
    { id: 'collections', label: 'Collections', icon: FiFolder }, // New Collections item
    { id: 'featured-products', label: 'Featured Products', icon: FiStar },
    { id: 'collection-hero', label: 'Collection Hero', icon: FiTarget },
    { id: 'promo-section', label: 'Promo Section', icon: FiBookOpen },
    { id: 'shop-header', label: 'Shop Header', icon: FiLayers },
    { id: 'banners', label: 'Banners', icon: FiAward },
    { id: 'navigation', label: 'Navigation Images', icon: FiLayout },
    { id: 'relationships', label: 'Product Relationships', icon: FiLink },
    { id: 'media', label: 'Media Library', icon: FiImage },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];
  
  // Animation variants for sidebar
  const sidebarItemVariants = {
    hover: { x: 10, transition: { duration: 0.2 } }
  };

  // Relationship types for filtering
  const relationshipTypes = [
    { value: 'style-with', label: 'Style It With', icon: FiStar },
    { value: 'also-purchased', label: 'Also Purchased', icon: FiShoppingBag },
    { value: 'also-viewed', label: 'Also Viewed', icon: FiEye },
    { value: 'recommended', label: 'Recommended', icon: FiStar }
  ];

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
      case 'relationships':
        return renderRelationships();
      case 'collection-hero':
        return renderCollectionHeroes();
      case 'promo-section':
        return renderPromoSections();
      case 'shop-header':
        return renderShopHeaders();
      case 'featured-products':
        return renderFeaturedProducts();
      case 'collections': // Add new collections case
        return renderCollections();
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
  
      {!layouts || layouts.length === 0 ? (
        <p>No layouts found. Create your first layout.</p>
      ) : (
        <div className="grid gap-4">
          {layouts.map((layout, index) => (
            <div
              key={layout._id || index}
              className={`border p-4 ${layout.isActive ? 'border-black' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{layout.name}</h3>
                  <p className="text-sm text-gray-600">
                    {layout.isActive ? 'Active' : 'Inactive'} • {layout.sections?.length || 0} sections
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created: {new Date(layout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {!layout.isActive && (
                    <button
                      onClick={() => setLayoutActive(layout._id)}
                      className="px-3 py-1 text-xs bg-black text-white hover:bg-gray-800"
                    >
                      Set Active
                    </button>
                  )}
                  <Link 
                    to={`/admin/layouts/edit/${layout._id}`}
                    className="p-2 text-gray-600 hover:text-black"
                  >
                    <FiEdit />
                  </Link>
                  <button 
                    onClick={() => handleDelete('homepage', layout._id)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    disabled={layout.isActive}
                  >
                    <FiTrash className={layout.isActive ? 'opacity-50 cursor-not-allowed' : ''} />
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

      {!sections || sections.length === 0 ? (
        <p>No content sections found. Create your first section.</p>
      ) : (
        <div className="grid gap-4">
          {sections.map(section => (
            <div
              key={section._id}
              className={`border ${section.isActive ? 'border-black' : 'border-gray-200'} p-4`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{section.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${section.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                    <p className="text-sm text-gray-600">
                      Type: {section.type} • {section.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <button
                    onClick={() => toggleActive('sections', section._id, section.isActive)}
                    className={`px-3 py-1 text-xs rounded-md ${
                      section.isActive 
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {section.isActive ? 'Deactivate' : 'Activate'}
                  </button>
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
              
              {/* Preview of section content */}
              <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                {section.content?.title && (
                  <p className="truncate">Title: {section.content.title}</p>
                )}
                {section.media?.imageUrl && (
                  <p className="truncate">Image: {section.media.imageUrl}</p>
                )}
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

      {!banners || banners.length === 0 ? (
        <p>No banners found. Create your first banner.</p>
      ) : (
        <div className="grid gap-4">
          {banners.map(banner => (
            <div
              key={banner._id}
              className={`border ${banner.isActive ? 'border-black' : 'border-gray-200'} p-4`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{banner.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                    <p className="text-sm text-gray-600">
                      Page: {banner.page} • {banner.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  
                  {/* Date info if present */}
                  {(banner.startDate || banner.endDate) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {banner.startDate && `From: ${new Date(banner.startDate).toLocaleDateString()}`}
                      {banner.startDate && banner.endDate && ' • '}
                      {banner.endDate && `To: ${new Date(banner.endDate).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
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
                <button
                  onClick={() => toggleActive('banners', banner._id, banner.isActive)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    banner.isActive 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {banner.isActive ? 'Deactivate' : 'Activate'}
                </button>
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

  const renderFeaturedProducts = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Featured Products Sections</h2>
        <Link
          to="/admin/featured-products/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Section
        </Link>
      </div>

      {!featuredSections || featuredSections.length === 0 ? (
        <p>No featured product sections found. Create your first section.</p>
      ) : (
        <div className="grid gap-4">
          {featuredSections.map(section => (
            <div
              key={section.sectionId || section._id}
              className={`border ${section.isActive ? 'border-black' : 'border-gray-200'} p-4`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{section.title || 'Unnamed Section'}</h3>
                  <p className="text-sm text-gray-600">
                    Section ID: {section.sectionId} • {section.productIds?.length || 0} products
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link 
                    to={`/admin/featured-products/edit/${section.sectionId}`}
                    className="px-3 py-1 text-xs bg-black text-white hover:bg-gray-800"
                  >
                    Edit Products
                  </Link>
                  <button 
                    onClick={() => handleDelete('featured-products', section.sectionId)}
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

  const renderCollectionHeroes = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Collection Hero</h2>
        <Link
          to="/admin/collection-hero/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Collection Hero
        </Link>
      </div>

      {!collectionHeroes || collectionHeroes.length === 0 ? (
        <p>No collection heroes found. Create your first one.</p>
      ) : (
        <div className="grid gap-4">
          {collectionHeroes.map(hero => (
            <div
              key={hero._id}
              className={`border ${hero.isActive ? 'border-black' : 'border-gray-200'} p-4`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{hero.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${hero.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                    <p className="text-sm text-gray-600">
                      {hero.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                  {hero.media?.imageUrl && (
                    <img 
                      src={hero.media.imageUrl} 
                      alt={hero.media.altText || hero.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => toggleActive('collection-hero', hero._id, hero.isActive)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    hero.isActive 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {hero.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link 
                  to={`/admin/collection-hero/edit/${hero._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('collection-hero', hero._id)}
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

  const renderPromoSections = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Promo Sections</h2>
        <Link
          to="/admin/promo-section/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Promo Section
        </Link>
      </div>

      {!promoSections || promoSections.length === 0 ? (
        <p>No promo sections found. Create your first one.</p>
      ) : (
        <div className="grid gap-4">
          {promoSections.map(promo => (
            <div
              key={promo._id}
              className={`border ${promo.isActive ? 'border-black' : 'border-gray-200'} p-4`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{promo.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${promo.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                    <p className="text-sm text-gray-600">
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  {promo.content?.title && (
                    <p className="text-xs text-gray-500 mt-1">
                      Title: {promo.content.title}
                    </p>
                  )}
                </div>
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                  {promo.media?.imageUrl && (
                    <img 
                      src={promo.media.imageUrl} 
                      alt={promo.media.altText || promo.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => toggleActive('promo-section', promo._id, promo.isActive)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    promo.isActive 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {promo.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link 
                  to={`/admin/promo-section/edit/${promo._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('promo-section', promo._id)}
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

  const renderShopHeaders = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Shop Headers</h2>
        <Link
          to="/admin/shop-header/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Shop Header
        </Link>
      </div>

      {!shopHeaders || shopHeaders.length === 0 ? (
        <p>No shop headers found. Create your first one.</p>
      ) : (
        <div className="grid gap-4">
          {shopHeaders.map(header => (
            <div
              key={header._id}
              className={`border ${header.isActive ? 'border-black' : 'border-gray-200'} p-4`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{header.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${header.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                    <p className="text-sm text-gray-600">
                      {header.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  {header.content?.title && (
                    <p className="text-xs text-gray-500 mt-1">
                      Title: {header.content.title}
                    </p>
                  )}
                </div>
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                  {header.media?.imageUrl && (
                    <img 
                      src={header.media.imageUrl} 
                      alt={header.media.altText || header.name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => toggleActive('shop-header', header._id, header.isActive)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    header.isActive 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {header.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link 
                  to={`/admin/shop-header/edit/${header._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('shop-header', header._id)}
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

      {/* Category filter for navigation images */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category:</label>
        <select 
          className="w-full md:w-64 p-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            // You can add filtering logic here
            console.log('Filter by category:', e.target.value);
          }}
        >
          <option value="">All Categories</option>
          {['shop', 'dresses', 'collections', 'newin', 'mobile'].map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {!navImages || navImages.length === 0 ? (
        <p>No navigation images found. Add your first image.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navImages.map(image => (
            <div
              key={image._id}
              className={`border ${image.isActive ? 'border-black' : 'border-gray-200'} p-4`}
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
                <div className="flex items-center mt-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${image.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                  <p className="text-sm text-gray-600">
                    Category: {image.category}
                  </p>
                </div>
                {image.link && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Link: {image.link}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => toggleActive('navigation', image._id, image.isActive)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    image.isActive 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {image.isActive ? 'Deactivate' : 'Activate'}
                </button>
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

      {/* Search and filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search media..."
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => {
              // Add search functionality
              console.log('Search media:', e.target.value);
            }}
          />
        </div>
        <div className="flex space-x-2">
          <select 
            className="p-2 border border-gray-300 rounded-md"
            onChange={(e) => {
              // Add type filter
              console.log('Filter by type:', e.target.value);
            }}
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
          <select 
            className="p-2 border border-gray-300 rounded-md"
            onChange={(e) => {
              // Add sorting
              console.log('Sort by:', e.target.value);
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {!media || media.length === 0 ? (
        <p>No media found. Upload your first file.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div
              key={item._id}
              className="border border-gray-200 hover:border-black transition-colors"
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
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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

      {/* Pagination */}
      {media && media.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-black text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );

  const renderRelationships = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Product Relationships</h2>
        <Link
          to="/admin/product-relationships/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Relationship
        </Link>
      </div>

      {/* Relationship type filter tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <div className="flex -mb-px">
            {relationshipTypes.map(type => (
              <button
                key={type.value}
                className={`mr-1 py-2 px-4 text-sm font-medium flex items-center ${
                  relationshipType === type.value
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleRelationshipTypeChange(type.value)}
              >
                <type.icon className="mr-2" />
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!relationships || relationships.length === 0 ? (
        <div className="text-center py-8 border border-gray-200 rounded">
          <p className="text-gray-500 mb-4">No {relationshipType.replace('-', ' ')} relationships found.</p>
          <Link
            to="/admin/product-relationships/new"
            className="inline-flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
          >
            <FiPlus className="mr-2" /> Create Relationship
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {relationships.map(relationship => (
            <div
              key={relationship._id}
              className={`border ${relationship.isActive ? 'border-black' : 'border-gray-200'} p-4 rounded-md`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Source Product */}
                <div className="md:col-span-5 flex flex-col">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Source Product</h4>
                  <div className="border border-gray-100 p-2 flex items-center flex-1">
                    <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                      {/* Placeholder for product image */}
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiShoppingBag />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{relationship.sourceProductId}</p>
                      <p className="text-xs text-gray-500">ID: {relationship.sourceProductId}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="md:col-span-2 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="text-xs text-gray-500 mt-1">{relationship.relationType.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Related Product */}
                <div className="md:col-span-5 flex flex-col">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Related Product</h4>
                  <div className="border border-gray-100 p-2 flex items-center flex-1">
                    <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                      {/* Placeholder for product image */}
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiShoppingBag />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{relationship.relatedProductId}</p>
                      <p className="text-xs text-gray-500">ID: {relationship.relatedProductId}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                <div className="mr-auto flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${relationship.isActive ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                  <span className="text-sm text-gray-500">
                    {relationship.isActive ? 'Active' : 'Inactive'} • Order: {relationship.order}
                  </span>
                </div>
                <button
                  onClick={() => toggleActive('relationships', relationship._id, relationship.isActive)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    relationship.isActive 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {relationship.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link 
                  to={`/admin/product-relationships/edit/${relationship._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('relationships', relationship._id)}
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

  const renderCollections = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Collections</h2>
        <Link
          to="/admin/collections/new"
          className="flex items-center px-4 py-2 bg-black text-white hover:bg-gray-800"
        >
          <FiPlus className="mr-2" /> Create New Collection
        </Link>
      </div>

      {!collections || collections.length === 0 ? (
        <p>No collections found. Create your first collection.</p>
      ) : (
        <div className="grid gap-4">
          {collections.map(collection => (
            <div
              key={collection._id}
              className={`border ${collection.isActive ? 'border-black' : 'border-gray-200'} p-4`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{collection.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Handle: {collection.handle} • 
                    Products: {collection.productIds?.length || 0} • 
                    Tags: {collection.filters?.tags?.length || 0}
                  </p>
                  {collection.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
                {collection.headerImage && (
                  <div className="w-24 h-24 bg-gray-100 flex-shrink-0 ml-4">
                    <img 
                      src={collection.headerImage} 
                      alt={collection.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <a
                  href={`/collections/${collection.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <FiEye className="inline mr-1" /> View
                </a>
                <button
                  onClick={() => toggleActive('collections', collection._id, collection.isActive)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    collection.isActive 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {collection.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link 
                  to={`/admin/collections/edit/${collection._id}`}
                  className="p-2 text-gray-600 hover:text-black"
                >
                  <FiEdit />
                </Link>
                <button 
                  onClick={() => handleDelete('collections', collection._id)}
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