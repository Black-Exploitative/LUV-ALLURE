import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const SizeGuideModal = ({ isOpen, onClose }) => {

  const sizeChart = {
    headers: [
      "US Size",
      "EU Size",
      "UK Size",
      "Bust (in)",
      "Waist (in)",
      "Hips (in)",
    ],
    sizes: [
      ["XS", "34", "6", "32-33", "25-26", "35-36"],
      ["S", "36", "8", "34-35", "27-28", "37-38"],
      ["M", "38", "10", "36-37", "29-30", "39-40"],
      ["L", "40", "12", "38-39", "31-32", "41-42"],
      ["XL", "42", "14", "40-41", "33-34", "43-44"],
    ],
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        delay: 0.15,
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const borderLineVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200"></div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <div className="px-6 pt-8 pb-4">
              <h2 className="text-2xl font-thin tracking-wide text-center">
                SIZE GUIDE
              </h2>
              <motion.div
                className="h-px bg-gray-200 mt-4"
                variants={borderLineVariants}
                initial="initial"
                animate="animate"
              />
            </div>

            {/* Title with Women label - removed tabs since we only have women's sizes */}
            <div className="flex justify-center px-6 mb-6">
              <div className="border-b pb-2 text-center">
                <h3 className="text-sm font-medium tracking-wide text-black">
                  WOMEN'S SIZING
                </h3>
              </div>
            </div>

            {/* Size Table - Made responsive for mobile */}
            <div className="px-6 pb-8">
              <div className="overflow-x-auto rounded-lg border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {sizeChart.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-2 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide text-center whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 bg-white">
                    <AnimatePresence mode="wait">
                      {sizeChart.sizes.map((size, rowIndex) => (
                        <motion.tr
                          key={`women-${rowIndex}`}
                          custom={rowIndex}
                          variants={tableRowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {size.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-2 py-3 text-center text-gray-800 font-thin tracking-wide whitespace-nowrap"
                            >
                              {cell}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* How to measure section */}
              <motion.div
                className="mt-8 bg-gray-50 rounded-lg p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-medium mb-3 tracking-wide">
                  HOW TO MEASURE
                </h3>
                <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                  <p>For the most accurate fit, measure your body as follows:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        <strong>Bust:</strong> Measure around the fullest part of
                        your bust, keeping the tape level.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        <strong>Waist:</strong> Measure around your natural
                        waistline, keeping the tape comfortably loose.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>
                        <strong>Hips:</strong> Measure around the fullest part of
                        your hips.
                      </span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Footer note */}
              <p className="text-xs text-gray-400 text-center mt-6 italic">
                Please note that size charts are meant as a guide only. Fit may
                vary depending on construction, materials, and manufacturer.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

SizeGuideModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SizeGuideModal;