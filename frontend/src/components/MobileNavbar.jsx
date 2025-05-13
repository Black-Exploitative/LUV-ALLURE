/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import MiniCartPreview from "../components/MiniCartPreview";
import AnimatedCartBadge from "../components/AnimatedCartBadge";
import SearchBar from "./SearchBar";

export default function MobileNavbar({ darkNavbar }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const { cartItemCount, setIsCartDrawerOpen } = useCart();

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

  const handleCartClick = () => {
    if (cartItemCount === 0) {
      toast.error("No item in cart yet!");
    } else {
      setIsCartDrawerOpen(true);
    }
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + index * 0.1,
        duration: 0.5,
      },
    }),
  };

  const subMenuVariants = {
    closed: { 
      height: 0,
      opacity: 0,
      marginTop: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: { 
      height: "auto",
      opacity: 1,
      marginTop: 8,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Dropdown content configuration 
  const dropdownContent = {
    shop: {
      columns: [
        {
          title: "ALL CLOTHING",
          links: [
            { name: "Dresses", href: "/shop/dresses" },
            { name: "Tops", href: "/shop/tops" },
            { name: "Skirts & Skorts", href: "/shop/skirts&skorts" },
            { name: "Sets", href: "/shop/sets" },
            { name: "Pants & Capris'", href: "/shop/pants" },
            { name: "Jumpsuits", href: "/shop/jumpsuits" },
            { name: "All Clothing", href: "/shop" },
          ],
        },
        {
          title: "ALL GIFTING",
          links: [
            { name: "Gift Cards", href: "/Shop/gift-cards" },
            { name: "Vouchers", href: "/Shop/vouchers" },
            { name: "Membership", href: "/Shop/membership" },
            { name: "All Gifting", href: "/shop/gifting" },
          ],
        },
      ],
    },
    dresses: {
      columns: [
        {
          title: "DRESSES BY LENGTH",
          links: [
            { name: "All Dresses", href: "/shop" },
            { name: "Mini Dresses", href: "/shop/mini-dresses" },
            { name: "Maxi Dresses", href: "/shop/maxi-dresses" },
            { name: "Midi Dresses", href: "/shop/midi-dresses" },
          ],
        },
        {
          title: "DRESSES BY STYLE",
          links: [
            { name: "Prom Dresses", href: "/shop/prom-dresses" },
            { name: "Formal Dresses", href: "/shop/formal-dresses" },
            { name: "Party Dresses", href: "/shop/party-dresses" },
            {
              name: "Wedding Guest Dresses",
              href: "/shop/wedding-guest-dresses",
            },
            { name: "Corset Dresses", href: "/shop/corset-dresses" },
            { name: "Bubblehem Dresses", href: "/shop/bubblehem-dresses" },
            { name: "Flowy Dresses", href: "/shop/flowy-dresses" },
          ],
        },
        {
          title: "DRESSES BY COLOUR",
          links: [
            { name: "White Dresses", href: "/shop/white-dresses" },
            { name: "Red Dresses", href: "/shop/red-dresses" },
            { name: "Pink Dresses", href: "/shop/pink-dresses" },
            { name: "Yellow Dresses", href: "/shop/yellow-dresses" },
            { name: "Green Dresses", href: "/shop/green-dresses" },
            { name: "Brown Dresses", href: "/shop/brown-dresses" },
            { name: "Blue Dresses", href: "/shop/blue-dresses" },
            { name: "Black Dresses", href: "/shop/black-dresses" },
            { name: "Embelishment Dresses", href: "/shop/embelishment-dresses" },
          ],
        },
      ],
    },
    collections: {
      columns: [
        {
          title: "Collections",
          links: [{ name: "All Vendors", href: "/collections" }],
        },
        {
          title: "OCCASION",
          links: [
            { name: "Birthdays", href: "/collections/birthdays" },
            { name: "Formal", href: "/collections/formal" },
            { name: "Party", href: "/collections/party" },
            { name: "Wedding Guest", href: "/collections/wedding-guest" },
            { name: "Holiday", href: "/collections/holiday" },
            { name: "Festival", href: "/collections/festival" },
          ],
        },
      ],
    },
    newin: {
      columns: [
        {
          title: "NEW IN",
          links: [
            { name: "New Arrivals", href: "/collections/new-arrivals" },
            { name: "Back In Stock", href: "/collections/back-in-stock" },
            { name: "Most Popular", href: "/collections/most-popular" },
          ],
        },
      ],
    },
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
            {cartItemCount > 0 && (
              <AnimatedCartBadge theme={darkNavbar ? "light" : "dark"} />
            )}
          </div>
        </div>

        {/* Only render preview if there are items */}
        {cartItemCount > 0 && <MiniCartPreview />}
      </div>
    );
  };

  return (
    <>
      <div className="container mx-auto py-4 px-6 flex justify-between items-center h-[70px] relative">
        {/* Hamburger Menu Button */}
        <motion.button
          className="relative z-50 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isMobileMenuOpen ? (
            <div className="relative flex items-center">
              <div className="absolute bg-black rounded-full w-10 h-10 flex items-center justify-center">
                <img
                  src="/icons/close-menu.svg"
                  alt="Close Menu"
                  className="w-5 h-5"
                />
              </div>
            </div>
          ) : (
            <img
              src={
                darkNavbar
                  ? "/icons/hamburger.svg"
                  : "/icons/hamburger-black.svg"
              }
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
            />
          </a>
        </div>

        {/* Right Icons */}
        <div className={`flex space-x-4 items-center ${
          darkNavbar ? "text-white" : "text-black"
        }`}>
          <motion.div className="flex items-center">
            <SearchBar darkNavbar={darkNavbar} />
          </motion.div>

          <motion.div className="flex items-center">
            <motion.img
              src={
                darkNavbar ? "/icons/contact.svg" : "/icons/contact-black.svg"
              }
              alt="Phone"
              className="w-[12.6px] h-[15px] cursor-pointer"
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

      {/* Full Screen Mobile Menu Overlay with Expandable Sections */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-40 flex flex-col pt-20 overflow-y-auto"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="container mx-auto px-6 flex flex-col text-black">
              {/* Main Navigation Links with Expandable Sections */}
              <div className="space-y-2 mt-6">
                {/* SHOP Section */}
                <div className="border-b border-gray-200 pb-4">
                  <motion.div 
                    className="flex justify-between items-center cursor-pointer py-2"
                    variants={linkVariants}
                    custom={0}
                    onClick={() => toggleSection('shop')}
                  >
                    <span className="text-xl md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider font-medium">SHOP</span>
                    <img 
                      src="/icons/arrow-down.svg" 
                      alt="Expand" 
                      className={`w-4 h-4 transition-transform duration-300 ${expandedSection === 'shop' ? 'rotate-180' : ''}`}
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedSection === 'shop' && (
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-4 space-y-6">
                          {dropdownContent.shop.columns.map((column, colIndex) => (
                            <div key={colIndex}>
                              <h3 className="font-medium text-sm mb-3">{column.title}</h3>
                              <div className="flex flex-col space-y-3">
                                {column.links.map((link, linkIndex) => (
                                  <a
                                    key={linkIndex}
                                    href={link.href}
                                    className="text-sm text-gray-700 hover:text-black"
                                  >
                                    {link.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* DRESSES Section */}
                <div className="border-b border-gray-200 pb-4">
                  <motion.div 
                    className="flex justify-between items-center cursor-pointer py-2"
                    variants={linkVariants}
                    custom={1}
                    onClick={() => toggleSection('dresses')}
                  >
                    <span className="text-xl md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider font-medium">DRESSES</span>
                    <img 
                      src="/icons/arrow-down.svg" 
                      alt="Expand" 
                      className={`w-4 h-4 transition-transform duration-300 ${expandedSection === 'dresses' ? 'rotate-180' : ''}`}
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedSection === 'dresses' && (
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-4 space-y-6">
                          {dropdownContent.dresses.columns.map((column, colIndex) => (
                            <div key={colIndex}>
                              <h3 className="font-medium text-sm mb-3">{column.title}</h3>
                              <div className="flex flex-col space-y-3">
                                {column.links.map((link, linkIndex) => (
                                  <a
                                    key={linkIndex}
                                    href={link.href}
                                    className="text-sm text-gray-700 hover:text-black"
                                  >
                                    {link.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* COLLECTIONS Section */}
                <div className="border-b border-gray-200 pb-4">
                  <motion.div 
                    className="flex justify-between items-center cursor-pointer py-2"
                    variants={linkVariants}
                    custom={2}
                    onClick={() => toggleSection('collections')}
                  >
                    <span className="text-xl md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider font-medium">LOOKBOOK</span>
                    <img 
                      src="/icons/arrow-down.svg" 
                      alt="Expand" 
                      className={`w-4 h-4 transition-transform duration-300 ${expandedSection === 'collections' ? 'rotate-180' : ''}`}
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedSection === 'collections' && (
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-4 space-y-6">
                          {dropdownContent.collections.columns.map((column, colIndex) => (
                            <div key={colIndex}>
                              <h3 className="font-medium text-sm mb-3">{column.title}</h3>
                              <div className="flex flex-col space-y-3">
                                {column.links.map((link, linkIndex) => (
                                  <a
                                    key={linkIndex}
                                    href={link.href}
                                    className="text-sm text-gray-700 hover:text-black"
                                  >
                                    {link.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* NEW IN Section */}
                <div className="border-b border-gray-200 pb-4">
                  <motion.div 
                    className="flex justify-between items-center cursor-pointer py-2"
                    variants={linkVariants}
                    custom={3}
                    onClick={() => toggleSection('newin')}
                  >
                    <span className="text-xl md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider font-medium">NEW ARRIVALS</span>
                    <img 
                      src="/icons/arrow-down.svg" 
                      alt="Expand" 
                      className={`w-4 h-4 transition-transform duration-300 ${expandedSection === 'newin' ? 'rotate-180' : ''}`}
                    />
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedSection === 'newin' && (
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={subMenuVariants}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-4 space-y-6">
                          {dropdownContent.newin.columns.map((column, colIndex) => (
                            <div key={colIndex}>
                              <h3 className="font-medium text-sm mb-3">{column.title}</h3>
                              <div className="flex flex-col space-y-3">
                                {column.links.map((link, linkIndex) => (
                                  <a
                                    key={linkIndex}
                                    href={link.href}
                                    className="text-sm text-gray-700 hover:text-black"
                                  >
                                    {link.name}
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Additional Links without dropdowns */}
                <motion.a
                  href="/contact-us"
                  className="block text-xl md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider font-medium py-4 border-b border-gray-200"
                  variants={linkVariants}
                  custom={4}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  CONTACT US
                </motion.a>
                
                <motion.a
                  href="/services"
                  className="block text-xl md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider font-medium py-4 border-b border-gray-200"
                  variants={linkVariants}
                  custom={5}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  SERVICES
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}