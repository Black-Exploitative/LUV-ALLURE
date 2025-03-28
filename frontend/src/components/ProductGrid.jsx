import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../services/api";
import ProductCard from "./ProductCard";
import ProductSkeletonLoader from "./ProductSkeletonLoader";

const ProductGrid = ({ gridType }) => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        
        // Transform the response data to match component expectations
        if (data && data.products) {
          const transformedProducts = data.products.map(product => {
            // Parse variant options (which contain color/size combinations)
            let variants = [];
            if (product.options) {
              product.options.forEach(option => {
                // Parse "Color / Size" format
                const optionParts = option.name.split('/').map(part => part.trim());
                const color = optionParts[0] || "Default";
                const size = optionParts[1] || "One Size";
                
                variants.push({
                  id: `${product.id}-${option.name}`,
                  color,
                  size,
                  fullOption: option.name,
                  values: option.values
                });
              });
            }
            
            // Ensure we have at least one variant
            if (variants.length === 0) {
              variants = [{ color: "Default", size: "One Size", fullOption: "Default", values: ["Default"] }];
            }
            
            // Parse price as number
            const priceAmount = product.variants && product.variants[0]?.price?.amount;
            const priceValue = priceAmount ? parseFloat(priceAmount) : 0;
            
            // Handle images based on the actual structure
            let images = [];
            if (product.images && Array.isArray(product.images)) {
              // If images is a direct array
              images = product.images.map(img => img.src || img);
            } else if (product.images && product.images.edges) {
              // If images is in the edges structure
              images = product.images.edges.map(edge => edge.node.url);
            }
            
            // If no images found, use placeholder
            if (images.length === 0) {
              images = ["/images/placeholder.jpg"];
            }
            
            return {
              id: product.id,
              title: product.title,
              description: product.description,
              priceValue,
              variants,
              images
            };
          });
          setProducts(transformedProducts);
        } else {
          setError("Invalid product data structure received");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to load products.");
      } finally {
        // Simulate a minimum loading time for a better UX
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    };
    loadProducts();
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // Group products by base product and color
  const groupedProducts = [];
  
  products.forEach(product => {
    // Get unique colors from variants
    const uniqueColors = [...new Set(product.variants.map(v => v.color))];
    
    // For each color, create a product entry
    uniqueColors.forEach(color => {
      // Get all sizes for this color
      const sizesForColor = product.variants
        .filter(v => v.color === color)
        .map(v => v.size);
      
      groupedProducts.push({
        id: `${product.id}-${color}`,
        title: product.title,
        displayName: `${product.title} - ${color}`,
        description: product.description,
        color,
        priceValue: product.priceValue,
        sizes: sizesForColor,
        images: product.images,
        originalProduct: product // Keep reference to original product
      });
    });
  });

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  return (
    <div className="mx-[20px]">
      {loading ? (
        <ProductSkeletonLoader gridType={gridType} count={gridType === 2 ? 6 : 8} />
      ) : (
        <motion.div
          ref={gridRef}
          className={`
            ${gridType === 2 
              ? "grid grid-cols-1 md:grid-cols-2 gap-x-[10px] gap-y-[30px]" 
              : "grid grid-cols-2 md:grid-cols-4 gap-x-[10px] md:gap-x-[10px] gap-y-[30px]"}
          `}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {groupedProducts.map((product) => (
            <div key={product.id} className="overflow-hidden w-full">
              <ProductCard
                product={{
                  id: product.id,
                  name: product.displayName || product.title,
                  price: product.priceValue,
                  sizes: product.sizes,
                  images: product.images,
                  color: product.color,
                  description: product.description
                }}
                gridType={gridType}
                onProductClick={() => handleProductClick(product.originalProduct || product)}
              />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

ProductGrid.propTypes = {
  gridType: PropTypes.oneOf([2, 4]).isRequired,
};

export default ProductGrid;