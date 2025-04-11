import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from './Navbar';
import CollectionCard from './CollectionCard'; 
import PurchasedCard from './PurchasedCard';
import Footer from './Footer'; 

const CollectionsPage = () => {
  
  const titleControls = useAnimation();
  const collectionControls = useAnimation();
  const newArrivalsControls = useAnimation();
  const buttonControls = useAnimation();

  
  const [titleRef, titleInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [collectionsRef, collectionsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [newArrivalsRef, newArrivalsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [buttonRef, buttonInView] = useInView({ threshold: 0.1, triggerOnce: true });

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
  }, [titleInView, collectionsInView, newArrivalsInView, buttonInView]);

  // Sample collection data
  const collections = [
    { id: 1, imageUrl: '/collections/summer.jpg', title: 'SUMMER COLLECTION' },
    { id: 2, imageUrl: '/collections/autumn.jpg', title: 'AUTUMN ELEGANCE' },
    { id: 3, imageUrl: '/collections/winter.jpg', title: 'WINTER LUXE' },
    { id: 4, imageUrl: '/collections/spring.jpg', title: 'SPRING REVIVAL' },
    { id: 5, imageUrl: '/collections/evening.jpg', title: 'EVENING GLAMOUR' },
    { id: 6, imageUrl: '/collections/casual.jpg', title: 'CASUAL CHIC' },
    { id: 7, imageUrl: '/collections/resort.jpg', title: 'RESORT ESCAPE' },
    { id: 8, imageUrl: '/collections/minimal.jpg', title: 'MINIMALIST EDIT' },
    { id: 9, imageUrl: '/collections/modern.jpg', title: 'MODERN HERITAGE' }
  ];

  // Sample new arrivals data
  const newArrivals = [
    { id: 1, imageUrl: '/products/product1.jpg', title: 'Silk Maxi Dress', price: '$890' },
    { id: 2, imageUrl: '/products/product2.jpg', title: 'Oversized Wool Coat', price: '$1,250' },
    { id: 3, imageUrl: '/products/product3.jpg', title: 'Leather Shoulder Bag', price: '$1,450' },
    { id: 4, imageUrl: '/products/product4.jpg', title: 'Statement Earrings', price: '$560' },
    { id: 5, imageUrl: '/products/product5.jpg', title: 'Cashmere Sweater', price: '$780' },
    { id: 6, imageUrl: '/products/product6.jpg', title: 'Tailored Trousers', price: '$620' },
    { id: 7, imageUrl: '/products/product7.jpg', title: 'Embellished Heels', price: '$895' },
    { id: 8, imageUrl: '/products/product8.jpg', title: 'Printed Silk Scarf', price: '$350' }
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
    console.log('Navigating to all products');
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

      {/* Navbar */}
      <Navbar />

      {/* Page Container */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Collections Title */}
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleControls}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center py-20 md:py-28 border-b border-gray-100"
        >
          <h1 className="text-3xl md:text-5xl font-light tracking-widest text-gray-900">ALL COLLECTIONS</h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            Discover our curated assortment of timeless elegance and contemporary style.
          </p>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          ref={collectionsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={collectionControls}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 py-16 md:py-24"
        >
          {collections.map((collection, index) => (
            <motion.div 
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
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

        {/* Divider with quote */}
        <div className="py-20 md:py-32 text-center">
          <div className="w-16 h-[1px] bg-gray-300 mx-auto mb-12"></div>
          <p className="text-xl md:text-2xl font-light text-gray-700 italic max-w-3xl mx-auto">
            "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street, fashion has to do with ideas, the way we live, what is happening."
          </p>
          <p className="mt-6 text-sm uppercase tracking-widest text-gray-500">— Coco Chanel</p>
        </div>

        {/* New Arrivals Section */}
        <motion.div
          ref={newArrivalsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={newArrivalsControls}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="py-16 md:py-24 border-t border-gray-100"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-widest text-gray-900 text-center mb-16">NEW ARRIVALS</h2>
          
          {/* New Arrivals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {newArrivals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.05 + 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <PurchasedCard
                  imageUrl={product.imageUrl}
                  title={product.title}
                  price={product.price}
                  // Pass any other props your PurchasedCard component needs
                />
              </motion.div>
            ))}
          </div>

          {/* View Products Button */}
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
              {/* Button background animation */}
              <motion.div 
                className="absolute inset-0 bg-white"
                initial={{ width: "0%" }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              
              {/* Button text */}
              <span className="relative z-10 block px-12 py-4 text-white group-hover:text-black text-lg uppercase tracking-wider">
                View All Products
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Newsletter Section */}
        <div className="py-20 md:py-32 bg-gray-50 my-20 md:my-32">
          <div className="max-w-xl mx-auto text-center px-4">
            <h3 className="text-2xl md:text-3xl font-light tracking-wide text-gray-900 mb-6">Join Our World</h3>
            <p className="text-gray-600 mb-8">
              Subscribe to receive exclusive updates on new collections, special events and personalized offers.
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