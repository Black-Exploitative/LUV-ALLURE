import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import DatePicker from "../components/DatePicker"; 

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    marketing: false,
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      // Check if user is at least 16 years old
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      
      if (birthDate > minAgeDate) {
        newErrors.dateOfBirth = "You must be at least 16 years old";
      }
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Validate terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Copy data to avoid modifying the state directly
      const userData = {
        ...formData,
        // Convert to a birthdate field as expected by the backend
        birthdate: formData.dateOfBirth
      };
      
      // Register the user
      await register(userData);
      
      // Redirect to user account page
      navigate('/user-account');
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific errors from the server
      if (error.message?.includes('User already exists')) {
        setErrors(prev => ({
          ...prev,
          email: "This email is already registered"
        }));
      }
      
      // Error notification is handled by the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top background banner */}
      <div className="h-16 bg-black w-full"></div>
      
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        

        <div className="w-full max-w-md space-y-10">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-thin sm:tracking-tight md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr :tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr  lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2 lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-gray-900">CREATE AN ACCOUNT</h1>
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
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                  )}
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
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                  )}
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
                  className={`appearance-none block w-full px-3 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-xs font-medium text-gray-700 mb-1">
                  DATE OF BIRTH
                </label>
                <DatePicker
                  value={formData.dateOfBirth}
                  onChange={(e) => {
                    // Make sure we only update dateOfBirth and don't touch other form fields
                    const newValue = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      dateOfBirth: newValue
                    }));
                    
                    // Clear dateOfBirth error if it exists
                    if (errors.dateOfBirth) {
                      setErrors(prev => ({
                        ...prev,
                        dateOfBirth: undefined
                      }));
                    }
                  }}
                  error={errors.dateOfBirth}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
                )}
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
                  className={`appearance-none block w-full px-3 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
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
                  className={`appearance-none block w-full px-3 py-3 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
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
                    className={`h-4 w-4 border-gray-300 focus:ring-black text-black ${
                      errors.termsAccepted ? 'ring-1 ring-red-500' : ''
                    }`}
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="termsAccepted" className={`text-gray-700 ${
                    errors.termsAccepted ? 'text-red-500' : ''
                  }`}>
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
                  {errors.termsAccepted && (
                    <p className="mt-1 text-xs text-red-500">{errors.termsAccepted}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                whileHover={{ backgroundColor: "#333" }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 cursor-pointer border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
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