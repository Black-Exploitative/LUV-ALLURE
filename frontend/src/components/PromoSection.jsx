import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import PropTypes from "prop-types";
import AnimatedImage from "./AnimatedImage";

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

const PromoSection = () => {
  // This could be fetched from CMS
  const promoData = {
    title: "We Share the Love of Valentine",
    description: "As the lofty and flory presence of valentine ensumes the air and fills our heart. We bring you a subtlyty of blah blah blah this that that.",
    imageUrl: "/images/grid1.avif",
    linkText: "Explore Collection",
    linkUrl: "#"
  };

  return (
    <AnimatedSection delay={0.3}>
      <div className="w-full mt-[103px] mb-[162px] px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto gap-8">
          {/* Left Image Section */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatedImage
              src={promoData.imageUrl}
              alt="Left Side Image"
              className="w-full max-w-[500px] h-[600px] object-cover mx-auto"
            />
          </motion.div>

          {/* Right Content Section */}
          <motion.div
            className="w-full md:w-1/2 px-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="text-center max-w-lg mx-auto">
              <motion.h2
                className="text-[30px] font-extralight mb-[40px] text-center"
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
                  <p className="text-[15px] text-center relative group inline-block">
                    <span className="border-b-[3px] pb-[3px] group-hover:border-b-0">Ex</span>
                    <span>plore Collection</span>
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