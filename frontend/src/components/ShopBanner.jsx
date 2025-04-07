import { useEffect, useState, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Button from "./Button";
import AnimatedImage from "./AnimatedImage";
import { getShopBanner } from "../services/cmsService";
import PropTypes from "prop-types";

// Animated Section component with animations
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

export default function ShopBanner() {
  const [shopBanner, setShopBanner] = useState({
    imageUrl: "/images/photo3.jpg",
    altText: "Fashion Model",
    overlayOpacity: 0.4,
    buttonText: "SHOP NOW",
    buttonLink: "#shop-now"
  });
  const [shopBannerLoading, setShopBannerLoading] = useState(true);

  // Fetch shop banner data from CMS
  useEffect(() => {
    const fetchShopBanner = async () => {
      try {
        setShopBannerLoading(true);
        console.log("Fetching shop banner...");
        
        const shopBannerData = await getShopBanner();
        console.log("Shop banner data received:", shopBannerData);
        
        if (shopBannerData) {
          console.log("Setting shop banner with:", {
            imageUrl: shopBannerData.media?.imageUrl || shopBanner.imageUrl,
            altText: shopBannerData.media?.altText || "Fashion Model",
            overlayOpacity: shopBannerData.media?.overlayOpacity || 0.4,
            buttonText: shopBannerData.content?.buttonText || "SHOP NOW",
            buttonLink: shopBannerData.content?.buttonLink || "#shop-now"
          });
          
          setShopBanner({
            imageUrl: shopBannerData.media?.imageUrl || shopBanner.imageUrl,
            altText: shopBannerData.media?.altText || "Fashion Model",
            overlayOpacity: shopBannerData.media?.overlayOpacity || 0.4,
            buttonText: shopBannerData.content?.buttonText || "SHOP NOW",
            buttonLink: shopBannerData.content?.buttonLink || "#shop-now"
          });
        } else {
          console.log("No shop banner data received, using defaults");
        }
      } catch (error) {
        console.error("Error fetching shop banner:", error);
      } finally {
        setShopBannerLoading(false);
      }
    };
    
    fetchShopBanner();
  }, []);

  return (
    <AnimatedSection delay={0.2}>
      <div className="relative w-full h-screen mt-[90px]">
        {/* CMS-Controlled Background Image */}
        {shopBannerLoading ? (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        ) : (
          <>
            <div className="absolute inset-0">
              <AnimatedImage
                src={shopBanner.imageUrl}
                alt={shopBanner.altText}
                className="w-full h-full object-cover"
              />
            </div>

            <div 
              className="absolute inset-0 bg-black"
              style={{ opacity: shopBanner.overlayOpacity }}
            ></div>

            <motion.div
              className="absolute inset-0 flex flex-col justify-end items-center z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="mb-8">
                <Button href={shopBanner.buttonLink}>{shopBanner.buttonText}</Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AnimatedSection>
  );
}