// frontend/src/components/ProductGrid.jsx - Improved with consistent styling and proper data transformation
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import ProductCard from "./ProductCard";
import ProductSkeletonLoader from "./ProductSkeletonLoader";

const ProductGrid = ({ 
  gridType = 4, 
  collectionHandle = null,
  isMobile = false,
  category = null,
  color = null,
  initialFilters = {}
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const gridRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    ...initialFilters,
    category: category || initialFilters.category,
    color: color || initialFilters.color
  });
  const [sort, setSort] = useState("relevance");
  
  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine if we're on mobile if not explicitly set
  const isMobileScreen = isMobile || windowWidth < 768;
  const mobileColumns = isMobileScreen && gridType === 2 ? 1 : 2;

  // Parse query parameters when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    let hasUpdates = false;
    
    // Parse query parameters for specific filters
    const supportedFilters = ['category', 'color', 'size', 'price', 'collection'];
    
    supportedFilters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) {
        newFilters[filter] = value;
        hasUpdates = true;
      }
    });
    
    // Get sort parameter
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      setSort(sortParam);
      hasUpdates = true;
    }
    
    // Get page parameter
    const pageParam = parseInt(searchParams.get('page'));
    if (pageParam && pageParam > 0) {
      setPage(pageParam);
      hasUpdates = true;
    }
    
    // Update filters if necessary
    if (hasUpdates) {
      setFilters(newFilters);
    }
  }, [location.search]);

  // Effect for loading products based on filters and sort
  useEffect(() => {
    // Reset pagination when filters change
    if (page === 1) {
      fetchProducts();
    } else {
      // If page is not 1, reset to page 1 which will trigger a fetch
      setPage(1);
    }
  }, [filters, sort, collectionHandle]);
  
  // Effect for pagination
  useEffect(() => {
    if (page > 1) {
      fetchMoreProducts();
    }
  }, [page]);

  // Load products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build API query parameters
      const params = new URLSearchParams();
      
      // Add filters to query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          // Handle array values
          if (Array.isArray(value)) {
            value.forEach(val => params.append(key, val));
          } else {
            params.append(key, value);
          }
        }
      });
      
      // Add sort parameter
      if (sort && sort !== 'relevance') {
        params.append('sort', sort);
      }
      
      // Add limit parameter
      params.append('limit', '12');
      
      // Special handling for collection handle
      if (collectionHandle) {
        params.append('collection', collectionHandle);
      }
      
      console.log('Fetching products with params:', Object.fromEntries(params.entries()));
      
      // Make API request
      let response;
      if (collectionHandle) {
        response = await api.get(`/collections/${collectionHandle}/products?${params.toString()}`);
      } else {
        response = await api.get(`/products?${params.toString()}`);
      }
      
      if (response.data && (response.data.products || response.data.data)) {
        const fetchedProducts = response.data.products || response.data.data || [];
        setProducts(fetchedProducts);
        setCursor(response.data.pageInfo?.endCursor || null);
        setHasMore(response.data.pageInfo?.hasNextPage || false);
        
        // Process products into grouped format
        processProducts(fetchedProducts);
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
  
  // Fetch more products for pagination
  const fetchMoreProducts = async () => {
    if (!cursor || !hasMore) return;
    
    try {
      // Build API query parameters
      const params = new URLSearchParams();
      
      // Add filters to query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          // Handle array values
          if (Array.isArray(value)) {
            value.forEach(val => params.append(key, val));
          } else {
            params.append(key, value);
          }
        }
      });
      
      // Add sort parameter
      if (sort && sort !== 'relevance') {
        params.append('sort', sort);
      }
      
      // Add pagination parameters
      params.append('limit', '12');
      params.append('cursor', cursor);
      
      // Special handling for collection handle
      if (collectionHandle) {
        params.append('collection', collectionHandle);
      }
      
      // Make API request
      let response;
      if (collectionHandle) {
        response = await api.get(`/collections/${collectionHandle}/products?${params.toString()}`);
      } else {
        response = await api.get(`/products?${params.toString()}`);
      }
      
      if (response.data.success) {
        // Get the new products
        const newProducts = response.data.products || [];
        
        // Append new products to existing ones
        setProducts(prevProducts => [...prevProducts, ...newProducts]);
        setCursor(response.data.pageInfo?.endCursor || null);
        setHasMore(response.data.pageInfo?.hasNextPage || false);
        
        // Process all products (existing + new)
        processProducts([...products, ...newProducts]);
      }
    } catch (error) {
      console.error('Error fetching more products:', error);
    }
  };
  
  // Process products to group by color
  const processProducts = (productsToProcess) => {
    const newGroupedProducts = [];
    
    productsToProcess.forEach(product => {
      // Extract variant information
      let variants = [];
      
      // First check if we have properly formatted variants
      if (product.variants && Array.isArray(product.variants)) {
        // Extract size and color from variant options
        variants = product.variants.map(variant => {
          let color = 'Default';
          let size = 'One Size';
          
          // Try to extract color and size from selectedOptions
          if (variant.selectedOptions && Array.isArray(variant.selectedOptions)) {
            const colorOption = variant.selectedOptions.find(opt => 
              opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');
            const sizeOption = variant.selectedOptions.find(opt => 
              opt.name.toLowerCase() === 'size');
              
            if (colorOption) color = colorOption.value;
            if (sizeOption) size = sizeOption.value;
          }
          
          // If variant has direct color/size properties, use those
          if (variant.color) color = variant.color;
          if (variant.size) size = variant.size;
          
          // Handle title that might contain color/size (Format: "Color / Size")
          if (variant.title && variant.title.includes('/')) {
            const parts = variant.title.split('/').map(p => p.trim());
            if (parts.length >= 2) {
              // If no color is set, use the first part
              if (color === 'Default') color = parts[0];
              // If no size is set, use the second part
              if (size === 'One Size') size = parts[1];
            }
          }
          
          return {
            id: variant.id || `${product.id}-${color}-${size}`,
            color,
            size,
            price: variant.price?.amount || product.price
          };
        });
      } 
      
      // If we have product options but no variants, create variants from options
      else if (product.options && Array.isArray(product.options)) {
        // Find color and size options
        const colorOption = product.options.find(opt => 
          opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour');
        const sizeOption = product.options.find(opt => 
          opt.name.toLowerCase() === 'size');
        
        const colors = colorOption && Array.isArray(colorOption.values) 
          ? colorOption.values 
          : ['Default'];
        
        const sizes = sizeOption && Array.isArray(sizeOption.values) 
          ? sizeOption.values 
          : ['One Size'];
        
        // Create variant combinations
        colors.forEach(color => {
          sizes.forEach(size => {
            variants.push({
              id: `${product.id}-${color}-${size}`,
              color,
              size,
              price: product.price
            });
          });
        });
      }
      
      // If no variants, create a default one
      if (variants.length === 0) {
        variants = [{ 
          id: `${product.id}-default`, 
          color: 'Default', 
          size: 'One Size',
          price: product.price
        }];
      }
      
      // Process images
      let images = [];
      if (product.images && Array.isArray(product.images)) {
        images = product.images.map(img => typeof img === 'string' ? img : img.src || img.url);
      } else if (product.image) {
        images = [product.image];
      } else if (product.images && product.images.edges) {
        images = product.images.edges.map(edge => edge.node.url);
      }
      
      // If no images, use placeholder
      if (images.length === 0) {
        images = ["/images/placeholder.jpg"];
      }
      
      // Get unique colors from variants
      const uniqueColors = [...new Set(variants.map(v => v.color))];
      
      // For each color, create a grouped product entry
      uniqueColors.forEach(color => {
        // Get all sizes for this color
        const sizesForColor = variants
          .filter(v => v.color === color)
          .map(v => v.size);
        
        // Parse price as number
        let priceValue = 0;
        if (typeof product.price === 'number') {
          priceValue = product.price;
        } else if (typeof product.price === 'string') {
          priceValue = parseFloat(product.price);
        } else if (product.priceRange && product.priceRange.minVariantPrice) {
          priceValue = parseFloat(product.priceRange.minVariantPrice.amount);
        } else if (variants[0] && variants[0].price) {
          priceValue = parseFloat(variants[0].price);
        }
        
        newGroupedProducts.push({
          id: `${product.id}-${color}`,
          originalId: product.id,
          title: product.title,
          displayName: `${product.title} - ${color}`,
          description: product.description,
          color,
          priceValue,
          sizes: sizesForColor,
          images,
          originalProduct: product
        });
      });
    });
    
    setGroupedProducts(newGroupedProducts);
  };

  // Handle product click to navigate to product detail
  const handleProductClick = (productId, productSlug) => {
    // Combine slug and ID with underscore as in original ProductGrid
    navigate(`/product/${productSlug}_${productId}`);
  };
  
  // Handle load more button click
  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  // Get responsive grid classes based on gridType and mobile status
  const getGridClasses = () => {
    if (isMobileScreen) {
      return mobileColumns === 1 
        ? "grid-cols-1 gap-y-[20px] mx-[15px]" 
        : "grid-cols-2 gap-x-[5px] gap-y-[15px] mx-[10px]";
    } else if (gridType === 2) {
      return "grid-cols-1  md:grid-cols-2 gap-x-[10px] gap-y-[30px] mx-[20px]";
    } else {
      return "grid-cols-2  md:grid-cols-4 gap-x-[10px]  md:gap-x-[10px] gap-y-[30px] mx-[20px]";
    }
  };

  // If no products and not loading
  if (!loading && groupedProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-light mb-4">No products found</h2>
        <p className="text-gray-600 mb-8">
          Try adjusting your filters or browse our other collections.
        </p>
        <button 
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition"
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <div className={isMobileScreen ? (mobileColumns === 1 ? "mx-[15px]" : "mx-[10px]") : "mx-[20px]"}>
      {loading ? (
        <ProductSkeletonLoader gridType={gridType} count={gridType === 2 ? 6 : 8} />
      ) : (
        <>
          <motion.div
            ref={gridRef}
            className={`grid ${getGridClasses()}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {groupedProducts.map((product) => (
              <div key={product.id} className="overflow-hidden w-full">
                <ProductCard
                  product={{
                    id: product.originalId,
                    name: product.displayName || product.title,
                    price: product.priceValue,
                    sizes: product.sizes,
                    images: product.images,
                    color: product.color,
                    description: product.description,
                    handle: product.originalProduct.handle || product.originalId
                  }}
                  gridType={gridType}
                  onProductClick={() => handleProductClick(
                    product.originalId, 
                    product.originalProduct.handle || product.title.toLowerCase().replace(/\s+/g, '-')
                  )}
                  isMobile={isMobileScreen}
                  mobileColumns={mobileColumns}
                />
              </div>
            ))}
          </motion.div>
          
          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center my-12">
              <button
                className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors duration-300  md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

ProductGrid.propTypes = {
  gridType: PropTypes.oneOf([2, 4]),
  collectionHandle: PropTypes.string,
  isMobile: PropTypes.bool,
  category: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  initialFilters: PropTypes.object
};

export default ProductGrid;