/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const CollectionCard = ({ imageUrl, title, onClick, onShopNowClick }) => {
  return (
    <motion.div
      className="relative w-[410px] h-[700px] overflow-hidden cursor-pointer group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />

      <div className="absolute inset-0 bg-black/30 flex flex-col justify-between">
        <div className="flex-grow flex items-center justify-center">
          <h2 className="text-gray-200 text-4xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst">
            {title}
          </h2>
        </div>

        <div className="p-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onShopNowClick) onShopNowClick();
            }}
            className="relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ width: "100%" }}
              whileHover={{ width: "0%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            <span className="relative z-10 block px-8 py-3 border border-white text-black lg uppercase md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst">
              Shop Now
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

CollectionCard.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onShopNowClick: PropTypes.func,
};

CollectionCard.defaultProps = {
  onClick: () => {},
  onShopNowClick: () => {},
};

export default CollectionCard;
