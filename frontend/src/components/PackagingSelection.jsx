// frontend/src/components/PackagingSelection.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import packagingOptions from '../config/packagingOptions';

const PackagingSelection = ({ selectedPackaging, onSelectPackaging, giftMessage, onGiftMessageChange }) => {
  const [expandedOption, setExpandedOption] = useState(null);

  const toggleDetails = (id) => {
    setExpandedOption(expandedOption === id ? null : id);
  };

  return (
    <div className="py-6">
      <h3 className="text-xl font-medium mb-4">Select Packaging</h3>
      <p className="text-gray-600 mb-6">Choose how you'd like your items to be packaged</p>
      
      <div className="space-y-4">
        {packagingOptions.map((option) => (
          <div 
            key={option.id}
            className={`border rounded-lg overflow-hidden ${
              selectedPackaging?.id === option.id 
                ? 'border-black' 
                : 'border-gray-200 hover:border-gray-300'
            } transition-all`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-1/3 aspect-video md:aspect-square relative overflow-hidden">
                <img 
                  src={option.imageUrl} 
                  alt={option.name} 
                  className="w-full h-full object-cover"
                />
                {option.price > 0 && (
                  <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs">
                    +₦{option.price.toLocaleString()}
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 md:p-6 md:w-2/3 flex flex-col">
                {/* Header with radio button */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id={`packaging-${option.id}`}
                      name="packaging"
                      value={option.id}
                      checked={selectedPackaging?.id === option.id}
                      onChange={() => onSelectPackaging(option)}
                      className="mr-3 accent-black h-4 w-4"
                    />
                    <label htmlFor={`packaging-${option.id}`} className="text-lg font-medium cursor-pointer">
                      {option.name}
                    </label>
                  </div>
                  
                  {option.price > 0 ? (
                    <span className="hidden md:block text-sm font-medium">+₦{option.price.toLocaleString()}</span>
                  ) : (
                    <span className="hidden md:block text-sm text-green-600 font-medium">Free</span>
                  )}
                </div>
                
                {/* Description */}
                <p className="text-gray-600 mb-2">{option.description}</p>
                
                {/* Details toggle */}
                <button
                  onClick={() => toggleDetails(option.id)}
                  className="text-gray-500 text-sm underline hover:text-black transition-colors self-start mt-2"
                >
                  {expandedOption === option.id ? 'Hide details' : 'View details'}
                </button>
                
                {/* Expanded details */}
                {expandedOption === option.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-gray-100"
                  >
                    <h4 className="text-sm font-medium mb-2">Features:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Gift message input (only for gift packaging) */}
            {option.allowsGiftMessage && selectedPackaging?.id === option.id && (
              <div className="px-6 pb-6">
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label htmlFor="gift-message" className="block text-sm font-medium mb-2">
                    Add a gift message
                  </label>
                  <textarea
                    id="gift-message"
                    rows="3"
                    placeholder="Enter your gift message here..."
                    value={giftMessage}
                    onChange={(e) => onGiftMessageChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                    maxLength="200"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    {giftMessage.length}/200 characters
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

PackagingSelection.propTypes = {
  selectedPackaging: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }),
  onSelectPackaging: PropTypes.func.isRequired,
  giftMessage: PropTypes.string.isRequired,
  onGiftMessageChange: PropTypes.func.isRequired
};

export default PackagingSelection;