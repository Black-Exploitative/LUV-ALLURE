/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import FilterSortBar from "../../../components/FilterSortBar";
import ProductGrid from "../../../components/ProductGrid";
import api from "../../../services/api";

const AllDresses = () => {
  const { handle } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gridType, setGridType] = useState(4);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  

  const isMobile = windowWidth < 768;
  
  // Get collection data
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await api.get(`/collections/${handle}`);
        if (response.data.success) {
          setCollection(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching collection:", error);
        setError("Collection not found");
        setLoading(false);
      }
    };
    
    fetchCollection();
  }, [handle]);
  
  const handleGridChange = (type) => {
    setGridType(type);
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
      
      {/* Dynamic Shop Header - Responsive */}
      {collection && (
        <div className={`relative w-full ${isMobile ? 'h-40' : 'h-70'} mt-[70px]`}>
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${collection.headerImage || '/images/banner.webp'})` }}
          ></div>
          
  
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: collection.headerOverlayOpacity || 0.5 }}
          ></div>
          
   
          <div className="relative h-full z-10 flex flex-col justify-center items-center text-center">
            {collection.headerTitle && (
              <h1 className={`text-white ${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-2`}>
                {collection.headerTitle}
              </h1>
            )}
            {collection.headerDescription && (
              <p className={`text-white ${isMobile ? 'text-sm px-4' : 'text-lg'} max-w-2xl`}>
                {collection.headerDescription}
              </p>
            )}
          </div>
        </div>
      )}
      
    
      <FilterSortBar onGridChange={handleGridChange} />
      <ProductGrid 
        gridType={gridType} 
        collectionHandle={handle} 
        isMobile={isMobile} 
        className="grid-cols-2"
      />
      
      <Footer />
    </div>
  );
};

export default AllDresses;