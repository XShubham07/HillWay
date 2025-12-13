import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  const navigate = useNavigate();
  const ref = useRef(null);

  // Scroll parallax for subtle movement
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/mountain.webp')",
            filter: "brightness(0.5) contrast(1.1)",
          }}
        />
        {/* Dark gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </motion.div>

      {/* Content Container */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl space-y-8"
        >
          {/* Brand Name with Letter-by-Letter Animation */}
          <motion.div variants={itemVariants} className="overflow-hidden">
            <div className="flex gap-1">
              {["H", "i", "l", "l", "W", "a", "y"].map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="text-5xl md:text-7xl lg:text-8xl font-black text-white inline-block"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Tagline with Elegant Reveal */}
          <motion.div variants={itemVariants} className="relative">
            <motion.h2
              className="text-2xl md:text-4xl lg:text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#D9A441] leading-tight"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Your Way to the Mountains
            </motion.h2>
            {/* Subtle underline accent */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              className="h-[2px] bg-gradient-to-r from-[#D9A441] to-transparent mt-4"
            />
          </motion.div>

          {/* Description Paragraph */}
          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-base md:text-lg lg:text-xl leading-relaxed max-w-xl font-light"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Discover the pristine beauty of the Himalayas with curated travel
            experiences. From serene valleys to majestic peaks, embark on a
            journey that awakens your spirit of adventure.
          </motion.p>

          {/* CTA Button with Hover Effect */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => navigate("/tours")}
              className="group relative px-8 py-4 bg-white text-black font-semibold text-lg rounded-full overflow-hidden transition-all duration-300 hover:pr-12"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Explore Destinations
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaArrowRight />
                </motion.span>
              </span>
              {/* Hover background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#D9A441] to-[#FFD700]"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>

          {/* Optional: Subtle scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="pt-8"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-gray-500 text-sm flex items-center gap-2"
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
              <span className="uppercase tracking-widest font-light">Scroll to explore</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
