import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  const navigate = useNavigate();
  const ref = useRef(null);

  // Parallax hooks
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center">

      {/* 1. PARALLAX BACKGROUND LAYER */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/mountain.webp')" }}
        />

        {/* --- INTENSIFIED FADE OUT LAYERS --- */}

        {/* Layer 1: Deep solid base on the left (hides image completely behind text) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#022c22] via-[#022c22] to-transparent opacity-95 via-40%" />

        {/* Layer 2: Extended gradient for smoothness */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#022c22] via-[#022c22]/80 to-transparent" />

        {/* --- SUNRISE GOLD FADEOUT EFFECT --- */}
        {/* Increased width and opacity for a dramatic left-side glow */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[85%] bg-gradient-to-r from-yellow-600/50 via-yellow-500/20 to-transparent mix-blend-overlay blur-3xl" />

        {/* Bottom gradient to blend seamlessly into Home.jsx */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent opacity-90" />
      </motion.div>

      {/* 2. DECORATIVE GLOWS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-[-15%] w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[150px] animate-pulse" />
      </div>

      {/* 3. MAIN HERO CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">

        <motion.div
          style={{ y: textY, opacity: opacityText }}
          className="max-w-3xl space-y-10"
        >
          <div className="space-y-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-2"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-100 text-sm font-medium tracking-wide uppercase">
                Premium Himalayan Travel
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl md:text-9xl font-black text-white leading-none tracking-tight"
            >
              Hill<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">Way</span>
            </motion.h1>

            {/* --- MOVING ROUNDED OUTLINE TAGLINE --- */}
            {/* Using SVG for perfect rounded corner animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative inline-block mt-4 rounded-2xl group"
            >
              {/* SVG Overlay for Moving Border */}
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <svg className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0" />
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* The animated rectangle */}
                  <motion.rect
                    x="2" y="2"
                    width="calc(100% - 4px)"
                    height="calc(100% - 4px)"
                    rx="14" // Matches CSS rounded-2xl (approx 16px)
                    fill="none"
                    stroke="url(#gold-gradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, pathOffset: 0 }}
                    animate={{
                      pathLength: [0.3, 0.3], // Length of the "beam"
                      pathOffset: [0, 1]      // Moves the beam around
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </svg>
              </div>

              {/* Tagline Text */}
              <div className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5">
                <h2 className="relative z-10 text-2xl md:text-4xl font-light text-[#fbbf24] tracking-widest uppercase text-center" style={{ textShadow: "0 0 25px rgba(251, 191, 36, 0.5)" }}>
                  Your Way to the Mountains
                </h2>
              </div>
            </motion.div>

            {/* Description Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-200 font-light max-w-lg leading-relaxed pt-6"
            >
              Discover the pristine beauty of the Himalayas with curated travel
              experiences. From serene valleys to majestic peaks, embark on a
              journey that awakens your spirit.
            </motion.p>
          </div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => navigate("/tours")}
              className="group relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/40 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Adventure <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </button>

            <button
              onClick={() => navigate("/destinations")}
              className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:border-yellow-500/30 transition-all duration-300"
            >
              View Destinations
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 4. SCROLL INDICATOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-xs text-gray-400 uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 bg-yellow-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}