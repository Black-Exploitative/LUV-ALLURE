import ProductCard from "./ProductCard";
import PropTypes from "prop-types";

const products = [
  { name: "Formal Dress", price: 99.99, images: ["/images/dress1.jpg"] },
  { name: "Evening Gown", price: 149.99, images: ["/images/dress2.jpg"] },
 
];

const ProductGrid = ({ gridType }) => {
  return (
    <div className={`grid grid-cols-${gridType} gap-6 p-6`}>
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

ProductGrid.propTypes = {
    gridType: PropTypes.oneOf([2,4]).isRequired,
};
export default ProductGrid;
