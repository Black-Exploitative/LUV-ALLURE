import ProductCard from "./ProductCard";
import PropTypes from "prop-types";

const products = [
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo4.jpg", "/images/photo6.jpg", "/images/photo4.jpg"],
  },
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo4.jpg"],
  },
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo4.jpg"],
  },
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo4.jpg"]
  },
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo6.jpg"],
  },
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo6.jpg"],
  },
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo4.jpg"],
  },
  {
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo4.jpg", "/images/photo4.jpg"],
  },
];

const ProductGrid = ({ gridType }) => {
  return (
    <div
      className={`grid gap-6 p-6 ${
        gridType === 2 ? "grid-cols-2" : "grid-cols-4"
      }`}
    >
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

ProductGrid.propTypes = {
  gridType: PropTypes.oneOf([2, 4]).isRequired,
};
export default ProductGrid;
