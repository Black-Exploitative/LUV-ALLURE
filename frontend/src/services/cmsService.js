// frontend/src/services/cmsService.js
import axios from 'axios';

// Create cache for CMS content
let contentCache = {
  homepage: null,
  banners: {},
  navImages: {},
  productRelationships: {},
  expiryTime: 5 * 60 * 1000 // 5 minutes
};

// Function to clear cached content
export const clearCmsCache = () => {
  contentCache = {
    homepage: null,
    banners: {},
    navImages: {},
    productRelationships: {},
    expiryTime: 5 * 60 * 1000
  };
};

// CMS Service for front-end content
const cmsService = {
  // Get active homepage layout with populated sections
  getHomepageContent: async () => {
    try {
      // Check cache first
      if (contentCache.homepage && contentCache.homepage.timestamp > Date.now() - contentCache.expiryTime) {
        return contentCache.homepage.data;
      }
      
      const response = await axios.get('/api/cms/homepage');
      const homepageData = response.data.data;
      
      // Cache the result
      contentCache.homepage = {
        data: homepageData,
        timestamp: Date.now()
      };
      
      return homepageData;
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      // Return default empty structure if API fails
      return {
        name: 'Default Layout',
        sections: []
      };
    }
  },
  
  // Get banner for specific page
  getBanner: async (pageName) => {
    try {
      // Check cache first
      if (contentCache.banners[pageName] && 
          contentCache.banners[pageName].timestamp > Date.now() - contentCache.expiryTime) {
        return contentCache.banners[pageName].data;
      }
      
      const response = await axios.get(`/api/cms/banners?page=${pageName}`);
      
      // Get active banners and handle date filtering
      const now = new Date();
      const activeBanners = response.data.data.filter(banner => {
        // Check if banner is active
        if (!banner.isActive) return false;
        
        // Check start date if it exists
        if (banner.startDate && new Date(banner.startDate) > now) return false;
        
        // Check end date if it exists
        if (banner.endDate && new Date(banner.endDate) < now) return false;
        
        return true;
      });
      
      // Get the first active banner for the page
      const banner = activeBanners.length > 0 ? activeBanners[0] : null;
      
      // Cache the result
      contentCache.banners[pageName] = {
        data: banner,
        timestamp: Date.now()
      };
      
      return banner;
    } catch (error) {
      console.error(`Error fetching banner for ${pageName}:`, error);
      return null;
    }
  },
  
  // Get navigation images for a specific category
  getNavigationImages: async (category) => {
    try {
      // Check cache first
      if (contentCache.navImages[category] && 
          contentCache.navImages[category].timestamp > Date.now() - contentCache.expiryTime) {
        return contentCache.navImages[category].data;
      }
      
      // Make sure category is included in the query string
      const response = await axios.get(`/api/cms/nav-images`, {
        params: { category }
      });
      
      // Get active navigation images sorted by order
      const activeNavImages = response.data.data
        .filter(image => image.isActive)
        .sort((a, b) => a.order - b.order);
      
      console.log(`Images for ${category}:`, activeNavImages); // Add for debugging
      
      // Cache the result
      contentCache.navImages[category] = {
        data: activeNavImages,
        timestamp: Date.now()
      };
      
      return activeNavImages;
    } catch (error) {
      console.error(`Error fetching navigation images for ${category}:`, error);
      return [];
    }
  },
  
  // Get product relationships for a specific product and relationship type
  getProductRelationships: async (productId, relationType) => {
    try {
      const cacheKey = `${productId}-${relationType}`;
      
      // Check cache first
      if (contentCache.productRelationships[cacheKey] && 
          contentCache.productRelationships[cacheKey].timestamp > Date.now() - contentCache.expiryTime) {
        return contentCache.productRelationships[cacheKey].data;
      }
      
      const response = await axios.get(`/api/cms/product-relationships?sourceProductId=${productId}&relationType=${relationType}`);
      
      // Get active relationships sorted by order
      const activeRelationships = response.data.data
        .filter(rel => rel.isActive)
        .sort((a, b) => a.order - b.order);
      
      // Fetch related product details
      const relatedProductIds = activeRelationships.map(rel => rel.relatedProductId);
      
      if (relatedProductIds.length === 0) {
        return [];
      }
      
      // For each related product ID, fetch product details
      const productPromises = relatedProductIds.map(id => 
        axios.get(`/api/products/${id}`)
          .then(res => res.data.product)
          .catch(err => {
            console.error(`Error fetching product ${id}:`, err);
            return null;
          })
      );
      
      const products = await Promise.all(productPromises);
      const validProducts = products.filter(product => product !== null);
      
      // Cache the result
      contentCache.productRelationships[cacheKey] = {
        data: validProducts,
        timestamp: Date.now()
      };
      
      return validProducts;
    } catch (error) {
      console.error(`Error fetching ${relationType} products for ${productId}:`, error);
      return [];
    }
  }
};

export default cmsService;