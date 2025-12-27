// src/hooks/useIsMobile.js

import { useState, useEffect } from 'react';

export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with correct value (SSR safe)
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    // RAF throttling to prevent excessive re-renders
    let ticking = false;
    let timeoutId = null;

    const checkMobile = () => {
      const newIsMobile = window.innerWidth < breakpoint;
      
      // Only update if value actually changed
      setIsMobile(prev => {
        if (prev !== newIsMobile) {
          return newIsMobile;
        }
        return prev;
      });
      
      ticking = false;
    };

    const handleResize = () => {
      // Clear previous timeout
      if (timeoutId) clearTimeout(timeoutId);
      
      // RAF throttling - only once per frame
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkMobile();
        });
        ticking = true;
      }
      
      // Debounce - final check after resize stops
      timeoutId = setTimeout(() => {
        checkMobile();
      }, 150);
    };
    
    // Use passive listener for better scroll performance
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isMobile;
};