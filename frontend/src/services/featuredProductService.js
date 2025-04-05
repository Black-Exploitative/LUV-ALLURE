// services/FeaturedProductService.js
import api from './api';

// No need for base URL anymore, using the configured api service

const FeaturedProductService = {
  // Fetch featured products from CMS
  getFeaturedProducts: async (sectionId = 'season-offers') => {
    try {
      // First, try to fetch featured products from the CMS
      const cmsResponse = await api.get(`/cms/featured-products?section=${sectionId}`);
      
      if (cmsResponse.data?.products?.length > 0) {
        return cmsResponse.data.products;
      }
      
      // If no CMS products, fall back to fetching from Shopify directly
      return await fetchShopifyProducts();
    } catch (error) {
      console.error('Error fetching featured products:', error);
      
      // If CMS fetch fails, try to get them directly from Shopify
      return await fetchShopifyProducts();
    }
  },
  
  // Update featured products in CMS
  updateFeaturedProducts: async (sectionId, productIds, title) => {
    try {
      const response = await api.put(`/cms/featured-products/${sectionId}`, {
        productIds,
        title
      });
      return response.data;
    } catch (error) {
      console.error('Error updating featured products:', error);
      throw error;
    }
  },
  
  // Get all featured products sections (for admin dashboard)
  getAllSections: async () => {
    try {
      const response = await api.get(`/cms/featured-products/sections`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured product sections:', error);
      return { sections: [] };
    }
  },
  
  // Delete a featured products section
  deleteSection: async (sectionId) => {
    try {
      const response = await api.delete(`/cms/featured-products/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting featured product section:', error);
      throw error;
    }
  }
};

// Helper function to fetch products directly from Shopify
async function fetchShopifyProducts(limit = 4) {
  try {
    const response = await api.get(`/products?limit=${limit}`);
    
    // Process products to ensure consistent format
    return response.data.products.map(product => ({
      id: product.id,
      title: product.title || product.name,
      images: Array.isArray(product.images) 
        ? product.images 
        : product.images?.edges?.map(edge => edge.node.url) || 
          [product.image || '/images/placeholder.jpg'],
      price: parseFloat(product.price || product.variants?.[0]?.price?.amount || 0),
      handle: product.handle,
      description: product.description
    }));
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    
    // Return fallback data for development
    return [
      { 
        id: 1, 
        title: "Crimson Allure", 
        images: ["/images/photo4.jpg", "/images/photo5.jpg"],
        price: 250000
      },
      { 
        id: 2, 
        title: "L'dact Allure", 
        images: ["/images/photo5.jpg", "/images/photo4.jpg"],
        price: 180000
      },
      { 
        id: 3, 
        title: "Novo Amor Allure", 
        images: ["/images/photo6.jpg", "/images/photo3.jpg"],
        price: 210000
      },
      { 
        id: 4, 
        title: "Swivel Allure", 
        images: ["/images/man-wearing-blank-shirt.jpg", "/images/photo4.jpg"],
        price: 195000
      }
    ];
  }
}

export default FeaturedProductService;