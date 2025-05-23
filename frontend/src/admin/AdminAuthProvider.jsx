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


  const DEVELOPMENT_MODE = true; 
  
  // Mock admin credentials for testing
  const MOCK_ADMIN = {
    id: 'admin_123',
    email: 'admin@luvsallure.com',
    name: "Luv's Allure Administrator",
    role: 'admin'
  };

  const MOCK_CREDENTIALS = {
    email: 'admin@luvsallure.com',
    password: 'Admin123!@#'
  };

  // Mock authentication functions
  const mockAdminLogin = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === MOCK_CREDENTIALS.email && password === MOCK_CREDENTIALS.password) {
      const mockToken = 'mock_admin_token_' + Date.now();
      return {
        success: true,
        token: mockToken,
        admin: MOCK_ADMIN
      };
    } else {
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }
  };

  const mockVerifyToken = async (token) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (token && token.startsWith('mock_admin_token_')) {
      return {
        success: true,
        admin: MOCK_ADMIN
      };
    } else {
      return {
        success: false,
        message: 'Invalid token'
      };
    }
  };

  // Check for existing admin token on app load
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
          if (DEVELOPMENT_MODE) {
            // Mock token verification
            const response = await mockVerifyToken(adminToken);
            if (response.success) {
              setAdminUser(response.admin);
              setIsAdminAuthenticated(true);
            } else {
              localStorage.removeItem('adminToken');
            }
          } else {
            // Real API call
            api.defaults.headers.common['Authorization'] = `Bearer ${adminToken}`;
            const response = await api.get('/admin/verify');
            if (response.data.success) {
              setAdminUser(response.data.admin);
              setIsAdminAuthenticated(true);
            } else {
              localStorage.removeItem('adminToken');
              delete api.defaults.headers.common['Authorization'];
            }
          }
        }
      } catch (error) {
        console.error('Admin auth check failed:', error);
        localStorage.removeItem('adminToken');
        if (!DEVELOPMENT_MODE) {
          delete api.defaults.headers.common['Authorization'];
        }
      } finally {
        setIsAdminLoading(false);
      }
    };

    checkAdminAuth();
  }, []);

  const adminLogin = async (email, password) => {
    try {
      setIsAdminLoading(true);
      
      let response;
      
      if (DEVELOPMENT_MODE) {
        // Use mock authentication
        response = await mockAdminLogin(email, password);
      } else {
        // Real API call
        const apiResponse = await api.post('/admin/login', { email, password });
        response = apiResponse.data;
      }

      if (response.success) {
        const { token, admin } = response;
        
        // Store admin token
        localStorage.setItem('adminToken', token);
        
       
        if (!DEVELOPMENT_MODE) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        
        // Update state
        setAdminUser(admin);
        setIsAdminAuthenticated(true);
        
        toast.success('Admin login successful');
        return { success: true };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      const message = DEVELOPMENT_MODE 
        ? 'Mock login failed. Check credentials.' 
        : error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsAdminLoading(false);
    }
  };

  const adminLogout = async () => {
    try {
      if (!DEVELOPMENT_MODE) {
       
        await api.post('/admin/logout');
      }
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      
      localStorage.removeItem('adminToken');
      if (!DEVELOPMENT_MODE) {
        delete api.defaults.headers.common['Authorization'];
      }
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
    adminLogout,
    DEVELOPMENT_MODE
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