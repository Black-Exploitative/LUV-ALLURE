import { useEffect, useState } from "react";
import FeaturedProducts from "./FeaturedProducts";
import ShopBanner from "./ShopBanner";
import PromoSection from "./PromoSection";
import ServicesSection from "./ServicesSection";
import api from "../services/api";

// Skeletal loading components for each section type
const SkeletalSections = () => {
  return (
    <div className="w-full">
      {/* Featured Products Skeleton */}
      <div className="px-4 py-12 max-w-7xl mx-auto">
        {/* Section Title Skeleton */}
        <div className="h-8 bg-gray-200 animate-pulse w-64 mx-auto mb-8 rounded"></div>
        
        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2  md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-200 animate-pulse h-72 rounded">
              <div className="h-4/5 w-full bg-gray-300 animate-pulse"></div>
              <div className="h-6 w-3/4 bg-gray-300 animate-pulse mt-2 mx-auto rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 animate-pulse mt-2 mx-auto rounded"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Shop Banner Skeleton */}
      <div className="relative w-full h-96 bg-gray-200 animate-pulse mt-12">
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <div className="h-12 w-32 bg-gray-300 animate-pulse rounded"></div>
        </div>
      </div>
      
      {/* Promo Section Skeleton */}
      <div className="w-full py-16 px-4">
        <div className="flex flex-col  md:flex-row max-w-6xl mx-auto">
          <div className="w-full  md:w-1/2 h-[400px] bg-gray-200 animate-pulse rounded"></div>
          <div className="w-full  md:w-1/2 p-8 flex flex-col justify-center">
            <div className="h-8 bg-gray-200 animate-pulse w-3/4 mx-auto mb-4 rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-full mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-5/6 mx-auto mb-2 rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-4/5 mx-auto mb-4 rounded"></div>
            <div className="h-4 bg-gray-200 animate-pulse w-32 mx-auto rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Services Section Skeleton */}
      <div className="w-full py-12 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-200 animate-pulse w-64 mx-auto mb-8 rounded"></div>
          <div className="grid grid-cols-2  md:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="p-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-4"></div>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse mb-2 rounded"></div>
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 animate-pulse mt-1 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const OfferSection = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renderedSectionTypes, setRenderedSectionTypes] = useState(new Set());

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
          
          // Filter out duplicate section types - keep only the first occurrence of each type
          const uniqueSections = [];
          const seenTypes = new Set();
          
          sortedSections.forEach(section => {
            if (section.sectionId && section.sectionId.type) {
              const sectionType = section.sectionId.type;
              if (!seenTypes.has(sectionType)) {
                uniqueSections.push(section);
                seenTypes.add(sectionType);
              }
            }
          });
          
          setSections(uniqueSections);
          setRenderedSectionTypes(seenTypes);
          
          console.log("Rendered section types:", [...seenTypes]);
          console.log("Unique sections:", uniqueSections);
        }
      } catch (error) {
        console.error('Error fetching homepage layout:', error);
        // Fallback to default order
        setSections([]);
      } finally {
        // Short timeout to prevent flickering if loading is very fast
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchHomepageLayout();
  }, []);

  // Function to render a specific section based on its type
  const renderSection = (section) => {
    // If section doesn't have a valid sectionId, skip it
    if (!section || !section.sectionId) return null;
    
    // Get the section data
    const sectionData = section.sectionId;
    
    // Check the section type and render the appropriate component
    switch (sectionData.type) {
      case 'featured-products':
        return <FeaturedProducts key={sectionData._id} />;
      case 'shop-banner':
        return <ShopBanner key={sectionData._id} />;
      case 'promo-section':
        return <PromoSection key={sectionData._id} />;
      case 'services':
        return <ServicesSection key={sectionData._id} />;
      default:
        // If the section type is not recognized, render nothing
        return null;
    }
  };
  
  if (loading) {
    return <SkeletalSections />;
  }
  
  return (
    <div className="overflow-x-hidden w-full">
      {sections.length > 0 ? (
        // Render sections based on CMS data
        <>
          {sections.map(section => renderSection(section))}
          
          {/* Always render ServicesSection if it's not already included in CMS sections */}
          {!renderedSectionTypes.has('services') && <ServicesSection key="always-services" />}
        </>
      ) : (
        // Fallback to default sections if none are found in CMS
        <>
          <FeaturedProducts />
          <ShopBanner />
          <PromoSection />
          <ServicesSection />
        </>
      )}
    </div>
  );
};

export default OfferSection;