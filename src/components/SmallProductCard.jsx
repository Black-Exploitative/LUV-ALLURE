import PropTypes from "prop-types";

const SmallProductCard = ({ image, name, color, onViewProduct }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-[130px] h-[200px] object-cover rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-center ml-4 flex-grow">
        {/* Product Name */}
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>

        {/* Product Color */}
        <p className="text-sm text-gray-600">Color: {color}</p>
      </div>

      {/* View Product Button */}
      <button
        onClick={onViewProduct}
        className="ml-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        View Product
      </button>
    </div>
  );
};

SmallProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onViewProduct: PropTypes.func.isRequired,
};

export default SmallProductCard;
