// frontend/src/auth/ProfileManagement.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api"; // Assuming you have an authService for API calls

const ProfileManagement = ({ user, setUser }) => {
  const { updateProfile, currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Use the user from props or from auth context
  const userData = user || currentUser || {};

  // Create a form state from the user data
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phoneNumber: userData.phoneNumber || ""
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the updateProfile method from AuthContext
      await updateProfile(formData);
      
      // Update the local state if setUser is provided
      if (setUser) {
        setUser(prev => ({
          ...prev,
          ...formData
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Here you would call an API endpoint to change the password
      await authService.changePassword(passwordData);
      
      // Reset form after successful change
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      // Show success message (handled by API service with toast)
    } catch (error) {
      console.error("Error changing password:", error);
      
      // Handle specific error for incorrect current password
      if (error.message?.includes('incorrect password')) {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: "Current password is incorrect"
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium mb-4">PERSONAL DETAILS</h2>
      <p className="text-xs text-gray-800 font-base font-[Raleway] mb-6">Update your personal information.</p>

      <form className="space-y-6" onSubmit={handleProfileSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              FIRST NAME
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleFormChange}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              LAST NAME
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleFormChange}
              className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            EMAIL
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleFormChange}
            className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-xs font-medium text-gray-700 mb-1"
          >
            PHONE NUMBER
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleFormChange}
            className="appearance-none block w-full px-3 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
          />
        </div>

        <div className="pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ backgroundColor: "#333" }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 cursor-pointer border border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
          </motion.button>
        </div>
      </form>

      <div className="pt-8 border-t border-gray-200">
        <h3 className="text-xl font-medium mb-4">CHANGE PASSWORD</h3>

        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              CURRENT PASSWORD
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className={`appearance-none block w-full px-3 py-3 border ${
                passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword}</p>
            )}
          </div>

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
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`appearance-none block w-full px-3 py-3 border ${
                passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              CONFIRM NEW PASSWORD
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`appearance-none block w-full px-3 py-3 border ${
                passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm`}
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ backgroundColor: "#333" }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 border cursor-pointer border-transparent text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProfileManagement.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  setUser: PropTypes.func,
};

export default ProfileManagement;