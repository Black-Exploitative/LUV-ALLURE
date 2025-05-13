// frontend/src/components/AltProductGrid.jsx - Enhanced with proper filter support
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import ProductSkeletonLoader from "./ProductSkeletonLoader";
import ProductCard from "./ProductCard";

const AltProductGrid = ({ 
  gridType = 4, 
  collectionHandle = null,
  isMobile = false,
  category = null,
  color = null,
  tag = null,
  initialFilters = {}
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [cursor, setCursor] = useState(null);
  const [filters, setFilters] = useState({
    ...initialFilters,
    category: category || initialFilters.category,
    color: color || initialFilters.color,
    tag: tag || initialFilters.tag
  });
  const [sort, setSort] = useState("relevance");
  
 const LoadingSkeleton = ProductSkeletonLoader
  // Parse query parameters on mount and when location changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    let hasUpdates = false;
    
    // Parse query parameters for specific filters
    const supportedFilters = ['category', 'color', 'size', 'tag', 'price', 'collection'];
    
    supportedFilters.forEach(filter => {
      const value = searchParams.get(filter);
      if (value) {
        newFilters[filter] = value;
        hasUpdates = true;
      }
    });
    
    // Handle array parameters (e.g., multiple colors)
    ['colors', 'sizes', 'tags'].forEach(filterArray => {
      const baseFilter = filterArray.slice(0, -1); // Remove 's' to get singular
      const values = searchParams.getAll(baseFilter);
      if (values && values.length > 0) {
        newFilters[baseFilter] = values;
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
  
  // Handle filter changes from FilterSortBar component
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      setFilters(prevFilters => ({
        ...prevFilters,
        ...initialFilters
      }));
    }
  }, [initialFilters]);
  
  // Effect for loading products based on current filters and sort
  useEffect(() => {
    // Reset pagination when filters change
    if (page === 1) {
      fetchProducts();
    } else {
      // If page is not 1, reset to page 1 which will trigger a fetch
      setPage(1);
    }
  }, [filters, sort]);
  
  // Effect for pagination
  useEffect(() => {
    if (page > 1) {
      fetchMoreProducts();
    }
  }, [page]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      const response = await api.get(`/products?${params.toString()}`);
      
      console.log('Products response:', response.data);
      
      if (response.data.success) {
        setProducts(response.data.products || []);
        setCursor(response.data.pageInfo?.endCursor || null);
        setHasMore(response.data.pageInfo?.hasNextPage || false);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
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
      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.data.success) {
        // Append new products to existing ones
        setProducts(prevProducts => [...prevProducts, ...response.data.products]);
        setCursor(response.data.pageInfo?.endCursor || null);
        setHasMore(response.data.pageInfo?.hasNextPage || false);
      }
    } catch (error) {
      console.error('Error fetching more products:', error);
    }
  };
  
  const handleLoadMore = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  // Update the layout based on the grid type
  const getGridClasses = () => {
    switch (gridType) {
      case 2:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4";
      case 4:
      default:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4";
    }
  };
  
  // When no products are available
  if (!loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-light mb-4">No products found</h2>
          <p className="text-gray-600 mb-8">
            Try adjusting your filters or browse our other collections.
          </p>
          <Link 
            to="/shop" 
            className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Products Grid */}
      <div className={`grid ${getGridClasses()}`}>
        {loading ? (
          // Show loading skeletons
          Array(12).fill().map((_, index) => (
            <div key={`skeleton-${index}`} className="p-2">
              <LoadingSkeleton type="product" />
            </div>
          ))
        ) : (
          // Show actual products
          products.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: Math.min(index * 0.1, 1), 
                ease: "easeOut" 
              }}
              className="p-2"
            >
              <ProductCard 
                product={product} 
                gridType={gridType}
                isMobile={isMobile}
              />
            </motion.div>
          ))
        )}
      </div>
      
      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-12">
          <button
            className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors duration-300 md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider"
            onClick={handleLoadMore}
          >
            Load More
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

AltProductGrid.propTypes = {
  gridType: PropTypes.number,
  collectionHandle: PropTypes.string,
  isMobile: PropTypes.bool,
  category: PropTypes.string,
  color: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  initialFilters: PropTypes.object
};

export default AltProductGrid;