import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import PropTypes from "prop-types";
// import AnimatedImage from "./AnimatedImage";
import api from "../services/api";

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

// Skeleton loading component for PromoSection
const PromoSectionSkeleton = () => {
  return (
    <div className="w-full mt-[103px] mb-[162px] px-4  md:px-8 lg:px-16">
      <div className="flex flex-col  md:flex-row items-center justify-center max-w-6xl mx-auto gap-8">
        {/* Left Image Skeleton */}
        <div className="w-full  md:w-1/2">
          <div className="w-full max-w-[500px] h-[600px] bg-gray-200 animate-pulse mx-auto"></div>
        </div>

        {/* Right Content Skeleton */}
        <div className="w-full  md:w-1/2 px-4">
          <div className="text-center max-w-lg mx-auto space-y-4">
            {/* Heading skeleton */}
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mx-auto"></div>
            
            {/* Description skeleton - multiple lines */}
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 animate-pulse rounded w-full"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-5/6 mx-auto"></div>
              <div className="h-5 bg-gray-200 animate-pulse rounded w-4/5 mx-auto"></div>
            </div>
            
            {/* Link skeleton */}
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3 mx-auto mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PromoSection = () => {
  // Default data in case CMS fails
  const defaultData = {
    title: "Betty Butter",
    description: "Dress in a glaze, not a blaze.",
    imageUrl: "/images/grid1.avif",
    linkText: "Reveal the Collection",
    linkUrl: "/shop"
  };

  const [promoData, setPromoData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromoData = async () => {
      try {
        setLoading(true);
        // Get promo sections from CMS - filter for active sections
        const response = await api.get('/cms/sections?type=promo-section');
        
        if (response.data?.data && response.data.data.length > 0) {
          // Find the first active promo section
          const activePromo = response.data.data.find(section => section.isActive);
          
          if (activePromo) {
            setPromoData({
              title: activePromo.content?.title || defaultData.title,
              description: activePromo.content?.description || defaultData.description,
              imageUrl: activePromo.media?.imageUrl || defaultData.imageUrl,
              linkText: activePromo.content?.linkText || defaultData.linkText,
              linkUrl: activePromo.content?.linkUrl || defaultData.linkUrl
            });
          }
        }
      } catch (error) {
        console.error('Error fetching promo section data:', error);
        // Keep default data on error
      } finally {
        // Short timeout to prevent flickering if loading is very fast
        setTimeout(() => setLoading(false), 300);
      }
    };
    
    fetchPromoData();
  }, []);

  if (loading) {
    return <PromoSectionSkeleton />;
  }

  return (
    <AnimatedSection delay={0.3}>
      <div className="w-full mt-[103px] mb-[162px] px-4  md:px-8 lg:px-16">
        <div className="flex flex-col  md:flex-row items-center justify-center max-w-6xl mx-auto gap-8">
          {/* Left Image Section */}
          <motion.div
            className="w-full  md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={promoData.imageUrl}
              alt="Left Side Image"
              className="w-full max-w-[500px] h-[600px] object-cover mx-auto"
            />
          </motion.div>

          {/* Right Content Section */}
          <motion.div
            className="w-full  md:w-1/2 px-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="text-center max-w-lg mx-auto">
              <motion.h2
                className="text-[30px] font-thin sm:tracking-tight md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst mb-[40px] text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {promoData.title}
              </motion.h2>
              <motion.p
                className="text-[20px] mb-[20px] font-medium text-center"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {promoData.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex justify-center"
              >
                <a href={promoData.linkUrl}>
                  <p className="text-[15px] text-center font-thin sm:tracking-tight md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst relative group inline-block">
                    <span className="border-b-[3px] pb-[3px] group-hover:border-b-0">{promoData.linkText.substring(0, 2)}</span>
                    <span>{promoData.linkText.substring(2)}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-current group-hover:w-full transition-all duration-300"></span>
                  </p>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PromoSection;