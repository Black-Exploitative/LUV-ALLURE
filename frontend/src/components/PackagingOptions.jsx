import { useState } from 'react';
import PropTypes from 'prop-types';

const PackagingOptions = ({ selectedOption, onSelectPackaging }) => {
  const [showDetails, setShowDetails] = useState(null);

  const packagingOptions = [
    {
      id: 'normal',
      name: 'Standard Packaging',
      price: 0,
      description: 'Our standard protective packaging ensures your items arrive in perfect condition.',
      image: '/images/packaging/standard-packaging.jpg',
      features: [
        'Protective dust bag for each item',
        'Tissue paper wrapping',
        'Branded box',
        'Quality assurance tag'
      ]
    },
    {
      id: 'luxe',
      name: 'Luxe Packaging',
      price: 5000,
      description: 'Elevate your unboxing experience with our premium packaging option.',
      image: '/images/packaging/luxe-packaging.jpg',
      features: [
        'Premium velvet dust bag',
        'Satin ribbon wrapping',
        'Elegant black gift box with gold embossing',
        'Scented tissue paper',
        'Thank you card'
      ]
    },
    {
      id: 'gift',
      name: 'Gift Packaging',
      price: 10000,
      description: 'The ultimate gift experience with personalized touches for that special someone.',
      image: '/images/packaging/gift-packaging.jpg',
      features: [
        'Everything in Luxe Packaging',
        'Personalized handwritten letter',
        'Preserved rose',
        'Premium gift wrapping',
        'Choice of occasion card',
        'Exclusive gift bag'
      ]
    }
  ];

  // Handle selecting a packaging option
  const handleSelectOption = (optionId) => {
    const option = packagingOptions.find(opt => opt.id === optionId);
    onSelectPackaging(option);
  };

  // Toggle showing details for an option
  const toggleDetails = (optionId) => {
    setShowDetails(showDetails === optionId ? null : optionId);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Select Packaging Option</h3>
      
      <div className="space-y-4">
        {packagingOptions.map((option) => (
          <div key={option.id} className="border rounded-md overflow-hidden">
            <div 
              className={`flex cursor-pointer ${
                selectedOption?.id === option.id ? 'bg-gray-50 border-black' : 'bg-white'
              }`}
              onClick={() => handleSelectOption(option.id)}
            >
              {/* Image */}
              <div className="w-20 h-20 flex-shrink-0 bg-gray-100">
                <img 
                  src={option.image} 
                  alt={option.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
              
              {/* Option details */}
              <div className="flex-1 px-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{option.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{option.price === 0 ? 'Free' : `₦${option.price.toLocaleString()}`}</p>
                  </div>
                  
                  {/* Radio button */}
                  <div className="ml-4 mt-1 flex items-center h-5">
                    <input
                      type="radio"
                      name="packaging-option"
                      checked={selectedOption?.id === option.id}
                      onChange={() => handleSelectOption(option.id)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                  </div>
                </div>
                
                {/* View details toggle */}
                <button 
                  type="button" 
                  className="text-xs text-gray-600 mt-1 underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDetails(option.id);
                  }}
                >
                  {showDetails === option.id ? 'Hide details' : 'View details'}
                </button>
              </div>
            </div>
            
            {/* Expanded details */}
            {showDetails === option.id && (
              <div className="px-4 py-3 bg-gray-50 text-sm">
                <p className="text-gray-700 mb-2">{option.description}</p>
                <h5 className="font-medium text-xs mb-1">Includes:</h5>
                <ul className="list-disc pl-5 text-xs text-gray-600 space-y-1">
                  {option.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                
                {/* Larger image view */}
                <div className="mt-3">
                  <img 
                    src={option.image} 
                    alt={option.name} 
                    className="w-full max-h-40 object-contain"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

PackagingOptions.propTypes = {
  selectedOption: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }),
  onSelectPackaging: PropTypes.func.isRequired,
};

export default PackagingOptions;