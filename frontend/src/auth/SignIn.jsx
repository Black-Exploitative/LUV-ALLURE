// SignIn.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic will be implemented later
    console.log("Sign in attempt:", { email, password, rememberMe });
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
            <h1 className="text-3xl font-light tracking-wide text-gray-900">SIGN IN</h1>
            <p className="mt-6 text-sm text-gray-600">
              Sign in to access your account and manage your preferences.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
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
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  PASSWORD
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                />
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 border-gray-300 focus:ring-black text-black"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-700">
                    REMEMBER ME
                  </label>
                </div>

                <div className="text-xs">
                  <Link to="/forgot-password" className="text-black hover:underline">
                    FORGOT PASSWORD?
                  </Link>
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
                SIGN IN
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

          {/* Create account link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Dont have an account?
            </p>
            <Link
              to="/signup"
              className="text-sm font-medium text-black hover:underline"
            >
              CREATE AN ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
  );
}