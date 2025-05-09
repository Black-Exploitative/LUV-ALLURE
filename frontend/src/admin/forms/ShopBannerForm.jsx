// frontend/src/admin/forms/ShopBannerForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiAlertCircle, FiInfo, FiMonitor, FiSmartphone } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const ShopBannerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: 'Shop Now Banner',
    type: 'shop-banner',
    deviceType: 'desktop', // Default to desktop, can be 'mobile' or 'desktop'
    content: {
      buttonText: 'SHOP NOW',
      buttonLink: '/collections',
      alignment: 'center',
      buttonPosition: 'bottom' // Default position
    },
    media: {
      imageUrl: '',
      altText: 'Fashion Model',
      overlayOpacity: 0.4
    },
    isActive: true
  });
  
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageWarning, setImageWarning] = useState('');

  // Parse device type from query parameters
  useEffect(() => {
    if (!isEditing) {
      // Extract device type from URL query parameters
      const urlParams = new URLSearchParams(location.search);
      const deviceParam = urlParams.get('device');
      
      // If device param exists and is valid, update the form data
      if (deviceParam && (deviceParam === 'mobile' || deviceParam === 'desktop')) {
        setFormData(prev => ({
          ...prev,
          deviceType: deviceParam,
          name: `Shop Now Banner - ${deviceParam === 'mobile' ? 'Mobile' : 'Desktop'}`
        }));
      }
    }
  }, [isEditing, location.search]);
  
  // Image resolution warning thresholds
  const MIN_RECOMMENDED_WIDTH = 1920;
  const MIN_RECOMMENDED_HEIGHT = 1080;
  
  // Button position options - using more explicit labels
  const buttonPositions = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top', label: 'Top Center' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'left', label: 'Middle Left' },
    { value: 'center', label: 'Middle Center' },
    { value: 'right', label: 'Middle Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom', label: 'Bottom Center' },
    { value: 'bottom-right', label: 'Bottom Right' }
  ];
  
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
            
            // Log what we're getting from the server
            console.log("Loaded section data:", section);
            console.log("Button position:", section.content?.buttonPosition);
            console.log("Device type:", section.deviceType || 'desktop');
            
            setFormData({
              ...section,
              type: 'shop-banner', // Ensure correct type
              deviceType: section.deviceType || 'desktop', // Use desktop as fallback
              content: {
                buttonText: section.content?.buttonText || 'SHOP NOW',
                buttonLink: section.content?.buttonLink || '/collections',
                alignment: section.content?.alignment || 'center',
                buttonPosition: section.content?.buttonPosition || 'bottom' 
              },
              media: {
                imageUrl: section.media?.imageUrl || '',
                altText: section.media?.altText || 'Shop Banner',
                overlayOpacity: section.media?.overlayOpacity !== undefined ? section.media.overlayOpacity : 0.4
              }
            });
            
            // Check image resolution if image URL exists
            if (section.media?.imageUrl) {
              checkImageResolution(section.media.imageUrl);
            }
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
          // Sort media by creation date (newest first)
          const sortedMedia = response.data.data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setMediaLibrary(sortedMedia || []);
        }
      } catch (err) {
        console.error('Failed to load media:', err);
      }
    };
    
    loadMedia();
  }, []);
  
  // Check image resolution
  const checkImageResolution = (url) => {
    if (!url) return;
    
    const img = new Image();
    img.onload = () => {
      if (img.width < MIN_RECOMMENDED_WIDTH || img.height < MIN_RECOMMENDED_HEIGHT) {
        setImageWarning(
          `This image is low resolution (${img.width}x${img.height}px). ` +
          `For best quality, use an image at least ${MIN_RECOMMENDED_WIDTH}x${MIN_RECOMMENDED_HEIGHT}px.`
        );
      } else {
        setImageWarning('');
      }
    };
    img.onerror = () => {
      setImageWarning('Could not load image to check resolution.');
    };
    img.src = url;
  };
  
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
          [child]: type === 'checkbox' ? checked : value
        }
      });
      
      // Check image resolution if changing the image URL
      if (name === 'media.imageUrl') {
        checkImageResolution(value);
      }
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
  
  // Switch between device types
  const handleDeviceTypeChange = (deviceType) => {
    // Update URL to reflect device type without reloading page
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('device', deviceType);
    
    // Update the URL with the new search parameters
    window.history.replaceState(
      {},
      '',
      `${location.pathname}?${urlParams.toString()}`
    );
    
    // Update form data with new device type
    setFormData(prev => ({
      ...prev,
      deviceType,
      name: `Shop Now Banner - ${deviceType === 'mobile' ? 'Mobile' : 'Desktop'}`
    }));
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
    
    // Check resolution of selected image
    checkImageResolution(mediaItem.url);
    
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
      setError('Banner image is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Log the data being saved to help debug button position issues
      console.log("Saving shop banner with data:", JSON.stringify(formData, null, 2));
      
      // API endpoint and method based on editing or creating
      const url = isEditing 
        ? `/cms/sections/${id}` 
        : '/cms/sections';
      
      const method = isEditing ? 'put' : 'post';
      
      const response = await api[method](url, formData);
      
      // If creating a new section (not editing), add it to the active homepage layout
      if (!isEditing && response.data && response.data.data && response.data.data._id) {
        try {
          // Get the active layout
          const layoutResponse = await api.get('/cms/homepage');
          const layout = layoutResponse.data.data;
          
          // Check if this section already exists in the layout
          const sectionExists = layout.sections.some(section => 
            section.sectionId && section.sectionId._id === response.data.data._id);
          
          // If it doesn't exist, add it to the layout
          if (!sectionExists && layout._id) {
            const updatedSections = [...layout.sections, {
              sectionId: response.data.data._id,
              order: layout.sections.length,
              column: 0,
              width: 12
            }];
            
            // Update the layout
            await api.put(`/cms/layouts/${layout._id}`, {
              ...layout,
              sections: updatedSections
            });
            
            console.log("Added shop banner to homepage layout");
          }
        } catch (layoutErr) {
          console.error("Failed to update homepage layout:", layoutErr);
          // Still consider the operation successful even if layout update fails
        }
      }
      
      setSuccess(isEditing 
        ? 'Shop banner updated successfully!' 
        : 'Shop banner created successfully!');
      
      // Show toast notification
      toast.success(isEditing ? 'Shop banner updated!' : 'Shop banner created!');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin/shop-banners');
      }, 1500);
      
    } catch (err) {
      setError('Failed to save shop banner section. Please try again.');
      toast.error('Failed to save shop banner');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Media library modal with improved filtering
  const renderMediaLibrary = () => {
    if (!showMediaLibrary) return null;
    
    // Filter to show only images (not videos or other media)
    const imageMedia = mediaLibrary.filter(media => 
      media.type === 'image' || 
      media.url?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
    );
    
    // Sort by creation date (newest first)
    const sortedMedia = [...imageMedia].sort((a, b) => 
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 w-full max-w-5xl max-h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Media Library</h3>
            <button 
              onClick={() => setShowMediaLibrary(false)}
              className="text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 flex items-center">
              <FiInfo className="mr-2" /> 
              {formData.deviceType === 'mobile' 
                ? 'Select a portrait (vertical) image for the best mobile experience'
                : 'Select a landscape (horizontal) image for the best desktop experience'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedMedia.length > 0 ? (
              sortedMedia.map(media => (
                <div 
                  key={media._id} 
                  className="border border-gray-200 p-2 cursor-pointer hover:border-black"
                  onClick={() => handleMediaSelect(media)}
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center mb-2 relative">
                    <img 
                      src={media.url} 
                      alt={media.name}
                      className="max-h-full max-w-full object-contain"
                    />
                    
                    {/* Show dimensions if available */}
                    {media.dimensions && (
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                        {media.dimensions.width}x{media.dimensions.height}
                      </div>
                    )}
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
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/media/new')}
              className="text-black hover:underline text-sm flex items-center"
            >
              <FiPlus className="mr-1" /> Upload new image
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to position button in preview based on selected position
  const getButtonPositionStyle = (position) => {
    // Default to bottom if no position is provided
    const pos = position ? position.trim().toLowerCase() : 'bottom';
    
    // Create position style object
    let positionStyle = {};
    
    // Set vertical position
    if (pos.includes('top')) {
      positionStyle.top = '8%';
    } else if (pos.includes('bottom')) {
      positionStyle.bottom = '8%';
    } else {
      positionStyle.top = '50%';
      positionStyle.transform = 'translateY(-50%)';
    }
    
    // Set horizontal position
    if (pos.includes('left')) {
      positionStyle.left = '8%';
    } else if (pos.includes('right')) {
      positionStyle.right = '8%';
    } else {
      positionStyle.left = '50%';
      
      // Combine transforms if we already have one
      if (positionStyle.transform) {
        positionStyle.transform = 'translate(-50%, -50%)';
      } else {
        positionStyle.transform = 'translateX(-50%)';
      }
    }
    
    return positionStyle;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/shop-banners')}
          className="mr-2 text-gray-500 hover:text-black"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">
          {isEditing ? 'Edit Shop Banner' : 'Create Shop Banner'}
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
        {/* Device type selector tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleDeviceTypeChange('desktop')}
              className={`flex items-center py-2 px-4 ${
                formData.deviceType === 'desktop' 
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <FiMonitor className="mr-2" />
              Desktop Version
            </button>
            <button
              type="button"
              onClick={() => handleDeviceTypeChange('mobile')}
              className={`flex items-center py-2 px-4 ${
                formData.deviceType === 'mobile' 
                  ? 'border-b-2 border-black text-black font-medium'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <FiSmartphone className="mr-2" />
              Mobile Version
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center">
            <FiInfo className="mr-1" />
            {formData.deviceType === 'mobile' 
              ? 'Creating the mobile version of the shop banner. This will be shown on small screens only.'
              : 'Creating the desktop version of the shop banner. This will be shown on tablets and larger screens.'}
          </p>
        </div>
        
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
                Internal name for this section (e.g., "Shop Now Banner - {formData.deviceType === 'mobile' ? 'Mobile' : 'Desktop'}")
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="media.imageUrl"
                  value={formData.media.imageUrl}
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
                {formData.deviceType === 'mobile' 
                  ? 'Use a portrait orientation image for best results on mobile devices'
                  : 'Use a landscape orientation image for best results on desktop devices'
                }
              </p>
              
              {/* Image resolution warning */}
              {imageWarning && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded text-xs flex items-start">
                  <FiAlertCircle className="mr-1 mt-0.5 flex-shrink-0" />
                  <span>{imageWarning}</span>
                </div>
              )}
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
                Text description for screen readers and SEO
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overlay Opacity
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  name="media.overlayOpacity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.media.overlayOpacity}
                  onChange={handleChange}
                  className="w-full mr-3"
                />
                <span>{formData.media.overlayOpacity}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Opacity of the dark overlay on the image (0 = transparent, 1 = opaque)
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                name="content.buttonText"
                value={formData.content.buttonText}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Link
              </label>
              <input
                type="text"
                name="content.buttonLink"
                value={formData.content.buttonLink}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., /collections"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Button Position
              </label>
              <select
                name="content.buttonPosition"
                value={formData.content.buttonPosition}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {buttonPositions.map(position => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Position of the button on the banner
              </p>
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
        {formData.media.imageUrl && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="flex items-center text-md font-medium mb-4">
                {formData.deviceType === 'mobile' ? (
                  <>
                    <FiSmartphone className="mr-2" />
                    Mobile Banner Preview
                  </>
                ) : (
                  <>
                    <FiMonitor className="mr-2" />
                    Desktop Banner Preview
                  </>
                )}
              </h3>
              <div 
                className={`relative overflow-hidden rounded ${
                  formData.deviceType === 'mobile' 
                    ? 'h-96 max-w-xs mx-auto' // Mobile preview size
                    : 'h-96 w-full' // Desktop preview size
                }`}
              >
                <img
                  src={formData.media.imageUrl}
                  alt={formData.media.altText || 'Shop Now Banner'}
                  className="w-full h-full object-cover"
                />
                
                <div 
                  className="absolute inset-0 bg-black" 
                  style={{ opacity: formData.media.overlayOpacity }}
                ></div>
                
                <div 
                  className="absolute z-10"
                  style={getButtonPositionStyle(formData.content.buttonPosition)}
                >
                  <div className="relative inline-block px-8 py-3 border-2 border-white text-white text-lg overflow-hidden cursor-pointer">
                    <span className="relative z-10">
                      {formData.content.buttonText}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Note: This is a preview. The actual banner may appear differently on the website.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate('/admin/shop-banners')}
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
                <span>Save {formData.deviceType === 'mobile' ? 'Mobile' : 'Desktop'} Banner</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
      
      {renderMediaLibrary()}
    </div>
  );
};

export default ShopBannerForm;