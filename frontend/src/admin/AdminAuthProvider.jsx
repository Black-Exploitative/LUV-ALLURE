import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import PropTypes from 'prop-types';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check for existing admin token on app load
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
          // Set the token in API headers
          api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
          
          // Verify the token with the server
          const response = await api.get('/admin/verify');
          if (response.data.success) {
            setAdminUser(response.data.admin);
            setIsAdminAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('adminToken');
            delete api.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        localStorage.removeItem('adminToken');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setIsAdminLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      setIsAdminLoading(true);
      
      const response = await api.post('/admin/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, admin } = response.data;
        
        // Store admin token
        localStorage.setItem('adminToken', token);
        
        // Set token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update state
        setAdminUser(admin);
        setIsAdminAuthenticated(true);
        
        toast.success('Admin login successful');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsAdminLoading(false);
    }
  };

  const adminLogout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      await api.post('/admin/logout');
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
      setAdminUser(null);
      setIsAdminAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const value = {
    adminUser,
    isAdminAuthenticated,
    isAdminLoading,
    adminLogin,
    adminLogout
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

AdminAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};