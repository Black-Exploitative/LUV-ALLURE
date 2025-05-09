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

// Animated heading component
const AnimatedHeading = ({ children, className }) => {
  const controls = useAnimation();
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.h2
      ref={headingRef}
      className={className}
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.h2>
  );
};

// Service card component
const ServiceCard = ({ src, title, description, index }) => {
  const controls = useAnimation();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={cardRef}
      className="flex flex-col items-center text-center"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{ duration: 0.7, delay: index * 0.2 }}
    >
      <AnimatedImage
        src={src}
        alt={title}
        className="w-[400px] h-[400px] object-cover"
      />

      <motion.h3
        className="text-[18px] font-medium tracking-wide mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.2 }}
      >
        {title}
      </motion.h3>

      <motion.p
        className="mt-2 text-[14px] font-normal text-[#5F6368] max-w-[350px] mx-auto" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.2 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      src: "https://plus.unsplash.com/premium_photo-1661578500173-608987c20fc8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29uYWwlMjBzaG9waW5nfGVufDB8fDB8fHww",
      title: "EXCLUSIVE PERSONAL SHOPPING",
      description:
        "Looking for something special that's not in our collection? Share your vision, and we'll find it or curate a perfect alternative just for you.",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3R5bGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      title: "SIGNATURE STYLING SERVICE",
      description:
        "From birthdays to galas, our expert stylists create personalized looks tailored to your unique style and any occasion.",
    },
    {
      id: 3,
      src: "https://plus.unsplash.com/premium_photo-1664530452424-2bc239d787d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZHJlc3MlMjBmaXR0aW5nfGVufDB8fDB8fHww",
      title: "PERFECT FIT TAILORING",
      description:
        "Ensure every piece fits perfectly. Our tailoring service adjusts garments from our collection to match your exact measurements.",
    },
  ];

  return (
    <AnimatedSection delay={0.4}>
      <div className="w-full my-[50px]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <AnimatedHeading className="tracking-wider text-[25px] font-normal text-black mb-[50px]">
              LUV'S ALLURE SERVICES
            </AnimatedHeading>
          </div>
     
          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                src={service.src}
                title={service.title}
                description={service.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

ServiceCard.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

AnimatedSection.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
};

AnimatedHeading.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

export default ServicesSection;