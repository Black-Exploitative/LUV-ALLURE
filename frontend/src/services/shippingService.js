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
  country: "Nigeria",
  // Added approximate coordinates for distance calculations
  coordinates: {
    latitude: 6.4358,
    longitude: 3.4796
  }
};

// Lagos area locations with approximate coordinates for distance estimation
const LAGOS_LOCATIONS = {
  'Lekki': { latitude: 6.4698, longitude: 3.5852 },
  'Ikoyi': { latitude: 6.4541, longitude: 3.4358 },
  'Victoria Island': { latitude: 6.4281, longitude: 3.4219 },
  'Ajah': { latitude: 6.4698, longitude: 3.5652 },
  'Ikeja': { latitude: 6.6018, longitude: 3.3515 },
  'Surulere': { latitude: 6.5059, longitude: 3.3509 },
  'Yaba': { latitude: 6.5105, longitude: 3.3726 },
  'Gbagada': { latitude: 6.5555, longitude: 3.3887 },
  'Magodo': { latitude: 6.6174, longitude: 3.3819 },
  'Ojodu': { latitude: 6.6372, longitude: 3.3705 },
  'Ikorodu': { latitude: 6.6194, longitude: 3.5105 },
  'Epe': { latitude: 6.5944, longitude: 3.9792 },
  'Badagry': { latitude: 6.4149, longitude: 2.8819 },
  'Apapa': { latitude: 6.4553, longitude: 3.3641 },
  'Oshodi': { latitude: 6.5355, longitude: 3.3087 }
};

// Weight estimation for products (in kg)
const PRODUCT_WEIGHTS = {
  default: 0.5, // Default weight per item
  dress: 0.5,
  jacket: 0.8,
  coat: 1.0,
  accessories: 0.2
};

// State-based shipping rates (in Naira)
const STATE_SHIPPING_RATES = {
  // Confirmed prices from the data
  'Delta': 8722,
  'Anambra': 8722,
  'Edo': 8722,
  'Oyo': 8722,
  'Abia': 9512,
  'Adamawa': 9512,
  'Akwa Ibom': 9512,
  'Bauchi': 9698,
  'Bayelsa': 9698,
  'Benue': 9698,
  'Nasarawa': 9698,
  'Borno': 11110,
  
  // Estimated prices based on proximity and region
  // South West (similar to Oyo)
  'Ogun': 8722,
  'Osun': 8722,
  'Ondo': 8722,
  'Ekiti': 8722,
  
  // South East (similar to Anambra/Abia)
  'Ebonyi': 9512,
  'Enugu': 9512,
  'Imo': 9512,
  
  // South South (similar to Delta/Edo or Akwa Ibom/Bayelsa)
  'Cross River': 9512,
  'Rivers': 9512,
  
  // North Central (similar to Benue/Nasarawa)
  'FCT': 9698,
  'Kogi': 9698,
  'Kwara': 9698,
  'Niger': 9698,
  'Plateau': 9698,
  
  // North East (similar to Adamawa/Bauchi or Borno)
  'Gombe': 9698,
  'Taraba': 9698,
  'Yobe': 11110,
  
  // North West (estimated based on distance)
  'Jigawa': 10200,
  'Kaduna': 9698,
  'Kano': 10200,
  'Katsina': 10200,
  'Kebbi': 10200,
  'Sokoto': 10700,
  'Zamfara': 10200
};

