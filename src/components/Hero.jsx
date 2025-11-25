// src/components/Hero.jsx

import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  
  // Heavy parallax + zoom effects
  const yBg = useTransform(scrollY, [0, 500], [0, 250]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.2]);
  const zoomText = useTransform(scrollY, [0, 300], [1, 0.8]); // Zoom out on scroll
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const rotate = useTransform(scrollY, [0, 500], [0, 5]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      
      {/* MOUNTAIN BACKGROUND with Heavy Parallax + Rotation */}
      <motion.div
        style={{ 
          y: yBg,
          scale: scale,
          rotate: rotate,
        }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/mountain.jpeg')",
            filter: "brightness(0.65) contrast(1.15) saturate(1.1)"
          }}
        />
      </motion.div>

      {/* Animated SVG Cutout Overlays */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        
        {/* Top Left Blob - Pulsing */}
        <motion.div
          initial={{ x: -300, y: -100, opacity: 0, scale: 0.5 }}
          animate={{ 
            x: 0, 
            y: 0, 
            opacity: 0.5,
            scale: 1,
          }}
          transition={{ 
            duration: 2, 
            ease: "easeOut",
            scale: {
              repeat: Infinity,
              duration: 4,
              repeatType: "reverse"
            }
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/70 to-blue-600/50 rounded-full blur-3xl"
        />
        
        {/* Bottom Right Blob - Morphing */}
        <motion.div
          initial={{ x: 300, y: 100, opacity: 0, scale: 0.5 }}
          animate={{ 
            x: 0, 
            y: 0, 
            opacity: 0.4,
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ 
            duration: 2, 
            delay: 0.4,
            scale: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut"
            },
            rotate: {
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }
          }}
          className="absolute -bottom-32 -right-32 w-[700px] h-[700px] bg-gradient-to-tl from-purple-500/60 to-pink-400/40 rounded-full blur-3xl"
        />

        {/* Center Accent Blob - Breathing */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 1.5,
            delay: 0.8,
            scale: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            },
            opacity: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-teal-400/30 to-cyan-500/20 rounded-full blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/70 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: 0,
              scale: 0
            }}
            animate={{
              y: [0, -50 - Math.random() * 30, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Shooting Stars */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              width: Math.random() * 100 + 50,
              top: `${Math.random() * 50}%`,
            }}
            initial={{ x: -200, opacity: 0 }}
            animate={{
              x: typeof window !== 'undefined' ? window.innerWidth + 200 : 2000,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 3 + 2,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Dynamic Gradient Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-1"
      />

      {/* CONTENT with Zoom Effect */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        style={{ 
          opacity,
          scale: zoomText, // Zoom in/out on scroll
        }}
      >
        
        {/* Main Title - SMALLER + LEFT ALIGNED */}
        <motion.h1
          initial={{ y: 100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.6, 0.05, 0.01, 0.9],
            type: "spring",
            stiffness: 60
          }}
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight"
        >
          {/* "Experience the" - LEFT ALIGNED */}
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="block text-left text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            Experience the
          </motion.span>
          
          {/* "Untouched Hills" - Mountain cutout with letter animation */}
          <span className="block mt-4 text-left">
            {'             Untouched Hills'.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5 + index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                style={{
                  backgroundImage: "url('/mountain.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: 'inline-block',
                  filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.9))",
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subtitle - LEFT ALIGNED */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-6 text-lg md:text-xl text-white font-light max-w-2xl drop-shadow-2xl text-left"
        >
          Premium tours, hidden trails, and luxury stays.
        </motion.p>

        {/* CTA Button - Redirects to /tours */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 2.2,
            type: "spring",
            stiffness: 100
          }}
          className="mt-10"
        >
          <motion.button
            onClick={() => navigate('/tours')}
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0 0 40px rgba(6, 182, 212, 0.8)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-full shadow-2xl hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 relative overflow-hidden group"
          >
            <motion.span
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
              style={{ opacity: 0.2 }}
            />
            <span className="relative z-10">Explore Tours</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Animated Border Effect */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-1 z-20"
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
        />
      </motion.div>

      {/* Corner Accent Lines */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute top-20 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent z-20"
      />
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 100 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute top-20 left-0 w-0.5 bg-gradient-to-b from-cyan-400 to-transparent z-20"
      />
    </section>
  );
}
