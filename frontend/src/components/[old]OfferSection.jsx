import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Button from "./Button";
import AnimatedImage from "./AnimatedImage";
import PropTypes from "prop-types";
import EnhancedProductCard from "./EnhancedProductCard";
import FeaturedProductService from "../services/featuredProductService";
import cmsService from "../services/cmsService";
import { useNavigate } from "react-router-dom"; 

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

export default function OfferSection() {
  const [sectionTitle, setSectionTitle] = useState("HERE'S WHAT THE SEASON OFFERS");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopBanner, setShopBanner] = useState({
    imageUrl: "/images/photo3.jpg",
    altText: "Fashion Model",
    overlayOpacity: 0.4,
    buttonText: "SHOP NOW",
    buttonLink: "#shop-now"
  });
  const [shopBannerLoading, setShopBannerLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.style.overflowX = "";
    };
  }, []);
  
  // Fetch shop banner data from CMS
  useEffect(() => {
    const fetchShopBanner = async () => {
      try {
        setShopBannerLoading(true);
        console.log("Fetching shop banner...");
        
        const shopBannerData = await cmsService.getShopBanner();
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
  
  // Fetch featured products and section configuration
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Fetch products from our service
        const fetchedProducts = await FeaturedProductService.getFeaturedProducts();
        setProducts(fetchedProducts);
        
        // You would also fetch section title from CMS here
        // For now, we'll use the default or mock a CMS response
        setSectionTitle("HERE'S WHAT THE SEASON OFFERS");
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Fallback data
        setProducts([
          { 
            id: 1, 
            title: "Crimson Allure", 
            images: ["/images/photo4.jpg", "/images/photo5.jpg"],
            price: 250000
          },
          { 
            id: 2, 
            title: "L'dact Allure", 
            images: ["/images/photo5.jpg", "/images/photo4.jpg"],
            price: 180000
          },
          { 
            id: 3, 
            title: "Novo Amor Allure", 
            images: ["/images/photo6.jpg", "/images/photo3.jpg"],
            price: 210000
          },
          { 
            id: 4, 
            title: "Swivel Allure", 
            images: ["/images/man-wearing-blank-shirt.jpg", "/images/photo4.jpg"],
            price: 195000
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

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

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <div className="overflow-x-hidden w-full">
      <section className="py-16 mt-[90px]">
        {/* Dynamic Section Heading */}
        <div className="mx-[100px] text-center">
          <AnimatedHeading className="tracking-wider text-[30px] font-normal text-black mb-[103px]">
            {sectionTitle}
          </AnimatedHeading>
        </div>

        {/* Enhanced Product Grid with Auto-Carousel Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mx-[100px]">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="flex justify-center">
                <div className="w-[380px] h-[500px] bg-gray-200 animate-pulse"></div>
              </div>
            ))
          ) : (
            products.map((product, index) => (
              <div key={product.id} className="flex justify-center">
                <EnhancedProductCard 
                  product={product}
                  index={index}
                  onProductClick={() => handleProductClick(product)}
                />
              </div>
            ))
          )}
        </div>
      </section>

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