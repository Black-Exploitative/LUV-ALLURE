import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Footer from "../components/Footer";

const ContactUs = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Danny fix dynamism here
    console.log("Form submitted:", formData);
    setFormSubmitted(true);

    // Reset form after submission
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 5000);
  };

  // Animation variants - Fixed the easing functions
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: (custom) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        delay: custom * 0.1,
        ease: "easeOut",
      },
    }),
  };

  const accordionVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const contactMethods = [
    {
      title: "Customer Service",
      description: "For product inquiries, orders, and general information.",
      items: [
        {
          icon: <FaPhoneAlt />,
          label: "Phone",
          value: "+234 703 389 3926",
          link: "tel:+2347033893926",
        },
        {
          icon: <FaEnvelope />,
          label: "Email",
          value: "support@luvsallure.com",
          link: "mailto:support@luvsallure.com",
        },
        {
          icon: <FaWhatsapp />,
          label: "WhatsApp",
          value: "Chat with us",
          link: "https://wa.me/+2347033893926",
        },
      ],
    },
    {
      title: "Press Inquiries",
      description: "For media requests and press-related matters.",
      items: [
        {
          icon: <FaEnvelope />,
          label: "Email",
          value: "press@luvallure.com",
          link: "mailto:press@luvallure.com",
        },
      ],
    },
    {
      title: "Partnerships & Business",
      description: "For partnership opportunities and business proposals.",
      items: [
        {
          icon: <FaEnvelope />,
          label: "Email",
          value: "partnerships@luvallure.com",
          link: "mailto:partnerships@luvallure.com",
        },
      ],
    },
    {
      title: "Find Our Stores",
      description: "Visit our boutiques for personalized assistance.",
      items: [
        {
          icon: <FaMapMarkerAlt />,
          label: "Store Locator",
          value: "Find a store near you",
          link: "/store-locator",
        },
      ],
    },
  ];

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        className="bg-white text-black min-h-screen"
      >
        {/* Hero Section */}
        <div className="relative h-[60vh] bg-[#f8f6f4] flex items-center justify-center overflow-hidden mt-[70px]">
          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-[0.15em] uppercase mb-6 text-black"
            >
              Contact Us
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-16 h-[2px] bg-black mx-auto mb-6"
            ></motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl font-thin tracking-widerr text-black"
            >
              We're here to assist you with any inquiries
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="animate-bounce text-black">
              <IoIosArrowDown size={28} />
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: "easeOut",
              }}
            >
              <h2 className="text-2xl md:text-3xl font-thin tracking-wider mb-12 uppercase">
                How Can We Help?
              </h2>

              <div className="space-y-8">
                {contactMethods.map((method, index) => (
                  <div key={index} className="border-b border-gray-200">
                    <button
                      className="w-full text-left py-4 flex justify-between items-center"
                      onClick={() => toggleAccordion(index)}
                    >
                      <h3 className="text-lg md:text-xl font-thin tracking-wider">
                        {method.title}
                      </h3>
                      <motion.div
                        animate={{
                          rotate: activeAccordion === index ? 180 : 0,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <IoIosArrowDown />
                      </motion.div>
                    </button>

                    <motion.div
                      variants={accordionVariants}
                      animate={activeAccordion === index ? "open" : "closed"}
                      initial="closed"
                      className="overflow-hidden"
                    >
                      <div className="py-4 mb-4">
                        <p className="text-gray-600 mb-6">
                          {method.description}
                        </p>

                        <div className="space-y-6">
                          {method.items.map((item, itemIndex) => (
                            <motion.a
                              key={itemIndex}
                              href={item.link}
                              className="flex items-center gap-6 group"
                              whileHover={{ x: 5 }}
                            >
                              <div className="w-10 h-10 rounded-full bg-[#f8f6f4] flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">
                                  {item.label}
                                </p>
                                <p className="font-thin tracking-widest text-black group-hover:underline">
                                  {item.value}
                                </p>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5,
                ease: "easeOut",
              }}
            >
              <h2 className="text-2xl md:text-3xl font-thin tracking-wider mb-12 uppercase">
                Send Us a Message
              </h2>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#f8f6f4] p-12 text-center"
                >
                  <h3 className="text-xl md:text-2xl font-thin tracking-wider mb-4">
                    Thank You
                  </h3>
                  <p className="text-gray-600">
                    Your message has been sent successfully. We'll get back to
                    you shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm text-gray-500 mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition-colors bg-transparent"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm text-gray-500 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition-colors bg-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm text-gray-500 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition-colors bg-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm text-gray-500 mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition-colors bg-transparent"
                    >
                      <option value="" disabled>
                        Please select
                      </option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Returns">Returns</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm text-gray-500 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full border-b border-gray-300 py-3 focus:border-black outline-none transition-colors bg-transparent resize-none"
                    ></textarea>
                  </div>

                  <div className="mt-12">
                    <motion.button
                      type="submit"
                      className="px-8 py-4 bg-black text-white uppercase tracking-widerr text-sm hover:bg-gray-800 transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Send Message
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* World Map Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="w-full h-[60vh] bg-[#f8f6f4] mt-20 flex items-center justify-center"
        >
          <div className="text-center max-w-2xl mx-auto px-6">
            <h2 className="text-2xl md:text-3xl font-thin tracking-wider mb-6 uppercase">
              Our Global Presence
            </h2>
            <p className="text-gray-600 mb-8">
              Experience our exclusive collection at our retail locations
              worldwider.
            </p>
            <motion.a
              href="/store-locator"
              className="inline-block px-8 py-4 border border-black uppercase tracking-widerr text-sm hover:bg-black hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Find a Store
            </motion.a>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <div className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-thin tracking-wider mb-6 uppercase">
                Stay Connected
              </h2>
              <p className="text-gray-600 mb-8">
                Subscribe to receive exclusive updates and offers.
              </p>

              <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 border-b border-gray-300 py-3 px-4 focus:border-black outline-none transition-colors bg-transparent"
                  required
                />
                <motion.button
                  type="submit"
                  className="px-8 py-3 bg-black text-white uppercase tracking-widerr text-sm hover:bg-gray-800 transition-colors duration-300 whitespace-nowrap"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default ContactUs;
