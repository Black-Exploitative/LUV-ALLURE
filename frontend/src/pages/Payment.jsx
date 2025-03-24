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
    packagingOption: "standard", // New field for packaging options
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
      return <FaCheck className="w-6 h-6 text-black" />;
    }
    return (
      <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-800">
        {section}
      </span>
    ); // Increased size to match
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
                <div className="flex items-center space-x-3">
                  {getSectionIcon(1)}
                  <span className="font-medium">Personal Information</span>
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

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <CountryCodeInput
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                        />
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
                            className="focus:ring-black h-4 w-4 text-black border-gray-300 rounded"
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

                      {/* Alternate Contact Field - conditionally rendered */}
                      {formData.alternateContact && (
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alternate Contact
                          </label>
                          <input
                            type="tel"
                            name="alternateContactNumber"
                            value={formData.alternateContactNumber || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => handleContinue(1)}
                        className="cursor-pointer w-full py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                      >
                        Continue to Shipping
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
            <div className="bg-white shadow rounded-md overflow-hidden">
              <button
                className={`cursor-pointer w-full px-6 py-4 flex items-center justify-between ${
                  !canOpenSection(2) ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  activeSection === 2
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => canOpenSection(2) && setActiveSection(2)}
                disabled={!canOpenSection(2)}
              >
                <div className="flex items-center space-x-3">
                  {getSectionIcon(2)}
                  <span className="font-medium">Shipping</span>
                </div>
                {activeSection === 2 ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {activeSection === 2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t">
                      <div className="mb-6 space-y-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="homeDelivery"
                            name="shippingMethod"
                            value="homeDelivery"
                            checked={formData.shippingMethod === "homeDelivery"}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <div>
                            <label
                              htmlFor="homeDelivery"
                              className="font-medium block mb-1"
                            >
                              Home Delivery
                            </label>
                            <p className="text-sm text-gray-600">
                              Delivered to your address within 3-5 business
                              days.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="collectInStore"
                            name="shippingMethod"
                            value="collectInStore"
                            checked={
                              formData.shippingMethod === "collectInStore"
                            }
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <div>
                            <label
                              htmlFor="collectInStore"
                              className="font-medium block mb-1"
                            >
                              Collect in Store
                            </label>
                            <p className="text-sm text-gray-600">
                              Pick up your order from our store at no extra
                              cost.
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

              {/* Show summary when section is collapsed but completed */}
              {activeSection !== 2 && completedSections.includes(2) && (
                <div className="px-6 py-3 border-t text-sm text-gray-600">
                  {formData.shippingMethod === "homeDelivery" ? (
                    <p>
                      {formData.addressLine1}, {formData.city}, {formData.state}
                      , {formData.country}
                    </p>
                  ) : (
                    <p>Collect in Store</p>
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Packaging and Gifting */}
            <div className="bg-white shadow rounded-md overflow-hidden">
              <button
                className={`cursor-pointer w-full px-6 py-4 flex items-center justify-between ${
                  !canOpenSection(3) ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  activeSection === 3
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => canOpenSection(3) && setActiveSection(3)}
                disabled={!canOpenSection(3)}
              >
                <div className="flex items-center space-x-3">
                  {getSectionIcon(3)}
                  <span className="font-medium">Packaging and Gifting</span>
                </div>
                {activeSection === 3 ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {activeSection === 3 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t">
                      <div className="mb-6">
                        <h3 className="font-medium text-lg mb-4">
                          Select Packaging Option
                        </h3>

                        {/* Standard Packaging Option */}
                        <div className="flex flex-col md:flex-row border border-gray-200 rounded-md mb-4 hover:border-black transition-colors">
                          <div className="md:w-1/2 p-4">
                            <div className="flex items-start">
                              <input
                                type="radio"
                                id="standardPackaging"
                                name="packagingOption"
                                value="standard"
                                checked={
                                  formData.packagingOption === "standard"
                                }
                                onChange={handleInputChange}
                                className="mt-1 mr-3"
                              />
                              <div>
                                <label
                                  htmlFor="standardPackaging"
                                  className="font-medium block mb-1"
                                >
                                  Standard Packaging
                                </label>
                                <p className="text-sm text-gray-600">
                                  Elegant standard packaging with branded tissue
                                  paper.
                                </p>
                                <p className="text-sm font-semibold mt-2">
                                  Free
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="md:w-1/2 p-4 flex space-x-2">
                            {/* Standard Packaging Images */}
                            <div className="w-1/2 h-32 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src="../public/images/stylewith2.jpg"
                                alt="Standard packaging front"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-1/2 h-32 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src="./public/images/stylewith2.jpg"
                                alt="Standard packaging contents"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Premium Packaging Option */}
                        <div className="flex flex-col md:flex-row border border-gray-200 rounded-md mb-4 hover:border-black transition-colors">
                          <div className="md:w-1/2 p-4">
                            <div className="flex items-start">
                              <input
                                type="radio"
                                id="premiumPackaging"
                                name="packagingOption"
                                value="premium"
                                checked={formData.packagingOption === "premium"}
                                onChange={handleInputChange}
                                className="mt-1 mr-3"
                              />
                              <div>
                                <label
                                  htmlFor="premiumPackaging"
                                  className="font-medium block mb-1"
                                >
                                  Premium Packaging
                                </label>
                                <p className="text-sm text-gray-600">
                                  Luxury box with satin ribbon and premium
                                  presentation.
                                </p>
                                <p className="text-sm font-semibold mt-2">
                                  ₦5,000.00
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="md:w-1/2 p-4 flex space-x-2">
                            {/* Premium Packaging Images */}
                            <div className="w-1/2 h-32 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src="./public/images/stylewith2.jpg"
                                alt="Premium packaging box"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-1/2 h-32 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src="./public/images/stylewith2.jpg"
                                alt="Premium packaging open"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Gift Wrapping Option */}
                        <div className="mt-8">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              id="giftWrapping"
                              name="giftWrapping"
                              checked={formData.giftWrapping}
                              onChange={handleInputChange}
                              className="mt-1"
                            />
                            <div>
                              <label
                                htmlFor="giftWrapping"
                                className="font-medium block mb-1"
                              >
                                Add Gift Wrapping
                              </label>
                              <p className="text-sm text-gray-600">
                                Add premium gift wrapping to your order for an
                                additional ₦2,000.
                              </p>
                            </div>
                          </div>

                          {formData.giftWrapping && (
                            <div className="mt-4 ml-6">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
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

              {/* Show summary when section is collapsed but completed */}
              {activeSection !== 3 && completedSections.includes(3) && (
                <div className="px-6 py-3 border-t text-sm text-gray-600">
                  <p>
                    {formData.packagingOption === "premium"
                      ? "Premium packaging"
                      : "Standard packaging"}
                    {formData.giftWrapping ? ", Gift wrapped" : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Section 4: Payment */}
            <div className="bg-white shadow rounded-md overflow-hidden">
              <button
                className={`cursor-pointer w-full px-6 py-4 flex items-center justify-between ${
                  !canOpenSection(4) ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  activeSection === 4
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
                onClick={() => canOpenSection(4) && setActiveSection(4)}
                disabled={!canOpenSection(4)}
              >
                <div className="flex items-center space-x-3">
                  {getSectionIcon(4)}
                  <span className="font-medium">Payment</span>
                </div>
                {activeSection === 4 ? (
                  <FaChevronUp className="w-4 h-4" />
                ) : (
                  <FaChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {activeSection === 4 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 border-t">
                      <div className="mb-6 space-y-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="cardPayment"
                            name="paymentMethod"
                            value="card"
                            checked={formData.paymentMethod === "card"}
                            onChange={handleInputChange}
                            className="mt-1"
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

                        <div className="flex items-start space-x-3">
                          <input
                            type="radio"
                            id="bankTransfer"
                            name="paymentMethod"
                            value="bankTransfer"
                            checked={formData.paymentMethod === "bankTransfer"}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                          <div>
                            <label
                              htmlFor="bankTransfer"
                              className="font-medium block mb-1"
                            >
                              Bank Transfer
                            </label>
                            <p className="text-sm text-gray-600">
                              Payment instructions will be sent to your email.
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
                              setCompletedSections([...completedSections, 4]);
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
            </div>
          </div>

          {/* Column spacer for layout balance - the order summary is now at the top */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
