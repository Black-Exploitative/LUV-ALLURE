// frontend/src/pages/navpages/dresses/AllDresses.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FilterSortBar from "../../../components/FilterSortBar";
import ProductGrid from "../../../components/AltProductGrid";
import productService from "../../../services/productService";

const Dresses = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gridType, setGridType] = useState(4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [availableFilters, setAvailableFilters] = useState(null);
  const [filters, setFilters] = useState({
    category: ["Dress"],
  });

  // Set initial filters
  useEffect(() => {
    // Parse URL parameters and merge with default filters
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};
    
    // Get filter parameters from URL
    ['category', 'color', 'size', 'tag', 'price'].forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        urlFilters[param] = value;
      }
    });
    
    // Merge with our default filter (keeping the Dress category)
    setFilters(prevFilters => ({
      ...prevFilters,
      ...urlFilters
    }));
    
    // Get available filters
    fetchAvailableFilters();
  }, [location.search]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowWidth < 768;
  
  // Fetch available filters for this category
  const fetchAvailableFilters = async () => {
    try {
      setLoading(true);
      const result = await productService.getProducts({
        category: "Dress"
      }, 'relevance', 1);
      
      if (result.filters) {
        setAvailableFilters(result.filters);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching filters:", err);
      setError("Failed to load filters");
      setLoading(false);
    }
  };
  
  const handleGridChange = (type) => {
    setGridType(type);
  };
  
  const handleFiltersChange = (filterData) => {
    console.log("Filters changed:", filterData);
    setFilters({
      ...filters,
      ...filterData.filters
    });
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">{error}</h1>
          <a href="/shop" className="text-blue-600 hover:underline">
            Browse all products
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Shop Header - Responsive */}
      <div className={`relative w-full ${isMobile ? 'h-40' : 'h-70'} mt-[70px]`}>
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/dresses/all-dresses-banner.jpg')` }}
        ></div>
        
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.5 }}
        ></div>
        
        <div className="relative h-full z-10 flex flex-col justify-center items-center text-center">
          <h1 className={`text-white ${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-2`}>
            All Dresses
          </h1>
          <p className={`text-white ${isMobile ? 'text-sm px-4' : 'text-lg'} max-w-2xl`}>
            Explore our complete collection of stunning dresses
          </p>
        </div>
      </div>
      
      {/* Filter and Product Grid */}
      <FilterSortBar 
        onGridChange={handleGridChange} 
        onFiltersChange={handleFiltersChange} 
        initialFilters={filters}
        availableFilters={availableFilters}
      />
      
      <ProductGrid 
        gridType={gridType} 
        isMobile={isMobile} 
        category="Dress"
        initialFilters={filters}
      />
      
      <Footer />
    </div>
  );
};

export default Dresses;