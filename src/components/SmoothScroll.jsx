// src/components/SmoothScroll.jsx
import { useEffect, useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useLocation } from 'react-router-dom';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const location = useLocation();

  // 1. Initialize Lenis (Singleton)
  useLayoutEffect(() => {
    // Prevent multiple instances
    if (lenisRef.current) return;

    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      duration: isMobile ? 1.5 : 1.2, // Longer duration = smoother feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: true, // Force smooth on touch for "butter" feel
      touchMultiplier: isMobile ? 1.5 : 2, // Sensitivity
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis; // Expose to window for other components to use

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      window.lenis = null;
    };
  }, []);

  // 2. Reset Scroll on Route Change (Immediate)
  useLayoutEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return <>{children}</>;
}