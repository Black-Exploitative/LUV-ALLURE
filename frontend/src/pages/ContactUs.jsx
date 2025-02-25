import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-white text-black px-6 md:px-12 py-16">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-widest uppercase">Contact Us</h1>
        <p className="text-gray-600 mt-4">We would love to hear from you</p>
      </motion.div>
      
      {/* Contact Details Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto"
      >
        {/* Phone */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <FaPhoneAlt size={30} className="text-gray-800 mb-4" />
          <h3 className="text-lg font-medium">Call Us</h3>
          <p className="text-gray-600">+1 (800) 123-4567</p>
          <p className="text-gray-600">Mon - Fri, 9 AM - 6 PM</p>
        </motion.div>

        {/* WhatsApp */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center text-center"
        >
          <FaWhatsapp size={30} className="text-green-500 mb-4" />
          <h3 className="text-lg font-medium">WhatsApp Chat</h3>
          <p className="text-gray-600">Chat with us instantly</p>
          <a href="https://wa.me/18001234567" className="text-blue-500 hover:underline">Message Us</a>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mt-16"
      >
        {/* Email */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center text-center"
        >
          <FaEnvelope size={30} className="text-gray-800 mb-4" />
          <h3 className="text-lg font-medium">Email Us</h3>
          <p className="text-gray-600">support@luvallure.com</p>
          <a href="mailto:support@luvallure.com" className="text-blue-500 hover:underline">Send an Email</a>
        </motion.div>

        {/* Location */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <FaMapMarkerAlt size={30} className="text-red-500 mb-4" />
          <h3 className="text-lg font-medium">Store Locator</h3>
          <p className="text-gray-600">Find our boutiques near you</p>
          <a href="/store-locator" className="text-blue-500 hover:underline">Locate a Store</a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactUs;
