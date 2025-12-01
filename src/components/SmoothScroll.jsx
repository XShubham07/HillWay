// src/components/SmoothScroll.jsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function SmoothScroll({ children }) {
  useEffect(() => {

    const isMobile = window.innerWidth < 768;

    const lenis = new Lenis({
      // ⚡ PC vs Mobile different durations
      duration: isMobile ? 0.55 : 1.0,

      // ⚡ Mobile responsiveness boost
      smoothTouch: true,                 // <-- KEY FIX
      touchMultiplier: isMobile ? 2.4 : 1.5,

      // ⚡ PC smoothness
      smooth: true,

      // ⚡ Scroll sensitivity
      wheelMultiplier: isMobile ? 1.2 : 1,

      // ⚡ Mobile natural feel = simple linear ease
      easing: isMobile
        ? (t) => t                          // SUPER RESPONSIVE
        : (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.lenis = lenis; // expose for scroll-driven components

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
