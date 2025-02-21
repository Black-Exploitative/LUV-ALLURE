import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetailsPage from "./pages/ProductDetailsPage"; 
import { CartProvider } from "./context/CartContext"; 
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <CartProvider>
    <Router>
    <Navbar />
    <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
      </Routes>
    </Router>
    </CartProvider>
  );
}
