// src/components/CartoonLandscape.jsx
import React from "react";
import { motion } from "framer-motion";

export default function CartoonLandscape({ style }) {
  // Variants for subtle floating animations
  const floatingVariant = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const sunVariant = {
    animate: {
      rotate: 360,
      scale: [1, 1.1, 1],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      style={{
        ...style,
        background: "linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)", // Sky gradient
      }}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden origin-bottom"
    >
      {/* --- SUN --- */}
      <motion.div
        variants={sunVariant}
        animate="animate"
        className="absolute top-16 right-24 w-32 h-32"
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="#FFD700" />
          <circle cx="50" cy="50" r="38" stroke="#FFD700" strokeWidth="4" strokeDasharray="10 10" opacity="0.6"/>
        </svg>
      </motion.div>

      {/* --- CLOUDS --- */}
      <motion.div variants={floatingVariant} animate="animate" className="absolute top-32 left-10 w-48 opacity-80">
        <Cloud />
      </motion.div>
      <motion.div
        variants={floatingVariant}
        animate="animate"
        transition={{ delay: 2 }}
        className="absolute top-20 right-1/3 w-40 opacity-70"
      >
        <Cloud />
      </motion.div>

      {/* --- MOUNTAINS --- */}
      <div className="absolute bottom-0 left-0 w-full flex items-end translate-y-1">
        {/* Back Mountain - Darker, less detail */}
        <svg
          className="w-full h-auto absolute bottom-0 -z-10 opacity-80"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#7FB285" d="M0,160 L120,130 C240,100 480,40 720,60 C960,80 1200,180 1320,230 L1440,280 L1440,320 L0,320 Z" />
        </svg>

        {/* Middle Mountain - Medium color */}
        <svg
          className="w-full h-auto absolute bottom-0 -z-5"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#95C6A8" d="M0,220 L80,190 C160,160 320,100 480,110 C640,120 800,200 960,210 C1120,220 1280,160 1360,130 L1440,100 L1440,320 L0,320 Z" />
          {/* Snow cap */}
          <path fill="#FFFFFF" d="M400,115 L480,110 L560,125 L480,150 Z" opacity="0.8" />
        </svg>

        {/* Front Mountain - Lighter color with simple snow caps */}
        <svg
          className="w-full h-auto relative z-0"
          viewBox="0 0 1440 400"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path fill="#A8D5BA" d="M0,320 L60,280 C120,240 240,160 360,170 C480,180 600,280 720,290 C840,300 960,220 1080,190 C1200,160 1320,180 1380,190 L1440,200 L1440,400 L0,400 Z" />
          {/* Snow caps */}
          <path fill="#FFFFFF" d="M300,180 L360,170 L420,190 L360,210 Z" opacity="0.9" />
          <path fill="#FFFFFF" d="M1020,205 L1080,190 L1140,205 L1080,230 Z" opacity="0.9" />
        </svg>
      </div>
    </motion.div>
  );
}

// Simple Cloud Component
function Cloud() {
  return (
    <svg viewBox="0 0 100 60" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
      <path d="M25,30 Q30,10 50,10 Q70,10 75,30 Q95,30 95,50 Q95,70 75,70 L25,70 Q5,70 5,50 Q5,30 25,30 Z" />
    </svg>
  );
}