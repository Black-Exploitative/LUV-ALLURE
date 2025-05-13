/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MiniCartPreview from "../components/MiniCartPreview";
import AnimatedCartBadge from "../components/AnimatedCartBadge";
import SearchBar from "./SearchBar";
import cmsService from "../services/cmsService";

export default function DesktopNavbar({ darkNavbar }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { cartItemCount, setIsCartDrawerOpen } = useCart();
  const location = useLocation();
  const navRef = useRef(null);
  const dropdownRefs = useRef({});

  const [navImages, setNavImages] = useState({
    shop: [],
    dresses: [],
    collections: [],
    newin: [],
  });

  // Load navigation images from CMS
  const loadNavigationImages = async () => {
    try {
      console.log("Fetching nav images...");

      // Load images for each category
      const shopImages = await cmsService.getNavigationImages("shop");
      console.log("Shop images:", shopImages);

      const dressesImages = await cmsService.getNavigationImages("dresses");
      console.log("Dresses images:", dressesImages);

      const collectionsImages = await cmsService.getNavigationImages(
        "collections"
      );
      console.log("Collections images:", collectionsImages);

      const newinImages = await cmsService.getNavigationImages("newin");
      console.log("New In images:", newinImages);

      setNavImages({
        shop: shopImages,
        dresses: dressesImages,
        collections: collectionsImages,
        newin: newinImages,
      });
    } catch (error) {
      console.error("Error loading navigation images:", error);
    }
  };

  // Load navigation images on mount
  useEffect(() => {
    loadNavigationImages();
  }, []);

  const handleCartClick = () => {
    if (cartItemCount === 0) {
      toast.error("No item in cart yet!");
    } else {
      setIsCartDrawerOpen(true);
    }
  };

  // Handle mouse enter for dropdown
  const handleDropdownEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  // Handle mouse leave for entire dropdown area
  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
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

  // Dropdown content configuration
  const dropdownContent = {
    shop: {
      columns: [
        {
          title: "ALL CLOTHING",
          links: [
            { name: "Dresses", href: "/shop/dresses" },
            { name: "Tops", href: "/shop/tops" },
            { name: "Skirts & Skorts", href: "#/shop/skirts&skorts" },
            { name: "Sets", href: "#/shop/sets" },
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
      featuredItems: [
        {
          image:
            "https://plus.unsplash.com/premium_photo-1682097559861-d5d5027868b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fE1heGklMjBkcmVzc3xlbnwwfHwwfHx8MA%3D%3D",
          title: "MAXI DRESSES",
          href: "",
        },
        {
          image:
            "https://images.unsplash.com/photo-1719610894782-7b376085e200?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1pbmklMjBkcmVzc3xlbnwwfHwwfHx8MA%3D%3D",
          title: "MINI DRESSES",
          href: "",
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
            { name: "White Dresses", href: "#" },
            { name: "Red Dresses", href: "#" },
            { name: "Pink Dresses", href: "#" },
            { name: "Yellow Dresses", href: "#" },
            { name: "Green Dresses", href: "#" },
            { name: "Brown Dresses", href: "#" },
            { name: "Blue Dresses", href: "#" },
            { name: "Black Dresses", href: "#" },
            { name: "Embelishment Dresses", href: "#" },
          ],
        },
      ],
      featuredItems: [
        {
          image:
            "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "SHOP ALL DRESSES",
          href: "#",
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
            { name: "Birthdays", href: "#" },
            { name: "Formal", href: "#" },
            { name: "Party", href: "#" },
            { name: "Wedding Guest", href: "#" },
            { name: "Holiday", href: "#" },
            { name: "Festival", href: "#" },
          ],
        },
      ],
      featuredItems: [
        {
          image:
            "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "THE WEDDING EDIT",
          href: "#",
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
      featuredItems: [
        {
          image:
            "https://images.unsplash.com/photo-1642447411662-59ab77473a8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "NEW ARRIVALS",
          href: "/collections/new-arrivals",
        },
        {
          image:
            "https://images.unsplash.com/photo-1626818590159-04cb9274a5e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGRyZXNzZXN8ZW58MHx8MHx8fDA%3D",
          title: "SEASONAL SALE | 25% OFF",
          href: "#",
        },
      ],
    },
  };

  // Update how featured items are generated in the dropdownContent object
  const getDropdownFeaturedItems = (category) => {
    // If CMS images are available for this category
    if (navImages[category] && navImages[category].length > 0) {
      return navImages[category].map((image) => ({
        image: image.imageUrl,
        title: image.name.toUpperCase(),
        href: image.link || "#",
      }));
    }

    // Fallback to the default items if no CMS images
    return dropdownContent[category].featuredItems;
  };

  return (
    <>
      <div className="mx-[100px] py-4 flex flex-row justify-between items-center h-[70px] relative">
        {/* Left-side Navigation Links */}
        <div
          className={`flex space-x-2 lg:space-x-6 text-xs lg:text-[12px] ${
            darkNavbar ? "text-white" : "text-black"
          }`}
        >
          {/* SHOP Dropdown */}
          <div
            className="nav-dropdown-container relative"
            onMouseEnter={() => handleDropdownEnter("shop")}
            onMouseLeave={handleDropdownLeave}
            ref={(el) => (dropdownRefs.current["shop"] = el)}
          >
            <a
              href="#"
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === "shop" ? "active-nav-item" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === "shop" ? null : "shop");
              }}
            >
              SHOP
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === "shop" && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>

          {/* DRESSES Dropdown */}
          <div
            className="nav-dropdown-container relative"
            onMouseEnter={() => handleDropdownEnter("dresses")}
            onMouseLeave={handleDropdownLeave}
            ref={(el) => (dropdownRefs.current["dresses"] = el)}
          >
            <a
              href="/shop/dresses"
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === "dresses" ? "active-nav-item" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(
                  activeDropdown === "dresses" ? null : "dresses"
                );
              }}
            >
              DRESSES
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === "dresses" && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>

          {/* COLLECTIONS Dropdown - Hide on smaller tablets */}
          <div
            className="nav-dropdown-container relative hidden lg:block"
            onMouseEnter={() => handleDropdownEnter("collections")}
            onMouseLeave={handleDropdownLeave}
            ref={(el) => (dropdownRefs.current["collections"] = el)}
          >
            <a
              href="#"
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === "collections" ? "active-nav-item" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(
                  activeDropdown === "collections" ? null : "collections"
                );
              }}
            >
              LOOKBOOK
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === "collections" && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>

          {/* NEW IN Dropdown - Hide on smaller tablets */}
          <div
            className="nav-dropdown-container relative hidden lg:block"
            onMouseEnter={() => handleDropdownEnter("newin")}
            onMouseLeave={handleDropdownLeave}
            ref={(el) => (dropdownRefs.current["newin"] = el)}
          >
            <a
              href="#"
              className={`hover:opacity-80 h-full flex items-center relative whitespace-nowrap ${
                activeDropdown === "newin" ? "active-nav-item" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveDropdown(activeDropdown === "newin" ? null : "newin");
              }}
            >
              NEW ARRIVALS
            </a>
            {/* Highlight indicator that appears at the bottom of navbar */}
            {activeDropdown === "newin" && (
              <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-current" />
            )}
          </div>
        </div>

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

        {/* Right-side Navigation */}
        <div
          className={`flex items-center space-x-6 text-xs lg:text-[12px] ${
            darkNavbar ? "text-white" : "text-black"
          }`}
        >
          {/* Show these links only on larger screens */}
          <a
            href="/contact-us"
            className="hover:opacity-80 h-full flex items-center whitespace-nowrap"
          >
            CONTACT US
          </a>
          <a
            href="/services"
            className="hover:opacity-80 h-full flex items-center whitespace-nowrap"
          >
            SERVICES
          </a>

          {/* Icons - wrapped in a flex container with consistent alignment */}
          <div className="flex items-center space-x-6">
            <motion.div className="flex items-center h-full">
              <SearchBar darkNavbar={darkNavbar} />
            </motion.div>

            <a href="/user-account">
              <motion.div className="flex items-center h-full">
                <motion.img
                  src={
                    darkNavbar
                      ? "/icons/contact.svg"
                      : "/icons/contact-black.svg"
                  }
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
      </div>

      {/* Dropdowns Container - Outside the navbar */}
      <AnimatePresence>
        {activeDropdown && (
          <motion.div
            className="absolute left-0 w-full bg-white text-black shadow-lg z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            onMouseEnter={() => handleDropdownEnter(activeDropdown)}
            onMouseLeave={handleDropdownLeave}
          >
            <div className="mx-[100px] py-8 px-6 grid grid-cols-12 gap-6">
              {/* Left Side - Text Links */}
              {dropdownContent[activeDropdown].columns.map(
                (column, colIndex) => (
                  <div key={colIndex} className="col-span-3">
                    <h3 className="font-normal md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst uppercase text-[15px] mb-4">{column.title}</h3>
                    <div className="flex flex-col space-y-2">
                      {column.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.href}
                          className="text-[13px] md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst uppercase text-gray-600 hover:underline hover:text-black"
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Right Side - Featured Images from CMS */}
              {getDropdownFeaturedItems(activeDropdown).map(
                (item, itemIndex) => (
                  <div key={itemIndex} className="col-span-3">
                    <a href={item.href} className="block">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <p className="text-center font-medium text-sm mt-2">
                        {item.title}
                      </p>
                    </a>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .active-nav-item {
          position: relative;
        }
      `}</style>
    </>
  );
}