import { motion } from 'framer-motion';

export default function ContactUs() {
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
        <p className="text-gray-600 mt-4">We would love to hear from you </p>
      </motion.div>
      
      {/* Contact Details */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
          <p>Email: <a href="mailto:support@luvallure.com" className="underline">support@luvallure.com</a></p>
          <p>Phone: <a href="tel:+123456789" className="underline">+1 234 567 89</a></p>
          <p className="mt-4">Hours: Mon-Fri, 9AM - 6PM (EST)</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Visit Us</h2>
          <p>123 Luv Allure Street, Fashion District, NYC</p>
          <p className="mt-4">Google Maps: <a href="https://goo.gl/maps/example" target="_blank" className="underline">View Location</a></p>
        </div>
      </motion.div>
      
      {/* Contact Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-16 max-w-2xl mx-auto"
      >
        <h2 className="text-xl font-semibold text-center mb-6">Send Us a Message</h2>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required />
          <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required />
          <input type="text" placeholder="Subject" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" required />
          <textarea placeholder="Your Message" className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-32" required></textarea>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">Send Message</button>
        </form>
      </motion.div>
    </div>
  );
}
