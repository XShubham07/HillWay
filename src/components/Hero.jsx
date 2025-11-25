// src/components/Hero.jsx

import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Hero() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  
  // Detect mobile device
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // SMOOTH ZOOM UP EFFECT - Background starts zoomed in, zooms OUT as you scroll
  const scale = useTransform(
    scrollY, 
    [0, 800], 
    isMobile ? [1.2, 1] : [1.5, 1]
  );
  
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.8, 0]);
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* MOUNTAIN BACKGROUND - SMOOTH ZOOM UP EFFECT */}
      <motion.div
        style={{
          scale,
          willChange: 'transform',
        }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/mountain.webp')",
            filter: "brightness(0.7) contrast(1.15) saturate(1.2)",
            transformOrigin: 'center center',
          }}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

      {/* Animated Decorative Blobs - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
          <motion.div
            initial={{ x: -300, y: -100, opacity: 0, scale: 0.5 }}
            animate={{
              x: 0,
              y: 0,
              opacity: 0.4,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
              scale: {
                repeat: Infinity,
                duration: 5,
                repeatType: "reverse"
              }
            }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/15 to-blue-600/10 rounded-full blur-3xl"
          />

          <motion.div
            initial={{ x: 300, y: 100, opacity: 0, scale: 0.5 }}
            animate={{
              x: 0,
              y: 0,
              opacity: 0.3,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1.5,
              delay: 0.5,
              scale: {
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }
            }}
            className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-gradient-to-tl from-blue-500/15 to-purple-600/10 rounded-full blur-3xl"
          />
        </div>
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(isMobile ? 3 : 8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080) 
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        style={{
          opacity,
          y,
        }}
      >
        {/* Main Title */}
        <motion.h1
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 50
          }}
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
        >
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]"
          >
            Your Way to The
          </motion.span>
          
          {/* MOUNTAINS TEXT WITH mountain.webp IMAGE CUTOUT EFFECT */}
          <motion.span 
            className="block relative"
            style={{
              background: 'url("/mountain.webp")',
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'brightness(1.5) contrast(1.3) saturate(1.4)',
              textShadow: 'none',
            }}
          >
            {'Mountains'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
            
            {/* White stroke outline for depth */}
            <span 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'url("/mountain.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextStroke: '3px rgba(255,255,255,0.4)',
                WebkitTextFillColor: 'transparent',
                filter: 'brightness(1.5) contrast(1.3)',
              }}
            >
              Mountains
            </span>
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 1.5,
            type: "spring",
            stiffness: 80
          }}
          className="mt-6 text-base md:text-xl text-white font-light max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          Premium tours, hidden trails, and luxury stays.
        </motion.p>

        {/* CTA Button */}
        <motion.div className="mt-8 md:mt-10">
          <motion.button
            onClick={() => navigate('/tours')}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 1.8,
              type: "spring",
              stiffness: 80
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px rgba(6, 182, 212, 0.6)",
            }}
            whileTap={{ scale: 0.98 }}
            className="relative px-10 md:px-12 py-4 md:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-base md:text-lg rounded-xl font-bold shadow-2xl transition-all duration-300 min-h-[48px] overflow-hidden group"
          >
            <motion.span
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
              style={{ opacity: 0.2 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Explore Tours
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        style={{
          opacity: useTransform(scrollY, [0, 200], [1, 0])
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="flex flex-col items-center gap-2 text-white/80"
        >
          <span className="text-xs md:text-sm font-light tracking-wider">Scroll Down</span>
          <motion.div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div 
              className="w-1 h-2 bg-white/80 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
