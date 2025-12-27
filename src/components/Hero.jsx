import { motion } from "framer-motion";
import { FaArrowDown, FaPlay, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import Snowfall from 'react-snowfall';

export default function Hero() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);

  // MOBILE-OPTIMIZED SNOWFALL CONFIG
  const snowfallConfig = useMemo(() => ({
    // Increased count as requested (was 40 -> 80)
    snowflakeCount: isMobile ? 80 : 150, 
    // Thicker size on mobile (was [0.5, 1.5] -> [2.0, 4.0])
    radius: isMobile ? [2.0, 4.0] : [0.5, 3.0],
    // Speed optimized for "floaty" feel with larger flakes
    speed: isMobile ? [0.5, 2.5] : [0.5, 3.0], 
    wind: isMobile ? [-0.5, 1.0] : [-0.5, 2.0],
    style: { opacity: isMobile ? 0.7 : 0.8 } // Slightly higher opacity for visibility
  }), [isMobile]);

  // ANIMATION CONFIG
  const animationConfig = useMemo(() => ({
    badge: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut" }
    },
    title: {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
    content: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2, duration: 0.6 }
    }
  }), []);

  return (
    <div 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#022c22]"
      // PERFORMANCE FIX: 
      // 'translate3d' forces the entire Hero section into a GPU layer.
      // This prevents the browser from "unloading" the background paint when you scroll down,
      // fixing the white flicker when you scroll back up.
      style={{ 
        transform: 'translate3d(0,0,0)', 
        backfaceVisibility: 'hidden' 
      }}
    >

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#022c22] z-10" />
        
        {/* Noise - Desktop Only */}
        <div className="hidden md:block absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-10 pointer-events-none" />
        
        {/* Placeholder Color */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#0f1f1a]" />
        )}
        
        {/* Main Image */}
        <img
          src="/mountain.webp"
          alt="Majestic Mountains"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
          fetchpriority="high"
          onLoad={() => setImageLoaded(true)}
          style={{ 
            // Ensure image stays on GPU
            transform: 'translateZ(0)',
            willChange: 'opacity'
          }}
        />
      </div>

      {/* Snowfall Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Snowfall
          color="#ffffff"
          snowflakeCount={snowfallConfig.snowflakeCount}
          radius={snowfallConfig.radius}
          speed={snowfallConfig.speed}
          wind={snowfallConfig.wind}
          style={snowfallConfig.style}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Floating Badge */}
        <motion.div
          {...animationConfig.badge}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 md:mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-[0.2em] text-emerald-200 uppercase">
            Premium Expeditions
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          {...animationConfig.title}
          className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.95] tracking-tighter mb-6 md:mb-8"
          style={{ willChange: 'transform, opacity' }}
        >
          <span className="block text-white uppercase">
            Your Way
          </span>
          <span className="block text-4xl md:text-6xl lg:text-8xl font-serif italic text-[#D9A441] mt-2 md:mt-4 font-light">
            to the Mountains
          </span>
        </motion.h1>

        {/* Description & Buttons Group */}
        <motion.div {...animationConfig.content}>
          <p className="text-gray-300 text-sm md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-medium">
            Curated journeys to the untouched peaks of the Himalayas.
            Experience the serenity of nature with unmatched luxury.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/tours")}
              className="group relative px-8 py-4 bg-[#D9A441] text-black font-black text-sm uppercase tracking-widest rounded-full overflow-hidden transition-transform active:scale-95 shadow-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Tours 
                <FaArrowRight className="text-xs" />
              </span>
            </button>

            <button
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-full flex items-center gap-3 active:scale-95"
            >
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black">
                <FaPlay className="text-[8px] ml-0.5" />
              </span>
              Watch Film
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Scroll</span>
      </motion.div>

      {/* Decorative Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#022c22] to-transparent z-10" />
    </div>
  );
}