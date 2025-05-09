import { useState, useEffect } from "react";
import DesktopProductDetailsPage from "../pages/DesktopProductDetailsPage";
import MobileProductDetailsPage from "../pages/MobileProductDetailsPage";

const ProductDetailsPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkIfMobile();

  
    window.addEventListener("resize", checkIfMobile);

   
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return isMobile ? <MobileProductDetailsPage /> : <DesktopProductDetailsPage />;
};

export default ProductDetailsPage;