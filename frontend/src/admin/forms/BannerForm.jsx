// frontend/src/admin/forms/BannerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const BannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    page: 'home',
    title: '',
    description: '',
    imageUrl: '',
    altText: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    startDate: '',
    endDate: ''
  });
  
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Available pages for banners
  const availablePages = [
    { value: 'home', label: 'Home Page' },
    { value: 'shop', label: 'Shop Page' },
    { value: 'product', label: 'Product Details' },
    { value: 'checkout', label: 'Checkout Page' },
    { value: 'contact', label: 'Contact Page' }
  ];
  
  // Load banner data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/cms/banners/${id}`);
          
          // Format dates for input fields if they exist
          const banner = response.data.data;
          if (banner.startDate) {
            banner.startDate = new Date(banner.startDate).toISOString().split('T')[0];
          }
          if (banner.endDate) {
            banner.endDate = new Date(banner.endDate).toISOString().split('T')[0];
          }
          
          setFormData(banner);
        } catch (err) {
          setError('Failed to load banner data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id, isEditing]);
  
  // Load media library
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const response = await axios.get('/api/cms/media?type=image');
        setMediaLibrary(response.data.data || []);
      } catch (err) {
        console.error('Failed to load media:', err);
      }
    };
    
    loadMedia();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear any previous error/success messages
    setError('');
    setSuccess('');
  };
  
  // Handle media selection
  const handleMediaSelect = (mediaItem) => {
    setFormData({
      ...formData,
      imageUrl: mediaItem.url,
      altText: formData.altText || mediaItem.altText || mediaItem.name
    });
    setShowMediaLibrary(false);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Banner name is required');
      return;
    }
    
    if (!formData.imageUrl.trim()) {
      setError('Banner image is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // API endpoint and method based on editing or creating
      const url = isEditing 
        ? `/api/cms/banners/${id}` 
        : '/api/cms/banners';
      
      const method = isEditing ? 'put' : 'post';
      
      await axios[method](url, formData);
      
      setSuccess(isEditing 
        ? 'Banner updated successfully!' 
        : 'Banner created successfully!');
      
      // Show toast notification
      toast.success(isEditing ? 'Banner updated!' : 'Banner created!');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
      
    } catch (err) {
      setError('Failed to save banner. Please try again.');
      toast.error('Failed to save banner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Media library modal
  const renderMediaLibrary = () => {
    if (!showMediaLibrary) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Media Library</h3>
            <button 
              onClick={() => setShowMediaLibrary(false)}
              className="text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {mediaLibrary.length > 0 ? (
              mediaLibrary.map(media => (
                <div 
                  key={media._id} 
                  className="border border-gray-200 p-2 cursor-pointer hover:border-black"
                  onClick={() => handleMediaSelect(media)}
                >
                  <div className="h-24 bg-gray-100 flex items-center justify-center mb-2">
                    <img 
                      src={media.url} 
                      alt={media.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-xs truncate">{media.name}</p>
                </div>
              ))
            ) : (
              <p className="col-span-4 text-center text-gray-500 py-8">
                No media found. Please upload some images first.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="mr-2 text-gray-500 hover:text-black"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">
          {isEditing ? 'Edit Banner' : 'Create New Banner'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Internal name for this banner
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page
                </label>
                <select
                  name="page"
                  value={formData.page}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {availablePages.map(page => (
                    <option key={page.value} value={page.value}>
                      {page.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Where this banner will be displayed
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-l-md"
                  placeholder="Image URL"
                />
                <button
                  type="button"
                  onClick={() => setShowMediaLibrary(true)}
                  className="bg-gray-200 px-4 flex items-center rounded-r-md"
                >
                  <FiImage />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Select an image from the media library or enter a URL
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alt Text
              </label>
              <input
                type="text"
                name="altText"
                value={formData.altText}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Descriptive text for the image"
              />
              <p className="mt-1 text-xs text-gray-500">
                Text description for screen readers and SEO
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional. Leave empty if no button is needed.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., /shop/dresses"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional. When this banner should start displaying.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional. When this banner should stop displaying.
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Preview */}
        {formData.imageUrl && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-md font-medium mb-4">Banner Preview</h3>
              <div className="relative overflow-hidden">
                <img
                  src={formData.imageUrl}
                  alt={formData.altText || formData.name}
                  className="w-full h-56 object-cover"
                />
                
                {(formData.title || formData.description || formData.buttonText) && (
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center p-4">
                    {formData.title && (
                      <h2 className="text-white text-xl font-bold mb-2">{formData.title}</h2>
                    )}
                    {formData.description && (
                      <p className="text-white text-sm mb-4">{formData.description}</p>
                    )}
                    {formData.buttonText && (
                      <button className="px-4 py-2 bg-white text-black text-sm">
                        {formData.buttonText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center space-x-2 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                <span>Save Banner</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
      
      {renderMediaLibrary()}
    </div>
  );
};

export default BannerForm;