// frontend/src/admin/forms/ProductRelationshipForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSearch, FiPlus, FiTrash } from 'react-icons/fi';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ProductRelationshipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    sourceProductId: '',
    relatedProductIds: [], // Allow multiple related products
    relationType: 'style-with',
    order: 0,
    isActive: true
  });
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sourceProduct, setSourceProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('source'); // 'source' or 'related'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Relationship types
  const relationshipTypes = [
    { value: 'style-with', label: 'Style It With' },
    { value: 'also-purchased', label: 'Customers Also Purchased' },
    { value: 'also-viewed', label: 'Customers Also Viewed' },
    { value: 'recommended', label: 'Recommended For You' }
  ];
  
  // Load relationship data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/cms/product-relationships/${id}`);
          
          // Get the relationship data
          const relationshipData = response.data.data;
          
          // Set form data
          setFormData({
            sourceProductId: relationshipData.sourceProductId,
            relatedProductIds: [relationshipData.relatedProductId], // Start with the single related product
            relationType: relationshipData.relationType,
            order: relationshipData.order,
            isActive: relationshipData.isActive
          });
          
          // Load source product details
          if (relationshipData.sourceProductId) {
            const sourceResponse = await axios.get(`/api/products/${relationshipData.sourceProductId}`);
            setSourceProduct(sourceResponse.data.product);
          }
          
          // Load related product details
          if (relationshipData.relatedProductId) {
            const relatedResponse = await axios.get(`/api/products/${relationshipData.relatedProductId}`);
            setRelatedProducts([relatedResponse.data.product]);
          }
        } catch (err) {
          setError('Failed to load relationship data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id, isEditing]);
  
  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    
    loadProducts();
  }, []);
  
  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }
    
    const filtered = products.filter(product => 
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    
    // Clear any previous error/success messages
    setError('');
    setSuccess('');
  };
  
  // Set the search mode and clear the search query
  const setSearchModeAndClear = (mode) => {
    setSearchMode(mode);
    setSearchQuery('');
  };
  
  // Handle source product selection
  const handleSourceProductSelect = (product) => {
    setSourceProduct(product);
    setFormData({
      ...formData,
      sourceProductId: product.id
    });
    setSearchQuery('');
    // Switch to related product search after selecting source
    setSearchMode('related');
  };
  
  // Handle related product selection
  const handleRelatedProductSelect = (product) => {
    // Check if product is already selected
    if (formData.relatedProductIds.includes(product.id)) {
      return;
    }
    
    // Check if product is the source product
    if (product.id === formData.sourceProductId) {
      toast.error("Source and related product cannot be the same");
      return;
    }
    
    // Add to related products
    setRelatedProducts([...relatedProducts, product]);
    setFormData({
      ...formData,
      relatedProductIds: [...formData.relatedProductIds, product.id]
    });
    setSearchQuery('');
  };
  
  // Remove a related product
  const handleRemoveRelatedProduct = (productId) => {
    setRelatedProducts(relatedProducts.filter(p => p.id !== productId));
    setFormData({
      ...formData,
      relatedProductIds: formData.relatedProductIds.filter(id => id !== productId)
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sourceProductId) {
      setError('Please select a source product');
      return;
    }
    
    if (formData.relatedProductIds.length === 0) {
      setError('Please select at least one related product');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      if (isEditing) {
        // Update existing relationship
        await axios.put(`/api/cms/product-relationships/${id}`, {
          sourceProductId: formData.sourceProductId,
          relatedProductId: formData.relatedProductIds[0], // Use first related product for backwards compatibility
          relationType: formData.relationType,
          order: formData.order,
          isActive: formData.isActive
        });
        
        setSuccess('Relationship updated successfully!');
        toast.success('Relationship updated!');
      } else {
        // Create multiple relationships, one for each related product
        const relationshipPromises = formData.relatedProductIds.map(relatedId => 
          axios.post('/api/cms/product-relationships', {
            sourceProductId: formData.sourceProductId,
            relatedProductId: relatedId,
            relationType: formData.relationType,
            order: formData.order,
            isActive: formData.isActive
          })
        );
        
        await Promise.all(relationshipPromises);
        
        setSuccess('Relationships created successfully!');
        toast.success('Relationships created!');
      }
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
      
    } catch (err) {
      setError('Failed to save relationship. Please try again.');
      console.error(err);
      
      // More detailed error message if available
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  // Product selection UI
  const renderProductSearch = (title, placeholder, onSelectProduct) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      
      <div className="flex mb-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full p-2 pr-10 border border-gray-300 rounded-md"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-md h-64 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 p-4">No products found</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div className="flex items-center">
                  {product.images && product.images[0] && (
                    <div className="w-10 h-10 bg-gray-100 mr-3">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{product.title}</h4>
                    <p className="text-xs text-gray-500">ID: {product.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  
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
          {isEditing ? 'Edit Product Relationship' : 'Create Product Relationship'}
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
            <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship Type
                </label>
                <select
                  name="relationType"
                  value={formData.relationType}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {relationshipTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Type of relationship between products
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
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
                  Order in which this relationship appears (lower numbers first)
                </p>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
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
            
            <div className="border-t border-gray-200 pt-6">
              {/* Source Product Selection */}
              {!sourceProduct ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium">Source Product</h3>
                    <button 
                      type="button"
                      className={`text-sm ${searchMode === 'source' ? 'text-black font-medium' : 'text-gray-500'}`}
                      onClick={() => setSearchModeAndClear('source')}
                    >
                      Search Products
                    </button>
                  </div>
                  
                  {searchMode === 'source' && renderProductSearch(
                    "Select Source Product",
                    "Search for a product to display relationships on...",
                    handleSourceProductSelect
                  )}
                </>
              ) : (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Source Product</h3>
                    <button
                      type="button"
                      onClick={() => {
                        setSourceProduct(null);
                        setFormData({...formData, sourceProductId: ''});
                      }}
                      className="text-sm text-black underline"
                    >
                      Change
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-md">
                    <div className="flex items-center">
                      {sourceProduct.images && sourceProduct.images[0] && (
                        <div className="w-16 h-16 bg-gray-100 mr-4">
                          <img 
                            src={sourceProduct.images[0]} 
                            alt={sourceProduct.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{sourceProduct.title}</h4>
                        <p className="text-xs text-gray-500">ID: {sourceProduct.id}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          This is the product page where related items will appear
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Related Products Selection */}
              {sourceProduct && (
                <>
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-medium">Related Products</h3>
                      <button 
                        type="button"
                        className={`text-sm ${searchMode === 'related' ? 'text-black font-medium' : 'text-gray-500'}`}
                        onClick={() => setSearchModeAndClear('related')}
                      >
                        Add Products
                      </button>
                    </div>
                    
                    {/* Selected related products list */}
                    {relatedProducts.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium mb-2">Selected Products</h4>
                        <div className="space-y-2">
                          {relatedProducts.map(product => (
                            <div 
                              key={product.id}
                              className="flex items-center justify-between border border-gray-200 p-3 rounded-md"
                            >
                              <div className="flex items-center">
                                {product.images && product.images[0] && (
                                  <div className="w-12 h-12 bg-gray-100 mr-3">
                                    <img 
                                      src={product.images[0]} 
                                      alt={product.title} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h4 className="text-sm font-medium">{product.title}</h4>
                                  <p className="text-xs text-gray-500">ID: {product.id}</p>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => handleRemoveRelatedProduct(product.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <FiTrash size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => setSearchModeAndClear('related')}
                            className="mt-4 flex items-center text-sm text-black"
                          >
                            <FiPlus className="mr-1" />
                            Add More Products
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Search for related products */}
                    {searchMode === 'related' && renderProductSearch(
                      relatedProducts.length === 0 ? "Select Related Products" : "Add More Related Products",
                      "Search for products to recommend...",
                      handleRelatedProductSelect
                    )}
                    
                    {/* Prompt if no related products selected */}
                    {relatedProducts.length === 0 && searchMode !== 'related' && (
                      <div className="border border-gray-200 rounded-md p-6 text-center">
                        <p className="text-gray-500 mb-4">No related products selected</p>
                        <button
                          type="button"
                          onClick={() => setSearchModeAndClear('related')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <FiPlus className="mr-2" />
                          Add Related Products
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
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
                <span>Save Relationship</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default ProductRelationshipForm;