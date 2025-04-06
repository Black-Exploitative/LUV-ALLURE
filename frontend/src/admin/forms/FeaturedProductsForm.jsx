// frontend/src/admin/forms/FeaturedProductsForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiSearch, FiPlus, FiTrash } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const FeaturedProductsForm = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    sectionId: sectionId || 'season-offers',
    title: "HERE'S WHAT THE SEASON OFFERS",
    productIds: []
  });
  
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch initial data: all products and current featured products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products from Shopify
        const productsResponse = await api.get('/products');
        setProducts(productsResponse.data.products || []);
        setFilteredProducts(productsResponse.data.products || []);
        
        // If editing, fetch current featured products config
        if (sectionId) {
          const featuredResponse = await api.get(`/cms/featured-products?section=${sectionId}`);
          
          if (featuredResponse.data.title) {
            setFormData({
              sectionId,
              title: featuredResponse.data.title,
              productIds: featuredResponse.data.products.map(p => p.id)
            });
            
            // Set selected products
            setSelectedProducts(featuredResponse.data.products);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [sectionId]);
  
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
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear any previous error
    setError('');
  };
  
  // Add a product to selection
  const handleAddProduct = (product) => {
    // Check if already selected
    if (formData.productIds.includes(product.id)) {
      return;
    }
    
    // Add to selected products
    setSelectedProducts([...selectedProducts, product]);
    setFormData({
      ...formData,
      productIds: [...formData.productIds, product.id]
    });
  };
  
  // Remove a product from selection
  const handleRemoveProduct = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    setFormData({
      ...formData,
      productIds: formData.productIds.filter(id => id !== productId)
    });
  };
  
  // Reorder selected products
  const moveProduct = (index, direction) => {
    if (
      (direction === -1 && index === 0) || 
      (direction === 1 && index === selectedProducts.length - 1)
    ) {
      return; // Can't move further in that direction
    }
    
    const newSelectedProducts = [...selectedProducts];
    const newProductIds = [...formData.productIds];
    
    // Swap positions
    const temp = newSelectedProducts[index];
    newSelectedProducts[index] = newSelectedProducts[index + direction];
    newSelectedProducts[index + direction] = temp;
    
    // Also swap in productIds array
    const tempId = newProductIds[index];
    newProductIds[index] = newProductIds[index + direction];
    newProductIds[index + direction] = tempId;
    
    setSelectedProducts(newSelectedProducts);
    setFormData({
      ...formData,
      productIds: newProductIds
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Section title is required');
      return;
    }
    
    if (formData.productIds.length === 0) {
      setError('Please select at least one product');
      return;
    }
    
    try {
      setSubmitLoading(true);
      setError('');
      
      const response = await api.put(
        `/cms/featured-products/${formData.sectionId}`, 
        {
          productIds: formData.productIds,
          title: formData.title
        }
      );
      
      if (response.data.success) {
        toast.success('Featured products updated successfully!');
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (err) {
      console.error('Error saving featured products:', err);
      setError('Failed to save featured products. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Format product details for display

  const formatPrice = (input) => {
    // If input is null or undefined, return default
    if (input == null) {
      return '₦0.00';
    }
    
    // If input is a number or numeric string
    if (typeof input === 'number' || 
        (typeof input === 'string' && !isNaN(parseFloat(input)))) {
      return `₦${parseFloat(input).toLocaleString()}`;
    }
    
    // If input is an object (a product)
    if (typeof input === 'object') {
      // Try different price properties
      if (input.price && typeof input.price === 'number') {
        return `₦${input.price.toLocaleString()}`;
      }
      
      if (input.price && typeof input.price === 'string' && !isNaN(parseFloat(input.price))) {
        return `₦${parseFloat(input.price).toLocaleString()}`;
      }
      
      if (input.priceValue) {
        return `₦${parseFloat(input.priceValue).toLocaleString()}`;
      }
      
      if (input.variants && input.variants[0]?.price?.amount) {
        return `₦${parseFloat(input.variants[0].price.amount).toLocaleString()}`;
      }
    }
    
    // Default fallback
    return '₦0.00';
  };
  
  // Get product thumbnail image
 const getProductImage = (product) => {
    // Case 1: Check for images array
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      
      // If the first image is a string
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      
      // If the first image is an object with src property
      if (firstImage && typeof firstImage === 'object') {
        if (firstImage.src) {
          return firstImage.src;
        }
        
        // Check for url property (common in some e-commerce APIs)
        if (firstImage.url) {
          return firstImage.url;
        }
      }
    }
    
    // Case 2: Check for featuredImage
    if (product.featuredImage?.url) {
      return product.featuredImage.url;
    }
    
    // Case 3: Check for image property (used in some systems)
    if (product.image) {
      if (typeof product.image === 'string') {
        return product.image;
      }
      if (product.image.src) {
        return product.image.src;
      }
      if (product.image.url) {
        return product.image.url;
      }
    }
    
    // Default placeholder
    return '/images/placeholder.jpg';
  };
  
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
          {sectionId ? 'Edit Featured Products' : 'Create Featured Products Section'}
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left side - Section properties */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Section Properties</h2>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section ID
                  </label>
                  <input
                    type="text"
                    name="sectionId"
                    value={formData.sectionId}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={!!sectionId} // Disable if editing existing section
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Unique identifier for this featured products section
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., WHAT THE SEASON OFFERS"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Display title for this section on the website
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Product Search</h2>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                </div>
                
                <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">No products found</p>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredProducts.map(product => (
                        <div 
                          key={product.id}
                          className={`p-3 hover:bg-gray-50 ${
                            formData.productIds.includes(product.id) ? 'bg-gray-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                                <img 
                                  src={getProductImage(product)} 
                                  alt={product.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">{product.title}</h4>
                                <p className="text-xs text-gray-500">{formatPrice(product.price)}</p>
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleAddProduct(product)}
                              className={`p-2 rounded ${
                                formData.productIds.includes(product.id)
                                  ? 'text-green-500 cursor-not-allowed'
                                  : 'text-gray-400 hover:text-black hover:bg-gray-100'
                              }`}
                              disabled={formData.productIds.includes(product.id)}
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Selected products */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-medium mb-4">Selected Products</h2>
                
                {selectedProducts.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                    <p className="text-gray-500">
                      Select products from the left panel to feature in this section
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedProducts.map((product, index) => (
                      <motion.div 
                        key={product.id}
                        className="border border-gray-200 p-4 rounded-md bg-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-100 mr-4 flex-shrink-0">
                            <img 
                              src={getProductImage(product)} 
                              alt={product.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium">{product.title}</h3>
                            <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                          </div>
                          
                          <div className="flex space-x-1">
                            <button
                              type="button"
                              onClick={() => moveProduct(index, -1)}
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
                              onClick={() => moveProduct(index, 1)}
                              disabled={index === selectedProducts.length - 1}
                              className={`p-1 rounded ${
                                index === selectedProducts.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(product.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <FiTrash />
                            </button>
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
                <h2 className="text-lg font-medium mb-4">Section Preview</h2>
                
                <div className="border border-gray-300 p-4 bg-gray-50 rounded-md">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-medium">{formData.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedProducts.length > 0 ? (
                      selectedProducts.map(product => (
                        <div key={product.id} className="border border-gray-200 bg-white p-3">
                          <div className="aspect-[3/4] bg-gray-100 mb-2">
                            <img 
                              src={getProductImage(product)} 
                              alt={product.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-medium text-center">{product.title}</p>
                          <p className="text-xs text-gray-500 text-center">{formatPrice(product.price)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 text-center py-8 text-gray-500">
                        Add products to see preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 my-6">
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {submitLoading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    <span>Save Featured Products</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeaturedProductsForm;