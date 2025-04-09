/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaCheck } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CountryCodeInput from "../components/CountryCodeInput";

const PaymentPage = () => {
  const { cartItems, getCartTotals } = useCart();
  const { subtotal, itemCount } = getCartTotals();

  // Track the active section and completion status
  const [activeSection, setActiveSection] = useState(1);
  const [completedSections, setCompletedSections] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    contactNumber: "",
    alternateContact: false,
    alternateContactNumber: "",

    // Shipping
    shippingMethod: "homeDelivery",
    addressLine1: "",
    country: "",
    city: "",
    state: "",
    postalCode: "",
 
    // Packaging
    packagingOption: "standard",
    giftWrapping: false,
    giftMessage: "",
  
    // Payment
    paymentMethod: "card",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Validation state
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate section data
  const validateSection = (section) => {
    const newErrors = {};

    switch (section) {
      case 1: // Personal Information
        if (!formData.firstName.trim())
          newErrors.firstName = "First name is required";
        if (!formData.lastName.trim())
          newErrors.lastName = "Last name is required";
        if (!formData.contactNumber.trim())
          newErrors.contactNumber = "Contact number is required";
        break;

      case 2: // Shipping
        if (formData.shippingMethod === "homeDelivery") {
          if (!formData.addressLine1.trim())
            newErrors.addressLine1 = "Address is required";
          if (!formData.country.trim())
            newErrors.country = "Country is required";
          if (!formData.city.trim()) newErrors.city = "City is required";
          if (!formData.state.trim()) newErrors.state = "State is required";
          if (!formData.postalCode.trim())
            newErrors.postalCode = "Postal code is required";
        }
        break;

      case 3: // Packaging - no required fields
        break;

      case 4: // Payment
        if (formData.paymentMethod === "card") {
          if (!formData.cardNumber.trim())
            newErrors.cardNumber = "Card number is required";
          if (!formData.cardName.trim())
            newErrors.cardName = "Name on card is required";
          if (!formData.expiryDate.trim())
            newErrors.expiryDate = "Expiry date is required";
          if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle continue to next section
  const handleContinue = (section) => {
    if (validateSection(section)) {
      // Mark current section as completed
      if (!completedSections.includes(section)) {
        setCompletedSections([...completedSections, section]);
      }

      // Activate next section
      setActiveSection(section + 1);
    }
  };

  // Check if a section can be opened
  const canOpenSection = (section) => {
    if (section === 1) return true;
    return completedSections.includes(section - 1) || activeSection === section;
  };

  const getSectionIcon = (section) => {
    if (completedSections.includes(section)) {
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white">
          <FaCheck className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black text-black font-bold text-lg">
        {section}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Checkout Header and Order Summary in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Checkout Header Box */}
          <div className="md:col-span-2 border border-gray-300 rounded-none p-4 h-20">
            <p className="text-gray-700 font-thin">
              You are checking out as: <br />{" "}
              <span className="font-thin">
                {formData.firstName
                  ? `${formData.firstName}@example.com`
                  : "guest@example.com"}
              </span>
            </p>
          </div>

          {/* Order Summary - with thin grey border */}
          <div className="border border-gray-300 rounded-none p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span>Items ({itemCount}):</span>
                <span>₦{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Shipping:</span>
                <span>
                  {formData.shippingMethod === "homeDelivery"
                    ? "₦5,000.00"
                    : "Free"}
                </span>
              </div>

              {formData.packagingOption === "premium" && (
                <div className="flex justify-between text-sm">
                  <span>Premium Packaging:</span>
                  <span>₦5,000.00</span>
                </div>
              )}

              {formData.giftWrapping && (
                <div className="flex justify-between text-sm">
                  <span>Gift Wrapping:</span>
                  <span>₦4,000.00</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>₦{(subtotal * 0.05).toFixed(2)}</span>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    ₦
                    {(
                      subtotal +
                      (formData.shippingMethod === "homeDelivery" ? 2000 : 0) +
                      (formData.packagingOption === "premium" ? 5000 : 0) +
                      (formData.giftWrapping ? 2000 : 0) +
                      subtotal * 0.05
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cart Items Summary */}
            <div>
              <h3 className="font-medium mb-3">Your Items</h3>
              <div className="space-y-3">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-10 h-10 bg-gray-200 mr-3">
                      <img
                        src={
                          item.images?.[0] ||
                          item.image ||
                          "/images/placeholder.jpg"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      {item.selectedSize && (
                        <p className="text-gray-500">
                          Size: {item.selectedSize}
                        </p>
                      )}
                    </div>
                    <span>
                      ₦
                      {typeof item.price === "string"
                        ? parseFloat(item.price.replace(/,/g, "")).toFixed(2)
                        : parseFloat(item.price || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-[-14rem]">
          {/* Checkout Sections */}
          <div className="md:col-span-2 space-y-4">
            {/* Section 1: Personal Information */}
            <div className="mb-8">
              {/* Section header  */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getSectionIcon(1)}
                  <span className="font-medium text-xl">
                    Personal Information
                  </span>
                </div>

                {/* Only show Edit when completed and not active */}
                {activeSection !== 1 && completedSections.includes(1) && (
                  <button
                    onClick={() => setActiveSection(1)}
                    className="text-sm text-black underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              <AnimatePresence>
                {(activeSection === 1 || !completedSections.includes(1)) && (
                  <motion.div
                    initial={false}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full p-2 border ${
                              errors.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md`}
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full p-2 border ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md`}
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Fixed Contact Number Field with more space */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Contact Number
                        </label>
                        <div className="flex gap-4">
                          <div className="w-1/3">
                            <select
                              className="w-full p-2 border border-gray-300 rounded-md"
                              defaultValue="+234"
                            >
                              <option value="+234">+234 (Nigeria)</option>
                              <option value="+1">+1 (USA)</option>
                              <option value="+44">+44 (UK)</option>
                              <option value="+33">+33 (France)</option>
                            </select>
                          </div>
                          <div className="w-2/3">
                            <input
                              type="tel"
                              name="contactNumber"
                              value={formData.contactNumber}
                              onChange={handleInputChange}
                              className={`w-full p-2 border ${
                                errors.contactNumber
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } rounded-md`}
                            />
                          </div>
                        </div>
                        {errors.contactNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.contactNumber}
                          </p>
                        )}
                      </div>

                      {/* Alternate Contact Checkbox */}
                      <div className="flex items-start mb-6">
                        <div className="flex items-center h-5">
                          <input
                            id="alternateContact"
                            name="alternateContact"
                            type="checkbox"
                            checked={formData.alternateContact || false}
                            onChange={handleInputChange}
                            className="focus:ring-black h-5 w-5 text-black border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="alternateContact"
                            className="font-medium text-gray-700"
                          >
                            Add alternate contact number
                          </label>
                        </div>
                      </div>

                      {/* Alternate Contact Field - with country code */}
                      {formData.alternateContact && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Alternate Contact
                          </label>
                          <div className="flex gap-4">
                            <div className="w-1/3">
                              <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                defaultValue="+234"
                              >
                                <option value="+234">+234 (Nigeria)</option>
                                <option value="+1">+1 (USA)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+33">+33 (France)</option>
                              </select>
                            </div>
                            <div className="w-2/3">
                              <input
                                type="tel"
                                name="alternateContactNumber"
                                value={formData.alternateContactNumber || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => handleContinue(1)}
                        className="cursor-pointer w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                      >
                        CONTINUE TO SHIPPING
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show summary when section is collapsed but completed */}
              {activeSection !== 1 && completedSections.includes(1) && (
                <div className="text-sm text-gray-600">
                  <p>
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>{formData.contactNumber}</p>
                  {formData.alternateContactNumber && (
                    <p>Alt: {formData.alternateContactNumber}</p>
                  )}
                </div>
              )}
            </div>

            {/* Section 2: Shipping */}
            <div className="mb-8">
              {/* When not completed or when active, show the normal section header and content */}
              {(!completedSections.includes(2) || activeSection === 2) && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getSectionIcon(2)}
                      <span className="font-medium text-xl">SHIPPING</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeSection === 2 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          {/* Shipping method in a row layout */}
                          <div className="mb-6 grid grid-cols-2 gap-4">
                            <div className="flex items-start border border-gray-200 p-4 rounded hover:border-black transition-colors">
                              <input
                                type="radio"
                                id="homeDelivery"
                                name="shippingMethod"
                                value="homeDelivery"
                                checked={
                                  formData.shippingMethod === "homeDelivery"
                                }
                                onChange={handleInputChange}
                                className="mt-1 mr-3 h-5 w-5"
                              />
                              <div>
                                <label
                                  htmlFor="homeDelivery"
                                  className="font-medium block mb-1"
                                >
                                  Home Delivery
                                </label>
                                <p className="text-sm text-gray-600">
                                  Delivered within 3-5 days
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start border border-gray-200 p-4 rounded hover:border-black transition-colors">
                              <input
                                type="radio"
                                id="collectInStore"
                                name="shippingMethod"
                                value="collectInStore"
                                checked={
                                  formData.shippingMethod === "collectInStore"
                                }
                                onChange={handleInputChange}
                                className="mt-1 mr-3 h-5 w-5"
                              />
                              <div>
                                <label
                                  htmlFor="collectInStore"
                                  className="font-medium block mb-1"
                                >
                                  Collect in Store
                                </label>
                                <p className="text-sm text-gray-600">
                                  Free pickup available
                                </p>
                              </div>
                            </div>
                          </div>

                          {formData.shippingMethod === "homeDelivery" && (
                            <div className="space-y-4 mb-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Address Line 1
                                </label>
                                <input
                                  type="text"
                                  name="addressLine1"
                                  value={formData.addressLine1}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 border ${
                                    errors.addressLine1
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-md`}
                                />
                                {errors.addressLine1 && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.addressLine1}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country
                                  </label>
                                  <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border ${
                                      errors.country
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-md`}
                                  />
                                  {errors.country && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.country}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                  </label>
                                  <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border ${
                                      errors.city
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-md`}
                                  />
                                  {errors.city && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.city}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State/Province
                                  </label>
                                  <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border ${
                                      errors.state
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-md`}
                                  />
                                  {errors.state && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.state}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code
                                  </label>
                                  <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className={`w-full p-2 border ${
                                      errors.postalCode
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-md`}
                                  />
                                  {errors.postalCode && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.postalCode}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => handleContinue(2)}
                            className="cursor-pointer w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                          >
                            Continue to Packaging
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* When completed and not active, show the summary view with underlined Edit */}
              {activeSection !== 2 && completedSections.includes(2) && (
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <FaCheck className="text-white w-5 h-5" />
                      </div>
                      <span className="font-medium text-xl">
                        SHIPPING ADDRESS
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveSection(2)}
                      className="text-sm text-black underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="ml-14 mt-3">
                    <div className="text-sm text-gray-600">
                      {formData.firstName} {formData.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.addressLine1}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.city}, {formData.state} {formData.postalCode}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.country}
                    </div>
                    <div className="mt-2">
                      {formData.shippingMethod === "homeDelivery" ? (
                        <div>
                          <div className="text-sm font-medium">
                            Premium Express
                          </div>
                          <div className="text-sm text-gray-600">$0</div>
                          <div className="text-sm text-gray-600">
                            Estimated delivery within 2-3 business days.
                            Delivery between 9am - 8pm, Monday to Friday. A
                            signature will be required upon delivery.
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600">
                          Collect in Store
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Packaging and Gifting */}
            <div className="mb-8">
              {/* When not completed or when active, show the normal section header and content */}
              {(!completedSections.includes(3) || activeSection === 3) && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getSectionIcon(3)}
                      <span className="font-medium text-xl">
                        PACKAGING & GIFTING
                      </span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeSection === 3 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <div className="mb-6">
                            <h3 className="font-medium text-xl mb-4">
                              Select Packaging Option
                            </h3>

                            {/* Standard Packaging Option - Gucci style with thick border */}
                            <div
                              className={`border-2 ${
                                formData.packagingOption === "standard"
                                  ? "border-black"
                                  : "border-gray-200"
                              } rounded-none mb-6 hover:border-black transition-colors`}
                            >
                              <div className="p-4 flex flex-row items-start">
                                <input
                                  type="radio"
                                  id="standardPackaging"
                                  name="packagingOption"
                                  value="standard"
                                  checked={
                                    formData.packagingOption === "standard"
                                  }
                                  onChange={handleInputChange}
                                  className="mt-1 mr-4 h-5 w-5"
                                />
                                <div className="flex-1">
                                  <label
                                    htmlFor="standardPackaging"
                                    className="font-medium text-lg block mb-2"
                                  >
                                    Standard Packaging
                                  </label>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Elegant standard packaging with branded
                                    tissue paper.
                                  </p>
                                  <p className="text-sm font-semibold">Free</p>
                                </div>
                                <div className="flex space-x-2">
                                  {/* Standard Packaging Images */}
                                  <div className="w-24 h-24 bg-gray-100">
                                    <img
                                      src="/api/placeholder/96/96"
                                      alt="Standard packaging"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Premium Packaging Option - Gucci style */}
                            <div
                              className={`border-2 ${
                                formData.packagingOption === "premium"
                                  ? "border-black"
                                  : "border-gray-200"
                              } rounded-none mb-6 hover:border-black transition-colors`}
                            >
                              <div className="p-4 flex flex-row items-start">
                                <input
                                  type="radio"
                                  id="premiumPackaging"
                                  name="packagingOption"
                                  value="premium"
                                  checked={
                                    formData.packagingOption === "premium"
                                  }
                                  onChange={handleInputChange}
                                  className="mt-1 mr-4 h-5 w-5"
                                />
                                <div className="flex-1">
                                  <label
                                    htmlFor="premiumPackaging"
                                    className="font-medium text-lg block mb-2"
                                  >
                                    Premium Packaging
                                  </label>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Luxury box with satin ribbon and premium
                                    presentation.
                                  </p>
                                  <p className="text-sm font-semibold">
                                    ₦5,000.00
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  {/* Premium Packaging Images */}
                                  <div className="w-24 h-24 bg-gray-100">
                                    <img
                                      src="/api/placeholder/96/96"
                                      alt="Premium packaging"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Gift Wrapping Option */}
                            <div className="mt-8">
                              <div className="flex items-start space-x-4">
                                <input
                                  type="checkbox"
                                  id="giftWrapping"
                                  name="giftWrapping"
                                  checked={formData.giftWrapping}
                                  onChange={handleInputChange}
                                  className="mt-1 h-5 w-5"
                                />
                                <div>
                                  <label
                                    htmlFor="giftWrapping"
                                    className="font-medium text-lg block mb-1"
                                  >
                                    Add Gift Wrapping
                                  </label>
                                  <p className="text-sm text-gray-600">
                                    Add premium gift wrapping to your order for
                                    an additional ₦4,000.
                                  </p>
                                </div>
                              </div>

                              {formData.giftWrapping && (
                                <div className="mt-4 ml-9">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Gift Message
                                  </label>
                                  <textarea
                                    name="giftMessage"
                                    value={formData.giftMessage}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Write your gift message here..."
                                  ></textarea>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleContinue(3)}
                            className="cursor-pointer w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* When completed and not active, show the summary view */}
              {activeSection !== 3 && completedSections.includes(3) && (
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <FaCheck className="text-white w-5 h-5" />
                      </div>
                      <span className="font-medium text-xl">
                        PACKAGING & GIFTING
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveSection(3)}
                      className="text-sm text-black underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="ml-14 mt-3">
                    <div className="text-sm text-gray-600">
                      {formData.packagingOption === "premium"
                        ? "Premium packaging"
                        : "Standard packaging"}
                    </div>
                    {formData.giftWrapping && (
                      <>
                        <div className="text-sm text-gray-600">
                          Gift wrapped
                        </div>
                        {formData.giftMessage && (
                          <div className="text-sm text-gray-600">
                            Gift message: "{formData.giftMessage}"
                          </div>
                        )}
                      </>
                    )}
                    <div className="mt-2">
                      <div className="text-sm text-gray-600">
                        {formData.packagingOption === "premium"
                          ? "₦5,000.00"
                          : "Free"}
                        {formData.giftWrapping
                          ? " + ₦4,000.00 for gift wrapping"
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Payment */}
            <div className="mb-8">
              {/* When not completed or when active, show the normal section header and content */}
              {(!completedSections.includes(4) || activeSection === 4) && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {getSectionIcon(4)}
                      <span className="font-medium text-xl">PAYMENT</span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeSection === 4 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <div className="mb-6 grid grid-cols-2 gap-4">
                            <div className="flex items-start border border-gray-200 p-4 rounded hover:border-black transition-colors">
                              <input
                                type="radio"
                                id="cardPayment"
                                name="paymentMethod"
                                value="card"
                                checked={formData.paymentMethod === "card"}
                                onChange={handleInputChange}
                                className="mt-1 mr-3 h-5 w-5"
                              />
                              <div>
                                <label
                                  htmlFor="cardPayment"
                                  className="font-medium block mb-1"
                                >
                                  Credit/Debit Card
                                </label>
                                <p className="text-sm text-gray-600">
                                  Pay securely with your card.
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start border border-gray-200 p-4 rounded hover:border-black transition-colors">
                              <input
                                type="radio"
                                id="bankTransfer"
                                name="paymentMethod"
                                value="bankTransfer"
                                checked={
                                  formData.paymentMethod === "bankTransfer"
                                }
                                onChange={handleInputChange}
                                className="mt-1 mr-3 h-5 w-5"
                              />
                              <div>
                                <label
                                  htmlFor="bankTransfer"
                                  className="font-medium block mb-1"
                                >
                                  Bank Transfer
                                </label>
                                <p className="text-sm text-gray-600">
                                  Payment instructions will be sent to your
                                  email.
                                </p>
                              </div>
                            </div>
                          </div>

                          {formData.paymentMethod === "card" && (
                            <div className="space-y-4 mb-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Card Number
                                </label>
                                <input
                                  type="text"
                                  name="cardNumber"
                                  value={formData.cardNumber}
                                  onChange={handleInputChange}
                                  placeholder="1234 5678 9012 3456"
                                  className={`w-full p-2 border ${
                                    errors.cardNumber
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-md`}
                                />
                                {errors.cardNumber && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.cardNumber}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Name on Card
                                </label>
                                <input
                                  type="text"
                                  name="cardName"
                                  value={formData.cardName}
                                  onChange={handleInputChange}
                                  className={`w-full p-2 border ${
                                    errors.cardName
                                      ? "border-red-500"
                                      : "border-gray-300"
                                  } rounded-md`}
                                />
                                {errors.cardName && (
                                  <p className="text-red-500 text-xs mt-1">
                                    {errors.cardName}
                                  </p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date
                                  </label>
                                  <input
                                    type="text"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/YY"
                                    className={`w-full p-2 border ${
                                      errors.expiryDate
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-md`}
                                  />
                                  {errors.expiryDate && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.expiryDate}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVV
                                  </label>
                                  <input
                                    type="text"
                                    name="cvv"
                                    value={formData.cvv}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                    className={`w-full p-2 border ${
                                      errors.cvv
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    } rounded-md`}
                                  />
                                  {errors.cvv && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {errors.cvv}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              if (validateSection(4)) {
                                if (!completedSections.includes(4)) {
                                  setCompletedSections([
                                    ...completedSections,
                                    4,
                                  ]);
                                }
                                alert("Order placed successfully!");
                              }
                            }}
                            className="w-full py-3 bg-black text-white cursor-pointer font-medium hover:bg-gray-800 transition-colors"
                          >
                            Place Order
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* When completed and not active, show the summary view */}
              {activeSection !== 4 && completedSections.includes(4) && (
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <FaCheck className="text-white w-5 h-5" />
                      </div>
                      <span className="font-medium text-xl">PAYMENT</span>
                    </div>
                    <button
                      onClick={() => setActiveSection(4)}
                      className="text-sm text-black underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="ml-14 mt-3">
                    {formData.paymentMethod === "card" ? (
                      <>
                        <div className="text-sm text-gray-600">
                          Credit/Debit Card payment
                        </div>
                        <div className="text-sm text-gray-600">
                          Card ending in {formData.cardNumber.slice(-4)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formData.cardName}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Bank Transfer - Payment instructions sent to your email
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column spacer for layout balance */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
