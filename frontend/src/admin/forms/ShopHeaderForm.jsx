// frontend/src/admin/forms/ShopHeaderForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const ShopHeaderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: 'Shop Header',
    type: 'shop-header',
    content: {
      title: 'Shop the Latest Trends',
      description: 'Find your perfect style today.',
      alignment: 'center'
    },
    media: {
      imageUrl: '/images/banner.webp',
      altText: 'Shop Header',
      overlayOpacity: 0.5
    },
    isActive: true,
    order: 0
  });
  
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load section data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await api.get(`/cms/sections/${id}`);
          
          if (response.data.success) {
            // Initialize form fields that might be missing
            const section = response.data.data;
            setFormData({
              ...section,
              type: 'shop-header', // Ensure correct type
              content: {
                title: section.content?.title || 'Shop the Latest Trends',
                description: section.content?.description || 'Find your perfect style today.',
                alignment: section.content?.alignment || 'center'
              },
              media: {
                imageUrl: section.media?.imageUrl || '/images/banner.webp',
                altText: section.media?.altText || 'Shop Header',
                overlayOpacity: section.media?.overlayOpacity !== undefined ? section.media.overlayOpacity : 0.5
              }
            });
          } else {
            setError('Failed to load section data');
          }
        } catch (err) {
          console.error('Error loading section:', err);
          setError('Failed to load section data');
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
        const response = await api.get('/cms/media');
        if (response.data.success) {
          setMediaLibrary(response.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load media:', err);
      }
    };
    
    loadMedia();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (e.g., content.title)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : 
                  (child === 'overlayOpacity' ? parseFloat(value) : value)
        }
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear any previous error/success messages
    setError('');
    setSuccess('');
  };
  
  // Handle media selection
  const handleMediaSelect = (mediaItem) => {
    setFormData({
      ...formData,
      media: {
        ...formData.media,
        imageUrl: mediaItem.url,
        altText: formData.media.altText || mediaItem.altText || mediaItem.name
      }
    });
    
    setShowMediaLibrary(false);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Section name is required');
      return;
    }
    
    if (!formData.media.imageUrl) {
      setError('Image is required for the shop header');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Make sure the type is explicitly set to 'shop-header'
      const dataToSubmit = {
        ...formData,
        type: 'shop-header' // Ensure the type is correct
      };
      
      // API endpoint and method based on editing or creating
      const url = isEditing 
        ? `/cms/sections/${id}` 
        : '/cms/sections';
      
      const method = isEditing ? 'put' : 'post';
      
      console.log('Submitting data:', JSON.stringify(dataToSubmit, null, 2));
      
      const response = await api[method](url, dataToSubmit);
      
      if (response.data.success) {
        setSuccess(isEditing 
          ? 'Shop Header updated successfully!' 
          : 'Shop Header created successfully!');
        
        toast.success(isEditing ? 'Shop Header updated!' : 'Shop Header created!');
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (err) {
      console.error('Error saving section:', err);
      setError('Failed to save. Please try again. ' + (err.response?.data?.message || ''));
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
              mediaLibrary
                .filter(media => media.type === 'image')
                .map(media => (
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
          {isEditing ? 'Edit Shop Header' : 'Create Shop Header'}
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
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Name
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
                Internal name for this section (not displayed on the website)
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Title
              </label>
              <input
                type="text"
                name="content.title"
                value={formData.content.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                Main heading for the shop header
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="content.description"
                value={formData.content.description}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Short descriptive text that appears below the title
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Image
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="media.imageUrl"
                  value={formData.media.imageUrl}
                  onChange={handleChange}
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
                name="media.altText"
                value={formData.media.altText}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Descriptive text for the image"
              />
              <p className="mt-1 text-xs text-gray-500">
                For accessibility and SEO
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overlay Opacity: {formData.media.overlayOpacity}
              </label>
              <input
                type="range"
                name="media.overlayOpacity"
                min="0"
                max="1"
                step="0.1"
                value={formData.media.overlayOpacity}
                onChange={handleChange}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Controls the darkness of the overlay on the background image
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Text Alignment
                </label>
                <select
                  name="content.alignment"
                  value={formData.content.alignment}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Display order if multiple shop headers exist
                </p>
              </div>
            </div>
            
            <div className="flex items-center mb-1">
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
        {formData.media.imageUrl && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-md font-medium mb-4">Preview</h3>
              <div className="relative w-full h-60 overflow-hidden rounded-md">
                <img
                  src={formData.media.imageUrl}
                  alt={formData.media.altText}
                  className="w-full h-full object-cover"
                />
                
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: formData.media.overlayOpacity }}
                ></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {formData.content.title && (
                    <h2 className="text-white text-2xl font-bold mb-2">{formData.content.title}</h2>
                  )}
                  {formData.content.description && (
                    <p className="text-white text-lg">{formData.content.description}</p>
                  )}
                </div>
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
                <span>Save</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
      
      {renderMediaLibrary()}
    </div>
  );
};

export default ShopHeaderForm;