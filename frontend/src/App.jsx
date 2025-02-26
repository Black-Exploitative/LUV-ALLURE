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


export default function App() {
  return (
    <CartProvider>
    <Router>
    <Navbar />
    <Toaster />
    <CartDrawer />
    <AlreadyInCartModal />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}
