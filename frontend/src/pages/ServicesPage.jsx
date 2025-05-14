/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ServicesPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("delivery");
  const [isSticky, setIsSticky] = useState(false);
  const tabsRef = useRef(null);
  const tabsScrollRef = useRef(null);
  
  // Window width for responsive behaviors
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Tab options
  const tabs = [
    { id: "delivery", label: "Delivery & Returns" },
    { id: "styling", label: "SIGNATURE STYLING SERVICE" },
    { id: "packaging", label: "Packaging & Gifting" },
    { id: "tailoring", label: "Perfect Fit Tailoring" },
    { id: "allurvers", label: "Allurvers Account" },
  ];

  // Handle scroll for sticky nav
  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const tabsPosition = tabsRef.current.getBoundingClientRect().top;
        setIsSticky(tabsPosition <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll selected tab into view within the tabs container
  useEffect(() => {
    if (tabsScrollRef.current && windowWidth < 768) {
      const activeTabElement = tabsScrollRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeTabElement) {
        const scrollLeft = activeTabElement.offsetLeft - tabsScrollRef.current.offsetWidth / 2 + activeTabElement.offsetWidth / 2;
        tabsScrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeTab, windowWidth]);

  // Scroll to section when tab is clicked
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = isSticky ? 80 : 0; // Adjust offset for sticky nav
      const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Handle tab click
  const handleTabClick = (id) => {
    setActiveTab(id);
    scrollToSection(id);
  };

  // Horizontal scrollable tabs for mobile and small-medium screens
  const renderScrollableTabs = () => {
    return (
      <div 
        ref={tabsScrollRef}
        className="flex md:hidden overflow-x-auto no-scrollbar py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => (
          <button
            data-tab={tab.id}
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative px-3 flex-shrink-0 py-3 text-xs uppercase transition-colors duration-300 whitespace-nowrap ${
              activeTab === tab.id ? "text-black font-medium" : "text-gray-500"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                layoutId="underline-mobile"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    );
  };

  // Desktop tabs for large screens
  const renderDesktopTabs = () => {
    return (
      <div className="hidden md:flex justify-center relative">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative px-2 lg:px-4 xl:px-6 py-6 text-xs lg:text-sm uppercase transition-colors duration-300 ${
              activeTab === tab.id ? "text-black" : "text-gray-400"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"
                layoutId="underline"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Main Header */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-wide text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          LUVS ALLURE SERVICES
        </motion.h1>
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-700 text-center mt-4 sm:mt-6 font-thin tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          PERSONALIZE YOUR EXPERIENCE
        </motion.p>
      </div>

      {/* Tabs Navigation */}
      <div
        ref={tabsRef}
        className={`border-b border-gray-200 w-full ${
          isSticky ? "sticky top-0 bg-white z-40 shadow-sm" : ""
        }`}
      >
        <div className="w-full mx-auto px-4">
          {/* Mobile & Small screens: scrollable tabs */}
          {renderScrollableTabs()}
          
          {/* Large screens: full tabs */}
          {renderDesktopTabs()}
        </div>
      </div>

      {/* Content Sections */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Delivery & Returns Section */}
        <section id="delivery" className="py-12 sm:py-16 md:py-20 lg:py-32">
          <h2 className="text-2xl sm:text-3xl font-normal tracking-wide text-center mb-6 sm:mb-8">
            Delivery & Returns
          </h2>
          <p className="text-center font-medium text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
            Experience seamless luxury with our premium delivery and hassle-free
            returns. Every aspect of your journey with Luvs Allure is designed
            with precision and elegance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <motion.div
              className="w-full h-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-8 md:p-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-normal tracking-wide text-center">
                  Complimentary Shipping & Returns
                </h3>
                <p className="text-gray-600 text-center mt-4">
                  Enjoy free premium delivery and returns on all orders, with
                  each package handled with the utmost care.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="w-full h-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-8 md:p-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-normal tracking-wide text-center">
                  Order & Return Tracking
                </h3>
                <p className="text-gray-600 text-center mt-4">
                  Track your orders and returns in real-time with detailed
                  updates throughout the journey.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              className="w-full h-auto sm:col-span-2 lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-6 sm:p-8 md:p-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-normal tracking-wide text-center">
                  Expedited Delivery Options
                </h3>
                <p className="text-gray-600 text-center mt-4">
                  Select from our range of expedited delivery services when time
                  is of the essence.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Signature Styling Service Section */}
        <section id="styling" className="py-12 sm:py-16 md:py-20 lg:py-32 relative">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-[#f8f6f3] opacity-50"
              initial={{ backgroundPosition: "0% 0%" }}
              animate={{ backgroundPosition: "100% 100%" }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 20,
                ease: "linear",
              }}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-normal tracking-wide text-center mb-6 sm:mb-8">
              SIGNATURE STYLING SERVICE
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
              From birthdays to galas, our expert stylists create personalized
              looks tailored to your unique style and any occasion. Experience
              the art of curation with our dedicated team.
            </p>

            <div className="flex justify-center px-4">
              <motion.div
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <div className="h-full w-full bg-white shadow-xl flex flex-col items-center justify-center p-6 sm:p-8 md:p-10 relative overflow-hidden">
                  {/* Subtle animated glow */}
                  <motion.div
                    className="absolute w-[150%] h-[150%] bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{
                      x: ["100%", "-100%"],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 sm:mb-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium tracking-wide text-center">
                    Personal Styling Consultation
                  </h3>
                  <p className="text-gray-600 text-center mt-4">
                    Book a one-on-one session with our expert stylists to create
                    a wardrobe that perfectly expresses your personal aesthetic.
                  </p>
                  <button className="mt-6 border-b border-black text-sm uppercase tracking-wide pb-1">
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="text-center mt-12 sm:mt-16 px-4">
              <h3 className="text-lg sm:text-xl font-normal tracking-wide mb-4">CURATED ELEGANCE</h3>
              <p className="text-gray-600 tracking-wide text-sm sm:text-base max-w-xl mx-auto">
                Our signature styling service goes beyond fashion its about
                creating a personal narrative through carefully curated pieces.
                Each styling session is approached with artistry and precision,
                considering your lifestyle, preferences, and aspirations.
              </p>
            </div>
          </div>
        </section>

        {/* Packaging & Gifting Section */}
        <section id="packaging" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#faf9f8]">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-wide text-center mb-6 sm:mb-8">
            Packaging & Gifting
          </h2>
          <p className="text-center text-gray-600 tracking-wide text-sm sm:text-base max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
            Every Luvs Allure purchase is a celebration of craftsmanship,
            presented with the same attention to detail that goes into our
            collections. Discover our signature packaging and exclusive gifting
            options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 px-4 sm:px-6">
            {/* Card 1 */}
            <motion.div
              className="w-full h-auto aspect-auto sm:aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/packaging-image.jpg')] bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-700"></div>
                <div className="relative z-10 text-white text-center p-4">
                  <h3 className="text-xl sm:text-2xl font-thin tracking-wide mb-4">
                    Signature Packaging
                  </h3>
                  <p className="max-w-md text-sm sm:text-base">
                    Each purchase arrives wrapped in our distinctive black
                    packaging with embossed logo and satin ribbon, creating an
                    unforgettable unboxing experience.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="w-full h-auto aspect-auto sm:aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/gifting-image.jpg')] bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-700"></div>
                <div className="relative z-10 text-white text-center p-4">
                  <h3 className="text-xl sm:text-2xl font-thin tracking-wide mb-4">
                    Bespoke Gifting
                  </h3>
                  <p className="max-w-md text-sm sm:text-base">
                    Make any occasion special with our personalized gift
                    services, including custom messaging, gift wrapping, and
                    curated gift selections for your loved ones.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Perfect Fit Tailoring Section */}
        <section id="tailoring" className="py-12 sm:py-16 md:py-20 lg:py-32">
          <h2 className="text-2xl sm:text-3xl font-normal tracking-wide text-center mb-6 sm:mb-8">
            Perfect Fit Tailoring
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
            Ensure every piece fits perfectly. Our tailoring service adjusts
            garments from our collection to match your exact measurements,
            ensuring impeccable fit and comfort.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 px-4 sm:px-6">
            {/* Card 1 */}
            <motion.div
              className="w-full h-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center p-6 sm:p-8 md:p-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 sm:mb-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-thin tracking-wide text-center">
                  In-Store Tailoring
                </h3>
                <p className="text-gray-600 text-center mt-4 max-w-lg text-sm sm:text-base">
                  Visit our boutique for a personalized fitting session with our
                  master tailors who will ensure your garments fit flawlessly.
                  Initial alterations for new purchases are complimentary.
                </p>
                <ul className="mt-6 sm:mt-8 text-gray-600 space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Expert measurements and consultation
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Precise alterations by skilled artisans
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Final fitting to ensure perfection
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="w-full h-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center p-6 sm:p-8 md:p-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 sm:mb-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-full h-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-thin tracking-wide text-center">
                  At-Home Tailoring
                </h3>
                <p className="text-gray-600 text-center mt-4 max-w-lg text-sm sm:text-base">
                  For our VIP clients, we offer exclusive at-home tailoring
                  services. Our tailors will visit your residence to ensure your
                  garments are perfectly fitted in the comfort of your home.
                </p>
                <ul className="mt-6 sm:mt-8 text-gray-600 space-y-2 sm:space-y-3 text-sm sm:text-base">
                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    Convenient scheduling at your preferred time
                  </li>

                  <li className="flex items-start">
                    <span className="w-4 h-4 mr-2 mt-0.5 text-black flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Personal wardrobe consultation included</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-4 h-4 mr-2 mt-0.5 text-black flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>Multiple garments altered in one appointment</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Allurvers Account Section */}
        <section id="allurvers" className="py-12 sm:py-16 md:py-20 lg:py-32 bg-[#faf9f8]">
          <h2 className="text-2xl sm:text-3xl font-normal tracking-wide text-center mb-6 sm:mb-8">
            Allurvers Account
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
            Join our exclusive membership program to unlock premium benefits,
            personalized offers, and VIP access to new collections.
          </p>

          <div className="flex justify-center px-4">
            <motion.div
              className="w-full max-w-sm sm:max-w-md lg:max-w-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white shadow-lg flex flex-col items-center justify-center p-6 sm:p-8 md:p-12 relative overflow-hidden">
                {/* Elegant animated backdrop */}
                <div className="absolute inset-0 bg-gradient-radial from-gray-50 to-white opacity-70"></div>
                <motion.div
                  className="absolute inset-0 bg-[url('/pattern-bg.svg')] bg-repeat opacity-5"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                />

                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-6 sm:mb-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-thin tracking-wide mb-6">
                    Exclusive Member Benefits
                  </h3>
                  <ul className="text-left text-gray-700 space-y-3 sm:space-y-4 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                    <li className="flex items-start">
                      <span className="w-5 h-5 mr-3 mt-0.5 text-black flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>
                        Early access to new collections and limited editions
                        before public release
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 mr-3 mt-0.5 text-black flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>
                        Complimentary style consultations with our expert
                        advisors
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 mr-3 mt-0.5 text-black flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>
                        Birthday treats and exclusive seasonal offers tailored
                        to your preferences
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-5 h-5 mr-3 mt-0.5 text-black flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span>
                        Priority access to exclusive events, runway shows, and
                        private shopping evenings
                      </span>
                    </li>
                  </ul>
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                    <button className="relative text-sm tracking-wide uppercase pb-1 group">
                      Sign In
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black origin-left transform scale-x-100 group-hover:scale-x-0 transition-transform duration-300"></span>
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black origin-right transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </button>
                    <button className="relative text-sm tracking-wide uppercase pb-1 group">
                      Register
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black origin-left transform scale-x-100 group-hover:scale-x-0 transition-transform duration-300"></span>
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black origin-right transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 sm:py-16 md:py-20 md:py-28 border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center px-4">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-thin tracking-wide"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              May we help you?
            </motion.h2>
            <motion.p
              className="mt-4 sm:mt-6 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              Find out everything you need to know about the Luvs Allure
              universe with a Client Advisor.
            </motion.p>
            <motion.div
              className="mt-8 sm:mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <button className="group inline-flex items-center text-sm tracking-wide uppercase">
                <span className="w-5 h-5 mr-2 relative">
                  <span className="absolute inset-0 flex items-center justify-center transition-opacity group-hover:opacity-0">
                    +
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </span>
                Contact Us
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ServicesPage;