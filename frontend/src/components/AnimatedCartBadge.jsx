import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import PropTypes from "prop-types"; 

const AnimatedCartBadge = ({ theme = "dark" }) => {
  const { cartItemCount } = useCart();
  const [prevCount, setPrevCount] = useState(cartItemCount);
  const [isAnimating, setIsAnimating] = useState(false);

  const bgColor = theme === "dark" ? "bg-black" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const borderStyle = theme === "light" ? "border border-white" : "";

  // Detect changes in cart item count
  useEffect(() => {
    // Only animate if items were added (not removed)
    if (cartItemCount > prevCount) {
      setIsAnimating(true);

      // Reset animation state after a delay
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }

    // Update the previous count
    setPrevCount(cartItemCount);
  }, [cartItemCount, prevCount]);

  return (
    <>
      {/* Main Badge */}
      <span
        className={`absolute -top-[18px] -right-[10px] ${bgColor} ${textColor} ${borderStyle} text-xs w-[15px] h-[15px] flex items-center justify-center rounded-full`}
      >
        {cartItemCount}
      </span>

      {/* Animation Layer */}
      <AnimatePresence>
        {isAnimating && (
          <motion.span
            initial={{ scale: 1.8, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute -top-2 -right-2 ${bgColor} ${textColor} ${borderStyle} text-xs w-[10px] h-[10px] flex items-center justify-center rounded-full pointer-events-none`}
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
            className={`absolute top-6 -right-6 ${bgColor} ${textColor} ${borderStyle} text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap`}
          >
            Item added
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Add PropTypes validation
AnimatedCartBadge.propTypes = {
  theme: PropTypes.oneOf(["dark", "light"]), 
};

export default AnimatedCartBadge;