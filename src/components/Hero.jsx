// src/components/Hero.jsx
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. SCROLL PHYSICS (Synchronized)
  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, {
    stiffness: 120, // Snappier response
    damping: 25,    // Smooth settling
    restDelta: 0.001
  });

  // 2. SYNCHRONIZED SCROLL EFFECTS
  // Background: Starts Zoomed IN (1.4), Zooms OUT to (1.0) on scroll
  // This reveals more scenery as you scroll down.
  const bgScale = useTransform(smoothScroll, [0, 1000], [1.4, 1]);
  
  // Text: Starts Normal (1.0), Zooms IN (1.5) towards the user + Fades Out
  // This creates a feeling of "passing through" the text into the mountains.
  const contentScale = useTransform(smoothScroll, [0, 500], [1, 1.5]);
  const contentOpacity = useTransform(smoothScroll, [0, 300], [1, 0]);
  const contentY = useTransform(smoothScroll, [0, 500], [0, 100]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]">
      
      {/* --- BACKGROUND (Zooms Out on Scroll) --- */}
      <motion.div
        style={{
          scale: bgScale,
          willChange: 'transform',
        }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/mountain.webp')",
            filter: "brightness(0.85) contrast(1.1)", // Slightly brighter for clarity
            transform: "translateZ(0)",
          }}
        />
        {/* Subtle Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* --- MAIN CONTENT (Zooms In on Scroll) --- */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center flex flex-col items-center"
        style={{ 
          scale: contentScale, 
          opacity: contentOpacity,
          y: contentY 
        }}
        // Simple, Fast Loading Animation
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        
        {/* Top Tagline */}
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider drop-shadow-md mb-2">
          Your Way to
        </h2>

        {/* Massive Cutout Text */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter">
          <span 
            className="block relative"
            style={{
              // Cutout Logic
              backgroundImage: "url('/mountain.webp')",
              backgroundAttachment: isMobile ? "scroll" : "fixed", 
              backgroundPosition: "center",
              backgroundSize: "cover",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              // Styling
              filter: "brightness(1.6) contrast(1.3)", // Brighten text to pop
              WebkitTextStroke: "2px rgba(255,255,255,0.3)", // Subtle border
            }}
          >
            THE MOUNTAINS
          </span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-white/90 font-medium max-w-xl mx-auto drop-shadow-lg">
          Experience the altitude. Premium tours and hidden trails awaiting your arrival.
        </p>

        {/* Simple CTA Button */}
        <motion.div 
          className="mt-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => navigate('/tours')}
            className="px-10 py-4 bg-white text-black rounded-full font-extrabold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
          >
            Start Journey
          </button>
        </motion.div>

      </motion.div>

      {/* --- SCROLL MOUSE (Fades out quickly) --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-[26px] h-[42px] border-2 border-white/50 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 bg-white rounded-full"
          />
        </div>
      </motion.div>

    </section>
  );
}