import { useState, useEffect } from "react";
import DesktopProductDetailsPage from "./DesktopProductDetailsPage";
import MobileProductDetailsPage from "./MobileProductDetailsPage";

const ProductDetailsPage = () => {
  const [viewportMode, setViewportMode] = useState("mobile");

   useEffect(() => {
    const handleViewportChange = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Improved iPad detection
      const isIPadPro = width === 1024 && height === 1366 || 
                       width === 1366 && height === 1024;
      
      if (width >= 1280 || isIPadPro) {
        setViewportMode("desktop");
      } else if (width >= 1024 && width > height) {
        setViewportMode("tablet-landscape");
      } else if (width >= 768) {
        setViewportMode("tablet-portrait");
      } else {
        setViewportMode("mobile");
      }
    };

    handleViewportChange();
    window.addEventListener("resize", handleViewportChange);
    
    return () => {
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);
  
  // Now adjust the component rendering based on the viewport mode
  if (viewportMode === "desktop") {
    return <DesktopProductDetailsPage viewportMode={viewportMode} />;
  } else if (viewportMode === "tablet-landscape") {
    // Specifically handle tablet landscape mode
    return <DesktopProductDetailsPage viewportMode={viewportMode} />;
  } else {
    // Use mobile component for mobile and tablet portrait modes
    return <MobileProductDetailsPage viewportMode={viewportMode} />;
  }
};

export default ProductDetailsPage;