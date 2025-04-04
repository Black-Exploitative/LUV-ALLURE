// frontend/src/admin/forms/ProductRelationshipForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSearch } from 'react-icons/fi';
import axios from 'axios';

const ProductRelationshipForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    sourceProductId: '',
    relatedProductId: '',
    relationType: 'style-with',
    order: 0,
    isActive: true
  });
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sourceProduct, setSourceProduct] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Relationship types
  const relationshipTypes = [
    { value: 'style-with', label: 'Style It With' },
    { value: 'also-purchased', label: 'Also Purchased' },
    { value: 'also-viewed', label: 'Also Viewed' },
    { value: 'recommended', label: 'Recommended' }
  ];
  
  // Load relationship data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          setLoading(true);
          const response = await axios.get(`/api/cms/product-relationships/${id}`);
          setFormData(response.data.data);
          
          // Load source and related product details
          if (response.data.data.sourceProductId) {
            const sourceResponse = await axios.get(`/api/products/${response.data.data.sourceProductId}`);
            setSourceProduct(sourceResponse.data.product);
          }
          
          if (response.data.data.relatedProductId) {
            const relatedResponse = await axios.get(`/api/products/${response.data.data.relatedProductId}`);
            setRelatedProduct(relatedResponse.data.product);
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
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredProducts(filtered);
  }, [searchQuery, products]);
  
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
  
  // Handle source product selection
  const handleSourceProductSelect = (product) => {
    setSourceProduct(product);
    setFormData({
      ...formData,
      sourceProductId: product.id
    });
    setSearchQuery('');
  };
  
  // Handle related product selection
  const handleRelatedProductSelect = (product) => {
    setRelatedProduct(product);
    setFormData({
      ...formData,
      relatedProductId: product.id
    });
    setSearchQuery('');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sourceProductId || !formData.relatedProductId) {
      setError('Please select both source and related products');
      return;
    }
    
    if (formData.sourceProductId === formData.relatedProductId) {
      setError('Source and related products cannot be the same');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // API endpoint and method based on editing or creating
      const url = isEditing 
        ? `/api/cms/product-relationships/${id}` 
        : '/api/cms/product-relationships';
      
      const method = isEditing ? 'put' : 'post';
      
      await axios[method](url, formData);
      
      setSuccess(isEditing 
        ? 'Relationship updated successfully!' 
        : 'Relationship created successfully!');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
      
    } catch (err) {
      setError('Failed to save relationship. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Product selection UI
  const renderProductSelection = (title, selectedProduct, onSelect, excludeId = null) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      
      {selectedProduct ? (
        <div className="border border-gray-200 p-3 rounded-md mb-4">
          <div className="flex items-center">
            {selectedProduct.images && selectedProduct.images[0] && (
              <div className="w-16 h-16 bg-gray-100 mr-3">
                <img 
                  src={selectedProduct.images[0]} 
                  alt={selectedProduct.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h4 className="font-medium">{selectedProduct.title}</h4>
              <p className="text-xs text-gray-500">ID: {selectedProduct.id}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (title.includes('Source')) {
                  setSourceProduct(null);
                  setFormData({...formData, sourceProductId: ''});
                } else {
                  setRelatedProduct(null);
                  setFormData({...formData, relatedProductId: ''});
                }
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex mb-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
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
                {filteredProducts
                  .filter(product => !excludeId || product.id !== excludeId)
                  .map(product => (
                    <div 
                      key={product.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelect(product)}
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
                        <div>
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
      )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              {renderProductSelection(
                'Source Product (displayed on this product page)',
                sourceProduct,
                handleSourceProductSelect,
                formData.relatedProductId
              )}
              
              {/* Related Product Selection */}
              {renderProductSelection(
                'Related Product (shown as suggestion)',
                relatedProduct,
                handleRelatedProductSelect,
                formData.sourceProductId
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
                <FiSave />
                <span>Save Relationship</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductRelationshipForm;