import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom"; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkNavbar, setDarkNavbar] = useState(true); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartItemCount } = useCart();
  const location = useLocation(); 

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
   
    setDarkNavbar(location.pathname === "/" && !isScrolled);
  }, [location.pathname, isScrolled]);

  const handleCartClick = () => {
    if (cartItemCount === 0) {
      toast.error("No item in cart yet!");
    } else {
      toast.success("Opening cart...");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== "/" ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Left-side Navigation Links */}
        <div className={`hidden md:flex space-x-6 ${darkNavbar ? "text-white" : "text-black"}`}>
          <a href="#" className="hover:underline">SHOP</a>
          <a href="#" className="hover:underline">TRENDING</a>
          <a href="#" className="hover:underline">LOOKBOOK</a>
          <a href="#" className="hover:underline">NEW ARRIVALS</a>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <img src={`/icons/${isMobileMenuOpen ? "close-menu.svg" : "hamburger.svg"}`} alt="Menu" className="w-7 h-7" />
        </button>

        {/* Logo */}
        <div className="text-xl font-bold">
          <img src={darkNavbar ? "/images/logo-white.png" : "/images/logo-black.svg"} alt="Logo" className="h-10" />
        </div>

        {/* Right-side Navigation Links */}
        <div className={`hidden md:flex space-x-6 items-center ${darkNavbar ? "text-white" : "text-black"}`}>
          <a href="#" className="hover:underline">CONTACT US</a>
          <a href="#" className="hover:underline">SERVICES</a>
          <img src={darkNavbar ? "/icons/search.svg" : "/icons/search-black.svg"} alt="Search" className="w-5 h-5 cursor-pointer" />
          <img src={darkNavbar ? "/icons/contact.svg" : "/icons/contact-black.svg"} alt="Phone" className="w-5 h-5 cursor-pointer" />

          {/* Cart Icon */}
          <div className="relative">
            <img
              src={darkNavbar ? "/icons/cart.svg" : "/icons/cart-black.svg"}
              alt="Cart"
              className="w-5 h-5 cursor-pointer"
              onClick={handleCartClick}
            />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-3 w-3 bg-black rounded-full text-xs text-white flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 w-full p-4 shadow-lg">
          <a href="#" className="block py-2 text-black">Shop</a>
          <a href="#" className="block py-2 text-black">Trending</a>
          <a href="#" className="block py-2 text-black">Lookbook</a>
          <a href="#" className="block py-2 text-black">New Arrivals</a>
          <a href="#" className="block py-2 text-black">Contact Us</a>
          <a href="#" className="block py-2 text-black">Services</a>
        </div>
      )}
    </nav>
  );
}
