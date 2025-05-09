// frontend/src/utils/MediaQuery.js
import { useState, useEffect } from 'react';

// Define breakpoints for different device sizes
export const breakpoints = {
  mobile: 480,   // phones
  tablet: 768,   // tablets
  laptop: 1024,  // laptops/small desktops
  desktop: 1280  // large desktops
};

/**
 * Hook to detect current device type based on screen width
 * @returns {Object} Object containing boolean flags for each device type
 */
export const useDeviceDetect = () => {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      const width = window.innerWidth;
      setDeviceType({
        isMobile: width < breakpoints.tablet,
        isTablet: width >= breakpoints.tablet && width < breakpoints.laptop,
        isLaptop: width >= breakpoints.laptop && width < breakpoints.desktop,
        isDesktop: width >= breakpoints.desktop
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away to set initial state
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  return deviceType;
};

/**
 * Component that renders different content based on device size
 * @param {Object} props
 * @param {React.ReactNode} props.mobile - Content to show on mobile devices
 * @param {React.ReactNode} props.desktop - Content to show on desktop, laptop, and tablet
 * @param {boolean} props.reloadOnChange - Whether to force remount when device changes
 * @returns {React.ReactNode}
 */
export const DeviceView = ({ mobile, desktop, reloadOnChange = true }) => {
  const { isMobile } = useDeviceDetect();
  
  // If reloadOnChange is true, use a key to force remount when device type changes
  const key = reloadOnChange ? `device-${isMobile ? 'mobile' : 'desktop'}` : undefined;
  
  // Return the appropriate content with optional key for remounting
  return (
    <div key={key}>
      {isMobile ? mobile : desktop}
    </div>
  );
};

export default useDeviceDetect;