import { useState } from "react";
import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCard = ({ product, gridType }) => {
  const { name, price, sizes = [], images } = product;
  const [currentImage, setCurrentImage] = useState(0);

  const cardWidthClass = gridType === 2 ? "w-[655px]" : "w-full";
   // eslint-disable-next-line no-unused-vars
  const imageHeightClass = gridType === 2 ? "h-[751px]" : "h-[500px]";
  // DEBUG:Figure the error being caused header, not now


  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  return (
    <div className={`${cardWidthClass} p-4 relative group`}>
      {/* Image Section */}
      <div className="relative">
        <img
          src={images[currentImage]}
          alt={name}
          className="w-full ${imageHeightClass} object-cover"
        />
        {/* Left Arrow */}
        <div
          className="absolute left-2 top-1/2 transform -translate-y-1/2  bg-opacity-50 p-2 rounded-full cursor-pointer"
          onClick={handlePrev}
        >
          <FaChevronLeft className="text-white text-xl" />
        </div>
        {/* Right Arrow */}
        <div
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-opacity-50 p-2 rounded-full cursor-pointer"
          onClick={handleNext}
        >
          <FaChevronRight className="text-white text-xl" />
        </div>
      </div>
      {/* Product Details */}
      <h3 className="text-lg font-semibold text-gray-900 mt-4">{name}</h3>
      <p className="text-gray-700 text-lg mt-2">&#8358;{price}</p>
      <div className="flex mt-4">
        {sizes.map((size) => (
          <div
            key={size}
            className="px-2 py-1 border border-gray-300 mr-2 mb-2 cursor-pointer hover:bg-gray-200"
          >
            {size}
          </div>
        ))}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    sizes: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  gridType: PropTypes.oneOf([2, 4]).isRequired,
};

export default ProductCard;
