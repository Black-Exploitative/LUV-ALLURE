import { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
       
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:underline">SHOP</a>
          <a href="#" className="hover:underline">TRENDING</a>
          <a href="#" className="hover:underline">LOOKBOOK</a>
          <a href="#" className="hover:underline">NEW ARRIVALS</a>
        </div>
        
        
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <img src={`/icons/${isMobileMenuOpen ? "close-menu.svg" : "hamburger.svg"}`} alt="Menu" className="w-7 h-7" />
        </button>
        
        
        <div className="text-xl font-bold">
          <img src="/images/logo-white.png" alt="Luv-Allure Logo" className="h-10" />
        </div>
        
        
        <div className="hidden md:flex space-x-6 items-center">
          <img src="/icons/search.svg" alt="Search" className="w-5 h-5 cursor-pointer" />
          <img src="/icons/contact.svg" alt="Phone" className="w-5 h-5 cursor-pointer" />
          <img src="/icons/cart.svg" alt="Cart" className="w-5 h-5 cursor-pointer" />
          <a href="#" className="hover:underline">CONTACT US</a>
          <a href="#" className="hover:underline">SERVICES</a>
        </div>
      </div>

      
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-16 left-0 w-full p-4 shadow-lg">
          <a href="#" className="block py-2">Shop</a>
          <a href="#" className="block py-2">Trending</a>
          <a href="#" className="block py-2">Lookbook</a>
          <a href="#" className="block py-2">New Arrivals</a>
          <a href="#" className="block py-2">Contact Us</a>
          <a href="#" className="block py-2">Services</a>
        </div>
      )}
    </nav>
  );
}