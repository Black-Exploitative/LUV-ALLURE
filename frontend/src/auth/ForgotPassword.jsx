import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    setSubmitted(true);
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
            <h1 className="text-3xl font-light tracking-wide text-gray-900">FORGOT PASSWORD</h1>
            <p className="mt-6 text-sm text-gray-600">
              Enter your email address and we will send you a link to reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-6">
              <div className="rounded-full bg-green-50 w-16 h-16 flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">
                If an account exists for {email}, you will receive an email with instructions on how to reset your password.
              </p>
              <div className="pt-4">
                <Link
                  to="/signin"
                  className="text-sm font-medium text-black hover:underline"
                >
                  RETURN TO SIGN IN
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                />
              </div>

              <div>
                <motion.button
                  type="submit"
                  whileHover={{ backgroundColor: "#333" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150"
                >
                  RESET PASSWORD
                </motion.button>
              </div>
            </form>
          )}

          {!submitted && (
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