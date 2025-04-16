// frontend/src/components/ShopHeader.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import api from "../services/api";

const ShopHeader = () => {
  const [headerData, setHeaderData] = useState({
    imageUrl: "/images/banner.webp",
    title: "Shop the Latest Trends",
    description: "Find your perfect style today.",
    overlayOpacity: 0.5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch shop header data from CMS
    const fetchShopHeader = async () => {
      try {
        setLoading(true);
        const response = await api.get('/cms/shop-headers');
        
        if (response.data.success && response.data.data.length > 0) {
          // Get the active header
          const activeHeader = response.data.data.find(header => header.isActive);
          
          if (activeHeader) {
            setHeaderData({
              imageUrl: activeHeader.media?.imageUrl || headerData.imageUrl,
              title: activeHeader.content?.title || headerData.title,
              description: activeHeader.content?.description || headerData.description,
              overlayOpacity: activeHeader.media?.overlayOpacity !== undefined ? 
                          activeHeader.media.overlayOpacity : 0.5
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching shop header:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopHeader();
  }, []);

  if (loading) {
    return (
      <div className="relative w-full h-70 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
          <div className="w-1/2 h-8 bg-gray-300 rounded mb-4"></div>
          <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-70 mt-[70px]">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${headerData.imageUrl})` }}
      ></div>
      
      {/* Overlay with adjustable opacity */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: headerData.overlayOpacity }}
      ></div>
      
      {/* Content */}
      <div className="relative h-full z-10 flex flex-col justify-center items-center text-center">
        {headerData.title && (
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-white text-4xl font-bold mb-2"
          >
            {headerData.title}
          </motion.h1>
        )}
        {headerData.description && (
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-white text-lg max-w-2xl"
          >
            {headerData.description}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default ShopHeader;