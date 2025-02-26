import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const StyleAdvisor = ({ user }) => {
  // Style quiz state
  const [quizStep, setQuizStep] = useState(1);
  const [styleInspiration, setStyleInspiration] = useState("");
  const [statementPiece, setStatementPiece] = useState("");
  const [colorPalette, setColorPalette] = useState("");
  const [silhouette, setSilhouette] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [notifyUpdates, setNotifyUpdates] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  return (
    <>
      <div className="space-y-8">
        <h2 className="text-xl font-light">PERSONALIZED STYLE ADVISOR</h2>
        <p className="text-sm text-gray-600 max-w-3xl">
          Experience tailored fashion recommendations curated exclusively for
          you based on your preferences and past purchases. Our AI-driven style
          advisor analyzes the latest trends and your unique aesthetic to create
          perfect ensembles.
        </p>
      </div>

      {/* Futuristic Style Profile Visualization */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 via-gray-800 to-black p-8 text-white rounded-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-white/30"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-white/30"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-24 h-24 rounded-full bg-white/5 blur-lg"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <h3 className="text-lg font-light tracking-wider">
              YOUR STYLE PROFILE
            </h3>
            <div className="ml-3 h-[1px] flex-grow bg-gradient-to-r from-white/80 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-wider">MINIMALIST</span>
                <span className="text-xs tracking-wider">MAXIMALIST</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full w-full">
                <motion.div
                  className="h-1 bg-white rounded-full"
                  initial={{ width: "30%" }}
                  whileInView={{ width: "30%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-wider">CLASSIC</span>
                <span className="text-xs tracking-wider">AVANT-GARDE</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full w-full">
                <motion.div
                  className="h-1 bg-white rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "65%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs tracking-wider">CASUAL</span>
                <span className="text-xs tracking-wider">FORMAL</span>
              </div>
              <div className="h-1 bg-white/20 rounded-full w-full">
                <motion.div
                  className="h-1 bg-white rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "75%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-2">
                <span className="text-xl">🧥</span>
              </div>
              <p className="text-xs tracking-wider">OUTERWEAR</p>
              <p className="text-xl font-light">SIGNATURE</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-2">
                <span className="text-xl">👜</span>
              </div>
              <p className="text-xs tracking-wider">ACCESSORIES</p>
              <p className="text-xl font-light">ELEVATED</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-2">
                <span className="text-xl">👠</span>
              </div>
              <p className="text-xs tracking-wider">FOOTWEAR</p>
              <p className="text-xl font-light">BOLD</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-2">
                <span className="text-xl">👗</span>
              </div>
              <p className="text-xs tracking-wider">SILHOUETTES</p>
              <p className="text-xl font-light">STRUCTURED</p>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <motion.button
              whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 border border-white/20 rounded-sm text-sm"
            >
              <span>REFINE YOUR STYLE</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="mt-12">
        <h3 className="text-lg font-light tracking-wider mb-6">
          CURATED FOR YOU
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "CONTEMPORARY BUSINESS",
              description:
                "Redefine power dressing with our elevated essentials.",
              image: "/images/placeholder1.jpg",
            },
            {
              title: "EVENING STATEMENTS",
              description:
                "Make an impression with our signature evening pieces.",
              image: "/images/placeholder2.jpg",
            },
            {
              title: "WEEKEND LUXE",
              description:
                "Elevate your off-duty moments with refined casual wear.",
              image: "/images/placeholder3.jpg",
            },
          ].map((collection, idx) => (
            <motion.div
              key={idx}
              className="group relative cursor-pointer"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl">✨</span>
                </div>
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="px-6 py-2 bg-white text-black text-sm">
                    EXPLORE
                  </button>
                </div>
              </div>
              <h4 className="mt-4 font-medium text-sm tracking-wide">
                {collection.title}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                {collection.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Virtual Try-On Section */}
      <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-l-4 border-black">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-lg font-light tracking-wider">
              VIRTUAL STYLING SESSION
            </h3>
            <p className="mt-2 text-sm text-gray-600 max-w-xl">
              Connect with our style advisors for a personalized virtual
              consultation. Get expert advice and discover pieces tailored to
              your preferences.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "#333" }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 md:mt-0 px-6 py-3 bg-black text-white text-sm flex items-center space-x-2"
          >
            <span>BOOK A SESSION</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* AI Style Quiz */}
      <div className="mt-16 border border-gray-200 p-8">
        <h3 className="text-lg font-light tracking-wider mb-6">
          DISCOVER YOUR SIGNATURE LOOK
        </h3>

        {/* Using useState hooks for quiz state management */}
        <div className="space-y-8">
          {/* Explanation */}
          <p className="text-sm text-gray-600">
            Take our interactive style quiz to refine your recommendations and
            help us understand your preferences better.
          </p>

          {/* Quiz Progress Bar */}
          <div className="w-full bg-gray-100 h-1">
            <motion.div
              className="h-1 bg-black"
              initial={{ width: "20%" }}
              animate={{ width: quizStep >= 5 ? "100%" : `${quizStep * 20}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Quiz Content - Multiple screens that show/hide based on quizStep */}
          {quizStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium mb-4">
                    WHAT INSPIRES YOUR STYLE?
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Architecture",
                      "Nature",
                      "Art",
                      "Street Style",
                      "Cultural Heritage",
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className={`flex items-center space-x-2 px-4 py-3 border cursor-pointer ${
                          styleInspiration === item
                            ? "border-black bg-gray-50"
                            : "border-gray-200"
                        }`}
                        whileHover={{ x: 5, borderColor: "#000" }}
                        onClick={() => setStyleInspiration(item)}
                      >
                        <input
                          type="radio"
                          id={`inspiration-${idx}`}
                          name="inspiration"
                          checked={styleInspiration === item}
                          onChange={() => setStyleInspiration(item)}
                          className="h-4 w-4 border-gray-300 focus:ring-black text-black"
                        />
                        <label
                          htmlFor={`inspiration-${idx}`}
                          className="text-sm cursor-pointer flex-grow"
                        >
                          {item}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">
                    SELECT YOUR STATEMENT PIECE
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {["Jacket", "Bag", "Shoes", "Jewelry"].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className={`aspect-square border flex flex-col items-center justify-center cursor-pointer ${
                          statementPiece === item
                            ? "border-black bg-gray-50"
                            : "border-gray-200"
                        }`}
                        whileHover={{ y: -5, borderColor: "#000" }}
                        onClick={() => setStatementPiece(item)}
                      >
                        <span className="text-3xl mb-2">
                          {idx === 0
                            ? "🧥"
                            : idx === 1
                            ? "👜"
                            : idx === 2
                            ? "👠"
                            : "💍"}
                        </span>
                        <span className="text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-black text-white text-sm tracking-wide"
                  onClick={() => {
                    if (styleInspiration && statementPiece) {
                      setQuizStep(2);
                    }
                  }}
                >
                  CONTINUE
                </motion.button>
              </div>
            </motion.div>
          )}

          {quizStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium mb-4">
                    WHATS YOUR COLOR PALETTE?
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        name: "Neutrals",
                        colors: ["#F5F5F5", "#E0E0E0", "#9E9E9E", "#424242"],
                      },
                      {
                        name: "Monochrome",
                        colors: ["#FFFFFF", "#BDBDBD", "#616161", "#212121"],
                      },
                      {
                        name: "Earth Tones",
                        colors: ["#A1887F", "#795548", "#5D4037", "#3E2723"],
                      },
                      {
                        name: "Bold & Vibrant",
                        colors: ["#F44336", "#2196F3", "#FFEB3B", "#4CAF50"],
                      },
                    ].map((palette, idx) => (
                      <motion.div
                        key={idx}
                        className={`border p-3 cursor-pointer ${
                          colorPalette === palette.name
                            ? "border-black"
                            : "border-gray-200"
                        }`}
                        whileHover={{ y: -5, borderColor: "#000" }}
                        onClick={() => setColorPalette(palette.name)}
                      >
                        <div className="flex space-x-1 mb-2">
                          {palette.colors.map((color, colorIdx) => (
                            <div
                              key={colorIdx}
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                        <span className="text-sm">{palette.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">
                    YOUR PREFERRED SILHOUETTE
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Fitted & Structured",
                      "Relaxed & Oversized",
                      "Balanced & Proportional",
                      "Draped & Flowing",
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className={`flex items-center space-x-2 px-4 py-3 border cursor-pointer ${
                          silhouette === item
                            ? "border-black bg-gray-50"
                            : "border-gray-200"
                        }`}
                        whileHover={{ x: 5, borderColor: "#000" }}
                        onClick={() => setSilhouette(item)}
                      >
                        <input
                          type="radio"
                          id={`silhouette-${idx}`}
                          name="silhouette"
                          checked={silhouette === item}
                          onChange={() => setSilhouette(item)}
                          className="h-4 w-4 border-gray-300 focus:ring-black text-black"
                        />
                        <label
                          htmlFor={`silhouette-${idx}`}
                          className="text-sm cursor-pointer flex-grow"
                        >
                          {item}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-black text-black text-sm tracking-wide hover:bg-gray-100"
                  onClick={() => setQuizStep(1)}
                >
                  BACK
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-black text-white text-sm tracking-wide"
                  onClick={() => {
                    if (colorPalette && silhouette) {
                      setQuizStep(3);
                    }
                  }}
                >
                  CONTINUE
                </motion.button>
              </div>
            </motion.div>
          )}

          {quizStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h4 className="text-sm font-medium mb-6">
                SELECT STYLES THAT RESONATE WITH YOU
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Minimalist Elegance",
                  "Avant-Garde",
                  "Modern Classic",
                  "Bohemian Luxe",
                  "Structured Tailoring",
                  "Eclectic Artisanal",
                  "Refined Casual",
                  "Statement Glamour",
                ].map((style, idx) => (
                  <motion.div
                    key={idx}
                    className={`aspect-square cursor-pointer relative overflow-hidden ${
                      selectedStyles.includes(style) ? "ring-2 ring-black" : ""
                    }`}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => {
                      if (selectedStyles.includes(style)) {
                        setSelectedStyles(
                          selectedStyles.filter((s) => s !== style)
                        );
                      } else {
                        setSelectedStyles([...selectedStyles, style]);
                      }
                    }}
                  >
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <div className="text-center p-2">
                        <div className="text-2xl mb-2">
                          {idx % 8 === 0
                            ? "✨"
                            : idx % 8 === 1
                            ? "🌟"
                            : idx % 8 === 2
                            ? "🎨"
                            : idx % 8 === 3
                            ? "🌿"
                            : idx % 8 === 4
                            ? "📐"
                            : idx % 8 === 5
                            ? "🧵"
                            : idx % 8 === 6
                            ? "🧶"
                            : "💫"}
                        </div>
                        <span className="text-xs font-medium tracking-wide">
                          {style}
                        </span>
                      </div>
                    </div>
                    {selectedStyles.includes(style) && (
                      <div className="absolute top-2 right-2 bg-black rounded-full w-6 h-6 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-black text-black text-sm tracking-wide hover:bg-gray-100"
                  onClick={() => setQuizStep(2)}
                >
                  BACK
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-black text-white text-sm tracking-wide"
                  onClick={() => {
                    if (selectedStyles.length > 0) {
                      setQuizStep(4);
                    }
                  }}
                >
                  CONTINUE
                </motion.button>
              </div>
            </motion.div>
          )}

          {quizStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-medium mb-4">
                    OCCASIONS YOU DRESS FOR
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Business Professional",
                      "Formal Events",
                      "Casual Outings",
                      "Creative Workplace",
                      "Travel & Leisure",
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        className={`flex items-center space-x-2 px-4 py-3 border cursor-pointer ${
                          occasions.includes(item)
                            ? "border-black bg-gray-50"
                            : "border-gray-200"
                        }`}
                        whileHover={{ x: 5, borderColor: "#000" }}
                        onClick={() => {
                          if (occasions.includes(item)) {
                            setOccasions(occasions.filter((o) => o !== item));
                          } else {
                            setOccasions([...occasions, item]);
                          }
                        }}
                      >
                        <input
                          type="checkbox"
                          id={`occasion-${idx}`}
                          checked={occasions.includes(item)}
                          onChange={() => {
                            if (occasions.includes(item)) {
                              setOccasions(occasions.filter((o) => o !== item));
                            } else {
                              setOccasions([...occasions, item]);
                            }
                          }}
                          className="h-4 w-4 border-gray-300 focus:ring-black text-black rounded-sm"
                        />
                        <label
                          htmlFor={`occasion-${idx}`}
                          className="text-sm cursor-pointer flex-grow"
                        >
                          {item}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-4">
                    DESIGNER PREFERENCES
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      "Italian Heritage",
                      "French Ateliers",
                      "British Tailoring",
                      "Japanese Minimalism",
                      "American Contemporary",
                      "Scandinavian Design",
                    ].map((designer, idx) => (
                      <motion.div
                        key={idx}
                        className={`border p-3 cursor-pointer ${
                          designers.includes(designer)
                            ? "border-black bg-gray-50"
                            : "border-gray-200"
                        }`}
                        whileHover={{ y: -3, borderColor: "#000" }}
                        onClick={() => {
                          if (designers.includes(designer)) {
                            setDesigners(
                              designers.filter((d) => d !== designer)
                            );
                          } else {
                            setDesigners([...designers, designer]);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{designer}</span>
                          {designers.includes(designer) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-black text-black text-sm tracking-wide hover:bg-gray-100"
                  onClick={() => setQuizStep(3)}
                >
                  BACK
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-black text-white text-sm tracking-wide"
                  onClick={() => {
                    if (occasions.length > 0 && designers.length > 0) {
                      setQuizStep(5);
                    }
                  }}
                >
                  CONTINUE
                </motion.button>
              </div>
            </motion.div>
          )}

          {quizStep === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h4 className="text-sm font-medium mb-4">
                FINALIZE YOUR STYLE PROFILE
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="p-6 border border-gray-200 bg-gray-50">
                    <h5 className="font-medium text-sm mb-4">
                      YOUR SELECTIONS
                    </h5>
                    <div className="space-y-4 text-sm">
                      <div>
                        <span className="text-gray-500">
                          Style Inspiration:
                        </span>
                        <p>{styleInspiration}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Statement Piece:</span>
                        <p>{statementPiece}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Color Palette:</span>
                        <p>{colorPalette}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Silhouette:</span>
                        <p>{silhouette}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Styles:</span>
                        <p>{selectedStyles.join(", ")}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Occasions:</span>
                        <p>{occasions.join(", ")}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Designer Preferences:
                        </span>
                        <p>{designers.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="p-6 border border-gray-200">
                    <h5 className="font-medium text-sm mb-4">
                      CONTACT DETAILS
                    </h5>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          value={user.firstName + " " + user.lastName}
                          readOnly
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-sm"
                        />
                      </div>

                      <div className="flex items-start mt-4">
                        <div className="flex items-center h-5">
                          <input
                            id="notify-style"
                            name="notify-style"
                            type="checkbox"
                            checked={notifyUpdates}
                            onChange={() => setNotifyUpdates(!notifyUpdates)}
                            className="h-4 w-4 border-gray-300 focus:ring-black text-black"
                          />
                        </div>
                        <div className="ml-3 text-xs">
                          <label
                            htmlFor="notify-style"
                            className="text-gray-700"
                          >
                            I would like to receive style updates and new
                            collection notifications.
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-black text-black text-sm tracking-wide hover:bg-gray-100"
                  onClick={() => setQuizStep(4)}
                >
                  BACK
                </motion.button>

                <motion.button
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-black text-white text-sm tracking-wide"
                  onClick={() => {
                    setShowConfetti(true);
                    setTimeout(() => {
                      setQuizCompleted(true);
                    }, 500);
                  }}
                >
                  SUBMIT STYLE PROFILE
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Confetti and completion message */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              <div id="confetti-container" className="w-full h-full">
                {Array.from({ length: 100 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                      top: "-10%",
                      left: `${Math.random() * 100}%`,
                      rotate: 0,
                      scale: Math.random() * 0.5 + 0.5,
                    }}
                    animate={{
                      top: "100%",
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      ease: "easeOut",
                    }}
                    style={{
                      width: `${Math.random() * 12 + 8}px`,
                      height: `${Math.random() * 6 + 4}px`,
                      backgroundColor: [
                        "#FF9AA2",
                        "#FFB7B2",
                        "#FFDAC1",
                        "#E2F0CB",
                        "#B5EAD7",
                        "#C7CEEA",
                        "#9CF6F6",
                        "#D9D9D9",
                      ][Math.floor(Math.random() * 8)],
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {quizCompleted && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white p-8 max-w-lg w-full mx-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="text-center space-y-6">
                  <div className="inline-block rounded-full p-3 bg-green-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-light tracking-wide">
                    STYLE PROFILE COMPLETED
                  </h3>

                  <p className="text-sm text-gray-600">
                    Thank you for completing your style profile. Our
                    professional stylists will create a personalized style guide
                    based on your preferences. You will receive it via email
                    within 24-48 hours.
                  </p>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-black text-white text-sm tracking-wide"
                      onClick={() => setQuizCompleted(false)}
                    >
                      CLOSE
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

StyleAdvisor.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default StyleAdvisor;
