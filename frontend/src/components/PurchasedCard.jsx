import PropTypes from "prop-types";

const PurchasedCard = ({ product }) => {
  const { name, price, color, images } = product;

  return (
    <div className={"relative group"}>
      {/* Image Section */}
      <div className="relative">
        <img
          src={images}
          alt={name}
          className="w-full h-[630px] object-cover"
        />
      </div>
      {/* Product Details */}
      <h3 className="text-[12px] text-gray-900 mt-4">{name} - {color}</h3>
      <p className="text-gray-700 text-[12px] mt-2">&#8358;{price}</p>
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
