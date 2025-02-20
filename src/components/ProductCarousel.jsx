import { useState } from "react";
import PropTypes from "prop-types";

const ProductCarousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="flex">
      {/* Thumbnails */}
      <div className="flex flex-col space-y-4 mr-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`w-20 h-20 object-cover cursor-pointer border ${
              index === currentImageIndex ? "border-black" : "border-gray-300"
            }`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>

      {/* Main Image Section */}
      <div className="relative">
        <img
          src={images[currentImageIndex]}
          alt={`Main Image ${currentImageIndex + 1}`}
          className="w-[500px] h-[500px] object-cover"
        />

        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2  bg-opacity-50 text-white px-2 py-1 rounded-full"
          onClick={handlePrev}
        >
          ←
        </button>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-opacity-50 text-white px-2 py-1 rounded-full"
          onClick={handleNext}
        >
          →
        </button>
      </div>
    </div>
  );
};


ProductCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProductCarousel;
