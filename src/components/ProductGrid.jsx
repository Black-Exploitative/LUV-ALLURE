import ProductCard from "./ProductCard";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom"; 


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
    const navigate = useNavigate();

    const handleProductClick = (product) => {
      navigate(`/product/${product.id}`, { state: { product } });
    };

  return (
    <div
      className={`grid gap-6 p-6 ${
        gridType === 2 ? "grid-cols-2" : "grid-cols-4"
      }`}
    >
        {products.map((product) => (
        <div key={product.id} onClick={() => handleProductClick(product)}>
          <ProductCard product={product} gridType={gridType} />
        </div>
      ))}

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
