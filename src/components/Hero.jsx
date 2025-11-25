// src/components/Hero.jsx

import { motion, useScroll, useTransform } from "framer-motion";
import SearchBar from "./SearchBar";
import { HiOutlineArrowDown } from "react-icons/h3";

export default function Hero() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 250]);
  const yText = useTransform(scrollY, [0, 300], [0, 100]);

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      
      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-10">
        <motion.div
          style={{ y: yText }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-md">
            Experience the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
              Untouched Hills
            </span>
          </h1>

          <p className="mt-6 text-xl text-gray-200 font-light max-w-2xl drop-shadow-md">
            Premium tours, hidden trails, and luxury stays. Discover Sikkim like never before with HillWay.
          </p>

          <div className="mt-10">
            <SearchBar />
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70 cursor-pointer"
      >
        <span className="text-sm tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <HiOutlineArrowDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
