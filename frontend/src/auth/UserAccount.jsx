// UserAccount.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function UserAccount() {
  // Mock user data - this would come from your auth context or API
  const [user, setUser] = useState({
    firstName: "Emma",
    lastName: "Thompson",
    email: "emma.thompson@example.com",
    phoneNumber: "+1 212 555 0123"
  });
  
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

  // Mock order history
  const [orders, setOrders] = useState([
    {
      id: "ORD-85721493",
      date: "February 20, 2025",
      status: "Delivered",
      total: "$2,350.00",
      items: [
        { name: "Leather Handbag", quantity: 1, price: "$1,980.00" },
        { name: "Silk Scarf", quantity: 1, price: "$370.00" }
      ]
    },
    {
      id: "ORD-76542198",
      date: "January 12, 2025",
      status: "Delivered", 
      total: "$890.00",
      items: [
        { name: "Wool Cardigan", quantity: 1, price: "$890.00" }
      ]
    }
  ]);

  // Active section tracker
  const [activeSection, setActiveSection] = useState("dashboard");

  // Navigation sections
  const sections = [
    { id: "dashboard", label: "DASHBOARD" },
    { id: "orders", label: "MY ORDERS" },
    { id: "style-advisor", label: "STYLE ADVISOR" },
    { id: "wishlist", label: "WISHLIST" },
    { id: "addresses", label: "ADDRESSES" },
    { id: "payments", label: "PAYMENT METHODS" },
    { id: "profile", label: "PERSONAL DETAILS" }
  ];

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white">
      {/* Top black banner for visual consistency */}
      <div className="h-16 bg-black w-full"></div>
      
      {/* Main content area with side navigation */}
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-wide text-gray-900">MY ACCOUNT</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Side navigation */}
          <div className="md:w-1/4">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left py-3 px-4 transition duration-150 ${
                      activeSection === section.id 
                        ? "bg-black text-white" 
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                    whileHover={{ x: activeSection === section.id ? 0 : 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {section.label}
                  </motion.button>
                ))}
                
                <motion.button
                  className="block w-full text-left py-3 px-4 transition duration-150 text-gray-800 hover:bg-gray-100"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  SIGN OUT
                </motion.button>
              </nav>
            </div>
          </div>
          
          {/* Main content area - conditionally render based on active section */}
          <div className="md:w-3/4">
            {activeSection === "dashboard" && (
              <div className="space-y-8">
                <div className="bg-gray-50 p-6">
                  <h2 className="text-xl font-light mb-4">WELCOME BACK, {user.firstName.toUpperCase()}</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    From your account dashboard you can view your recent orders, manage your shipping and billing addresses, 
                    and edit your password and account details.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 bg-white">
                      <h3 className="font-medium mb-2">PERSONAL INFORMATION</h3>
                      <p className="text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-sm">{user.email}</p>
                      <p className="text-sm">{user.phoneNumber}</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 text-xs underline"
                        onClick={() => setActiveSection("profile")}
                      >
                        EDIT
                      </motion.button>
                    </div>
                    <div className="p-4 border border-gray-200 bg-white">
                      <h3 className="font-medium mb-2">DEFAULT ADDRESS</h3>
                      <p className="text-sm">135 W 50th Street</p>
                      <p className="text-sm">New York, NY 10020</p>
                      <p className="text-sm">United States</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-4 text-xs underline"
                        onClick={() => setActiveSection("addresses")}
                      >
                        EDIT
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-xl font-light">RECENT ORDERS</h2>
                  {orders.length > 0 ? (
                    <div className="border border-gray-200">
                      {orders.map((order, index) => (
                        <div 
                          key={order.id} 
                          className={`p-6 ${index !== orders.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.date}</p>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <span className="inline-block px-3 py-1 text-xs bg-green-50 text-green-800">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">Items:</p>
                            <ul className="ml-4 list-disc">
                              {order.items.map((item, i) => (
                                <li key={i}>
                                  {item.name} x{item.quantity} - {item.price}
                                </li>
                              ))}
                            </ul>
                            <p className="mt-2 font-medium">Total: {order.total}</p>
                          </div>
                          <div className="mt-4">
                            <motion.button
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              className="text-xs underline"
                            >
                              VIEW ORDER DETAILS
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">You haven't placed any orders yet.</p>
                  )}
                  
                  {orders.length > 0 && (
                    <div className="text-right">
                      <motion.button
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-sm underline"
                        onClick={() => setActiveSection("orders")}
                      >
                        VIEW ALL ORDERS
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeSection === "orders" && (
              <div className="space-y-6">
                <h2 className="text-xl font-light">ORDER HISTORY</h2>
                <p className="text-sm text-gray-600">
                  View and track all your orders.
                </p>
                
                {orders.length > 0 ? (
                  <div className="border border-gray-200">
                    {orders.map((order, index) => (
                      <div 
                        key={order.id} 
                        className={`p-6 ${index !== orders.length - 1 ? 'border-b border-gray-200' : ''}`}
                      >
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <span className="inline-block px-3 py-1 text-xs bg-green-50 text-green-800">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">Items:</p>
                          <ul className="ml-4 list-disc">
                            {order.items.map((item, i) => (
                              <li key={i}>
                                {item.name} x{item.quantity} - {item.price}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-2 font-medium">Total: {order.total}</p>
                        </div>
                        <div className="mt-4 flex space-x-4">
                          <motion.button
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-xs underline"
                          >
                            VIEW ORDER DETAILS
                          </motion.button>
                          <motion.button
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-xs underline"
                          >
                            TRACK PACKAGE
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center border border-gray-200">
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="inline-block px-6 py-3 bg-black text-white text-sm">
                      EXPLORE COLLECTIONS
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeSection === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-light">PERSONAL DETAILS</h2>
                <p className="text-sm text-gray-600">
                  Update your personal information.
                </p>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                        FIRST NAME
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={user.firstName}
                        onChange={(e) => setUser({...user, firstName: e.target.value})}
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                        LAST NAME
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={user.lastName}
                        onChange={(e) => setUser({...user, lastName: e.target.value})}
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                      EMAIL
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={user.email}
                      onChange={(e) => setUser({...user, email: e.target.value})}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700 mb-1">
                      PHONE NUMBER
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={user.phoneNumber}
                      onChange={(e) => setUser({...user, phoneNumber: e.target.value})}
                      className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ backgroundColor: "#333" }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150"
                    >
                      SAVE CHANGES
                    </motion.button>
                  </div>
                </form>
                
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-light mb-4">CHANGE PASSWORD</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-xs font-medium text-gray-700 mb-1">
                        CURRENT PASSWORD
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-xs font-medium text-gray-700 mb-1">
                        NEW PASSWORD
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                        CONFIRM NEW PASSWORD
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <motion.button
                        type="submit"
                        whileHover={{ backgroundColor: "#333" }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-3 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150"
                      >
                        UPDATE PASSWORD
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            
              <div className="space-y-8">
                <h2 className="text-xl font-light">PERSONALIZED STYLE ADVISOR</h2>
                <p className="text-sm text-gray-600 max-w-3xl">
                  Experience tailored fashion recommendations curated exclusively for you based on your preferences and past purchases. Our AI-driven style advisor analyzes the latest trends and your unique aesthetic to create perfect ensembles.
                </p>
                
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
                      <h3 className="text-lg font-light tracking-wider">YOUR STYLE PROFILE</h3>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                {/* Personalized Recommendations */}
                <div className="mt-12">
                  <h3 className="text-lg font-light tracking-wider mb-6">CURATED FOR YOU</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        title: "CONTEMPORARY BUSINESS",
                        description: "Redefine power dressing with our elevated essentials.",
                        image: "/images/placeholder1.jpg"
                      },
                      {
                        title: "EVENING STATEMENTS",
                        description: "Make an impression with our signature evening pieces.",
                        image: "/images/placeholder2.jpg"
                      },
                      {
                        title: "WEEKEND LUXE",
                        description: "Elevate your off-duty moments with refined casual wear.",
                        image: "/images/placeholder3.jpg"
                      }
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
                        <h4 className="mt-4 font-medium text-sm tracking-wide">{collection.title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{collection.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Virtual Try-On Section */}
                <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-l-4 border-black">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                      <h3 className="text-lg font-light tracking-wider">VIRTUAL STYLING SESSION</h3>
                      <p className="mt-2 text-sm text-gray-600 max-w-xl">
                        Connect with our style advisors for a personalized virtual consultation. Get expert advice and discover pieces tailored to your preferences.
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: "#333" }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 md:mt-0 px-6 py-3 bg-black text-white text-sm flex items-center space-x-2"
                    >
                      <span>BOOK A SESSION</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </motion.button>
                  </div>
                </div>
                
                {/* AI Style Quiz */}
                <div className="mt-16 border border-gray-200 p-8">
                  <h3 className="text-lg font-light tracking-wider mb-6">DISCOVER YOUR SIGNATURE LOOK</h3>
                  
                  {/* Using useState hooks for quiz state management */}
                  <div className="space-y-8">
                    {/* Explanation */}
                    <p className="text-sm text-gray-600">
                      Take our interactive style quiz to refine your recommendations and help us understand your preferences better.
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
                            <h4 className="text-sm font-medium mb-4">WHAT INSPIRES YOUR STYLE?</h4>
                            <div className="space-y-3">
                              {["Architecture", "Nature", "Art", "Street Style", "Cultural Heritage"].map((item, idx) => (
                                <motion.div 
                                  key={idx}
                                  className={`flex items-center space-x-2 px-4 py-3 border cursor-pointer ${
                                    styleInspiration === item ? "border-black bg-gray-50" : "border-gray-200"
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
                                  <label htmlFor={`inspiration-${idx}`} className="text-sm cursor-pointer flex-grow">
                                    {item}
                                  </label>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-4">SELECT YOUR STATEMENT PIECE</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {["Jacket", "Bag", "Shoes", "Jewelry"].map((item, idx) => (
                                <motion.div 
                                  key={idx}
                                  className={`aspect-square border flex flex-col items-center justify-center cursor-pointer ${
                                    statementPiece === item ? "border-black bg-gray-50" : "border-gray-200"
                                  }`}
                                  whileHover={{ y: -5, borderColor: "#000" }}
                                  onClick={() => setStatementPiece(item)}
                                >
                                  <span className="text-3xl mb-2">
                                    {idx === 0 ? "🧥" : idx === 1 ? "👜" : idx === 2 ? "👠" : "💍"}
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
                            <h4 className="text-sm font-medium mb-4">WHAT'S YOUR COLOR PALETTE?</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {[
                                { name: "Neutrals", colors: ["#F5F5F5", "#E0E0E0", "#9E9E9E", "#424242"] },
                                { name: "Monochrome", colors: ["#FFFFFF", "#BDBDBD", "#616161", "#212121"] },
                                { name: "Earth Tones", colors: ["#A1887F", "#795548", "#5D4037", "#3E2723"] },
                                { name: "Bold & Vibrant", colors: ["#F44336", "#2196F3", "#FFEB3B", "#4CAF50"] }
                              ].map((palette, idx) => (
                                <motion.div 
                                  key={idx}
                                  className={`border p-3 cursor-pointer ${
                                    colorPalette === palette.name ? "border-black" : "border-gray-200"
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
                            <h4 className="text-sm font-medium mb-4">YOUR PREFERRED SILHOUETTE</h4>
                            <div className="space-y-3">
                              {["Fitted & Structured", "Relaxed & Oversized", "Balanced & Proportional", "Draped & Flowing"].map((item, idx) => (
                                <motion.div 
                                  key={idx}
                                  className={`flex items-center space-x-2 px-4 py-3 border cursor-pointer ${
                                    silhouette === item ? "border-black bg-gray-50" : "border-gray-200"
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
                                  <label htmlFor={`silhouette-${idx}`} className="text-sm cursor-pointer flex-grow">
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
                    
                   
            {/* Additional sections (wishlist, addresses, payments) would be implemented similarly */}
            {activeSection === "wishlist" && (
              <div className="space-y-6">
                <h2 className="text-xl font-light">MY WISHLIST</h2>
                <p className="text-sm text-gray-600">
                  Items you've saved for later.
                </p>
                
                <div className="py-12 text-center border border-gray-200">
                  <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
                  <Link to="/shop" className="inline-block px-6 py-3 bg-black text-white text-sm">
                    EXPLORE COLLECTIONS
                  </Link>
                </div>
              </div>
            )}
            
            {activeSection === "addresses" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-light">MY ADDRESSES</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-black text-sm font-medium text-black hover:bg-black hover:text-white focus:outline-none transition duration-150"
                  >
                    ADD NEW ADDRESS
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 relative">
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="text-xs underline">EDIT</button>
                      <button className="text-xs underline">DELETE</button>
                    </div>
                    
                    <div className="mb-2 flex items-center">
                      <h3 className="font-medium">HOME</h3>
                      <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs">DEFAULT</span>
                    </div>
                    
                    <p className="text-sm">Emma Thompson</p>
                    <p className="text-sm">135 W 50th Street</p>
                    <p className="text-sm">New York, NY 10020</p>
                    <p className="text-sm">United States</p>
                    <p className="text-sm">Phone: +1 212 555 0123</p>
                  </div>
                  
                  <div className="p-6 border border-gray-200 relative">
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="text-xs underline">EDIT</button>
                      <button className="text-xs underline">DELETE</button>
                    </div>
                    
                    <h3 className="font-medium mb-2">OFFICE</h3>
                    <p className="text-sm">Emma Thompson</p>
                    <p className="text-sm">350 Fifth Avenue</p>
                    <p className="text-sm">New York, NY 10118</p>
                    <p className="text-sm">United States</p>
                    <p className="text-sm">Phone: +1 212 555 4567</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === "payments" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-light">PAYMENT METHODS</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border border-black text-sm font-medium text-black hover:bg-black hover:text-white focus:outline-none transition duration-150"
                  >
                    ADD PAYMENT METHOD
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border border-gray-200 relative">
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="text-xs underline">EDIT</button>
                      <button className="text-xs underline">DELETE</button>
                    </div>
                    
                    <div className="mb-2 flex items-center">
                      <h3 className="font-medium">VISA ENDING IN 4321</h3>
                      <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs">DEFAULT</span>
                    </div>
                    
                    <p className="text-sm">Emma Thompson</p>
                    <p className="text-sm">Expiry: 05/27</p>
                    <p className="text-sm">Billing Address: 135 W 50th Street, New York</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
    </>
  );
  
}