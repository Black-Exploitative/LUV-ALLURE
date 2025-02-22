"use client";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function AnimatedImage({ src, alt, className }) {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`cursor-pointer ${className}`} 
      whileHover={{ opacity: 0.8 }} 
      transition={{ duration: 0.3 }} 
    />
  );
}


AnimatedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

AnimatedImage.defaultProps = {
  className: "",
};
