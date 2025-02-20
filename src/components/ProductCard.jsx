import { useState } from "react";
import PropTypes from "prop-types";


const ProductCard = ({ product }) => {
  const { name, price, sizes, images } = product;
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div className="w-72 p-4 bg-white shadow-lg rounded-lg relative group">
      {/* Image Section */}
      <div className="relative">
        <img
          src={images[currentImage]}
          alt={name}
          className="w-full h-64 object-cover rounded-t-lg"
        />

        {/* Hover arrow for next image */}
        <div
          className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() =>
            setCurrentImage((prev) => (prev + 1) % images.length)
          }
        >
          <span className="text-white text-2xl font-bold">→</span>
        </div>
      </div>

      {/* Product Name */}
      <h3 className="text-lg font-semibold text-gray-900 mt-4">{name}</h3>

      {/* Price */}
      <p className="text-gray-700 text-lg mt-2">${price}</p>

      {/* Size Options */}
      <div className="flex flex-wrap mt-4">
        {sizes.map((size) => (
          <div
            key={size}
            className="px-2 py-1 border border-gray-300 rounded mr-2 mb-2 cursor-pointer hover:bg-gray-200"
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
      sizes: PropTypes.arrayOf(PropTypes.string).isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  };

export default ProductCard;
