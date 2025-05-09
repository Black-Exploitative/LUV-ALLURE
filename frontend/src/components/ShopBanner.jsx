import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Button from "./Button";
import AnimatedImage from "./AnimatedImage";
import { getShopBanner } from "../services/cmsService";
import PropTypes from "prop-types";

// Animated Section component
const AnimatedSection = ({ children, delay = 0 }) => {
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.section
      ref={sectionRef}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.8, delay }}
      className="w-full"
    >
      {children}
    </motion.section>
  );
};

AnimatedSection.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};

// Loading skeleton
const ShopBannerSkeleton = () => (
  <div className="relative w-full h-screen mt-[90px]">
    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
    <div className="absolute inset-0 flex items-end justify-center pb-8">
      <div className="h-12 w-32 bg-gray-300 animate-pulse rounded"></div>
    </div>
  </div>
);

export default function ShopBanner() {
  const [shopBanner, setShopBanner] = useState({
    imageUrl: "/images/photo3.jpg",
    altText: "Fashion Model",
    overlayOpacity: 0.4,
    buttonText: "SHOP NOW",
    buttonLink: "#shop-now",
    buttonPosition: "bottom" // Default position
  });
  const [loading, setLoading] = useState(true);

  // Fetch shop banner data
  useEffect(() => {
    const fetchShopBanner = async () => {
      try {
        setLoading(true);
        
        // Get shop banner data from CMS
        const shopBannerData = await getShopBanner();
        console.log("Raw shop banner data:", shopBannerData);
        
        if (shopBannerData) {
          // Extract button position with explicit logging
          const buttonPosition = shopBannerData.content?.buttonPosition;
          console.log("Button position from CMS:", buttonPosition);
          
          // Update shop banner state
          setShopBanner({
            imageUrl: shopBannerData.media?.imageUrl || "/images/photo3.jpg",
            altText: shopBannerData.media?.altText || "Fashion Model",
            overlayOpacity: shopBannerData.media?.overlayOpacity || 0.4,
            buttonText: shopBannerData.content?.buttonText || "SHOP NOW",
            buttonLink: shopBannerData.content?.buttonLink || "#shop-now",
            buttonPosition: buttonPosition || "bottom" // Use default if not set
          });
        }
      } catch (error) {
        console.error("Error fetching shop banner:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopBanner();
  }, []);

  // Manual button positioning for different positions
  const getButtonPosition = () => {
    const position = (shopBanner.buttonPosition || "bottom").toLowerCase().trim();
    console.log("Using button position:", position);
    
    // Set positions explicitly based on the position name
    switch (position) {
      case "top-left":
        return { top: "8%", left: "8%" };
      case "top":
        return { top: "8%", left: "50%", transform: "translateX(-50%)" };
      case "top-right":
        return { top: "8%", right: "8%" };
      case "left":
        return { top: "50%", left: "8%", transform: "translateY(-50%)" };
      case "center":
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
      case "right":
        return { top: "50%", right: "8%", transform: "translateY(-50%)" };
      case "bottom-left":
        return { bottom: "8%", left: "8%" };
      case "bottom-right":
        return { bottom: "8%", right: "8%" };
      case "bottom":
      default:
        return { bottom: "8%", left: "50%", transform: "translateX(-50%)" };
    }
  };

  if (loading) {
    return <ShopBannerSkeleton />;
  }

  // Get the position style for the button
  const buttonPositionStyle = getButtonPosition();
  console.log("Final button position style:", buttonPositionStyle);

  return (
    <AnimatedSection delay={0.2}>
      <div className="relative w-full h-screen mt-[90px]">
        {/* Background image */}
        <div className="absolute inset-0">
          <AnimatedImage
            src={shopBanner.imageUrl}
            alt={shopBanner.altText}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: shopBanner.overlayOpacity }}
        />

        {/* Button - Fixed button implementation for clickability */}
        <div 
          className="absolute z-10"
          style={buttonPositionStyle}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <a 
              href={shopBanner.buttonLink}
              className="inline-block px-8 py-3 border-2 border-white text-white text-lg hover:bg-white hover:bg-opacity-20 transition-all duration-300"
            >
              {shopBanner.buttonText}
            </a>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}