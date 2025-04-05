import PropTypes from "prop-types";

const SmallProductCard = ({ image, name, color, price, onViewProduct }) => {
  return (
    <div className="flex flex-row items-center justify-center">
      {/* Image */}
      <div className="flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-[140px] h-[200px] object-cover"
        />
      </div>

      {/* Product Info */}
      
        <div className="flex flex-col ml-[50px] mr-[170px] space-y-[15px]">
          {/* Product Name */}
          <h2 className="text-[12px] text-gray-900 uppercase ">{name}</h2>

          {/* Product Color */}
          <p className="text-[10px] text-gray-600 uppercase">{color}</p>

          {/* Product Price */}
          <p className="text-[10px] text-gray-600">{price}</p>
        </div>
        {/* View Product Button */}
        
 
      <button
          onClick={onViewProduct}
          className="uppercase border border-gray-500 text-gray-500 text-[12px] w-[154px] h-[50px] cursor-pointer"
        >
          VIEW PRODUCT
        </button>
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
