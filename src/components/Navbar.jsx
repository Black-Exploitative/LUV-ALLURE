import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkNavbar, setDarkNavbar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDarkNavbar(location.pathname === "/" && !isScrolled);
  }, [location.pathname, isScrolled]);

  const handleCartClick = () => {
    if (cartItemCount === 0) {
      toast.error("No item in cart yet!");
    } else {
      navigate('/checkout');
    }
  };

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: index => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + index * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== "/" ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Left-side Navigation Links (Desktop) */}
        <div className={`hidden md:flex space-x-6 ${darkNavbar ? "text-white" : "text-black"}`}>
          <a href="#" className="hover:underline">SHOP</a>
          <a href="#" className="hover:underline">TRENDING</a>
          <a href="#" className="hover:underline">LOOKBOOK</a>
          <a href="#" className="hover:underline">NEW ARRIVALS</a>
        </div>

        {/* Hamburger Menu Button (Mobile only, Left) */}
        <motion.button 
          className="md:hidden relative z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? (
            <div className="relative flex items-center">
              <div className="absolute bg-black rounded-full w-10 h-10 flex items-center justify-center">
                <img src="/icons/close-menu.svg" alt="Close Menu" className="w-5 h-5" />
              </div>
            </div>
          ) : (
            <img 
              src={darkNavbar ? "/icons/hamburger.svg" : "/icons/hamburger-black.svg"} 
              alt="Menu" 
              className="w-7 h-7" 
            />
          )}
        </motion.button>

        {/* Logo (Center) */}
        <div className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
          <motion.img 
            src={darkNavbar ? "/images/logo-white.png" : "/images/logo-black.svg"} 
            alt="Logo" 
            className="h-10"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Right-side Navigation (Desktop) */}
        <div className={`hidden md:flex space-x-6 items-center ${darkNavbar ? "text-white" : "text-black"}`}>
          <a href="#" className="hover:underline">CONTACT US</a>
          <a href="#" className="hover:underline">SERVICES</a>
          <motion.img 
            src={darkNavbar ? "/icons/search.svg" : "/icons/search-black.svg"} 
            alt="Search" 
            className="w-5 h-5 cursor-pointer" 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.img 
            src={darkNavbar ? "/icons/contact.svg" : "/icons/contact-black.svg"} 
            alt="Phone" 
            className="w-5 h-5 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />

          {/* Cart Icon */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={darkNavbar ? "/icons/cart.svg" : "/icons/cart-black.svg"}
              alt="Cart"
              className="w-5 h-5 cursor-pointer"
              onClick={handleCartClick}
            />
            {cartItemCount > 0 && (
              <motion.span 
                className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {cartItemCount}
              </motion.span>
            )}
          </motion.div>
        </div>
        
        {/* Mobile Right Icons */}
        <div className={`md:hidden flex space-x-6 items-center ${darkNavbar ? "text-white" : "text-black"}`}>
          <motion.img 
            src={darkNavbar ? "/icons/search.svg" : "/icons/search-black.svg"} 
            alt="Search" 
            className="w-5 h-5 cursor-pointer" 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.img 
            src={darkNavbar ? "/icons/contact.svg" : "/icons/contact-black.svg"} 
            alt="Phone" 
            className="w-5 h-5 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />

          {/* Cart Icon */}
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img
              src={darkNavbar ? "/icons/cart.svg" : "/icons/cart-black.svg"}
              alt="Cart"
              className="w-5 h-5 cursor-pointer"
              onClick={handleCartClick}
            />
            {cartItemCount > 0 && (
              <motion.span 
                className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {cartItemCount}
              </motion.span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white z-40 flex flex-col justify-center items-center"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col space-y-8 text-black text-2xl font-medium">
              {[
                { name: "SHOP", link: "#" },
                { name: "TRENDING", link: "#" },
                { name: "LOOKBOOK", link: "#" },
                { name: "NEW ARRIVALS", link: "#" },
                { name: "CONTACT US", link: "#" },
                { name: "SERVICES", link: "#" }
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.link}
                  className="hover:text-gray-600 transition-colors tracking-wide"
                  custom={index}
                  variants={linkVariants}
                  whileHover={{ x: 10 }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}