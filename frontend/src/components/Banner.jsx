import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cmsService from "../services/cmsService";
import { motion } from "framer-motion";

const Banner = ({ 
  imageUrl, 
  title, 
  description, 
  buttonText, 
  buttonLink, 
  pageName 
}) => {
  const [bannerData, setBannerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If pageName is provided, fetch banner from CMS
    if (pageName) {
      const fetchBanner = async () => {
        try {
          setLoading(true);
          const banner = await cmsService.getBanner(pageName);
          if (banner) {
            setBannerData(banner);
          }
        } catch (error) {
          console.error(`Error fetching banner for ${pageName}:`, error);
        } finally {
          setLoading(false);
        }
      };

      fetchBanner();
    } else {
      // If no pageName, use props directly
      setLoading(false);
    }
  }, [pageName]);

  // Determine what to display based on loading state and data
  const displayImageUrl = bannerData?.imageUrl || imageUrl;
  const displayTitle = bannerData?.title || title;
  const displayDescription = bannerData?.description || description;
  const displayButtonText = bannerData?.buttonText || buttonText;
  const displayButtonLink = bannerData?.buttonLink || buttonLink || "#";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-70 bg-cover bg-center"
      style={{ backgroundImage: `url(${displayImageUrl})` }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center p-4">
        {displayTitle && (
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-white text-4xl font-bold mb-2"
          >
            {displayTitle}
          </motion.h1>
        )}
        {displayDescription && (
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-white text-lg max-w-2xl"
          >
            {displayDescription}
          </motion.p>
        )}
        {displayButtonText && (
          <motion.a 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            href={displayButtonLink}
            className="mt-4 inline-block px-6 py-2 bg-white text-black hover:bg-gray-100 transition-colors"
          >
            {displayButtonText}
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

Banner.propTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
  pageName: PropTypes.string, 
};

Banner.defaultProps = {
  imageUrl: "/images/banner.webp",
  pageName: null
};

export default Banner;