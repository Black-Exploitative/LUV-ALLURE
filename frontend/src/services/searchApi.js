// services/searchApi.js
import api from './api';

// Service for search-related API calls
const searchService = {
  // Search products
  searchProducts: async (query, options = {}) => {
    try {
      const { category = 'all', limit = 10, page = 1 } = options;
      
      // Create query parameters
      const params = new URLSearchParams();
      params.append('q', query);
      if (category !== 'all') params.append('category', category);
      params.append('limit', limit.toString());
      params.append('page', page.toString());
      
      const response = await api.get(`/products/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      
      // For development/testing, return mock data when API fails
      return getMockSearchResults(query, options);
    }
  },
  
  // Get search suggestions (for autocomplete)
  getSearchSuggestions: async (query) => {
    try {
      const response = await api.get(`/products/suggestions?q=${encodeURIComponent(query)}`);
      return response.data.suggestions;
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      
      // Return mock suggestions for development
      return getMockSuggestions(query);
    }
  }
};

// Helper function to get mock search results for development
function getMockSearchResults(query, options = {}) {
  const { category = 'all' } = options;
  
  // Create a base set of products
  const allProducts = [
    {
      id: '1',
      title: 'Crimson Allure Dress',
      description: 'Elegant red dress with flowing design',
      price: '300000.00',
      image: '/images/photo4.jpg',
      productType: 'dresses',
      tags: ['gown', 'formal', 'evening', 'special occasion']
    },
    {
      id: '3',
      title: 'Novo Amor Top',
      description: 'Stylish top with modern design elements',
      price: '120000.00',
      image: '/images/photo6.jpg',
      productType: 'tops',
      tags: ['casual', 'top', 'stylish']
    },
    {
      id: '4',
      title: 'Swivel Allure Maxi Dress',
      description: 'Long flowing maxi dress perfect for summer events',
      price: '280000.00',
      image: '/images/man-wearing-blank-shirt.jpg',
      productType: 'dresses',
      tags: ['maxi', 'summer', 'flowing']
    },
    {
      id: '5',
      title: 'Amore Collection Silk Scarf',
      description: 'Luxurious silk scarf with beautiful patterns',
      price: '75000.00',
      image: '/images/stylewith.jpg',
      productType: 'accessories',
      tags: ['scarf', 'silk', 'luxury']
    },
    {
      id: '6',
      title: 'Elegant Evening Clutch',
      description: 'Beautiful clutch for evening events',
      price: '95000.00',
      image: '/images/stylewith2.jpg',
      productType: 'accessories',
      tags: ['bag', 'evening', 'clutch']
    }
  ];
  
  // Filter products by search query
  let filteredProducts = allProducts.filter(product => {
    const searchableText = [
      product.title,
      product.description,
      ...product.tags
    ].join(' ').toLowerCase();
    
    return searchableText.includes(query.toLowerCase());
  });
  
  // Apply category filter if specified
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(product => 
      product.productType.toLowerCase() === category.toLowerCase()
    );
  }
  
  return {
    products: filteredProducts,
    totalCount: filteredProducts.length,
    query
  };
}

// Helper function to get mock search suggestions
function getMockSuggestions(query) {
  if (!query || query.trim().length < 2) return [];
  
  const suggestions = [
    'dress',
    'dresses',
    'evening dress',
    'maxi dress',
    'gown',
    'elegant gown',
    'top',
    'silk top',
    'accessories',
    'scarf',
    'clutch',
    'allure collection',
    'red dress',
    'black dress'
  ];
  
  return suggestions
    .filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
}

export default searchService; ['red', 'formal', 'elegant']