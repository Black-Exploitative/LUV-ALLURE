import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MiniCartPreview from "../components/MiniCartPreview";
import AnimatedCartBadge from "../components/AnimatedCartBadge";
import SearchBar from "./SearchBar";
import cmsService from "../services/cmsService";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkNavbar, setDarkNavbar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { cartItemCount, setIsCartDrawerOpen } = useCart();
  const location = useLocation();
  const navRef = useRef(null);
  const dropdownRefs = useRef({});

  const [navImages, setNavImages] = useState({
    shop: [],
    dresses: [],
    collections: [],
    newin: []
  });
  
  // New state to track screen size for responsive behavior
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTabletView, setIsTabletView] = useState(false);


  // Load navigation images from CMS
  const loadNavigationImages = async () => {
    try {
      console.log("Fetching nav images...");
      
      // Load images for each category
      const shopImages = await cmsService.getNavigationImages('shop');
      console.log("Shop images:", shopImages);
      
      const dressesImages = await cmsService.getNavigationImages('dresses');
      console.log("Dresses images:", dressesImages);
      
      const collectionsImages = await cmsService.getNavigationImages('collections');
      console.log("Collections images:", collectionsImages);
      
      const newinImages = await cmsService.getNavigationImages('newin');
      console.log("New In images:", newinImages);
      
      setNavImages({
        shop: shopImages,
        dresses: dressesImages,
        collections: collectionsImages,
        newin: newinImages
      });
    } catch (error) {
      console.error("Error loading navigation images:", error);
    }
  };


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

  // Load navigation images on mount
  useEffect(() => {
    loadNavigationImages();
  }, []);

  // Add responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      setIsTabletView(window.innerWidth >= 768 && window.innerWidth < 1024);
      
      // Close dropdown if screen gets too small
      if (window.innerWidth < 1024 && activeDropdown) {
        setActiveDropdown(null);
      }
    };

    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeDropdown]);

  useEffect(() => {
    setDarkNavbar(location.pathname === "/" && !isScrolled);
  }, [location.pathname, isScrolled]);

  const handleCartClick = () => {
    if (cartItemCount === 0) {
      toast.error("No item in cart yet!");
    } else {
      setIsCartDrawerOpen(true);
    }
  };

  // Handle mouse enter for dropdown
  const handleDropdownEnter = (dropdown) => {
    if (!isMobileView && !isTabletView) {
      setActiveDropdown(dropdown);
    }
  };

  // Handle mouse leave for entire dropdown area
  const handleDropdownLeave = () => {
    setActiveDropdown(null);
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

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const ThemedMiniCartPreview = () => {
    return (
      <div className="relative">
        <div 
          className="cart-icon-container relative cursor-pointer flex items-center"
          onClick={handleCartClick}
        >
          <img
            src={darkNavbar ? "/icons/cart.svg" : "/icons/cart-black.svg"}
            alt="Cart"
            className="w-[15px] h-[15px]"
          />
          <div className="relative">
            {cartItemCount > 0 && <AnimatedCartBadge theme={darkNavbar ? "light" : "dark"} />}
          </div>
        </div>
        
        {/* Only render preview if there are items */}
        {cartItemCount > 0 && <MiniCartPreview />}
      </div>
    );
  };

  // Dropdown content configuration
  const dropdownContent = {
    shop: {
      columns: [
        {
          title: "ALL CLOTHING",
          links: [
            { name: "Dresses", href: "#" },
            { name: "Tops", href: "#" },
            { name: "Skirts & Skorts", href: "#" },
            { name: "Sets", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Playsuits & Jumpsuits", href: "#" },
            { name: "All Clothing", href: "/shop" }
          ]
        },
        {
          title: "ALL GIFTING",
          links: [
            { name: "Gift Cards", href: "#" },
            { name: "Vouchers", href: "#" },
            { name: "Membership", href: "#" },
            { name: "All Gifting", href: "#" }
          ]
        }
      ],
      featuredItems: [
        {
          image: "https://plus.unsplash.com/premium_photo-1682097559861-d5d5027868b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fE1heGklMjBkcmVzc3xlbnwwfHwwfHx8MA%3D%3D",
          title: "MAXI DRESSES",
          href: "#"
        },
        {
          image: "https://images.unsplash.com/photo-1719610894782-7b376085e200?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1pbmklMjBkcmVzc3xlbnwwfHwwfHx8MA%3D%3D",
          title: "MINI DRESSES",
          href: "#"
        }
      ]
    },
    dresses: {
      columns: [
        {
          title: "DRESSES BY LENGTH",
          links: [
            { name: "All Dresses", href: "#" },
            { name: "Mini Dresses", href: "#" },
            { name: "Maxi Dresses", href: "#" },
            { name: "Midi Dresses", href: "#" }
          ]
        },
        {
          title: "DRESSES BY STYLE",
          links: [
            { name: "Prom Dresses", href: "#" },
            { name: "Formal Dresses", href: "#" },
            { name: "Party Dresses", href: "#" },
            { name: "Wedding Guest Dresses", href: "#" },
            { name: "Bridesmaid Dresses", href: "#" },
//            { name: "Bridal Dresses", href: "#" },
            { name: "Corset Dresses", href: "#" },
            { name: "Bubblehem Dresses", href: "#" },
            { name: "Flowy Dresses", href: "#" }
          ]
        },
        {
          title: "DRESSES BY COLOUR",
          links: [
            { name: "White Dresses", href: "#" },
            { name: "Red Dresses", href: "#" },
            { name: "Pink Dresses", href: "#" },
            { name: "Yellow Dresses", href: "#" },
            { name: "Blue Dresses", href: "#" },
            { name: "Embelishment Dresses", href: "#" }
          ]
        }
      ],
      featuredItems: [
        {
          image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "SHOP ALL DRESSES",
          href: "#"
        }
      ]
    },
    collections: {
      columns: [
        {
          title: "COLLECTIONS",
          links: [
            { name: "All Collections", href: "#s" }
          ]
        },
        {
          title: "OCCASION",
          links: [
            { name: "Birthdays", href: "#" },
            { name: "Formal", href: "#" },
            { name: "Party", href: "#" },
            { name: "Wedding Guest", href: "#" },
            { name: "Bridesmaid", href: "#" },
            { name: "Bridal", href: "#" },
            { name: "Holiday", href: "#" },
            { name: "Festival", href: "#" }
          ]
        },
        {
          title: "TRENDING",
          links: [
          ]
        }
      ],
      featuredItems: [
        {
          image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "THE WEDDING EDIT",
          href: "#"
        }
      ]
    },
    newin: {
      columns: [
        {
          title: "NEW IN",
          links: [
            { name: "New Arrivals", href: "#" },
            { name: "Back In Stock", href: "#" },
            { name: "Most Popular", href: "#" },
          ]
        }
      ],
      featuredItems: [
        {
          image: "https://images.unsplash.com/photo-1642447411662-59ab77473a8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "NEW ARRIVALS",
          href: "#"
        },
        {
          image: "https://images.unsplash.com/photo-1626818590159-04cb9274a5e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "SEASONAL SALE | 25% OFF",
          href: "#"
        }
      ]
    }
  };

  // Update how featured items are generated in the dropdownContent object
  const getDropdownFeaturedItems = (category) => {
    // If CMS images are available for this category
    if (navImages[category] && navImages[category].length > 0) {
      return navImages[category].map(image => ({
        image: image.imageUrl,
        title: image.name.toUpperCase(),
        href: image.link || "#"
      }));

    }
    
    // Fallback to the default items if no CMS images
    return dropdownContent[category].featuredItems;
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : (location.pathname !== "/" ? "bg-white" : "bg-transparent")
      }`}
    >                                      
      <div className="container mx-auto py-4 px-6 flex justify-between items-center h-[70px] relative">
        {/* Left-side Navigation Links (Desktop and Tablet) */}
        <div className={`hidden md:flex space-x-2 lg:space-x-6 text-xs lg:text-[12px] ${darkNavbar ? "text-white" : "text-black"}`}>
          {/* SHOP Dropdown */}
          <div 
            className="nav-dropdown-container relative"
            onMouseEnter={() => handleDropdownEnter('shop')}
            onMouseLeave={handleDropdownLeave}
            ref={el => dropdownRefs.current['shop'] = el}
          >
            <a 
              href="#" 
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === 'shop' ? 'active-nav-item' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'shop' ? null : 'shop');
              }}
            >
              SHOP
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === 'shop' && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>

          {/* DRESSES Dropdown */}
          <div 
            className="nav-dropdown-container relative"
            onMouseEnter={() => handleDropdownEnter('dresses')}
            onMouseLeave={handleDropdownLeave}
            ref={el => dropdownRefs.current['dresses'] = el}
          >
            <a 
              href="#" 
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === 'dresses' ? 'active-nav-item' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'dresses' ? null : 'dresses');
              }}
            >
              DRESSES
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === 'dresses' && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>

          {/* COLLECTIONS Dropdown - Hide on smaller tablets */}
          <div 
            className="nav-dropdown-container relative hidden lg:block"
            onMouseEnter={() => handleDropdownEnter('collections')}
            onMouseLeave={handleDropdownLeave}
            ref={el => dropdownRefs.current['collections'] = el}
          >
            <a 
              href="#" 
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === 'collections' ? 'active-nav-item' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'collections' ? null : 'collections');
              }}
            >
              LOOKBOOK
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === 'collections' && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>

          {/* NEW IN Dropdown - Hide on smaller tablets */}
          <div 
            className="nav-dropdown-container relative hidden lg:block"
            onMouseEnter={() => handleDropdownEnter('newin')}
            onMouseLeave={handleDropdownLeave}
            ref={el => dropdownRefs.current['newin'] = el}
          >
            <a 
              href="#" 
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === 'newin' ? 'active-nav-item' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === 'newin' ? null : 'newin');
              }}
            >
              NEW ARRIVALS
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === 'newin' && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>
        </div>

        {/* Hamburger Menu Button (Mobile only, Left) */}
        <motion.button 
          className="md:hidden relative z-50 cursor-pointer"
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
              className="w-[15px] h-[12px]" 
            />
          )}
        </motion.button>

        {/* Logo (Center) */}
        
        <div className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
        <a href="/">
          <motion.img 
            src={darkNavbar ? "/images/LA-2.png" : "/images/LA-1.png"} 
            alt="Logo" 
            className="h-[55px]"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          /></a>
        </div>

        {/* Right-side Navigation (Desktop and Tablet) */}
        <div className={`hidden md:flex items-center space-x-6 text-xs lg:text-[12px] ${darkNavbar ? "text-white" : "text-black"}`}>
          {/* Show these links only on larger screens */}
          <a href="/contact-us" className="hover:opacity-80 h-full flex items-center whitespace-nowrap">CONTACT US</a>
          <a href="/services" className="hover:opacity-80 h-full flex items-center whitespace-nowrap">SERVICES</a>
          
          {/* Icons - wrapped in a flex container with consistent alignment */}
          <div className="flex items-center space-x-6">
            
            <motion.div className="flex items-center h-full"> 
              <SearchBar />
            </motion.div>
            
            <a href="/user-account">
            <motion.div className="flex items-center h-full">
              <motion.img 
                src={darkNavbar ? "/icons/contact.svg" : "/icons/contact-black.svg"} 
                alt="Phone" 
                className="w-[12.6px] h-[15px] cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            </motion.div>
            </a>

            {/* Enhanced Cart Icon with Preview */}
            <motion.div 
              className="flex items-center h-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemedMiniCartPreview />
            </motion.div>
          </div>
        </div>
                
        {/* Mobile Right Icons */}
        <div className={`md:hidden flex space-x-4 items-center ${darkNavbar ? "text-white" : "text-black"}`}>
          <motion.div className="flex items-center">
            <motion.img 
              src={darkNavbar ? "/icons/search.svg" : "/icons/search-black.svg"} 
              alt="Search" 
              className="w-5 h-5 cursor-pointer" 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </motion.div>
          
          <motion.div className="flex items-center">
            <motion.img 
              src={darkNavbar ? "/icons/contact.svg" : "/icons/contact-black.svg"} 
              alt="Phone" 
              className="w-5 h-5 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          </motion.div>

          {/* Mobile Cart with Preview */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ThemedMiniCartPreview />
          </motion.div>
        </div>
      </div>

      {/* Dropdowns Container - Outside the navbar, only for desktop */}
      <AnimatePresence>
        {activeDropdown && !isMobileView && !isTabletView && (
          <motion.div 
            className="absolute left-0 w-full bg-white text-black shadow-lg z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            onMouseEnter={() => handleDropdownEnter(activeDropdown)}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="container mx-auto py-8 px-6 grid grid-cols-12 gap-6">
              {/* Left Side - Text Links */}
              {dropdownContent[activeDropdown].columns.map((column, colIndex) => (
                <div key={colIndex} className="col-span-3">
                  <h3 className="font-medium text-sm mb-4">{column.title}</h3>
                  <div className="flex flex-col space-y-2">
                    {column.links.map((link, linkIndex) => (
                      <a key={linkIndex} href={link.href} className="text-sm hover:underline">
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Right Side - Featured Images from CMS */}
              {getDropdownFeaturedItems(activeDropdown).map((item, itemIndex) => (
                <div key={itemIndex} className="col-span-3">
                  <a href={item.href} className="block">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <p className="text-center font-medium text-sm mt-2">{item.title}</p>
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-white z-40 flex flex-col justify-center items-center overflow-y-auto"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col space-y-8 text-black text-2xl font-medium">
              {[
                { name: "SHOP", link: "shop" },
                { name: "DRESSES", link: "#" },
                { name: "COLLECTIONS", link: "#" },
                { name: "NEW IN", link: "#" },
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

      <style jsx>{`
        .active-nav-item {
          position: relative;
        }
      `}</style>
    </nav>
  );
}