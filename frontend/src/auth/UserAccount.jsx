import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import the separated components
import Orders from "./Orders";
import ProfileManagement from "./ProfileManagement";
import StyleAdvisor from "./StyleAdvisor";

export default function UserAccount() {
  // Mock user data -
  const [user, setUser] = useState({
    firstName: "Emma",
    lastName: "Thompson",
    email: "emma.thompson@example.com",
    phoneNumber: "+1 212 555 0123"
  });
  
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
                    <p className="text-sm text-gray-600">You have not placed any orders yet.</p>
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
            
            {/* Use the imported Orders component */}
            {activeSection === "orders" && <Orders orders={orders} />}
            
            {/* Use the imported ProfileManagement component */}
            {activeSection === "profile" && <ProfileManagement user={user} setUser={setUser} />}
            
            {/* Use the imported StyleAdvisor component */}
            {activeSection === "style-advisor" && <StyleAdvisor user={user} />}
            
            {activeSection === "wishlist" && (
              <div className="space-y-6">
                <h2 className="text-xl font-light">MY WISHLIST</h2>
                <p className="text-sm text-gray-600">
                  Items you&apos;ve saved for later. 
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