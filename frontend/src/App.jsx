import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Checkout from "./components/Checkout";
import ContactUs from "./pages/ContactUs";
import Payment from "./pages/Payment";
import AlreadyInCartModal from "./components/AlreadyInCartModal";
import CartDrawer from "./components/CartDrawer";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import ForgotPassword from "./auth/ForgotPassword";
import UserAccount from "./auth/UserAccount";
import { RecentlyViewedProvider } from "./context/RecentlyViewedProducts";
import NewsletterModal from "./components/NewsLetterModal";

import { AuthProvider } from "./context/authContext";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AdminLogin from "./pages/admin/Login";
import { useAuth } from "./context/authContext"; 

// Protected route component for admin routes
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <CartProvider>
      <RecentlyViewedProvider>
        <AuthProvider>
          <Router>
            {/* Show Navbar only on non-admin routes */}
            <Routes>
              <Route
                path="/admin/*"
                element={null} // No Navbar for admin routes
              />
              <Route
                path="*"
                element={<Navbar />}
              />
            </Routes>
            
            <Toaster />
            <CartDrawer />
            <AlreadyInCartModal />
            <NewsletterModal />
            
            <Routes>
              {/* Customer routes */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:productId" element={<ProductDetailsPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/user-account" element={<UserAccount />} />
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedAdminRoute>
                    <Dashboard />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedAdminRoute>
                    <Products />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/categories" 
                element={
                  <ProtectedAdminRoute>
                    <div>Categories Page</div>
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedAdminRoute>
                    <div>Orders Page</div>
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/customers" 
                element={
                  <ProtectedAdminRoute>
                    <div>Customers Page</div>
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/inventory" 
                element={
                  <ProtectedAdminRoute>
                    <div>Inventory Page</div>
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedAdminRoute>
                    <div>Analytics Page</div>
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedAdminRoute>
                    <div>Settings Page</div>
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={<Navigate to="/admin/dashboard" replace />} 
              />
            </Routes>
          </Router>
        </AuthProvider>
      </RecentlyViewedProvider>
    </CartProvider>
  );
}