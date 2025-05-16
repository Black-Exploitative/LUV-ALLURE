import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const NewsletterModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if modal has been shown this session
    const hasSeenModalThisSession = sessionStorage.getItem("modalShown");
    const hasSubscribed = localStorage.getItem("hasSubscribed");
    
    // Only show if not shown in this session and not already subscribed
    if (!hasSeenModalThisSession && !hasSubscribed) {
      // Show modal after 1 minute (60000ms)
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Mark as shown for this session
        sessionStorage.setItem("modalShown", "true");
      }, 60000); 
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);

    sessionStorage.setItem("modalShown", "true");
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    console.log("Email submitted:", email);

 
    localStorage.setItem("hasSubscribed", "true");

    // Show success state
    setSubmitted(true);
    setError("");

    // Close modal after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={(e) => {
            // Close modal when clicking outside
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md mx-4"
          >
            {/* Elegant background with thin border */}
            <div className="absolute inset-0.5 bg-white"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-95"></div>
            <div className="absolute inset-0 border border-gray-200"></div>
            
            {/* Content container */}
            <div className="relative p-8 sm:p-10">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
                aria-label="Close"
              >
                <FaTimes size={20} />
              </button>

              {/* Modal content */}
              <div className="flex flex-col items-center text-center">
                {!submitted ? (
                  <>
                    <div className="font-serif tracking-wide text-xl mb-1">
                      LUV'S ALLURE
                    </div>
                    
                    {/* Ornamental element */}
                    <div className="relative w-16 h-px bg-black my-4">
                      <div className="absolute -top-0.5 w-6 h-1 bg-black left-1/2 transform -translate-x-1/2"></div>
                    </div>
                    
                    {/* Modal header */}
                    <h2 className="font-serif text-2xl sm:text-3xl mb-6 uppercase tracking-wide">
                      Join the exclusive list
                    </h2>
                    
                    {/* Message - improved readability */}
                    <p className="text-sm sm:text-base mb-8 max-w-xs text-gray-800 font-normal leading-relaxed">
                      Be the first to know about new collections, and the latest
                      in high fashion.
                    </p>
                    
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="w-full">
                      <div className="relative mb-8">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full border-b border-gray-300 py-3 px-1 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                          required
                        />
                        {error && (
                          <p className="text-xs text-red-500 mt-2 absolute">
                            {error}
                          </p>
                        )}
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full cursor-pointer bg-black text-white py-3 uppercase text-sm tracking-wider hover:bg-gray-900 transition-colors"
                      >
                        Subscribe
                      </motion.button>

                      <p className="text-xs text-gray-500 mt-6">
                        By subscribing, you agree to our Privacy Policy and
                        consent to receive updates from our company.
                      </p>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Success message */}
                    <div className="py-10">
                      {/* Subtle checkmark animation */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
                        className="w-16 h-16 mx-auto mb-6 rounded-full border border-gray-200 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </motion.div>
                      
                      <h2 className="font-serif text-2xl sm:text-3xl mb-3 uppercase tracking-wide">
                        Thank You
                      </h2>
                      
                      <div className="w-16 h-px bg-black my-4 mx-auto"></div>
                      
                      <p className="text-sm sm:text-base text-gray-800 mt-4 font-normal">
                        You've been added to our exclusive list.
                        <br />
                        <span className="italic">Expect the unexpected.</span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;