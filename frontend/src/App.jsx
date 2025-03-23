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
import SearchResults from "./pages/SearchResults"; // Import the new search results page

export default function App() {
  return (
    <CartProvider>
      <RecentlyViewedProvider>
        <Router>
          <Navbar />
          <Toaster />
          <CartDrawer />
          <AlreadyInCartModal />
          <NewsletterModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route
              path="/product/:productId"
              element={<ProductDetailsPage />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user-account" element={<UserAccount />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </Router>
      </RecentlyViewedProvider>
    </CartProvider>
  );
}