/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import FeaturedProducts from "./FeaturedProducts";
import ShopBanner from "./ShopBanner";
import PromoSection from "./PromoSection";
import ServicesSection from "./ServicesSection";
import api from "../services/api";

const OfferSection = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "";
    };
  }, []);

  useEffect(() => {
    const fetchHomepageLayout = async () => {
      try {
        setLoading(true);
        // Get homepage layout from CMS
        const response = await api.get('/cms/homepage');
        
        if (response.data?.data?.sections) {
          // Get sorted sections from the homepage layout
          const sortedSections = response.data.data.sections
            .slice()
            .sort((a, b) => a.order - b.order);
          
          setSections(sortedSections);
        }
      } catch (error) {
        console.error('Error fetching homepage layout:', error);
        // Fallback to default order
        setSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageLayout();
  }, []);

  // Default rendering, always show all sections in set order
  // The CMS data would only be used if you want to change the structure dynamically
  // For now, we'll maintain the original layout
  return (
    <div className="overflow-x-hidden w-full">
      <FeaturedProducts />
      <ShopBanner />
      <PromoSection />
      <ServicesSection />
    </div>
  );
};

export default OfferSection;;
