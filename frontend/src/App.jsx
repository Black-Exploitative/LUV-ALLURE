// frontend/src/App.jsx (updated with CMS routes)
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import CheckoutNavbar from "./components/CheckOutNavbar";
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
import SearchResults from "./pages/SearchResults";

// Admin CMS imports
import Dashboard from "./admin/Dashboard";
import SectionForm from "./admin/forms/SectionForm";
import BannerForm from "./admin/forms/BannerForm";
import NavImageForm from "./admin/forms/NavImageForm";
import LayoutForm from "./admin/forms/LayoutForm";
import MediaForm from "./admin/forms/MediaForm";
import ProductRelationshipForm from "./admin/forms/ProductRelationshipForm";
import FeaturedProductsForm from "./admin/forms/FeaturedProductsForm";
import ShopBannerForm from "./admin/forms/ShopBannerForm";

// Add these routes in the admin routes section

const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Check if current route is an admin route
  const isAdminRoute = path.startsWith('/admin');
  
  // Check if current route is a checkout route
  const checkoutPaths = ['/payment'];
  const isCheckoutRoute = checkoutPaths.includes(path);
  
  // Don't show any navigation for admin routes
  if (isAdminRoute) {
    return (
      <>
        <Toaster />
        <Routes>
          {/* Admin routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/sections/new" element={<SectionForm />} />
          <Route path="/admin/sections/edit/:id" element={<SectionForm />} />
          <Route path="/admin/banners/new" element={<BannerForm />} />
          <Route path="/admin/banners/edit/:id" element={<BannerForm />} />
          <Route path="/admin/featured-products/new" element={<FeaturedProductsForm />} />
          <Route path="/admin/featured-products/edit/:sectionId" element={<FeaturedProductsForm />} />
          <Route path="/admin/nav-images/new" element={<NavImageForm />} />
          <Route path="/admin/nav-images/edit/:id" element={<NavImageForm />} />
          <Route path="/admin/layouts/new" element={<LayoutForm />} />
          <Route path="/admin/layouts/edit/:id" element={<LayoutForm />} />
          <Route path="/admin/media/new" element={<MediaForm />} />
          <Route path="/admin/media/edit/:id" element={<MediaForm />} />
          <Route path="/admin/product-relationships/new" element={<ProductRelationshipForm />} />
          <Route path="/admin/product-relationships/edit/:id" element={<ProductRelationshipForm />} />
          <Route path="/admin/shop-banner/new" element={<ShopBannerForm />} />
          <Route path="/admin/shop-banner/edit/:id" element={<ShopBannerForm />} />
        </Routes>
      </>
    );
  }
  
  return (
    <>
      {isCheckoutRoute ? <CheckoutNavbar /> : <Navbar />}
      <Toaster />
      <CartDrawer />
      <AlreadyInCartModal />
      <NewsletterModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-account" element={<UserAccount />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <CartProvider>
      <RecentlyViewedProvider>
        <Router>
          <AppContent />
        </Router>
      </RecentlyViewedProvider>
    </CartProvider>
  );
}