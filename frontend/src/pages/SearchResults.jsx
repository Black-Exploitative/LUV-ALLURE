// pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import FilterSortBar from '../components/FilterSortBar';
import ProductSkeletonLoader from '../components/ProductSkeletonLoader';
import searchService from '../services/searchApi';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const colorParam = searchParams.get('color') || '';
  const sizeParam = searchParams.get('size') || '';
  const sortParam = searchParams.get('sort') || 'relevance';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedColor, setSelectedColor] = useState(colorParam);
  const [selectedSize, setSelectedSize] = useState(sizeParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [gridType, setGridType] = useState(4);
  const [pageInfo, setPageInfo] = useState(null);
  
  // Initial search on page load or when URL parameters change
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory(categoryParam);
      setSelectedColor(colorParam);
      setSelectedSize(sizeParam);
      setSelectedSort(sortParam);
      
      performSearch();
    } else {
      setLoading(false);
      setResults([]);
      setTotalResults(0);
    }
  }, [
    searchQuery, 
    categoryParam, 
    colorParam, 
    sizeParam, 
    sortParam,
  ]);

  const performSearch = async (options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchService.searchProducts(searchQuery, {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        color: selectedColor,
        size: selectedSize,
        sort: selectedSort,
        limit: 20,
        ...options
      });
      
      setResults(response.products || []);
      setTotalResults(response.totalCount || response.products?.length || 0);
      setPageInfo(response.pageInfo || null);
    } catch (error) {
      console.error('Error searching products:', error);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter changes from FilterSortBar
  const handleFiltersChange = (filterData) => {
    // Update local state
    if (filterData.filters.category?.length > 0) {
      setSelectedCategory(filterData.filters.category[0]);
    } else {
      setSelectedCategory('all');
    }
    
    if (filterData.filters.colour?.length > 0) {
      setSelectedColor(filterData.filters.colour[0]);
    } else {
      setSelectedColor('');
    }
    
    if (filterData.filters.size?.length > 0) {
      setSelectedSize(filterData.filters.size[0]);
    } else {
      setSelectedSize('');
    }
    
    // Update sort
    setSelectedSort(filterData.sort);
    
    // Perform search with new filters
    performSearch({
      category: filterData.filters.category?.length > 0 ? filterData.filters.category[0] : undefined,
      color: filterData.filters.colour?.length > 0 ? filterData.filters.colour[0] : undefined,
      size: filterData.filters.size?.length > 0 ? filterData.filters.size[0] : undefined,
      sort: filterData.sort
    });
  };
  
  // Prepare initial filters for FilterSortBar
  const initialFilters = {
    category: selectedCategory !== 'all' ? [selectedCategory] : [],
    colour: selectedColor ? [selectedColor] : [],
    size: selectedSize ? [selectedSize] : []
  };

  // Function to handle loading more results (if supported by API)
  const handleLoadMore = async () => {
    if (!pageInfo?.hasNextPage || !pageInfo?.endCursor) return;
    
    setLoading(true);
    try {
      const response = await searchService.searchProducts(searchQuery, {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        color: selectedColor,
        size: selectedSize,
        sort: selectedSort,
        limit: 20,
        cursor: pageInfo.endCursor
      });
      
      setResults(prev => [...prev, ...(response.products || [])]);
      setTotalResults(prev => prev + (response.products?.length || 0));
      setPageInfo(response.pageInfo || null);
    } catch (error) {
      console.error('Error loading more products:', error);
      setError('Failed to load more products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Banner 
        imageUrl="/images/banner.webp"
        title={searchQuery ? `Search: ${searchQuery}` : 'Search Results'}
        description={totalResults > 0 ? `${totalResults} results found` : 'No results found'}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter and Sort Bar */}
        <FilterSortBar 
          onGridChange={setGridType} 
          onFiltersChange={handleFiltersChange}
          initialFilters={initialFilters}
        />
        
        {/* Results display */}
        <div className="min-h-screen">
          {loading && results.length === 0 ? (
            <ProductSkeletonLoader gridType={gridType} count={gridType === 2 ? 6 : 8} />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => performSearch()}
                className="mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-light mb-4">No Results Found</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn't find any products matching "{searchQuery}". Try adjusting your filters or browse our curated collections.
              </p>
              <a 
                href="/shop"
                className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Browse All Products
              </a>
            </div>
          ) : (
            <>
              <div className={`
                ${gridType === 2 
                  ? "grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8" 
                  : "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8"}
              `}>
                {results.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="product-card group"
                  >
                    <a href={`/product/${product.id}`} className="block">
                      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                        <img
                          src={product.image || (product.images && product.images.length > 0 ? product.images[0] : "/images/placeholder.jpg")}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Quick view overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <span className="px-4 py-2 bg-white text-black text-xs uppercase tracking-wider">
                            Quick View
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h3 className="text-sm font-medium truncate">{product.title}</h3>
                        {product.productType && (
                          <p className="text-xs text-gray-500 mt-1">{product.productType}</p>
                        )}
                        <p className="text-sm font-medium mt-1">
                          ₦{typeof product.price === 'string' 
                              ? parseFloat(product.price).toLocaleString() 
                              : product.price.toLocaleString()}
                        </p>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
              
              {/* "Load More" button - only show if API supports pagination */}
              {pageInfo?.hasNextPage && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default SearchResults;