// frontend/src/admin/forms/MediaForm.jsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiUpload } from 'react-icons/fi';
import axios from 'axios';

const MediaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    altText: '',
    tags: ''
  });
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear any previous error/success messages
    setError('');
    setSuccess('');
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setPreview('');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      setFile(null);
      setPreview('');
      return;
    }
    
    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      setFile(null);
      setPreview('');
      return;
    }
    
    setFile(selectedFile);
    
    // Auto-fill name if empty
    if (!formData.name) {
      setFormData({
        ...formData,
        name: selectedFile.name.split('.')[0]
      });
    }
    
    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEditing && !file) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (isEditing) {
        // Update existing media
        await axios.put(`/api/cms/media/${id}`, formData);
        
        setSuccess('Media updated successfully!');
      } else {
        // Upload new media
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('altText', formData.altText);
        formDataToSend.append('tags', formData.tags);
        
        await axios.post('/api/cms/media', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setSuccess('Media uploaded successfully!');
      }
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
      
    } catch (err) {
      setError('Failed to upload media. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          {isEditing ? 'Edit Media' : 'Upload Media'}
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
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
          <div className="p-6">
            {!isEditing && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-black hover:text-gray-700 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
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
                  Name for this media file
                </p>
              </div>
              
              <div>
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
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., banner, product, navigation (comma separated)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Add tags to help organize your media library
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview section */}
        {(preview || isEditing) && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-md font-medium mb-4">Media Preview</h3>
              <div className="flex justify-center">
                <div className="max-w-full max-h-64 overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 object-contain"
                  />
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
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                {isEditing ? <FiSave /> : <FiUpload />}
                <span>{isEditing ? 'Save Media' : 'Upload'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MediaForm;