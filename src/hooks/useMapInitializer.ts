import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const fixLeafletIcons = () => {
  try {
    // @ts-ignore
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
      iconUrl: '/images/leaflet/marker-icon.png',
      shadowUrl: '/images/leaflet/marker-shadow.png',
    });
  } catch (error) {
    console.error('Error fixing Leaflet icons:', error);
  }
};

const useMapInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Skip if already initialized
    if (isInitialized) return;
    
    try {
      // Fix Leaflet icons
      fixLeafletIcons();
      
      // Mark as initialized
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing Leaflet:', error);
    }
    
    // Cleanup function
    return () => {
      // Clean up any Leaflet instances or event listeners if needed
    };
  }, [isInitialized]);
  
  return isInitialized;
};

export default useMapInitializer;
