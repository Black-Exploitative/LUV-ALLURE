import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const AnimatedCartBadge = () => {
  const { cartItems } = useCart();
  const [prevCount, setPrevCount] = useState(cartItems.length);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Detect changes in cart item count
  useEffect(() => {
    const currentCount = cartItems.length;
    
    // Only animate if items were added (not removed)
    if (currentCount > prevCount) {
      setIsAnimating(true);
      
      // Reset animation state after a delay
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
    
    // Update the previous count
    setPrevCount(currentCount);
  }, [cartItems.length, prevCount]);
  
  return (
    <>
      {/* Static Badge */}
      <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
        {cartItems.length}
      </span>
      
      {/* Animation Layer */}
      <AnimatePresence>
        {isAnimating && (
          <motion.span
            initial={{ scale: 1.8, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>
      
      {/* Added indicator */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-6 -right-6 bg-black text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap"
          >
            Item added
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedCartBadge;