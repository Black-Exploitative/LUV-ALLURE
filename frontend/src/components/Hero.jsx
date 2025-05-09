// frontend/src/components/Hero.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import cmsService from "../services/cmsService";
import { DeviceView } from "../utils/MediaQuery";;

export default function Hero() {
  const [heroData, setHeroData] = useState({
    desktop: {
      mediaType: "video",
      mediaUrl: "https://cdn.pixabay.com/video/2023/05/15/163117-827112884_large.mp4",
      title: "EXPLORE",
      buttonLink: "shop",
      backgroundColor: "rgba(0, 0, 0, 0.3)"
    },
    mobile: {
      mediaType: "image",
      mediaUrl: "/images/mobile-hero.jpg", // Default mobile hero image
      title: "EXPLORE",
      buttonLink: "shop",
      backgroundColor: "rgba(0, 0, 0, 0.4)" // Slightly darker for mobile
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        setLoading(true);
        // Get the active homepage layout
        const homepageLayout = await cmsService.getHomepageContent();
        
        if (homepageLayout && homepageLayout.sections) {
          // Find desktop hero section
          const desktopHeroSection = homepageLayout.sections.find(
            section => section.sectionId?.type === 'hero' && 
                     (!section.sectionId?.deviceType || section.sectionId?.deviceType === 'desktop')
          );
          
          // Find mobile hero section
          const mobileHeroSection = homepageLayout.sections.find(
            section => section.sectionId?.type === 'hero' && 
                      section.sectionId?.deviceType === 'mobile'
          );
          
          // Update desktop hero data if found
          if (desktopHeroSection && desktopHeroSection.sectionId) {
            const sectionData = desktopHeroSection.sectionId;
            
            setHeroData(prev => ({
              ...prev,
              desktop: {
                mediaType: sectionData.media?.videoUrl ? "video" : "image",
                mediaUrl: sectionData.media?.videoUrl || sectionData.media?.imageUrl || prev.desktop.mediaUrl,
                title: sectionData.content?.title || prev.desktop.title,
                buttonLink: sectionData.content?.buttonLink || prev.desktop.buttonLink,
                backgroundColor: `rgba(0, 0, 0, ${sectionData.media?.overlayOpacity || 0.3})` 
              }
            }));
          }
          
          // Update mobile hero data if found
          if (mobileHeroSection && mobileHeroSection.sectionId) {
            const sectionData = mobileHeroSection.sectionId;
            
            setHeroData(prev => ({
              ...prev,
              mobile: {
                mediaType: sectionData.media?.videoUrl ? "video" : "image",
                mediaUrl: sectionData.media?.videoUrl || sectionData.media?.imageUrl || prev.mobile.mediaUrl,
                title: sectionData.content?.title || prev.mobile.title,
                buttonLink: sectionData.content?.buttonLink || prev.mobile.buttonLink,
                backgroundColor: `rgba(0, 0, 0, ${sectionData.media?.overlayOpacity || 0.4})` 
              }
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching hero section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroSection();
  }, []);

  // Hero content renderer for a specific device type
  const renderHeroContent = (data) => {
    // Break the title into individual characters for animation
    const titleLetters = data.title.split("");

    return (
      <>
        {/* Background Media: Video or Image */}
        {data.mediaType === "video" ? (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src={data.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img 
            src={data.mediaUrl} 
            alt="Hero Background" 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: data.backgroundColor }}
        ></div>

        {/* Content */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <a 
            href={data.buttonLink} 
            className="text-white text-center flex flex-row gap-5 relative group"
          >
            {/* Render each letter with staggered animations */}
            {titleLetters.map((letter, index) => (
              <motion.h1 
                key={`${letter}-${index}`}
                className={`text-[20px] font-thin tracking-wider ${index === 0 ? "border-b-[3px] border-white pb-[5px] group-hover:border-b-0" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                {letter}
              </motion.h1>
            ))}
            
            {/* Animated underline effect */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
          </a>
        </div>
      </>
    );
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Show loading state */}
      {loading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      ) : (
        <DeviceView
          mobile={renderHeroContent(heroData.mobile)}
          desktop={renderHeroContent(heroData.desktop)}
        />
      )}
    </section>
  );
}