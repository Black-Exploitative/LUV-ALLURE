import { useState } from "react";
import ProductCard from "./ProductCard"; 

const products = [
  
  {
    name: "Formal Dress",
    price: 99.99,
    sizes: ["S", "M", "L"],
    images: ["/images/dress1.jpg", "/images/dress2.jpg"],
  },
  {
    name: "Evening Gown",
    price: 149.99,
    sizes: ["M", "L", "XL"],
    images: ["/images/dress3.jpg", "/images/dress4.jpg"],
  },
  
];

const ProductGrid = () => {
  const [gridType, setGridType] = useState(4); 

  const handleGridChange = (type) => {
    setGridType(type);
  };

  return (
    <div className={`grid grid-cols-${gridType} gap-6 p-6`}>
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
