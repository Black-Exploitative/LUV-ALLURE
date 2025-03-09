import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        if (token) {
          setUser({
            id: '1',
            name: 'Admin User',
            email: 'admin@luvsallure.com',
            role: 'admin'
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication 
      if (email === 'admin@example.com' && password === 'password') {
        const userData = {
          id: '1',
          name: 'Admin User',
          email: 'admin@luxurybrand.com',
          role: 'admin'
        };
        
        // Store token in localStorage 
        localStorage.setItem('adminToken', 'mock-jwt-token');
        
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'An error occurred during login. Please try again.' 
      };
    }
  };

  const logout = () => {
    // Remove token and reset state
    localStorage.removeItem('adminToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;