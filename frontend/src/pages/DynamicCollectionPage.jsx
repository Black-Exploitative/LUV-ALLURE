// frontend/src/pages/DynamicCollectionPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterSortBar from "../components/FilterSortBar";
import ProductGrid from "../components/ProductGrid";
import ProductSkeletonLoader from "../components/ProductSkeletonLoader";
import api from "../services/api";

const DynamicCollectionPage = () => {
  const { handle } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gridType, setGridType] = useState(4);
  const [initialFilters, setInitialFilters] = useState({});
  
  // Get collection data
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await api.get(`/collections/${handle}`);
        if (response.data.success) {
          setCollection(response.data.data);
          
          // Set initial filters based on collection settings
          const filters = {};
          if (response.data.data.filters?.tags?.length > 0) {
            filters.tags = response.data.data.filters.tags;
          }
          if (response.data.data.filters?.categories?.length > 0) {
            filters.category = response.data.data.filters.categories;
          }
          setInitialFilters(filters);
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
        setError("Collection not found");
      }
    };
    
    fetchCollection();
  }, [handle]);
  
  // Fetch products with filters
  const fetchProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      // Add filters to query
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else if (value) {
          queryParams.append(key, value);
        }
      });
      
      const response = await api.get(`/collections/${handle}/products?${queryParams.toString()}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  
  // Initial product load
  useEffect(() => {
    if (collection) {
      fetchProducts(initialFilters);
    }
  }, [collection]);
  
  // Handle filter changes
  const handleFiltersChange = (filterData) => {
    fetchProducts(filterData.filters);
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">{error}</h1>
          <a href="/collections" className="text-blue-600 hover:underline">
            Return to collections
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Dynamic Shop Header */}
      {collection && (
        <div className="relative w-full h-70 mt-[70px]">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${collection.headerImage || '/images/banner.webp'})` }}
          ></div>
          
          {/* Overlay with dynamic opacity */}
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: collection.headerOverlayOpacity || 0.5 }}
          ></div>
          
          {/* Content */}
          <div className="relative h-full z-10 flex flex-col justify-center items-center text-center">
            {collection.headerTitle && (
              <h1 className="text-white text-4xl font-bold mb-2">
                {collection.headerTitle}
              </h1>
            )}
            {collection.headerDescription && (
              <p className="text-white text-lg max-w-2xl">
                {collection.headerDescription}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4">
        {/* Filter and Sort Bar */}
        <FilterSortBar 
          onGridChange={setGridType} 
          onFiltersChange={handleFiltersChange}
          initialFilters={initialFilters}
        />
        
        {/* Products Grid */}
        {loading ? (
          <ProductSkeletonLoader gridType={gridType} count={gridType === 2 ? 6 : 8} />
        ) : (
          <ProductGrid products={products} gridType={gridType} />
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default DynamicCollectionPage;