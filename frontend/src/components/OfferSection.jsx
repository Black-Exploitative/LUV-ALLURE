import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Button from "./Button";
import AnimatedImage from "./AnimatedImage";
import PropTypes from "prop-types";

// Enhanced ProductCard component with animations
const ProductCard = ({ src, title, index }) => {
  const controls = useAnimation();
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={cardRef}
      className="w-[380px] h-auto rounded-none overflow-hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      animate={controls}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: "easeOut",
      }}
    >
      <AnimatedImage
        src={src}
        alt={title}
        className="w-full h-[500px] object-cover"
      />

      <motion.h3
        className="text-[15px] text-center font-medium text-black mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 + index * 0.15 }}
      >
        {title}
      </motion.h3>
    </motion.div>
  );
};

// Section component with animations
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


// Proptype validation

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

export default function OfferSection() {
  useEffect(() => {
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.style.overflowX = "";
    };
  }, []);
  const products = [
    { id: 1, src: "/images/photo4.jpg", title: "Crimson Allure" },
    { id: 2, src: "/images/photo5.jpg", title: "L'dact Allure" },
    { id: 3, src: "/images/photo6.jpg", title: "Novo Amor Allure" },
    {
      id: 4,
      src: "/images/man-wearing-blank-shirt.jpg",
      title: "Swivel Allure",
    },
  ];

  const services = [
    {
      id: 1,
      src: "/images/photo11.jpg",
      title: "EXCLUSIVE PERSONAL SHOPPING",
      description:
        "Looking for something special that's not in our collection? Share your vision, and we'll find it or curate a perfect alternative just for you.",
    },
    {
      id: 2,
      src: "/images/photo12.jpg",
      title: "SIGNATURE STYLING SERVICE",
      description:
        "From birthdays to galas, our expert stylists create personalized looks tailored to your unique style and any occasion.",
    },
    {
      id: 3,
      src: "/images/photo13.jpg",
      title: "PERFECT FIT TAILORING",
      description:
        "Ensure every piece fits perfectly. Our tailoring service adjusts garments from our collection to match your exact measurements.",
    },
  ];

  return (
    <div className="overflow-x-hidden w-full">
      <section className="py-16 mt-[90px]">
        {/* Section Heading */}
        <div className=" mx-[100px] text-center">
          <AnimatedHeading className="tracking-wider text-[30px] font-normal text-black mb-[103px]">
            HERE’S WHAT THE SEASON OFFERS
          </AnimatedHeading>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mx-[100px]">
          {products.map((product, index) => (
            <div key={product.id} className="flex justify-center">
              <ProductCard
                src={product.src}
                title={product.title}
                index={index}
              />
            </div>
          ))}
        </div>
      </section>

      <AnimatedSection delay={0.2}>
        <div className="relative w-full h-screen mt-[90px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <AnimatedImage
              src="/images/photo3.jpg"
              alt="Fashion Model"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-black opacity-40"></div>

          <motion.div
            className="absolute inset-0 flex flex-col justify-end items-center z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="mb-8">
              <Button href="#shop-now">SHOP NOW</Button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>

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
                src="/images/grid1.avif"
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
                  We Share the Love of Valentine
                </motion.h2>
                <motion.p
                  className="text-[20px] mb-[20px] font-medium text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  As the lofty and flory presence of valentine ensumes the air and
                  fills our heart. We bring you a subtlyty of blah blah blah this
                  that that.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex justify-center"
                >
                  <a href='#'>
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

      <AnimatedSection delay={0.4}>
        <div className="w-full my-[100px]">
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
    </div>
  );
}

ProductCard.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
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


ServiceCard.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
