import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

// Admin imports
import { AuthProvider } from "./context/authContext";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
    <CartProvider>
      <RecentlyViewedProvider>
        <AuthProvider>
          <Router>
            {/* Conditionally render Navbar for non-admin routes */}
            <Routes>
              <Route path="/admin/*" element={null} />
              <Route path="*" element={<Navbar />} />
            </Routes>
            
            <Toaster />
            <CartDrawer />
            <AlreadyInCartModal />
            <NewsletterModal />
            
            <Routes>
              {/* Customer-facing routes */}
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
              <Route path="/admin/dashboard" element={<Dashboard />} />
              {/* Add other admin routes directly */}
              
              {/* Default admin route */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </RecentlyViewedProvider>
    </CartProvider>
  );
}