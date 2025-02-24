import { useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 1,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/shop1.jpg", "/images/photo6.jpg", "/images/photo4.jpg"],
  },
  {
    id: 2,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/shop2.jpg", "/images/photo4.jpg"],
  },
  {
    id: 3,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo4.jpg"],
  },
  {
    id: 4,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/shop4.jpg", "/images/photo4.jpg"]
  },
  {
    id: 5,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo11.jpg", "/images/photo6.jpg"],
  },
  {
    id: 6,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo4.jpg", "/images/photo6.jpg"],
  },
  {
    id: 7,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo5.jpg", "/images/photo4.jpg"],
  },
  {
    id: 8,
    name: "AUBERGINE ALLURE ROMP SKIRT - BIEGE",
    price: 74000,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: ["/images/photo6.jpg", "/images/photo4.jpg", "/images/photo4.jpg"],
  },
];

const ProductGrid = ({ gridType }) => {
  const navigate = useNavigate();
  const gridRef = useRef(null);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Staggered animation for products
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      ref={gridRef}
      className={`grid gap-6 p-6 ${
        gridType === 2 
          ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2" 
          : "grid-cols-2 sm:grid-cols-2 md:grid-cols-4"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          gridType={gridType}
          onProductClick={() => handleProductClick(product)}
        />
      ))}
    </motion.div>
  );
};

ProductGrid.propTypes = {
  gridType: PropTypes.oneOf([2, 4]).isRequired,
};

export default ProductGrid;