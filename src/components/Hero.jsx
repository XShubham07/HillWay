import { motion, useScroll, useTransform } from "framer-motion";
import SearchBar from "./SearchBar";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";

export default function Hero() {
  const { scrollY } = useScroll();
  // Background moves slower than text creates 3D effect
  const yBg = useTransform(scrollY, [0, 500], [0, 250]);
  const yText = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      
      {/* Parallax Background */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/mountain.jpeg')" }}
        />
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[var(--dark)]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10">
        <motion.div
          style={{ y: yText }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl">
            Experience the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
              Untouched Hills
            </span>
          </h1>

          <p className="mt-6 text-xl text-gray-200 font-light max-w-2xl drop-shadow-md">
            Premium tours, hidden trails, and luxury stays. 
            Discover Sikkim like never before with HillWay.
          </p>
        </motion.div>

        {/* Search Bar with Glass Effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-10"
        >
          
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <HiOutlineArrowNarrowDown className="text-2xl" />
      </motion.div>
    </section>
  );
}