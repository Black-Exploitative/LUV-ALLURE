import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

const ContactUs = () => {
  return (
    <div className="bg-gray-100 text-black py-16 px-6 md:px-20">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Contact Us</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Call Us */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center text-center">
          <FaPhoneAlt size={30} className="mb-4 text-gray-800" />
          <h3 className="text-lg font-medium">Call Us</h3>
          <p className="text-gray-600">+1 (800) 123-4567</p>
          <p className="text-gray-600">Mon - Fri, 9 AM - 6 PM</p>
        </motion.div>

        {/* WhatsApp Chat */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center text-center">
          <FaWhatsapp size={30} className="mb-4 text-green-500" />
          <h3 className="text-lg font-medium">WhatsApp Chat</h3>
          <p className="text-gray-600">Chat with us instantly</p>
          <a href="https://wa.me/18001234567" className="text-blue-500 hover:underline">Message Us</a>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/* Email Us */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center text-center">
          <FaEnvelope size={30} className="mb-4 text-gray-800" />
          <h3 className="text-lg font-medium">Email Us</h3>
          <p className="text-gray-600">support@luvallure.com</p>
          <a href="mailto:support@luvallure.com" className="text-blue-500 hover:underline">Send an Email</a>
        </motion.div>

        {/* Store Locator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center text-center">
          <FaMapMarkerAlt size={30} className="mb-4 text-red-500" />
          <h3 className="text-lg font-medium">Store Locator</h3>
          <p className="text-gray-600">Find our boutiques near you</p>
          <a href="/store-locator" className="text-blue-500 hover:underline">Locate a Store</a>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactUs;
