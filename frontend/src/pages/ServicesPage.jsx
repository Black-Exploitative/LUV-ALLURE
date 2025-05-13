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

  // Scroll to section when tab is clicked
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = isSticky ? 80 : 0; // Adjust offset for sticky nav
      const y =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Handle tab click
  const handleTabClick = (id) => {
    setActiveTab(id);
    scrollToSection(id);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Main Header */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-12">
        <motion.h1
          className="text-4xl md:text-5xl xl:text-6xl font-medium md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          LUVS ALLURE SERVICES
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-gray-700 text-center mt-6 font-thin md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst"
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
        className={`border-b border-gray-200 ${
          isSticky ? "sticky top-0 bg-white z-40 shadow-sm" : ""
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex justify-center relative">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative px-4 md:px-6 py-6 text-xs md:text-sm md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst uppercase transition-colors duration-300 ${
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
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Delivery & Returns Section */}
        <section id="delivery" className="py-20 md:py-32">
          <h2 className="text-3xl font-normal md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center mb-8">
            Delivery & Returns
          </h2>
          <p className="text-center font-medium text-gray-600 max-w-3xl mx-auto mb-16">
            Experience seamless luxury with our premium delivery and hassle-free
            returns. Every aspect of your journey with Luvs Allure is designed
            with precision and elegance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
            {/* Card 1 */}
            <motion.div
              className="w-full max-w-[381px] aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-10">
                <div className="w-20 h-20 mb-6">
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
                <h3 className="text-xl font-normal md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center">
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
              className="w-full max-w-[381px] aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-10">
                <div className="w-20 h-20 mb-6">
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
                <h3 className="text-xl font-normal md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center">
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
              className="w-full max-w-[381px] aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-gray-50 flex flex-col items-center justify-center p-10">
                <div className="w-20 h-20 mb-6">
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
                <h3 className="text-xl font-normal md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-wider text-center">
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
        <section id="styling" className="py-20 md:py-32 relative">
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
            <h2 className="text-3xl font-normal md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center mb-8">
              SIGNATURE STYLING SERVICE
            </h2>
            <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
              From birthdays to galas, our expert stylists create personalized
              looks tailored to your unique style and any occasion. Experience
              the art of curation with our dedicated team.
            </p>

            <div className="flex justify-center">
              <motion.div
                className="w-full max-w-[402px] aspect-square"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <div className="h-full w-full bg-white shadow-xl flex flex-col items-center justify-center p-10 relative overflow-hidden">
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

                  <div className="w-24 h-24 mb-8">
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
                  <h3 className="text-2xl font-medium md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center">
                    Personal Styling Consultation
                  </h3>
                  <p className="text-gray-600 text-center mt-4">
                    Book a one-on-one session with our expert stylists to create
                    a wardrobe that perfectly expresses your personal aesthetic.
                  </p>
                  <button className="mt-6 border-b border-black text-sm uppercase md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst pb-1">
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="text-center mt-16">
              <h3 className="text-xl font-normal md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst mb-4">CURATED ELEGANCE</h3>
              <p className="text-gray-600 md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-[15px] max-w-xl mx-auto">
                Our signature styling service goes beyond fashion its about
                creating a personal narrative through carefully curated pieces.
                Each styling session is approached with artistry and precision,
                considering your lifestyle, preferences, and aspirations.
              </p>
            </div>
          </div>
        </section>

        {/* Packaging & Gifting Section */}
        <section id="packaging" className="py-20 md:py-32 bg-[#faf9f8]">
          <h2 className="text-3xl font-medium md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center mb-8">
            Packaging & Gifting
          </h2>
          <p className="text-center text-gray-600 md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-[15px] max-w-3xl mx-auto mb-16">
            Every Luvs Allure purchase is a celebration of craftsmanship,
            presented with the same attention to detail that goes into our
            collections. Discover our signature packaging and exclusive gifting
            options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
            {/* Card 1 */}
            <motion.div
              className="w-full max-w-[591px] aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 flex flex-col items-center justify-center p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/packaging-image.jpg')] bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-700"></div>
                <div className="relative z-10 text-white text-center">
                  <h3 className="text-2xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst mb-4">
                    Signature Packaging
                  </h3>
                  <p className="max-w-md">
                    Each purchase arrives wrapped in our distinctive black
                    packaging with embossed logo and satin ribbon, creating an
                    unforgettable unboxing experience.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              className="w-full max-w-[591px] aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 flex flex-col items-center justify-center p-12 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/gifting-image.jpg')] bg-cover bg-center opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-700"></div>
                <div className="relative z-10 text-white text-center">
                  <h3 className="text-2xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst mb-4">
                    Bespoke Gifting
                  </h3>
                  <p className="max-w-md">
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
        <section id="tailoring" className="py-20 md:py-32">
          <h2 className="text-3xl font-normal md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center mb-8">
            Perfect Fit Tailoring
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
            Ensure every piece fits perfectly. Our tailoring service adjusts
            garments from our collection to match your exact measurements,
            ensuring impeccable fit and comfort.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center">
            {/* Card 1 */}
            <motion.div
              className="w-full max-w-[591px] aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12">
                <div className="w-24 h-24 mb-8">
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
                <h3 className="text-2xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center">
                  In-Store Tailoring
                </h3>
                <p className="text-gray-600 text-center mt-4 max-w-lg">
                  Visit our boutique for a personalized fitting session with our
                  master tailors who will ensure your garments fit flawlessly.
                  Initial alterations for new purchases are complimentary.
                </p>
                <ul className="mt-8 text-gray-600 space-y-3">
                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black">
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
                    <span className="w-4 h-4 mr-2 text-black">
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
                    <span className="w-4 h-4 mr-2 text-black">
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
              className="w-full max-w-[591px] aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12">
                <div className="w-24 h-24 mb-8">
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
                <h3 className="text-2xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center">
                  At-Home Tailoring
                </h3>
                <p className="text-gray-600 text-center mt-4 max-w-lg">
                  For our VIP clients, we offer exclusive at-home tailoring
                  services. Our tailors will visit your residence to ensure your
                  garments are perfectly fitted in the comfort of your home.
                </p>
                <ul className="mt-8 text-gray-600 space-y-3">
                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black">
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

                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black">
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

                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black">
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
                    Personal wardrobe consultation included
                  </li>
                  <li className="flex items-center">
                    <span className="w-4 h-4 mr-2 text-black">
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
                    Multiple garments altered in one appointment
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Allurvers Account Section */}
        <section id="allurvers" className="py-20 md:py-32 bg-[#faf9f8]">
          <h2 className="text-3xl font-normal md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-center mb-8">
            Allurvers Account
          </h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16">
            Join our exclusive membership program to unlock premium benefits,
            personalized offers, and VIP access to new collections.
          </p>

          <div className="flex justify-center">
            <motion.div
              className="w-full max-w-[591px] aspect-square"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <div className="h-full w-full bg-white shadow-lg flex flex-col items-center justify-center p-12 relative overflow-hidden">
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
                  <div className="w-24 h-24 mx-auto mb-8">
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
                  <h3 className="text-2xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst mb-6">
                    Exclusive Member Benefits
                  </h3>
                  <ul className="text-left text-gray-700 space-y-4 max-w-lg mx-auto mb-8">
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
                  <div className="mt-8 space-x-8">
                    <button className="relative text-sm md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst uppercase pb-1 group">
                      Sign In
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black origin-left transform scale-x-100 group-hover:scale-x-0 transition-transform duration-300"></span>
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black origin-right transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                    </button>
                    <button className="relative text-sm md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst uppercase pb-1 group">
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
        <section className="py-20 md:py-28 border-t border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              May we help you?
            </motion.h2>
            <motion.p
              className="mt-6 text-gray-600 max-w-2xl mx-auto"
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
              className="mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              <button className="group inline-flex items-center text-sm md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst uppercase">
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
