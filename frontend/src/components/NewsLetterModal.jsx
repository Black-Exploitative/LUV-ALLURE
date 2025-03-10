import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const NewsletterModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Show modal after 1 minute (60000ms)
    const timer = setTimeout(() => {
      setIsVisible(true); // Show the modal
    }, 60000); // 1 minute

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    console.log('Email submitted:', email);
    
    // Save to localStorage to prevent showing again
    localStorage.setItem('hasSubscribed', 'true');
    
    // Show success state
    setSubmitted(true);
    setError('');
    
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
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
            className="relative w-full max-w-md bg-white p-8 mx-4"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              aria-label="Close"
            >
              <FaTimes  size={24} />
            </button>
            
            {/* Modal content */}
            <div className="flex flex-col items-center text-center">
              {!submitted ? (
                <>
                  <div className="font-serif tracking-wider text-xl mb-1">LUV'S ALLURE</div>
                  {/* Border line */}
                  <div className="w-16 h-px bg-black my-3"></div>
                  {/* Modal header */}
                  <h2 className="font-serif text-2xl mb-6 uppercase tracking-widest">Join the exclusive list</h2>
                  {/* Message */}
                  <p className="text-sm  mb-8 max-w-xs font-light  text-gray-800 font-base font-[Raleway] ">
                    Be the first to know about new collections, and the latest in high fashion.
                  </p>
                  {/* Form */}
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="relative mb-6">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full border-b border-gray-300 py-2 px-1 text-sm focus:outline-none focus:border-black transition-colors"
                        required
                      />
                      {error && <p className="text-xs text-red-500 mt-1 absolute">{error}</p>}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-black text-white py-3 uppercase text-sm tracking-widest hover:bg-gray-900 transition-colors"
                    >
                      Subscribe
                    </motion.button>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                    </p>
                  </form>
                </>
              ) : (
                <>
                  {/* Success message */}
                  <div className="py-6">
                    <h2 className="font-serif text-2xl mb-3 uppercase tracking-widest">Thank You</h2>
                    <div className="w-16 h-px bg-black my-3 mx-auto"></div>
                    <p className="text-sm text-gray-700 mt-4 font-[Raleway]">
                      You've been added to our exclusive list. Expect the unexpected.
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
