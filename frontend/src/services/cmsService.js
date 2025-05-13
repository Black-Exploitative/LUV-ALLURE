// frontend/src/services/cmsService.js
import axios from 'axios';
import api from './api';

// Create cache for CMS content
let contentCache = {
  homepage: null,
  banners: {},
  navImages: {},
  productRelationships: {},
  shopBanners: {},
  expiryTime: 5 * 60 * 1000 // 5 minutes
};

// Function to clear cached content
export const clearCmsCache = () => {
  contentCache = {
    homepage: null,
    banners: {},
    navImages: {},
    productRelationships: {},
    shopBanners: {},
    expiryTime: 5 * 60 * 1000
  };
};

// Base API URL - use environment variable or fallback
const API_URL = import.meta.env.VITE_API_URL || '/api';

// CMS Service for front-end content
const cmsService = {
  // Get active homepage layout with populated sections
  getHomepageContent: async () => {
    try {
      // Check cache first
      if (contentCache.homepage && contentCache.homepage.timestamp > Date.now() - contentCache.expiryTime) {
        return contentCache.homepage.data;
      }
      
      const response = await api.get('/cms/homepage');
      const homepageData = response.data.data;
      
      // Cache the result
      contentCache.homepage = {
        data: homepageData,
        timestamp: Date.now()
      };
      
      console.log('Homepage content loaded:', homepageData);
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
      
      const response = await api.get(`/cms/banners?page=${pageName}`);
      
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
        console.log(`Using cached nav images for ${category}`);
        return contentCache.navImages[category].data;
      }
      
      console.log(`Fetching navigation images for ${category}...`);
      
      // Make sure category is included in the query string
      const response = await api.get('/cms/nav-images', {
        params: { category }
      });
      
      // Get active navigation images sorted by order
      const activeNavImages = response.data.data
        .filter(image => image.isActive)
        .sort((a, b) => a.order - b.order);
      
      console.log(`Found ${activeNavImages.length} images for ${category}`);
      
      // Fix image URLs in production
      const imagesWithFixedUrls = activeNavImages.map(image => {
        // If we're in production and the URL starts with /uploads, fix it
        if (image.imageUrl && image.imageUrl.startsWith('/uploads')) {
          // Get the base URL from the current location or use environment variable
          const baseUrl = import.meta.env.VITE_API_URL || '';
          image.imageUrl = `${baseUrl}${image.imageUrl}`;
          console.log(`Fixed image URL: ${image.imageUrl}`);
        }
        return image;
      });
      
      // Cache the result
      contentCache.navImages[category] = {
        data: imagesWithFixedUrls,
        timestamp: Date.now()
      };
      
      return imagesWithFixedUrls;
    } catch (error) {
      console.error(`Error fetching navigation images for ${category}:`, error);
      console.error('Full error:', error.response || error);
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
      
      const response = await api.get(`/cms/product-relationships?sourceProductId=${productId}&relationType=${relationType}`);
      
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
        api.get(`/products/${id}`)
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

export const getShopBanner = async (deviceType = 'desktop') => {
  try {
    console.log(`Fetching shop banner data for ${deviceType}...`);
    
    // Check cache first
    const cacheKey = `shop-banner-${deviceType}`;
    if (contentCache.shopBanners[cacheKey] && 
        contentCache.shopBanners[cacheKey].timestamp > Date.now() - contentCache.expiryTime) {
      console.log(`Using cached shop banner for ${deviceType}`);
      return contentCache.shopBanners[cacheKey].data;
    }
    
    // Make a direct call to get sections of type shop-banner with device type filter
    const response = await api.get('/cms/sections', {
      params: {
        type: 'shop-banner',
        deviceType: deviceType
      }
    });
    
    // Log the full response for debugging
    console.log(`API Response for ${deviceType} shop banner:`, response.data);
    
    const banners = response.data.data || [];
    
    // Find the first active banner for the specified device type
    const activeBanner = banners.find(banner => {
      // Check if banner is active and matches the deviceType or has no deviceType specified (for backward compatibility)
      return banner.isActive && 
             (banner.deviceType === deviceType || 
              (!banner.deviceType && deviceType === 'desktop')); // Treat banners with no device type as desktop banners
    });
    
    if (activeBanner) {
      console.log(`Active ${deviceType} shop banner found:`, activeBanner);
      
      // Fix media URLs for production
      if (activeBanner.media?.imageUrl && activeBanner.media.imageUrl.startsWith('/uploads')) {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        activeBanner.media.imageUrl = `${baseUrl}${activeBanner.media.imageUrl}`;
      }
      
      // Important: Log the button position specifically
      console.log(`Button position in ${deviceType} banner:`, activeBanner.content?.buttonPosition);
      
      // Check if content and media objects exist
      if (!activeBanner.content) {
        console.warn("Banner content is missing!");
        activeBanner.content = {};
      }
      
      if (!activeBanner.media) {
        console.warn("Banner media is missing!");
        activeBanner.media = {};
      }
      
      // Cache the result
      contentCache.shopBanners[cacheKey] = {
        data: activeBanner,
        timestamp: Date.now()
      };
      
      return activeBanner;
    } else {
      console.log(`No active ${deviceType} shop banner found in response`);
      
      // Create a default empty banner as a fallback
      const defaultBanner = {
        content: {},
        media: {}
      };
      
      // Cache the result
      contentCache.shopBanners[cacheKey] = {
        data: defaultBanner,
        timestamp: Date.now()
      };
      
      return defaultBanner;
    }
  } catch (error) {
    console.error(`Error fetching ${deviceType} shop banner:`, error);
    return null;
  }
};

export const getPromoSection = async () => {
  try {
    // Make a direct call to get all sections of type promo-section
    const response = await api.get('/cms/sections?type=promo-section');
    const promoSections = response.data.data || [];
    
    // Get the first active promo section
    const activePromo = promoSections.find(section => section.isActive);
    
    // Fix media URLs for production
    if (activePromo?.media?.imageUrl && activePromo.media.imageUrl.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      activePromo.media.imageUrl = `${baseUrl}${activePromo.media.imageUrl}`;
    }
    
    return activePromo;
  } catch (error) {
    console.error('Error fetching promo section:', error);
    return null;
  }
};

// Get the active collection hero
export const getCollectionHero = async () => {
  try {
    // Make a direct call to get all sections of type collection-hero
    const response = await api.get('/cms/sections?type=collection-hero');
    const collectionHeroes = response.data.data || [];
    
    // Get the first active collection hero
    const activeHero = collectionHeroes.find(hero => hero.isActive);
    
    // Fix media URLs for production
    if (activeHero?.media?.imageUrl && activeHero.media.imageUrl.startsWith('/uploads')) {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      activeHero.media.imageUrl = `${baseUrl}${activeHero.media.imageUrl}`;
    }
    
    return activeHero;
  } catch (error) {
    console.error('Error fetching collection hero:', error);
    return null;
  }
};

export default cmsService;