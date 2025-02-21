import PropTypes from "prop-types";

const PurchasedCard = ({ product }) => {
  const { name, price, color, images } = product;


 
  return (
    <div className={"p-4 relative group"}>
      {/* Image Section */}
      <div className="relative">
        <img
          src={images}
          alt={name}
          className="w-full ${imageHeightClass} object-cover"
        />
      </div>
      {/* Product Details */}
      <h3 className="text-lg font-semibold text-gray-900 mt-4">{name}</h3>
      <p className="text-gray-700 text-md mt-2">{color}</p>
      <p className="text-gray-700 text-lg mt-2">&#8358;{price}</p>
      {/* <div className="flex mt-4">
        {sizes.map((size) => (
          <div
            key={size}
            className="px-2 py-1 border border-gray-300 mr-2 mb-2 cursor-pointer hover:bg-gray-200"
          >
            {size}
          </div>
        ))}
      </div> */}
    </div>
  );
};

PurchasedCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    images: PropTypes.string.isRequired,
  }).isRequired,
};

export default PurchasedCard;
