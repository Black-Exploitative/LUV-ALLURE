// services/shippingService.js - Integrated with real GIGL and Bolt shipping APIs
import axios from 'axios';
import api from './api';

// API configuration - Add your actual API keys and endpoints
const API_CONFIG = {
  GIGL: {
    baseUrl: 'https://api.giglogistics.com/v1', // Replace with actual GIGL API endpoint
    apiKey: import.meta.env.VITE_GIGL_API_KEY || 'YOUR_GIGL_API_KEY', // Store in .env file
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_GIGL_API_KEY || 'YOUR_GIGL_API_KEY'}`
    }
  },
  BOLT: {
    baseUrl: 'https://api.bolt.eu/v1', // Replace with actual Bolt API endpoint
    apiKey: import.meta.env.VITE_BOLT_API_KEY || 'YOUR_BOLT_API_KEY', // Store in .env file
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_BOLT_API_KEY || 'YOUR_BOLT_API_KEY'}`
    }
  }
};

// Nigerian states data
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

// Store's address (where the business is located)
const STORE_ADDRESS = {
  address: "Liberty Court 5 Apartments",
  area: "Lekki Peninsula II",
  zipCode: "106104",
  city: "Lekki",
  state: "Lagos",
  country: "Nigeria"
};

// Weight estimation for products (in kg)
const PRODUCT_WEIGHTS = {
  default: 0.5, // Default weight per item
  dress: 0.5,
  jacket: 0.8,
  coat: 1.0,
  accessories: 0.2
};

