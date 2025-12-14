import { motion } from "framer-motion";
import { FaArrowDown, FaPlay, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  
  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      
      {/* Background - No Parallax */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#022c22] z-10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-10 pointer-events-none" />
        <img
          src="/mountain.webp"
          alt="Majestic Mountains"
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-[0.2em] text-emerald-200 uppercase">
            Premium Expeditions
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-8"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
            Your Way
          </span>
          <span className="block text-4xl md:text-6xl lg:text-8xl font-serif italic text-[#D9A441] mt-2 md:mt-4 font-light">
            to Mountains
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-300 text-sm md:text-lg max-w-xl mx-auto leading-relaxed mb-12 font-medium"
        >
          Curated journeys to the untouched peaks of the Himalayas. 
          Experience the serenity of nature with unmatched luxury.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => navigate("/tours")}
            className="group relative px-8 py-4 bg-[#D9A441] text-black font-black text-sm uppercase tracking-widest rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(217,164,65,0.3)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Tours <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <button 
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm uppercase tracking-widest rounded-full hover:bg-white/20 transition-all flex items-center gap-3"
          >
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black">
              <FaPlay className="text-[8px] ml-0.5" />
            </span>
            Watch Film
          </button>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Scroll</span>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#022c22] to-transparent z-10" />
    </div>
  );
}