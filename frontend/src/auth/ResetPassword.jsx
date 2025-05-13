import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authService } from "../services/api";
import { toast } from "react-hot-toast";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenVerified, setTokenVerified] = useState(true); // Assume token is valid initially

  // Validate the token when component mounts
  useEffect(() => {
    // You might want to add token validation via API
    // For now, we'll just check that the token exists
    if (!token) {
      setTokenVerified(false);
      toast.error("Invalid or missing reset token");
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value,
    });

    // Clear specific error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!passwords.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // Call API to reset password
      await authService.resetPassword(token, passwords.newPassword);

      // Show success message
      toast.success("Password has been reset successfully");

      // Update UI to show success
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (error) {
      // Handle specific errors
      if (error.message?.includes("expired")) {
        setErrors({
          general: "Password reset link has expired. Please request a new one.",
        });
      } else {
        setErrors({
          general:
            error.message || "Failed to reset password. Please try again.",
        });
      }

      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!tokenVerified) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex flex-col">
          <div className="h-16 bg-black w-full"></div>
          <div className="flex-grow flex flex-col items-center justify-center px-6 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-medium mb-4">Invalid Reset Link</h1>
              <p className="text-gray-600 mb-8">
                The password reset link is invalid or has expired.
              </p>
              <Link
                to="/forgot-password"
                className="px-6 py-3 bg-black text-white text-sm"
              >
                REQUEST NEW RESET LINK
              </Link>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

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
              <h1 className="text-3xl font-thin md:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr lg:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerr 2xl:md:tracking-wide lg:tracking-wide xl:tracking-wider 2xl:tracking-widerst text-gray-900">
                RESET PASSWORD
              </h1>
              <p className="mt-6 text-sm text-gray-600">
                Enter your new password below.
              </p>
            </div>

            {resetSuccess ? (
              <div className="text-center space-y-6">
                <div className="rounded-full bg-green-50 w-16 h-16 flex items-center justify-center mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">
                  Your password has been reset successfully!
                </p>
                <p className="text-sm text-gray-600">
                  Redirecting you to the login page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                    {errors.general}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    NEW PASSWORD
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    CONFIRM PASSWORD
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    className={`appearance-none block w-full px-3 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ backgroundColor: "#333" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center py-3 px-4 border border-transparent cursor-pointer text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "RESETTING PASSWORD..." : "RESET PASSWORD"}
                  </motion.button>
                </div>
              </form>
            )}

            {!resetSuccess && (
              <div className="text-center">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-black hover:underline"
                >
                  RETURN TO SIGN IN
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
