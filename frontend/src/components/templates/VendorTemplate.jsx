// frontend/src/components/templates/VendorTemplate.jsx
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import FilterSortBar from "../FilterSortBar";
import ProductGrid from "../ProductGrid";
import productService from "../../services/productService";

export const VendorTemplate = ({ 
  vendorName, 
  banner = "/images/vendors/default-vendor-banner.jpg", 
  title, 
  subtitle,
  logoUrl = null
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gridType, setGridType] = useState(4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [availableFilters, setAvailableFilters] = useState(null);
  const [filters, setFilters] = useState({
    vendor: [vendorName],
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  
  // Fetch available filters for this vendor
  useEffect(() => {
    const fetchAvailableFilters = async () => {
      try {
        setLoading(true);
        const result = await productService.getProducts({
          vendor: vendorName
        }, 'relevance', 1);
        
        if (result.filters) {
          setAvailableFilters(result.filters);
        }
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching filters for vendor ${vendorName}:`, err);
        setError("Failed to load filters");
        setLoading(false);
      }
    };
    
    fetchAvailableFilters();
  }, [vendorName]);
  
  const handleGridChange = (type) => {
    setGridType(type);
  };
  
  const handleFiltersChange = (filterData) => {
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
      
      {/* Dynamic Vendor Header - Responsive */}
      <div className={`relative w-full ${isMobile ? 'h-40' : 'h-70'} mt-[70px]`}>
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${banner})` }}
        ></div>
        
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: 0.5 }}
        ></div>
        
        <div className="relative h-full z-10 flex flex-col justify-center items-center text-center">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt={`${vendorName} logo`} 
              className="h-16 mb-4 rounded bg-white bg-opacity-80 p-2"
            />
          )}
          <h1 className={`text-white ${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-2`}>
            {title || vendorName}
          </h1>
          {subtitle && (
            <p className={`text-white ${isMobile ? 'text-sm px-4' : 'text-lg'} max-w-2xl`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <FilterSortBar 
        onGridChange={handleGridChange} 
        onFiltersChange={handleFiltersChange} 
        initialFilters={filters}
        availableFilters={availableFilters}
      />
      
      <ProductGrid 
        gridType={gridType} 
        isMobile={isMobile} 
        initialFilters={filters}
      />
      
      <Footer />
    </div>
  );
};