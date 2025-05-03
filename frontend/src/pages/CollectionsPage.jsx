/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "../components/Navbar";
import CollectionCard from "../components/CollectionCard ";
import PurchasedCard from "../components/PurchasedCard";
import Footer from "../components/Footer";

const CollectionsPage = () => {
  // Animation controls
  const titleControls = useAnimation();
  const collectionControls = useAnimation();
  const newArrivalsControls = useAnimation();
  const buttonControls = useAnimation();

  // Intersection observers
  const [titleRef, titleInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [collectionsRef, collectionsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [newArrivalsRef, newArrivalsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [buttonRef, buttonInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Animation triggers
  useEffect(() => {
    if (titleInView) {
      titleControls.start({ opacity: 1, y: 0 });
    }
    if (collectionsInView) {
      collectionControls.start({ opacity: 1, y: 0 });
    }
    if (newArrivalsInView) {
      newArrivalsControls.start({ opacity: 1, y: 0 });
    }
    if (buttonInView) {
      buttonControls.start({ opacity: 1, y: 0 });
    }
  }, [
    titleInView,
    collectionsInView,
    newArrivalsInView,
    buttonInView,
    titleControls,
    collectionControls,
    newArrivalsControls,
    buttonControls,
  ]);

  const collections = [
    {
      id: 1,
      imageUrl: ".././public/images/photo1.jpg",
      title: "SUMMER COLLECTION",
    },
    {
      id: 2,
      imageUrl: ".././public/images/photo11.jpg",
      title: "AUTUMN ELEGANCE",
    },
    { id: 3, imageUrl: ".././public/images/photo13.jpg", title: "WINTER LUXE" },
    {
      id: 4,
      imageUrl: ".././public/images/photo12.jpg",
      title: "SPRING REVIVAL",
    },
    {
      id: 5,
      imageUrl: ".././public/images/shop4.jpg",
      title: "EVENING GLAMOUR",
    },
    { id: 6, imageUrl: ".././public/images/shop5.jpg", title: "CASUAL CHIC" },
    { id: 7, imageUrl: ".././public/images/shop1.jpg", title: "RESORT ESCAPE" },
    {
      id: 8,
      imageUrl: ".././public/images/shop2.jpg",
      title: "MINIMALIST EDIT",
    },
    {
      id: 9,
      imageUrl: ".././public/images/photo7.jpg",
      title: "MODERN HERITAGE",
    },
  ];

  const newArrivals = [
    {
      id: 1,
      name: "Silk Maxi Dress",
      price: 89000,
      color: "Ivory",
      images: ".././public/images/photo4.jpg",
    },
    {
      id: 2,
      name: "Oversized Wool Coat",
      price: 125000,
      color: "Camel",
      images: ".././public/images/photo1.jpg",
    },
    {
      id: 3,
      name: "Leather Shoulder Bag",
      price: 145000,
      color: "Black",
      images: ".././public/images/photo2.jpg",
    },
    {
      id: 4,
      name: "Statement Earrings",
      price: 56000,
      color: "Gold",
      images: ".././public/images/photo3.jpg",
    },
    {
      id: 5,
      name: "Cashmere Sweater",
      price: 78000,
      color: "Grey",
      images: ".././public/images/photo5.jpg",
    },
    {
      id: 6,
      name: "Tailored Trousers",
      price: 62000,
      color: "Navy",
      images: ".././public/images/photo6.jpg",
    },
    {
      id: 7,
      name: "Embellished Heels",
      price: 89500,
      color: "Silver",
      images: ".././public/images/photo11.jpg",
    },
    {
      id: 8,
      name: "Printed Silk Scarf",
      price: 35000,
      color: "Multi",
      images: ".././public/images/photo12.jpg",
    },
  ];

  const handleCollectionClick = (collection) => {
    // Navigate to collection detail page
    console.log(`Navigating to collection: ${collection.title}`);
  };

  const handleShopNowClick = (collection) => {
    // Navigate to collection shopping page
    console.log(`Shopping collection: ${collection.title}`);
  };

  const handleViewProductsClick = () => {
    // Navigate to all products page
    console.log("Navigating to all products");
  };

  // Page scroll progress
  const [scrollY, setScrollY] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);

      // Calculate scroll progress percentage
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = newScrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-white min-h-screen">
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50">
        <div
          className="h-full bg-black"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <Navbar />

      {/* Updated container for perfect centering */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleControls}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center py-20 md:py-28 border-b border-gray-100"
        >
          <h1 className="text-3xl md:text-5xl font-thin tracking-widest text-gray-900">
            ALL COLLECTIONS
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            Discover our curated assortment of timeless elegance and
            contemporary style.
          </p>
        </motion.div>

        {/* Updated collections grid for perfect centering */}
        <motion.div
          ref={collectionsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={collectionControls}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.1,
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 md:py-24 place-items-center"
        >
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full flex justify-center"
            >
              <CollectionCard
                imageUrl={collection.imageUrl}
                title={collection.title}
                onClick={() => handleCollectionClick(collection)}
                onShopNowClick={() => handleShopNowClick(collection)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="py-20 md:py-32 text-center">
          <div className="w-16 h-[1px] bg-gray-300 mx-auto mb-12"></div>
          <p className="text-xl md:text-2xl font-thin text-gray-700 italic max-w-3xl mx-auto">
            Fashion is not something that exists in dresses only. Fashion is in
            the sky, in the street, fashion has to do with ideas, the way we
            live, what is happening.
          </p>
          <p className="mt-6 text-sm uppercase tracking-widest text-gray-500">
            — LUVS ALLURE
          </p>
        </div>

        {/* New Arrivals Section with updated grid for perfect centering */}
        <motion.div
          ref={newArrivalsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={newArrivalsControls}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="py-16 md:py-24 border-t border-gray-100"
        >
          <h2 className="text-3xl md:text-4xl font-thin tracking-widest text-gray-900 text-center mb-16">
            NEW ARRIVALS
          </h2>

          {/* Updated New Arrivals Grid for perfect centering */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 place-items-center">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.05 + 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full flex justify-center"
              >
                <PurchasedCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            ref={buttonRef}
            initial={{ opacity: 0, y: 20 }}
            animate={buttonControls}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="flex justify-center mt-16 md:mt-24"
          >
            <button
              onClick={handleViewProductsClick}
              className="relative overflow-hidden group bg-black"
            >
              {/* Button text */}
              <span className="relative z-10 block px-12 py-4 text-white text-lg uppercase tracking-wider">
                View All Products
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Newsletter Section */}
        <div className="py-20 md:py-32 bg-gray-50 my-20 md:my-32">
          <div className="max-w-xl mx-auto text-center px-4">
            <h3 className="text-2xl md:text-3xl font-thin tracking-wide text-gray-900 mb-6">
              Join Our World
            </h3>
            <p className="text-gray-600 mb-8">
              Subscribe to receive exclusive updates on new collections, special
              events and personalized offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-5 py-3 border border-gray-300 focus:border-black focus:outline-none transition"
              />
              <button className="bg-black text-white px-6 py-3 hover:bg-gray-900 transition uppercase tracking-wider">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CollectionsPage;
