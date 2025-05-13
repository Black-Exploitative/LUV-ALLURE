// frontend/src/components/ShippingForm.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import shippingService from '../services/shippingService';

const ShippingForm = ({ onSubmit, isLoading, initialData }) => {
  const { currentUser } = useAuth();
  const { cartItems, getCartTotals } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    phone: '',
    email: '',
    saveInfo: true
  });
  
  const [errors, setErrors] = useState({});
  const [nigerianStates, setNigerianStates] = useState([]);
  const [estimatedShipping, setEstimatedShipping] = useState(null);
  const [isEstimating, setIsEstimating] = useState(false);
  
  // Initialize form with user data or initial data
  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    } else if (currentUser) {
      setFormData(prevData => ({
        ...prevData,
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || ''
      }));
    }
    
    // Get Nigerian states
    setNigerianStates(shippingService.getNigerianStates());
  }, [currentUser, initialData]);
  
  // Function to get shipping estimate when state changes
  useEffect(() => {
    const getShippingEstimate = async () => {
      // Only estimate if we have enough information
      if (formData.state && formData.city) {
        setIsEstimating(true);
        try {
          const { subtotal } = getCartTotals();
          
          // Prepare minimal address for shipping estimate
          const shippingAddress = {
            state: formData.state,
            city: formData.city,
            address: formData.address || "Unknown",
            country: "Nigeria"
          };
          
          // Get shipping estimate
          const estimate = await shippingService.getShippingEstimate(
            { items: cartItems, subtotal }, 
            shippingAddress
          );
          
          if (estimate.success) {
            setEstimatedShipping(estimate);
          } else {
            setEstimatedShipping(null);
          }
        } catch (error) {
          console.error('Error estimating shipping:', error);
          setEstimatedShipping(null);
        } finally {
          setIsEstimating(false);
        }
      } else {
        setEstimatedShipping(null);
      }
    };
    
    getShippingEstimate();
  }, [formData.state, formData.city, cartItems, getCartTotals]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user makes changes
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'phone', 'email'];
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (Nigerian format)
    if (formData.phone) {
      // Remove any non-digit characters for validation
      const digitsOnly = formData.phone.replace(/\D/g, '');
      
      // Check for Nigerian number formats (should be 10-11 digits)
      if (!(digitsOnly.length >= 10 && digitsOnly.length <= 15)) {
        newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
      }
    }
    
    // Nigerian state validation
    if (formData.country === 'Nigeria' && formData.state) {
      if (!shippingService.isValidNigerianState(formData.state)) {
        newErrors.state = 'Please select a valid Nigerian state';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  // Calculate shipping provider display name
  const getProviderDisplayName = (provider) => {
    if (!provider) return '';
    
    switch (provider.toUpperCase()) {
      case 'GIGL':
        return 'GIGL Express';
      case 'BOLT':
        return 'Bolt Delivery';
      default:
        return provider;
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-medium mb-6">Shipping Information</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-black`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-black`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        {/* Email Address */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-black`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        
        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address or P.O. Box"
            className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-black`}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>
        
        {/* Apartment, suite, etc. */}
        <div className="mb-4">
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, suite, etc. (optional)
          </label>
          <input
            type="text"
            id="apartment"
            name="apartment"
            value={formData.apartment}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-black`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>
          
          {/* State/Province */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-black`}
            >
              <option value="">Select a state</option>
              {nigerianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Zip/Postal Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code (optional)
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          
          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black"
              disabled  // Currently only shipping to Nigeria
            >
              <option value="Nigeria">Nigeria</option>
            </select>
          </div>
        </div>
        
        {/* Phone */}
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="For delivery questions"
            className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-1 focus:ring-black`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
        
        {/* Shipping estimate display */}
        {formData.state && formData.city && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h4 className="font-medium mb-2">Estimated Shipping</h4>
            
            {isEstimating ? (
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></span>
                <p className="text-sm text-gray-600">Calculating shipping...</p>
              </div>
            ) : estimatedShipping ? (
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">{getProviderDisplayName(estimatedShipping.provider)}</p>
                  <p className="text-sm font-medium">₦{estimatedShipping.cost.toLocaleString()}</p>
                </div>
                <p className="text-xs text-gray-600">
                  Estimated delivery: {estimatedShipping.estimatedDeliveryDays} business days
                  {estimatedShipping.isEstimate && ' (estimate)'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Unable to estimate shipping at this time. Final cost will be calculated at checkout.
              </p>
            )}
          </div>
        )}
        
        {/* Save info checkbox */}
        <div className="mb-8">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleChange}
              className="mr-2 h-4 w-4 accent-black"
            />
            <span className="text-sm text-gray-700">Save this information for next time</span>
          </label>
        </div>
        
        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-black text-white text-sm uppercase md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Continue to Packaging'
          )}
        </motion.button>
      </form>
    </div>
  );
};

ShippingForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  initialData: PropTypes.object
};

ShippingForm.defaultProps = {
  isLoading: false,
  initialData: null
};

export default ShippingForm;