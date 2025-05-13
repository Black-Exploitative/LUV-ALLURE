import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import EnhancedProductCard from "./EnhancedProductCard";
import FeaturedProductService from "../services/featuredProductService";
import PropTypes from "prop-types";

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

AnimatedHeading.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

const FeaturedProducts = () => {
  const [sectionTitle, setSectionTitle] = useState("HERE'S WHAT THE SEASON OFFERS");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Add resize listener to track window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to check if mobile view
  const isMobile = windowWidth < 768;

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

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  return (
    <section className="py-12 md:py-16 mt-[60px] md:mt-[90px]">
      {/* Dynamic Section Heading */}
      <div className="mx-4 sm:mx-8 md:mx-[100px] text-center">
        <AnimatedHeading className="md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-[22px] md:text-[30px] font-normal text-black mb-[50px] md:mb-[103px]">
          {sectionTitle}
        </AnimatedHeading>
      </div>

      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-8 mx-2 sm:mx-8 md:mx-[100px]">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="flex justify-center">
              <div className="w-full max-w-[160px] sm:max-w-[240px] md:w-[300px] lg:w-[380px] h-[280px] sm:h-[350px] md:h-[420px] lg:h-[500px] bg-gray-200 animate-pulse"></div>
            </div>
          ))
        ) : (
          products.map((product, index) => (
            <div key={product.id} className="flex justify-center">
              <EnhancedProductCard 
                product={product}
                index={index}
                onProductClick={() => handleProductClick(product)}
                isMobile={isMobile}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;