// src/components/PackageCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function PackageCard({ p, onView, index = 0 }) {
  const data = p;
  if (!data) return null;

  const ref = useRef(null);
  
  // Internal view detection for the glass slide-up effect
  const isCenterInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync active state for glass effect
  useEffect(() => {
    if (isMobile) {
      setActive(isCenterInView);
    }
  }, [isMobile, isCenterInView]);

  return (
    <motion.div
      ref={ref}
      // --- SMOOTH BULLET ANIMATION ---
      initial={{ opacity: 0, x: -50, scale: 0.95 }} 
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }} 
      transition={{ 
        type: "spring", 
        stiffness: 120, 
        damping: 14,    
        mass: 1,
        delay: index * 0.12 
      }}
      // --- CSS PERFORMANCE OVERRIDES ---
      className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-2xl group isolate bg-gray-900 will-change-transform transform-gpu"
      style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }} 
      
      onClick={() => onView?.(data)}
      onMouseEnter={() => !isMobile && setActive(true)}
      onMouseLeave={() => !isMobile && setActive(false)}
    >
      {/* 1. Optimized Image with Progressive Blur-Up */}
      <div className={`absolute inset-0 z-0 bg-gray-800 transition-opacity duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`} />
      
      <img
        src={data.img}
        alt={data.title}
        // Optimize LCP: Eager load first 2 cards, lazy load the rest
        loading={index < 2 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "auto"}
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out will-change-transform
          ${imgLoaded ? 'blur-0 scale-100 grayscale-0' : 'blur-xl scale-110 grayscale'}
          group-hover:scale-110
        `}
      />

      {/* 2. Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 z-10 pointer-events-none" />

      {/* 3. Bottom Content Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        
        {/* Animated Glass Background */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: active ? "0%" : "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 120 }}
          className="absolute inset-0 bg-white/10 backdrop-blur-xl border-t border-white/40 rounded-t-3xl will-change-transform"
        />

        {/* Content Container */}
        <div className="relative p-6 pt-6 flex flex-row items-end justify-between gap-4">
          
          {/* Left: Title & Subtitle */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h3 className="text-2xl font-extrabold text-white leading-tight drop-shadow-md truncate">
              {data.title}
            </h3>
            <p className="text-sm text-gray-200 font-medium line-clamp-2 leading-snug opacity-90">
              {data.subtitle || "Premium guided tour"}
            </p>
          </div>

          {/* Right: Price */}
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold block mb-0.5">
              Starting
            </span>
            <span className="text-xl font-bold text-cyan-300 drop-shadow-md block">
              ₹{data.basePrice?.toLocaleString()}
            </span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}