// Zones grouping states (used for fallback)
const ZONES = {
  southwest: ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'],
  southeast: ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'],
  southsouth: ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'],
  northcentral: ['Benue', 'FCT', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau'],
  northeast: ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'],
  northwest: ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara']
};

const shippingService = {
  /**
   * Calculate shipping cost using GIGL API for deliveries
   */
  async calculateGIGLShipping(orderData, shippingAddress) {
    try {
      // Calculate total weight
      let totalWeight = this.calculateTotalWeight(orderData.items);
      
      // Format origin and destination addresses for GIGL API
      const origin = {
        address: STORE_ADDRESS.address,
        area: STORE_ADDRESS.area,
        city: STORE_ADDRESS.city,
        state: STORE_ADDRESS.state,
        country: STORE_ADDRESS.country,
        postcode: STORE_ADDRESS.zipCode
      };
      
      const destination = {
        address: shippingAddress.address,
        area: shippingAddress.apartment || shippingAddress.area || "",
        city: shippingAddress.city,
        state: shippingAddress.state,
        country: shippingAddress.country || "Nigeria",
        postcode: shippingAddress.zipCode || ""
      };
      
      // Prepare payload for GIGL API
      // Customize this based on the actual GIGL API documentation
      const payload = {
        origin,
        destination,
        weight: totalWeight,
        packageType: "parcel",
        items: orderData.items.map(item => ({
          name: item.name || item.title,
          quantity: item.quantity || 1,
          weight: (PRODUCT_WEIGHTS[item.category] || PRODUCT_WEIGHTS.default) * (item.quantity || 1)
        }))
      };
      
      // Make API call to GIGL for shipping rate
      const response = await axios.post(
        `${API_CONFIG.GIGL.baseUrl}/shipping/rates`, 
        payload,
        { headers: API_CONFIG.GIGL.headers }
      );
      
      // Process the response based on actual GIGL API response format
      // This is a placeholder - adjust according to actual API response
      if (response.data && response.data.success) {
        return {
          success: true,
          provider: 'GIGL',
          cost: response.data.amount || response.data.cost,
          estimatedDeliveryDays: response.data.estimatedDeliveryDays || '2-5',
          weight: totalWeight
        };
      } else {
        throw new Error(response.data?.message || 'Failed to get GIGL shipping rate');
      }
    } catch (error) {
      console.error('Error calculating GIGL shipping:', error);
      
      // Implement fallback calculation in case API fails
      return this.calculateFallbackShipping(orderData, shippingAddress, 'GIGL');
    }
  },
  
  /**
   * Calculate shipping cost using Bolt API (for in-state deliveries)
   */
  async calculateBoltShipping(orderData, shippingAddress) {
    try {
      // Calculate total weight
      let totalWeight = this.calculateTotalWeight(orderData.items);
      
      // Prepare request data for Bolt API
      // Customize this based on Bolt's actual API documentation
      const payload = {
        pickup: {
          address: STORE_ADDRESS.address,
          city: STORE_ADDRESS.city,
          state: STORE_ADDRESS.state,
          coordinates: {
            latitude: 6.4281, // Replace with actual store coordinates
            longitude: 3.4219  // Replace with actual store coordinates
          }
        },
        dropoff: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          coordinates: null // Bolt might need coordinates or can geocode address
        },
        packageDetails: {
          weight: totalWeight,
          dimensions: {
            length: 30, // Default dimensions in cm
            width: 20,
            height: 10
          },
          quantity: orderData.items.reduce((total, item) => total + (item.quantity || 1), 0),
          value: orderData.subtotal || 0
        }
      };
      
      // Make API call to Bolt
      const response = await axios.post(
        `${API_CONFIG.BOLT.baseUrl}/delivery/price`, 
        payload,
        { headers: API_CONFIG.BOLT.headers }
      );
      
      // Process response (adjust according to actual Bolt API response)
      if (response.data && response.data.success) {
        return {
          success: true,
          provider: 'Bolt',
          cost: response.data.amount || response.data.price,
          estimatedDeliveryDays: '1-2', // Bolt typically delivers same-day or next-day
          weight: totalWeight
        };
      } else {
        throw new Error(response.data?.message || 'Failed to get Bolt shipping rate');
      }
    } catch (error) {
      console.error('Error calculating Bolt shipping:', error);
      
      // Implement fallback calculation in case API fails
      return this.calculateFallbackShipping(orderData, shippingAddress, 'Bolt');
    }
  },
  
  /**
   * Calculate total weight of order items
   */
  calculateTotalWeight(items) {
    // Calculate total weight based on items
    let totalWeight = items.reduce((weight, item) => {
      const itemType = item.category || 'default';
      const itemWeight = PRODUCT_WEIGHTS[itemType] || PRODUCT_WEIGHTS.default;
      return weight + (itemWeight * (item.quantity || 1));
    }, 0);
    
    // Ensure minimum weight (most carriers have a minimum weight)
    return Math.max(totalWeight, 0.5);
  },
  
  /**
   * Fallback shipping calculation in case API calls fail
   */
  calculateFallbackShipping(orderData, shippingAddress, provider = 'GIGL') {
    const totalWeight = this.calculateTotalWeight(orderData.items);
    const destinationState = shippingAddress.state;
    const isSameState = destinationState === STORE_ADDRESS.state;
    const isLagos = destinationState === 'Lagos';
    
    // Base rates for different scenarios
    const FALLBACK_RATES = {
      // Within Lagos (Bolt typically)
      lagos: {
        base: 2000,
        perKg: 400
      },
      // Within same state but not Lagos
      sameState: {
        base: 2500,
        perKg: 500
      },
      // Same zone (e.g., South West)
      sameZone: {
        base: 3500,
        perKg: 700
      },
      // Cross-zone (e.g., South West to South East)
      crossZone: {
        base: 4500,
        perKg: 900
      }
    };
    
    // Determine which rate to use
    let rate;
    if (isLagos) {
      rate = FALLBACK_RATES.lagos;
    } else if (isSameState) {
      rate = FALLBACK_RATES.sameState;
    } else {
      // Check if destination is in same zone as store
      const storeZone = this.getZone(STORE_ADDRESS.state);
      const destinationZone = this.getZone(destinationState);
      
      if (storeZone === destinationZone) {
        rate = FALLBACK_RATES.sameZone;
      } else {
        rate = FALLBACK_RATES.crossZone;
      }
    }
    
    // Calculate shipping cost
    const shippingCost = rate.base + (totalWeight * rate.perKg);
    
    return {
      success: true,
      provider: provider,
      cost: Math.round(shippingCost),
      estimatedDeliveryDays: isLagos ? '1-2' : '2-5',
      weight: totalWeight,
      isEstimate: true // Flag that this is an estimate, not from API
    };
  },
  
  /**
   * Get zone for a state
   */
  getZone(state) {
    for (const [zone, states] of Object.entries(ZONES)) {
      if (states.includes(state)) {
        return zone;
      }
    }
    return null;
  },
  
  /**
   * Get estimated shipping cost based on order data and shipping address
   */
  async getShippingEstimate(orderData, shippingAddress) {
    try {
      // Validate input
      if (!orderData || !orderData.items || !shippingAddress) {
        throw new Error('Invalid input data for shipping calculation');
      }
      
      // Check if we have the minimum required address info
      if (!shippingAddress.state) {
        return {
          success: false,
          message: 'Please provide a state to calculate shipping'
        };
      }
      
      // Determine which provider to use
      // Use Bolt for Lagos deliveries, GIGL for others
      const isLagos = shippingAddress.state.toLowerCase() === 'lagos';
      
      if (isLagos) {
        return await this.calculateBoltShipping(orderData, shippingAddress);
      } else {
        return await this.calculateGIGLShipping(orderData, shippingAddress);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      return {
        success: false,
        message: error.message || 'Error calculating shipping cost'
      };
    }
  },
  
  /**
   * Validate a Nigerian state name
   */
  isValidNigerianState(state) {
    return NIGERIAN_STATES.includes(state);
  },
  
  /**
   * Get list of all Nigerian states
   */
  getNigerianStates() {
    return [...NIGERIAN_STATES];
  }
};

export default shippingService;