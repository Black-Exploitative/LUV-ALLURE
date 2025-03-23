// pages/SearchResults.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import FilterSortBar from '../components/FilterSortBar';
import searchService from '../services/searchApi';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [gridType, setGridType] = useState(4);
  
  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'dresses', name: 'Dresses' },
    { id: 'tops', name: 'Tops' },
    { id: 'bottoms', name: 'Bottoms' },
    { id: 'accessories', name: 'Accessories' }
  ];
  
  useEffect(() => {
    if (searchQuery) {
      performSearch();
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [searchQuery, selectedCategory]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchService.searchProducts(searchQuery, {
        category: selectedCategory,
        limit: 20
      });
      
      setResults(response.products);
      setTotalResults(response.totalCount);
    } catch (error) {
      console.error('Error searching products:', error);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  const handleGridChange = (type) => {
    setGridType(type);
  };

  return (
    <>
      <Navbar />
      <Banner 
        imageUrl="/images/banner.webp"
        title={`Search: ${searchQuery}`}
        description={`${totalResults} results found`}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category filters */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Filter Results</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-4 py-2 border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-black text-white border-black'
                    : 'border-gray-300 hover:border-gray-800'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Filter and sorting options */}
        <FilterSortBar onGridChange={handleGridChange} />
        
        {/* Results display */}
        <div className="min-h-screen">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-black rounded-full"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={performSearch}
                className="mt-4 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-light mb-4">No Results Found</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                We couldn't find any products matching "{searchQuery}". Please try another search term or browse our categories.
              </p>
              <a 
                href="/shop"
                className="inline-block px-8 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Browse All Products
              </a>
            </div>
          ) : (
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
                        src={product.image || "/images/placeholder.jpg"}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="text-sm font-medium truncate">{product.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{product.productType}</p>
                      <p className="text-sm font-medium mt-1">₦{parseFloat(product.price).toLocaleString()}</p>
                    </div>
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default SearchResults;