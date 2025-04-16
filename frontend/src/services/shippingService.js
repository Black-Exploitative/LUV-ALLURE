// services/shippingService.js - API services for GIGL and Bolt shipping calculations
import axios from 'axios';
import api from './api';

// Nigerian states data
const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo', 
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

// Store's state (where the business is located)
const STORE_STATE = 'Lagos';

// Weight estimation for products (in kg) - you can expand this or make it dynamic
const PRODUCT_WEIGHTS = {
  default: 0.5, // Default weight per item
  dress: 0.5,
  jacket: 0.8,
  coat: 1.0,
  accessories: 0.2
};

// Base rates for different shipping zones (simplified)
const SHIPPING_RATES = {
  // Within the same state
  sameState: {
    base: 2500, // Base rate in Naira
    perKg: 500   // Additional cost per kg
  },
  // Within the same zone
  sameZone: {
    base: 3500,
    perKg: 700
  },
  // Cross-zone shipping
  crossZone: {
    base: 4500,
    perKg: 900
  }
};

// Zones grouping states (simplified)
const ZONES = {
  southwest: ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'],
  southeast: ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'],
  southsouth: ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'],
  northcentral: ['Benue', 'FCT', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau'],
  northeast: ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'],
  northwest: ['Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Sokoto', 'Zamfara']
};

// Helper function to find which zone a state belongs to
const getZone = (state) => {
  for (const [zone, states] of Object.entries(ZONES)) {
    if (states.includes(state)) {
      return zone;
    }
  }
  return null;
};

const shippingService = {
  /**
   * Calculate shipping cost using GIGL API (for out-of-state deliveries)
   * 
   * Note: This is a mock implementation. In a real scenario, you would integrate 
   * with GIGL's actual API endpoints.
   */
  async calculateGIGLShipping(orderData, shippingAddress) {
    try {
      // In a real implementation, you would make an API call to GIGL here
      // For now, we'll simulate the API response with our own calculation
      
      // 1. Calculate total weight based on items
      let totalWeight = orderData.items.reduce((weight, item) => {
        const itemType = item.category || 'default';
        const itemWeight = PRODUCT_WEIGHTS[itemType] || PRODUCT_WEIGHTS.default;
        return weight + (itemWeight * (item.quantity || 1));
      }, 0);
      
      // Ensure minimum weight
      totalWeight = Math.max(totalWeight, 0.5);
      
      // 2. Determine shipping zone
      const destinationState = shippingAddress.state;
      const destinationZone = getZone(destinationState);
      const originZone = getZone(STORE_STATE);
      
      let rate;
      if (destinationState === STORE_STATE) {
        rate = SHIPPING_RATES.sameState;
      } else if (destinationZone === originZone) {
        rate = SHIPPING_RATES.sameZone;
      } else {
        rate = SHIPPING_RATES.crossZone;
      }
      
      // 3. Calculate shipping cost
      const shippingCost = rate.base + (totalWeight * rate.perKg);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return calculated shipping cost
      return {
        success: true,
        provider: 'GIGL',
        cost: Math.round(shippingCost),
        estimatedDeliveryDays: destinationState === STORE_STATE ? '1-2' : '2-5',
        weight: totalWeight
      };
    } catch (error) {
      console.error('Error calculating GIGL shipping:', error);
      throw new Error('Failed to calculate shipping via GIGL');
    }
  },
  
  /**
   * Calculate shipping cost using Bolt API (for in-state deliveries)
   * 
   * Note: This is a mock implementation. In a real scenario, you would integrate 
   * with Bolt's actual API endpoints.
   */
  async calculateBoltShipping(orderData, shippingAddress) {
    try {
      // In a real implementation, you would make an API call to Bolt here
      
      // For now, we'll use a simplified calculation for Bolt
      // Bolt typically charges based on distance and weight

      // 1. Calculate total weight
      let totalWeight = orderData.items.reduce((weight, item) => {
        const itemType = item.category || 'default';
        const itemWeight = PRODUCT_WEIGHTS[itemType] || PRODUCT_WEIGHTS.default;
        return weight + (itemWeight * (item.quantity || 1));
      }, 0);
      
      // Ensure minimum weight
      totalWeight = Math.max(totalWeight, 0.5);
      
      // 2. Calculate base cost (Bolt is primarily for in-state deliveries)
      let baseCost = 2000; // Base cost for Bolt delivery
      
      // Add weight factor
      const weightCost = totalWeight * 400;
      
      // Add distance factor (simplified - would use actual distance in real API)
      const distanceCost = 500; // Fixed distance cost for demo purposes
      
      const shippingCost = baseCost + weightCost + distanceCost;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return calculated shipping cost
      return {
        success: true,
        provider: 'Bolt',
        cost: Math.round(shippingCost),
        estimatedDeliveryDays: '1-2',
        weight: totalWeight
      };
    } catch (error) {
      console.error('Error calculating Bolt shipping:', error);
      throw new Error('Failed to calculate shipping via Bolt');
    }
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
      // Use Bolt for same-state deliveries, GIGL for out-of-state
      const isSameState = shippingAddress.state === STORE_STATE;
      
      if (isSameState) {
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