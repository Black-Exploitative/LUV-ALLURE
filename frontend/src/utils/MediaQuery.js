// frontend/src/utils/MediaQuery.jsx
import { useState, useEffect } from 'react';

// Define breakpoint for mobile/desktop detection
const MOBILE_BREAKPOINT = 768; // Commonly used breakpoint for mobile devices

/**
 * Hook to check if the current device is mobile based on screen width
 * @returns {boolean} True if the device is mobile, false otherwise
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Ensure the initial state is set correctly
    handleResize();
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

/**
 * Component that renders different content based on device type
 * @param {React.ReactNode} mobile - Content to render on mobile devices
 * @param {React.ReactNode} desktop - Content to render on desktop devices
 * @returns {React.ReactNode} The appropriate content based on device type
 */
export const DeviceView = ({ mobile, desktop }) => {
  const isMobile = useIsMobile();
  
  // Render mobile content on mobile devices, desktop content on desktop devices
  return isMobile ? mobile : desktop;
};