import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import cmsService from "../services/cmsService";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    mediaType: "video", // "video" or "image"
    mediaUrl: "https://cdn.pixabay.com/video/2023/05/15/163117-827112884_large.mp4",
    title: "EXPLORE",
    buttonLink: "shop",
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroSection = async () => {
      try {
        setLoading(true);
        // Get the active homepage layout
        const homepageLayout = await cmsService.getHomepageContent();
        
       
        if (homepageLayout && homepageLayout.sections) {
          const heroSection = homepageLayout.sections.find(
            section => section.sectionId?.type === 'hero'
          );
          
          if (heroSection && heroSection.sectionId) {
            const sectionData = heroSection.sectionId;
            
            setHeroData({
              mediaType: sectionData.media?.videoUrl ? "video" : "image",
              mediaUrl: sectionData.media?.videoUrl || sectionData.media?.imageUrl || heroData.mediaUrl,
              title: sectionData.content?.title || heroData.title,
              buttonLink: sectionData.content?.buttonLink || heroData.buttonLink,
              backgroundColor: "rgba(0, 0, 0, 0.3)" 
            });
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

  // Break the title into individual characters for animation
  const titleLetters = heroData.title.split("");

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Show loading state */}
      {loading ? (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      ) : (
        <>
          {/* Background Media: Video or Image */}
          {heroData.mediaType === "video" ? (
            <video
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src={heroData.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={heroData.mediaUrl} 
              alt="Hero Background" 
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          )}

          {/* Overlay */}
          <div 
            className="absolute inset-0" 
            style={{ backgroundColor: heroData.backgroundColor }}
          ></div>

          {/* Content */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <a 
              href={heroData.buttonLink} 
              className="text-white text-center flex flex-row gap-5 relative group"
            >
              {/* Render each letter with staggered animations */}
              {titleLetters.map((letter, index) => (
                <motion.h1 
                  key={`${letter}-${index}`}
                  className={`text-[20px] font-thin ${index === 0 ? "border-b-[3px] border-white pb-[5px] group-hover:border-b-0" : ""}`}
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
      )}
    </section>
  );
}