/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";

import Orders from "./Orders";
import ProfileManagement from "./ProfileManagement";
import StyleAdvisor from "./StyleAdvisor";

export default function UserAccount() {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  
  // Set local user state from auth context
  const [user, setUser] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phoneNumber: currentUser?.phoneNumber || "",
  });

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mock order history
  const [orders, setOrders] = useState([
    {
      id: "ORD-85721493",
      date: "February 20, 2025",
      status: "Delivered",
      total: "$2,350.00",
      items: [
        { name: "Leather Handbag", quantity: 1, price: "$1,980.00" },
        { name: "Silk Scarf", quantity: 1, price: "$370.00" },
      ],
    },
    {
      id: "ORD-76542198",
      date: "January 12, 2025",
      status: "Delivered",
      total: "$890.00",
      items: [{ name: "Wool Cardigan", quantity: 1, price: "$890.00" }],
    },
  ]);

  // Active section tracker
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // Address management states
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: "HOME",
      firstName: user.firstName,
      lastName: user.lastName,
      street: "135 W 50th Street",
      city: "New York",
      state: "NY",
      zip: "10020",
      country: "United States",
      phone: "+1 212 555 0123",
      isDefault: true
    },
    {
      id: 2,
      label: "OFFICE",
      firstName: user.firstName,
      lastName: user.lastName,
      street: "350 Fifth Avenue",
      city: "New York",
      state: "NY",
      zip: "10118",
      country: "United States",
      phone: "+1 212 555 4567",
      isDefault: false
    }
  ]);
  
  // Edit and add address states
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    firstName: user.firstName,
    lastName: user.lastName,
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
    isDefault: false
  });

  // Navigation sections
  const sections = [
    { id: "dashboard", label: "DASHBOARD" },
    { id: "orders", label: "MY ORDERS" },
    { id: "style-advisor", label: "STYLE ADVISOR" },
    { id: "wishlist", label: "WISHLIST" },
    { id: "addresses", label: "ADDRESSES" },
    { id: "payments", label: "PAYMENT METHODS" },
    { id: "profile", label: "PERSONAL DETAILS" },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/');
  };
  
  // Address form handlers
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm({
      ...addressForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  
  const startEditingAddress = (address) => {
    setCurrentAddress(address);
    setAddressForm({
      ...address
    });
    setIsEditing(true);
    setIsAdding(false);
  };
  
  const startAddingAddress = () => {
    setAddressForm({
      label: "",
      firstName: user.firstName,
      lastName: user.lastName,
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      phone: "",
      isDefault: false
    });
    setIsAdding(true);
    setIsEditing(false);
  };
  
  const cancelAddressEdit = () => {
    setIsEditing(false);
    setIsAdding(false);
    setCurrentAddress(null);
  };
  
  const saveAddress = () => {
    if (isEditing && currentAddress) {
      setAddresses(addresses.map(addr => {
        if (addr.id === currentAddress.id) {
          return { ...addressForm, id: addr.id };
        }
        // If this address is set as default, set other addresses to non-default
        if (addressForm.isDefault && addr.id !== currentAddress.id) {
          return { ...addr, isDefault: false };
        }
        return addr;
      }));
    } else if (isAdding) {
      const newId = Math.max(...addresses.map(a => a.id), 0) + 1;
      const newAddress = { ...addressForm, id: newId };
      
      // If the new address is set as default, update other addresses
      if (newAddress.isDefault) {
        setAddresses([
          ...addresses.map(a => ({ ...a, isDefault: false })),
          newAddress
        ]);
      } else {
        setAddresses([...addresses, newAddress]);
      }
    }
    
    setIsEditing(false);
    setIsAdding(false);
    setCurrentAddress(null);
  };
  
  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  // Handler for selecting section - also closes mobile menu
  const handleSectionSelect = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  // Show loading state while fetching user data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }
  
  // Get current section label for mobile display
  const currentSectionLabel = sections.find(section => section.id === activeSection)?.label || "DASHBOARD";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Top black banner for visual consistency */}
        <div className="h-16 bg-black w-full"></div>

        {/* Main content area with side navigation */}
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-wide text-gray-900">
              MY ACCOUNT
            </h1>
          </div>

          {/* Mobile section selector - only visible on mobile */}
          <div className="md:hidden mb-6">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between py-3 px-4 border border-gray-300 focus:outline-none"
            >
              <span className="font-medium">{currentSectionLabel}</span>
              {isMobileMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {/* Dropdown menu for mobile */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-x border-b border-gray-300"
                >
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionSelect(section.id)}
                      className={`block w-full text-left py-3 px-4 transition ${
                        activeSection === section.id
                          ? "bg-black text-white"
                          : "text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-3 px-4 transition text-gray-800 hover:bg-gray-100"
                  >
                    SIGN OUT
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Side navigation - hidden on mobile */}
            <div className="hidden md:block md:w-1/4">
              <div className="sticky top-24">
                <nav className="space-y-1 font-normal">
                  {sections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`block w-full text-left py-3 px-4 transition cursor-pointer duration-150 ${
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
                    onClick={handleSignOut}
                    className="block w-full text-left py-3 px-4 cursor-pointer transition duration-150 text-gray-800 hover:bg-gray-100"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    SIGN OUT
                  </motion.button>
                </nav>
              </div>
            </div>

            {/* Main content area - takes full width on mobile */}
            <div className="w-full md:w-3/4">
              {activeSection === "dashboard" && (
                <div className="space-y-8">
                  <div className="p-2">
                    <h2 className="text-[20px] font-medium mb-4">
                      WELCOME BACK, {user.firstName.toUpperCase()}
                    </h2>
                    <p className="text-[12px] text-gray-600 font-normal tracking-wide mb-6">
                      From your account dashboard you can view your recent
                      orders, manage your shipping and billing addresses, and
                      edit your password and account details.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-2">
                      <div className="p-4 border border-gray-200 bg-white">
                        <h3 className="font-medium mb-[10px]">
                          PERSONAL INFORMATION
                        </h3>
                        <p className="text-[14px] font-normal ">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-[13px] font-[100] tracking-wide">{user.email}</p>
                        <p className="text-[13px]  tracking-wide">{user.phoneNumber}</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4 text-xs underline font-normal cursor-pointer"
                          onClick={() => handleSectionSelect("profile")}
                        >
                          EDIT
                        </motion.button>
                      </div>
                      <div className="p-4 border border-gray-200 bg-white">
                        <h3 className="font-medium mb-2">DEFAULT ADDRESS</h3>
                        <p className="text-sm font-normal font-[Raleway]">135 W 50th Street</p>
                        <p className="text-sm font-normal font-[Raleway]">New York, NY 10020</p>
                        <p className="text-sm font-normal font-[Raleway]">United States</p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-4 text-xs underline cursor-pointer"
                          onClick={() => handleSectionSelect("addresses")}
                        >
                          EDIT
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-lg pl-4 font-medium">RECENT ORDERS</h2>
                    <div className="ml-4">
                      {/* We'll use the Orders component with limited display for dashboard */}
                      <Orders dashboard={true} limit={2} />
                    </div>
                  </div>
                </div>
              )}

              {/* Use the imported Orders component */}
              {activeSection === "orders" && <Orders orders={orders} />}

              {/* Use the imported ProfileManagement component */}
              {activeSection === "profile" && (
                <ProfileManagement user={user} setUser={setUser} />
              )}

              {/* Use the imported StyleAdvisor component */}
              {activeSection === "style-advisor" && (
                <StyleAdvisor user={user} />
              )}

              {activeSection === "wishlist" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-medium mb-4">MY WISHLIST</h2>
                  <p className="text-sm text-gray-600">
                    Items you&apos;ve saved for later.
                  </p>

                  <div className="py-12 text-center border border-gray-200">
                    <p className="text-gray-600 mb-4">
                      Your wishlist is empty.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-3 bg-black text-white text-sm"
                    >
                      EXPLORE COLLECTIONS
                    </Link>
                  </div>
                </div>
              )}

              {activeSection === "addresses" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium mb-4">MY ADDRESSES</h2>
                    {!isAdding && !isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 border cursor-pointer border-black text-sm font-medium text-black hover:bg-black hover:text-white focus:outline-none transition duration-150"
                        onClick={startAddingAddress}
                      >
                        ADD NEW ADDRESS
                      </motion.button>
                    )}
                  </div>

                  {/* Form for adding or editing an address */}
                  {(isAdding || isEditing) && (
                    <div className="mb-6 p-6 border border-gray-200">
                      <h3 className="font-medium mb-4">
                        {isAdding ? "ADD NEW ADDRESS" : "EDIT ADDRESS"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs mb-1" htmlFor="label">
                            ADDRESS LABEL
                          </label>
                          <input
                            type="text"
                            id="label"
                            name="label"
                            value={addressForm.label}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                            placeholder="e.g., HOME, OFFICE"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="firstName">
                            FIRST NAME
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={addressForm.firstName}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="lastName">
                            LAST NAME
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={addressForm.lastName}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="street">
                            STREET ADDRESS
                          </label>
                          <input
                            type="text"
                            id="street"
                            name="street"
                            value={addressForm.street}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="city">
                            CITY
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="state">
                            STATE/PROVINCE
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="zip">
                            ZIP/POSTAL CODE
                          </label>
                          <input
                            type="text"
                            id="zip"
                            name="zip"
                            value={addressForm.zip}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="country">
                            COUNTRY
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs mb-1" htmlFor="phone">
                            PHONE NUMBER
                          </label>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressChange}
                            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-black"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-center">
                          <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={addressForm.isDefault}
                            onChange={handleAddressChange}
                            className="mr-2"
                          />
                          <label htmlFor="isDefault" className="text-sm">
                            SET AS DEFAULT ADDRESS
                          </label>
                        </div>
                      </div>
                      <div className="mt-6 flex space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={saveAddress}
                          className="px-6 py-2 bg-black text-white text-sm cursor-pointer"
                        >
                          {isAdding ? "ADD ADDRESS" : "SAVE CHANGES"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelAddressEdit}
                          className="px-6 py-2 border border-black text-sm cursor-pointer"
                        >
                          CANCEL
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* List of addresses */}
                  {!isAdding && !isEditing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-6 border border-gray-200 relative">
                          <div className="absolute top-4 right-4 flex space-x-2">
                            <button 
                              className="text-xs underline cursor-pointer"
                              onClick={() => startEditingAddress(address)}
                            >
                              EDIT
                            </button>
                            <button 
                              className="text-xs underline cursor-pointer"
                              onClick={() => deleteAddress(address.id)}
                            >
                              DELETE
                            </button>
                          </div>

                          <div className="mb-2 flex items-center">
                            <h3 className="font-medium">{address.label}</h3>
                            {address.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs">
                                DEFAULT
                              </span>
                            )}
                          </div>

                          <p className="text-sm font-normal font-[Raleway]">
                            {address.firstName} {address.lastName}
                          </p>
                          <p className="text-sm font-normal font-[Raleway]">{address.street}</p>
                          <p className="text-sm font-normal font-[Raleway]">
                            {address.city}, {address.state} {address.zip}
                          </p>
                          <p className="text-sm font-normal font-[Raleway]">{address.country}</p>
                          <p className="text-sm font-normal font-[Raleway]">Phone: {address.phone}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeSection === "payments" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-medium mb-4">PAYMENT METHODS</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 border border-black cursor-pointer text-sm font-medium text-black hover:bg-black hover:text-white focus:outline-none transition duration-150"
                    >
                      ADD PAYMENT METHOD
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-gray-200 relative">
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="text-xs underline cursor-pointer">EDIT</button>
                        <button className="text-xs underline cursor-pointer">DELETE</button>
                      </div>

                      <div className="mb-2 flex items-center">
                        <h3 className="font-medium">VISA ENDING IN 4321</h3>
                        <span className="ml-2 px-2 py-0.5 bg-black text-white text-xs">
                          DEFAULT
                        </span>
                      </div>

                      <p className="text-sm font-normal font-[Raleway]">{user.firstName} {user.lastName}</p>
                      <p className="text-sm font-normal font-[Raleway]">Expiry: 05/27</p>
                      <p className="text-sm font-normal font-[Raleway]">
                        Billing Address: 135 W 50th Street, New York
                      </p>
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