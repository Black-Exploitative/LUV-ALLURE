/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MobileNavbar from "./MobileNavbar";
import DesktopNavbar from "./DesktopNavbar";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [darkNavbar, setDarkNavbar] = useState(true);
  const location = useLocation();
  const navRef = useRef(null);
  
  // State to track screen size for responsive behavior
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDarkNavbar(location.pathname === "/" && !isScrolled);
  }, [location.pathname, isScrolled]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : location.pathname !== "/"
          ? "bg-white"
          : "bg-transparent"
      }`}
    >
     
      {isMobileView ? (
        <MobileNavbar darkNavbar={darkNavbar} />
      ) : (
        <DesktopNavbar darkNavbar={darkNavbar} />
      )}
    </nav>
  );
}