"use client";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function Button({ children }) {
  return (
    <motion.button
      className="relative inline-block px-8 py-3 border-2 border-white text-white text-lg overflow-hidden cursor-pointer"
      whileHover="hover"
    >
      {/* Background fill animation */}
      <motion.span
        className="absolute inset-0 bg-black"
        initial={{ x: "-100%" }}
        variants={{
          hover: { x: 0, transition: { duration: 0.5, ease: "easeInOut" } },
        }}
      />

      {/* Button text */}
      <motion.span
        className="relative z-10"
        variants={{
          hover: {  color: "#fff", transition: { duration: 0.5 } },
        }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
};
