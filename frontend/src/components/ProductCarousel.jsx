import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProductCarousel = ({ images }) => {
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [secondaryImageIndex, setSecondaryImageIndex] = useState(1);
  
  
  const extendedImages = images.length < 6 
    ? [...images, ...images, ...images].slice(0, Math.max(6, images.length))
    : images;

 
  useEffect(() => {
    
    if (extendedImages.length === 1) {
      setSecondaryImageIndex(0);
    } 
   
    else if (secondaryImageIndex >= extendedImages.length || secondaryImageIndex === primaryImageIndex) {
      setSecondaryImageIndex((primaryImageIndex + 1) % extendedImages.length);
    }
  }, [extendedImages.length, primaryImageIndex, secondaryImageIndex]);

  const handleThumbnailClick = (index) => {
    setPrimaryImageIndex(index);
    
    // Update secondary image to be the next one after the clicked one
    if (extendedImages.length > 1) {
      setSecondaryImageIndex((index + 1) % extendedImages.length);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Main Images Section - Two side by side */}
      <div className="flex flex-col md:flex-row mb-4">
        {/* Primary Image */}
        <div className="w-full md:w-1/2 mb-2 md:mb-0">
          <img
            src={extendedImages[primaryImageIndex]}
            alt={`Main Image ${primaryImageIndex + 1}`}
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>

        {/* Secondary Image */}
        <div className="w-full md:w-1/2">
          <img
            src={extendedImages[secondaryImageIndex]}
            alt={`Secondary Image ${secondaryImageIndex + 1}`}
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>
      </div>

      {/* Thumbnails at the bottom */}
      <div className="flex mt-4 gap-2 overflow-x-auto justify-center">
        {extendedImages.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`w-20 h-20 object-cover cursor-pointer border-2 flex-shrink-0 ${
              index === primaryImageIndex || index === secondaryImageIndex
                ? "border-black" 
                : "border-gray-300"
            }`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

ProductCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProductCarousel;