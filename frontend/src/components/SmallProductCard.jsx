import PropTypes from "prop-types";

const SmallProductCard = ({ image, name, color, price, onViewProduct }) => {
  return (
    <div className="flex items-start p-4">
      {/* Image */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-[130px] h-[200px] object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="ml-4  flex flex-1 items-center">
        <div className="flex flex-col mt-18">
          {/* Product Name */}
          <h2 className="text-lg font-semibold text-gray-900">{name}</h2>

          {/* Product Color */}
          <p className="text-sm text-gray-600">{color}</p>

          {/* Product Price */}
          <p className="text-sm text-gray-600">{price}</p>
        </div>
        {/* View Product Button */}
        <button
          onClick={onViewProduct}
          className="w-fit border border-gray-500 text-black px-4 py-2 ml-4 mt-10 cursor-pointer"
        >
          View Product
        </button>
      </div>
    </div>
  );
};

SmallProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onViewProduct: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
};

export default SmallProductCard;
