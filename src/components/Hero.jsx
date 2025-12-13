import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaPlay, FaStar, FaCompass } from "react-icons/fa"; // Fixed Import

// --- INTERNAL COMPONENT: MAGNETIC BUTTON ---
const MagneticButton = ({ children, onClick, className }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 }); // Sensitivity
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.button
      ref={ref}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

export default function Hero() {
  const navigate = useNavigate();
  const ref = useRef(null);

  // --- SCROLL PARALLAX ---
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // --- MOUSE PARALLAX (Desktop Only) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const moveBgX = useTransform(smoothX, [-0.5, 0.5], ["1%", "-1%"]);
  const moveBgY = useTransform(smoothY, [-0.5, 0.5], ["1%", "-1%"]);

  const handleMouseMove = (e) => {
    // Only apply on desktop to save battery on mobile
    if (window.innerWidth > 768) {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) - 0.5);
      mouseY.set((clientY / innerHeight) - 0.5);
    }
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden bg-[#0f172a] flex items-center justify-center"
    >
      {/* 1. BACKGROUND IMAGE LAYER */}
      <motion.div
        style={{
          y: yBg,
          x: moveBgX,
          translateY: moveBgY,
          scale: 1.15, // Zoom in to prevent edges showing on move
        }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/mountain.webp')",
            // High contrast cinematic look
            filter: "brightness(0.7) contrast(1.1) saturate(1.1)"
          }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-black/40" />
      </motion.div>

      {/* 2. MAIN CONTENT LAYER */}
      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 px-6 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-end justify-between gap-12 pb-20 md:pb-0"
      >

        {/* Left Side: Text */}
        <div className="flex-1 text-center md:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-[#D9A441]"
          >
            <FaCompass className="animate-spin-slow" /> Discover Sikkim
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              CHASING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A441] to-yellow-200">
                HORIZONS
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-300 text-lg md:text-xl font-light max-w-md mx-auto md:mx-0 leading-relaxed"
          >
            Experience the Himalayas with premium comfort.
            Curated tours, verified stays, and unforgettable memories.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4"
          >
            <MagneticButton
              onClick={() => navigate("/tours")}
              className="group relative px-8 py-4 bg-[#D9A441] text-black font-bold rounded-full overflow-hidden shadow-lg shadow-[#D9A441]/20 flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Packages <FaArrowRight className="group-hover:-rotate-45 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </MagneticButton>

            <button
              onClick={() => navigate("/about")}
              className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center gap-2"
            >
              <FaPlay className="text-xs" /> Our Story
            </button>
          </motion.div>
        </div>

        {/* Right Side: Floating Glass Stats (Hidden on small mobile) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="hidden md:block w-72"
        >
          <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className="flex justify-between items-center mb-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1e293b] bg-gray-300 flex items-center justify-center text-black text-xs font-bold overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#1e293b] bg-[#D9A441] flex items-center justify-center text-black text-xs font-bold">
                  +2k
                </div>
              </div>
              <div className="text-right">
                <div className="flex text-[#D9A441] text-xs gap-0.5">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Top Rated</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm text-gray-300 border-b border-white/10 pb-2">
                <span>Avg. Temp</span>
                <span className="text-white font-mono">12°C</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300 border-b border-white/10 pb-2">
                <span>Elevation</span>
                <span className="text-white font-mono">5,410 ft</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>Next Trip</span>
                <span className="text-[#D9A441] font-bold">Tomorrow</span>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>

      {/* 3. DECORATIVE ELEMENTS */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent z-20 pointer-events-none" />

    </section>
  );
}