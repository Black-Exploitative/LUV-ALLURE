import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
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
  // Separate state for desktop and mobile data
  const [shopBannerData, setShopBannerData] = useState({
    desktop: {
      imageUrl: "/images/photo3.jpg",
      altText: "Fashion Model",
      overlayOpacity: 0.4,
      buttonText: "SHOP NOW",
      buttonLink: "#shop-now",
      buttonPosition: "bottom" // Default position
    },
    mobile: {
      imageUrl: "/images/mobile-banner.jpg", // Default mobile image
      altText: "Fashion Collection",
      overlayOpacity: 0.5,
      buttonText: "SHOP NOW",
      buttonLink: "#shop-now",
      buttonPosition: "center" // Default position for mobile
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch shop banner data
  useEffect(() => {
    const fetchShopBanners = async () => {
      try {
        setLoading(true);
        
        // Get desktop shop banner data from CMS
        const desktopBannerData = await getShopBanner('desktop');
        console.log("Desktop shop banner data:", desktopBannerData);
        
        // Get mobile shop banner data from CMS
        const mobileBannerData = await getShopBanner('mobile');
        console.log("Mobile shop banner data:", mobileBannerData);
        
        // Update desktop banner if found
        if (desktopBannerData) {
          setShopBannerData(prev => ({
            ...prev,
            desktop: {
              imageUrl: desktopBannerData.media?.imageUrl || prev.desktop.imageUrl,
              altText: desktopBannerData.media?.altText || prev.desktop.altText,
              overlayOpacity: desktopBannerData.media?.overlayOpacity || prev.desktop.overlayOpacity,
              buttonText: desktopBannerData.content?.buttonText || prev.desktop.buttonText,
              buttonLink: desktopBannerData.content?.buttonLink || prev.desktop.buttonLink,
              buttonPosition: desktopBannerData.content?.buttonPosition || prev.desktop.buttonPosition
            }
          }));
        }
        
        // Update mobile banner if found
        if (mobileBannerData) {
          setShopBannerData(prev => ({
            ...prev,
            mobile: {
              imageUrl: mobileBannerData.media?.imageUrl || prev.mobile.imageUrl,
              altText: mobileBannerData.media?.altText || prev.mobile.altText,
              overlayOpacity: mobileBannerData.media?.overlayOpacity || prev.mobile.overlayOpacity,
              buttonText: mobileBannerData.content?.buttonText || prev.mobile.buttonText,
              buttonLink: mobileBannerData.content?.buttonLink || prev.mobile.buttonLink,
              buttonPosition: mobileBannerData.content?.buttonPosition || prev.mobile.buttonPosition
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching shop banners:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopBanners();
  }, []);

  // Get button position style based on position value
  const getButtonPositionStyle = (position) => {
    // Log the position value for debugging
    console.log("Calculating position for:", position);
    
    // Default position is center if none provided
    const pos = position ? position.trim().toLowerCase() : 'center';
    
    // Create position object
    let positionStyle = {};
    
    // Set vertical position
    if (pos.includes('top')) {
      positionStyle.top = '8%';
    } else if (pos.includes('bottom')) {
      positionStyle.bottom = '8%';
    } else {
      positionStyle.top = '50%';
      positionStyle.transform = 'translateY(-50%)';
    }
    
    // Set horizontal position
    if (pos.includes('left')) {
      positionStyle.left = '8%';
    } else if (pos.includes('right')) {
      positionStyle.right = '8%';
    } else {
      positionStyle.left = '50%';
      // If we already have a transform, we need to include both transformations
      if (positionStyle.transform) {
        positionStyle.transform = 'translate(-50%, -50%)';
      } else {
        positionStyle.transform = 'translateX(-50%)';
      }
    }
    
    console.log("Final position style:", positionStyle);
    return positionStyle;
  };

  // Render banner for a specific device type
  const renderBanner = (data) => {
    return (
      <div className="relative w-full h-screen mt-[90px]">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={data.imageUrl}
            alt={data.altText}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: data.overlayOpacity }}
        />

        {/* Button with proper positioning */}
        <div 
          className="absolute z-10"
          style={getButtonPositionStyle(data.buttonPosition)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <a 
              href={data.buttonLink}
              className="inline-block px-8 py-3 border-2 border-white text-white text-lg hover:bg-white hover:text-black transition-all duration-300"
            >
              {data.buttonText}
            </a>
          </motion.div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <ShopBannerSkeleton />;
  }

  return (
    <AnimatedSection delay={0.2}>
      {/* Mobile Banner - shown only on small screens */}
      <div className="block  md:hidden">
        {renderBanner(shopBannerData.mobile)}
      </div>
      
      {/* Desktop Banner - hidden on small screens, shown on md and up */}
      <div className="hidden  md:block">
        {renderBanner(shopBannerData.desktop)}
      </div>
    </AnimatedSection>
  );
}