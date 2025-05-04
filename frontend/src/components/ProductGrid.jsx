import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../services/api";
import ProductCard from "./ProductCard";
import ProductSkeletonLoader from "./ProductSkeletonLoader";

const ProductGrid = ({ gridType, filters, collectionHandle }) => {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load products with filters applied
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Prepare filter parameters for API call
        const apiParams = {
          collection: collectionHandle,
          category: filters?.category?.[0] || undefined,
          color: filters?.colour?.[0] || undefined,
          size: filters?.size?.[0] || undefined,
          sort: filters?.sort || undefined,
          price: filters?.price?.join('-') || undefined
        };
        
        console.log("Fetching products with filters:", apiParams);
        
        // Call API with filter parameters
        const data = await fetchProducts(apiParams);
        
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
  }, [filters, collectionHandle]);

  // Updated to only pass productId to handle navigation
  const handleProductClick = (productId, productSlug) => {
    navigate(`/product/${productSlug}_${productId}`);
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
        originalId: product.id, // Store the original product ID for navigation
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
    return (
      <div className="text-red-500 text-center py-8">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 underline text-blue-500"
        >
          Try again
        </button>
      </div>
    );
  }

  // No products found after applying filters
  if (!loading && groupedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-thin tracking-wider mb-4">No Products Found</h2>
        <p className="text-gray-600 max-w-lg text-center mb-8">
          We couldn't find any products matching your filters. Try adjusting your search criteria or browse our other collections.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          View All Products
        </button>
      </div>
    );
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
                  id: product.originalId, // Use the original product ID for API fetching
                  name: product.displayName || product.title,
                  price: product.priceValue,
                  sizes: product.sizes,
                  images: product.images,
                  color: product.color,
                  description: product.description
                }}
                gridType={gridType}
                onProductClick={handleProductClick}
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
  filters: PropTypes.object,
  collectionHandle: PropTypes.string
};

ProductGrid.defaultProps = {
  filters: {},
  collectionHandle: null
};

export default ProductGrid;