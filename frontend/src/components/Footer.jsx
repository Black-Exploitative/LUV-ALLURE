import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="container mx-auto grid md:grid-cols-4 gap-8">
        {/* Contact Us Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-sm text-gray-400">Need help? Our team is here for you.</p>
          <p className="text-sm mt-2">Call: <a href="tel:+11234567890" className="underline">+234 80534455</a></p>
          <p className="text-sm">Email: <a href="mailto:support@luvallure.com" className="underline">support@luvallure.com</a></p>
          <button className="mt-4 border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition">
            Live Chat
          </button>
        </motion.div>
        
        {/* Shop & Policies */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li><a href="/collections" className="hover:underline">New Arrivals</a></li>
            <li><a href="/women" className="hover:underline">Women</a></li>
            <li><a href="/men" className="hover:underline">Men</a></li>
            <li><a href="/accessories" className="hover:underline">Accessories</a></li>
            <li><a href="/sale" className="hover:underline">Sale</a></li>
          </ul>
        </motion.div>
        
        {/* Customer Care */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4">Customer Care</h3>
          <ul className="text-sm text-gray-400 space-y-2">
            <li><a href="/help" className="hover:underline">Help & FAQs</a></li>
            <li><a href="/shipping" className="hover:underline">Shipping & Returns</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms & Conditions</a></li>
          </ul>
        </motion.div>
        
        {/* Socials */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-gray-400 text-lg">
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center text-sm text-gray-500 mt-8"
      >
        © {new Date().getFullYear()} LUV ALLURE. All Rights Reserved.
      </motion.div>
    </footer>
  );
}
