// frontend/src/admin/forms/LayoutForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiPlus, FiTrash } from 'react-icons/fi';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const LayoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    isActive: false,
    sections: []
  });
  
  const [availableSections, setAvailableSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load layout data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/cms/layouts/${id}`);
          setFormData(response.data.data);
        } catch (err) {
          setError('Failed to load layout data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id, isEditing]);
  
  // Load available sections
  useEffect(() => {
    const loadSections = async () => {
      try {
        const response = await axios.get('/api/cms/sections');
        setAvailableSections(response.data.data || []);
      } catch (err) {
        console.error('Failed to load sections:', err);
      }
    };
    
    loadSections();
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
  
  // Add a section to the layout
  const addSection = (sectionId) => {
    // Find highest order to place new section at the end
    const highestOrder = formData.sections.length > 0
      ? Math.max(...formData.sections.map(section => section.order))
      : -1;
      
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          sectionId,
          order: highestOrder + 1,
          column: 0,
          width: 12 // Full width by default
        }
      ]
    });
  };
  
  // Remove a section from the layout
  const removeSection = (index) => {
    const updatedSections = [...formData.sections];
    updatedSections.splice(index, 1);
    
    // Reorder remaining sections
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx
    }));
    
    setFormData({
      ...formData,
      sections: reorderedSections
    });
  };
  
  // Move a section up in the order
  const moveSectionUp = (index) => {
    if (index === 0) return; // Already at the top
    
    const updatedSections = [...formData.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index - 1];
    updatedSections[index - 1] = temp;
    
    // Update order properties
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx
    }));
    
    setFormData({
      ...formData,
      sections: reorderedSections
    });
  };
  
  // Move a section down in the order
  const moveSectionDown = (index) => {
    if (index === formData.sections.length - 1) return; // Already at the bottom
    
    const updatedSections = [...formData.sections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[index + 1];
    updatedSections[index + 1] = temp;
    
    // Update order properties
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      order: idx
    }));
    
    setFormData({
      ...formData,
      sections: reorderedSections
    });
  };
  
  // Update section properties
  const updateSectionProperty = (index, property, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[index] = {
      ...updatedSections[index],
      [property]: value
    };
    
    setFormData({
      ...formData,
      sections: updatedSections
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form
    if (!formData.name.trim()) {
      setError('Layout name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // API endpoint and method based on editing or creating
      const url = isEditing 
        ? `/api/cms/layouts/${id}` 
        : '/api/cms/layouts';
      
      const method = isEditing ? 'put' : 'post';
      
      const response = await axios[method](url, formData);
      
      if (response.data.success) {
        setSuccess(isEditing 
          ? 'Layout updated successfully!' 
          : 'Layout created successfully!');
        
        toast.success(isEditing ? 'Layout updated!' : 'Layout created!');
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to save layout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Get section name by ID
  const getSectionName = (sectionId) => {
    const section = availableSections.find(s => s._id === sectionId);
    return section ? section.name : 'Unknown Section';
  };
  
  // Get section type by ID
  const getSectionType = (sectionId) => {
    const section = availableSections.find(s => s._id === sectionId);
    return section ? section.type : 'unknown';
  };
  
  // Width options for grid layout
  const widthOptions = [
    { value: 12, label: 'Full Width' },
    { value: 6, label: 'Half Width' },
    { value: 4, label: 'One Third' },
    { value: 3, label: 'One Quarter' }
  ];
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin')}
          className="mr-2 text-gray-500 hover:text-black"
        >
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">
          {isEditing ? 'Edit Homepage Layout' : 'Create New Homepage Layout'}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Layout properties */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Layout Properties</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout Name
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
                    Set as Active Layout
                  </label>
                </div>
                
                <p className="mt-4 text-xs text-gray-500">
                  Only one layout can be active at a time. Setting this layout as active will deactivate all others.
                </p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Available Sections</h2>
                
                {availableSections.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No sections found. Create some sections first.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {availableSections
                      .filter(section => section.isActive)
                      .map(section => (
                        <div 
                          key={section._id}
                          className="border border-gray-200 p-3 flex justify-between items-center hover:bg-gray-50"
                        >
                          <div>
                            <h3 className="text-sm font-medium">{section.name}</h3>
                            <p className="text-xs text-gray-500">Type: {section.type}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addSection(section._id)}
                            className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right side - Layout design */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Layout Design</h2>
                
                {formData.sections.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                    <p className="text-gray-500">
                      Add sections from the left panel to start building your layout
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.sections
                      .slice() // Create a copy to avoid mutation
                      .sort((a, b) => a.order - b.order) // Sort by order
                      .map((section, index) => (
                        <motion.div 
                          key={index}
                          className="border border-gray-200 p-4 rounded-md bg-white"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">
                              {getSectionName(section.sectionId)}
                            </h3>
                            <div className="flex space-x-1">
                              <button
                                type="button"
                                onClick={() => moveSectionUp(index)}
                                disabled={index === 0}
                                className={`p-1 rounded ${
                                  index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSectionDown(index)}
                                disabled={index === formData.sections.length - 1}
                                className={`p-1 rounded ${
                                  index === formData.sections.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSection(index)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <FiTrash />
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-2 bg-gray-50 text-xs text-gray-500 mb-3">
                            Type: {getSectionType(section.sectionId)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Width
                              </label>
                              <select
                                value={section.width}
                                onChange={(e) => updateSectionProperty(index, 'width', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              >
                                {widthOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label} ({option.value}/12)
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Column
                              </label>
                              <select
                                value={section.column}
                                onChange={(e) => updateSectionProperty(index, 'column', parseInt(e.target.value))}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              >
                                <option value={0}>Left (0)</option>
                                <option value={1}>Center (1)</option>
                                <option value={2}>Right (2)</option>
                              </select>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Preview section */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Layout Preview</h2>
                
                <div className="border border-gray-300 p-4 bg-gray-50 rounded-md">
                  {formData.sections.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Add sections to see a preview
                    </p>
                  ) : (
                    <div className="grid grid-cols-12 gap-2">
                      {formData.sections
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => {
                          // Calculate starting column based on section.column setting
                          let colStart = 1; // Default to start at first column
                          if (section.column === 1) colStart = Math.floor((12 - section.width) / 2) + 1; // Center
                          if (section.column === 2) colStart = 12 - section.width + 1; // Right align
                          
                          return (
                            <div
                              key={index}
                              className="bg-white border border-gray-300 p-2 text-center text-xs"
                              style={{
                                gridColumn: `${colStart} / span ${section.width}`,
                                minHeight: '60px'
                              }}
                            >
                              <p className="font-medium">{getSectionName(section.sectionId)}</p>
                              <p className="text-gray-500">{getSectionType(section.sectionId)}</p>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                <span>Save Layout</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LayoutForm;