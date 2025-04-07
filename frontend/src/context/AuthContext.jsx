// frontend/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if user is logged in on initial render
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        if (authService.isLoggedIn()) {
          // Get user data from localStorage first for immediate UI update
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (storedUser) {
            setCurrentUser(storedUser);
          }

          // Then fetch fresh data from the API
          try {
            const { user } = await authService.getCurrentUser();
            setCurrentUser(user);
          } catch (error) {
            // If API call fails (e.g., token expired), clear localStorage
            authService.logout();
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    try {
      // Format birthdate to ISO string if it's a Date object
      if (userData.birthdate && userData.birthdate instanceof Date) {
        userData.birthdate = userData.birthdate.toISOString();
      } else if (userData.dateOfBirth) {
        // Handle dateOfBirth field if that's what the form uses
        userData.birthdate = new Date(userData.dateOfBirth).toISOString();
        // Remove dateOfBirth to prevent confusion
        delete userData.dateOfBirth;
      }

      const response = await authService.register(userData);
      setCurrentUser(response.user);
      toast.success('Account created successfully!');
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      setCurrentUser(response.user);
      toast.success('Logged in successfully!');
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    toast.success('Logged out successfully!');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      // Call API to update user profile - implement this in authService
      // const response = await authService.updateProfile(userData);
      // setCurrentUser(response.user);
      
      // For now, just update the local state
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authChecked,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};