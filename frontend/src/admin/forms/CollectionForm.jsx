// frontend/src/admin/forms/CollectionForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiImage, FiPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const CollectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headerImage: '',
    headerTitle: '',
    headerDescription: '',
    headerOverlayOpacity: 0.5,
    filters: {
      tags: [],
      categories: [],
      customFilters: []
    },
    productIds: [],
    isActive: true,
    order: 0
  });
  
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  
  // Load collection data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await api.get(`/collections/${id}`);
          if (response.data.success) {
            setFormData(response.data.data);
          }
        } catch (err) {
          setError('Failed to load collection data');
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
      // Handle nested fields
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Handle media selection
  const handleMediaSelect = (mediaItem) => {
    setFormData({
      ...formData,
      headerImage: mediaItem.url
    });
    setShowMediaLibrary(false);
  };
  
  // Add tag
  const addTag = () => {
    if (tagInput && !formData.filters.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        filters: {
          ...formData.filters,
          tags: [...formData.filters.tags, tagInput]
        }
      });
      setTagInput('');
    }
  };
  
  // Remove tag
  const removeTag = (tag) => {
    setFormData({
      ...formData,
      filters: {
        ...formData.filters,
        tags: formData.filters.tags.filter(t => t !== tag)
      }
    });
  };
  
  // Add category
  const addCategory = () => {
    if (categoryInput && !formData.filters.categories.includes(categoryInput)) {
      setFormData({
        ...formData,
        filters: {
          ...formData.filters,
          categories: [...formData.filters.categories, categoryInput]
        }
      });
      setCategoryInput('');
    }
  };
  
  // Remove category
  const removeCategory = (category) => {
    setFormData({
      ...formData,
      filters: {
        ...formData.filters,
        categories: formData.filters.categories.filter(c => c !== category)
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Collection name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const url = isEditing ? `/collections/${id}` : '/collections';
      const method = isEditing ? 'put' : 'post';
      
      const response = await api[method](url, formData);
      
      if (response.data.success) {
        toast.success(isEditing ? 'Collection updated!' : 'Collection created!');
        setTimeout(() => navigate('/admin'), 1500);
      }
    } catch (err) {
      setError('Failed to save collection. Please try again.');
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
          {isEditing ? 'Edit Collection' : 'Create Collection'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Image
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="headerImage"
                  value={formData.headerImage}
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Header Title
                </label>
                <input
                  type="text"
                  name="headerTitle"
                  value={formData.headerTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Title shown in the header"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Header Overlay Opacity
                </label>
                <input
                  type="range"
                  name="headerOverlayOpacity"
                  min="0"
                  max="1"
                  step="0.1"
                  value={formData.headerOverlayOpacity}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current: {formData.headerOverlayOpacity}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Header Description
              </label>
              <textarea
                name="headerDescription"
                value={formData.headerDescription}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Description shown in the header"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <h3 className="text-md font-medium mb-4">Collection Filters</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-black text-white rounded-md"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.filters.tags.map(tag => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Categories
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Add a category"
                  />
                  <button
                    type="button"
                    onClick={addCategory}
                    className="px-4 py-2 bg-black text-white rounded-md"
                  >
                    <FiPlus />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.filters.categories.map(category => (
                    <span 
                      key={category}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {category}
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                </div>
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
        {formData.headerImage && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-md font-medium mb-4">Preview</h3>
              <div className="relative w-full h-60 overflow-hidden rounded-md">
                <img
                  src={formData.headerImage}
                  alt="Collection header"
                  className="w-full h-full object-cover"
                />
                
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: formData.headerOverlayOpacity }}
                ></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {formData.headerTitle && (
                    <h2 className="text-white text-2xl font-bold mb-2">
                      {formData.headerTitle}
                    </h2>
                  )}
                  {formData.headerDescription && (
                    <p className="text-white text-lg">
                      {formData.headerDescription}
                    </p>
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
                <span>Save Collection</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
      
      {renderMediaLibrary()}
    </div>
  );
};

export default CollectionForm;