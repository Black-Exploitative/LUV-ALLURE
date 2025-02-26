// SignUp.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    marketing: false,
    termsAccepted: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Sign up attempt:", formData);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top background banner */}
      <div className="h-16 bg-black w-full"></div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-12">
          <img src="/images/logo-black.svg" alt="Logo" className="h-10" />
        </div>

        <div className="w-full max-w-md space-y-10">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-light tracking-wide text-gray-900">CREATE AN ACCOUNT</h1>
            <p className="mt-6 text-sm text-gray-600">
              Join us to receive personalized updates and access exclusive content.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                    FIRST NAME
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
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
                    value={formData.lastName}
                    onChange={handleChange}
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
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                  CONFIRM PASSWORD
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                />
              </div>

              {/* Marketing Preferences */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketing"
                    name="marketing"
                    type="checkbox"
                    checked={formData.marketing}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 focus:ring-black text-black"
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="marketing" className="text-gray-700">
                    I would like to receive updates about products, services, and exclusive offers.
                  </label>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    required
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="h-4 w-4 border-gray-300 focus:ring-black text-black"
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="termsAccepted" className="text-gray-700">
                    I agree to the{" "}
                    <Link to="/terms" className="text-black hover:underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-black hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                whileHover={{ backgroundColor: "#333" }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150"
              >
                CREATE ACCOUNT
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Sign in link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Already have an account?
            </p>
            <Link
              to="/signin"
              className="text-sm font-medium text-black hover:underline"
            >
              SIGN IN
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  </>
  );
}