// Zones grouping states (used as fallback if state is not in rates table)
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
            latitude: STORE_ADDRESS.coordinates.latitude,
            longitude: STORE_ADDRESS.coordinates.longitude
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
   * Calculate approximate distance between two coordinates using Haversine formula
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in kilometers
    return distance;
  },
  
  /**
   * Estimate distance for a Lagos address
   */
  estimateDistanceInLagos(city, address) {
    // Start with an estimated distance based on city/area
    let estimatedDistance = 15; // Default distance in km
    
    // Check if we can get a closer estimate based on known locations
    const cityLower = city.toLowerCase();
    const addressLower = address.toLowerCase();
    
    // Try to find matching Lagos location
    for (const [location, coords] of Object.entries(LAGOS_LOCATIONS)) {
      if (cityLower.includes(location.toLowerCase()) || addressLower.includes(location.toLowerCase())) {
        estimatedDistance = this.calculateDistance(
          STORE_ADDRESS.coordinates.latitude,
          STORE_ADDRESS.coordinates.longitude,
          coords.latitude,
          coords.longitude
        );
        break;
      }
    }
    
    // Look for specific locations in address
    if (addressLower.includes('admiralty way') || addressLower.includes('admiralty')) {
      return 17; // Based on provided data
    } else if (addressLower.includes('ojodu berger') || addressLower.includes('berger')) {
      return 50; // Based on provided data
    } else if (addressLower.includes('magodo') || addressLower.includes('gra phase 1')) {
      return 34; // Based on provided data
    }
    
    // Apply some adjustments based on areas we know
    if (cityLower.includes('lekki') || addressLower.includes('lekki')) {
      // Since our store is in Lekki, distances will be shorter
      estimatedDistance = Math.min(estimatedDistance, 20);
    } else if (cityLower.includes('ikeja') || addressLower.includes('ikeja')) {
      estimatedDistance = Math.max(estimatedDistance, 30);
    } else if (cityLower.includes('ikorodu') || addressLower.includes('ikorodu')) {
      estimatedDistance = Math.max(estimatedDistance, 40);
    }
    
    return Math.round(estimatedDistance);
  },
  
  /**
   * Calculate shipping cost based on distance for Lagos deliveries
   */
  calculateLagosShippingByDistance(distance, weight) {
    // New distance-based pricing model based on the provided data points
    // Base fee + distance rate + weight factor
    
    let baseFee = 1500; // Base fee in Naira
    let distanceRate = 0;
    let weightFactor = weight * 100; // 100 Naira per kg
    
    // Calculate distance rate with tiered pricing
    if (distance <= 15) {
      // Short distance
      distanceRate = distance * 30; // 30 Naira per km
    } else if (distance <= 25) {
      // Medium distance
      distanceRate = 15 * 30 + (distance - 15) * 60; // 60 Naira per km after 15km
    } else if (distance <= 40) {
      // Longer distance
      distanceRate = 15 * 30 + 10 * 60 + (distance - 25) * 180; // 180 Naira per km after 25km
    } else {
      // Very long distance within Lagos
      distanceRate = 15 * 30 + 10 * 60 + 15 * 180 + (distance - 40) * 100; // 100 Naira per km after 40km
    }
    
    // Total shipping cost
    const totalCost = baseFee + distanceRate + weightFactor;
    
    // Round to nearest 10 Naira
    return Math.ceil(totalCost / 10) * 10;
  },
  
  /**
   * Fallback shipping calculation in case API calls fail
   */
  calculateFallbackShipping(orderData, shippingAddress, provider = 'GIGL') {
    const totalWeight = this.calculateTotalWeight(orderData.items);
    const destinationState = shippingAddress.state;
    const isSameState = destinationState === STORE_ADDRESS.state;
    const isLagos = destinationState === 'Lagos';
    
    // For Lagos deliveries, use the new distance-based calculation
    if (isLagos) {
      // Estimate distance based on address
      const estimatedDistance = this.estimateDistanceInLagos(
        shippingAddress.city,
        shippingAddress.address
      );
      
      // Calculate shipping cost based on distance and weight
      const shippingCost = this.calculateLagosShippingByDistance(estimatedDistance, totalWeight);
      
      return {
        success: true,
        provider: provider === 'GIGL' ? 'GIGL' : 'Bolt',
        cost: shippingCost,
        estimatedDeliveryDays: estimatedDistance > 30 ? '2-3' : '1-2',
        weight: totalWeight,
        distance: estimatedDistance,
        isEstimate: true
      };
    }
    
    // For non-Lagos deliveries, use the fixed state-based rates
    let baseShippingCost = 0;
    
    // Check if we have a fixed rate for this state
    if (STATE_SHIPPING_RATES[destinationState]) {
      baseShippingCost = STATE_SHIPPING_RATES[destinationState];
    } else {
      // Fallback to zone-based estimation if state not found in rates table
      const storeZone = this.getZone(STORE_ADDRESS.state);
      const destinationZone = this.getZone(destinationState);
      
      if (storeZone === destinationZone) {
        baseShippingCost = 8722; // Same zone as Lagos (Southwest)
      } else if (destinationZone === 'southeast' || destinationZone === 'southsouth') {
        baseShippingCost = 9512; // Southern states
      } else if (destinationZone === 'northcentral') {
        baseShippingCost = 9698; // North Central
      } else {
        baseShippingCost = 10700; // Far North
      }
    }
    
    // Add weight surcharge for heavier packages
    let weightSurcharge = 0;
    if (totalWeight > 1) {
      weightSurcharge = Math.ceil(totalWeight - 1) * 500; // ₦500 per kg over 1kg
    }
    
    // Calculate total shipping cost
    const shippingCost = baseShippingCost + weightSurcharge;
    
    // Calculate estimated delivery days based on region
    let estimatedDeliveryDays = '3-5';
    
    if (this.getZone(destinationState) === 'southwest') {
      estimatedDeliveryDays = '2-3';
    } else if (this.getZone(destinationState) === 'southeast' || this.getZone(destinationState) === 'southsouth') {
      estimatedDeliveryDays = '3-4';
    } else if (this.getZone(destinationState) === 'northcentral') {
      estimatedDeliveryDays = '3-5';
    } else {
      estimatedDeliveryDays = '4-7'; // Far northern states
    }
    
    return {
      success: true,
      provider: 'GIGL', // GIGL is used for interstate shipping
      cost: Math.round(shippingCost),
      estimatedDeliveryDays: estimatedDeliveryDays,
      weight: totalWeight,
      isEstimate: true
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