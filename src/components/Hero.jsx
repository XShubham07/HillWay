// src/components/Hero.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  // ⚙️ SCROLL PHYSICS
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax & Zoom Logic
  // Background zooms IN slightly (creates depth)
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.4]);
  // Text zooms OUT (recedes away) and fades
  const textScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.8]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // 🎨 CUTOUT STYLE
  const mountainCutout = {
    backgroundImage: `url('/mountain.webp')`,
    backgroundSize: "cover",
    backgroundPosition: "center 50%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    // Increased contrast for better visibility on mobile
    filter: "brightness(1.4) contrast(1.2)",
  };

  // 🎬 PREMIUM ANIMATION VARIANTS
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: "100%", opacity: 0, rotateX: 45 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        bounce: 0,
        duration: 1.8, // Slow, elegant ease
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0f172a]"
    >
      {/* 1. BACKGROUND LAYER */}
      <motion.div
        style={{ scale: bgScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/mountain.webp')",
            filter: "brightness(0.5) blur(0px)", // Darker for text pop
          }}
        />
        {/* Vignette for focus */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80" />
      </motion.div>

      {/* 2. TEXT CONTENT WRAPPER */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full px-4"
        style={{
          scale: textScale,
          opacity: textOpacity,
          y: textY,
          willChange: "transform, opacity"
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* --- TOP LINE: "Your way to the" --- */}
        {/* Using a Mask-div to hide the text before it slides up */}
        <div className="overflow-hidden mb-2 md:mb-4">
          <motion.h3
            variants={itemVariants}
            className="font-serif italic text-white/90 text-xl md:text-3xl lg:text-4xl tracking-widest font-light text-center"
          >
            Your way to the
          </motion.h3>
        </div>

        {/* --- CENTER: "MOUNTAINS" --- */}
        <div className="relative flex flex-wrap justify-center gap-x-[2px] md:gap-x-2 leading-none py-2 overflow-visible">
          {"MOUNTAINS".split("").map((letter, i) => (
            <motion.span
              key={i}
              variants={itemVariants}
              style={mountainCutout}
              // Responsive text size: 13vw on mobile ensures it fits, huge rem on desktop
              className="text-[13vw] md:text-8xl lg:text-[11rem] xl:text-[13rem] font-black tracking-tighter inline-block transform will-change-transform"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* --- BOTTOM: DECORATIVE LINE & CTA --- */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center mt-6 md:mt-12"
        >
          {/* Vertical Line */}
          <div className="h-12 w-[1px] bg-gradient-to-b from-white to-transparent mb-6 opacity-50" />

          <button
            onClick={() => navigate("/tours")}
            className="group relative px-8 py-3 bg-transparent border border-white/30 rounded-full text-white overflow-hidden transition-all duration-300 hover:border-white hover:bg-white/5"
          >
            <span className="relative z-10 text-sm md:text-base font-bold tracking-widest uppercase">
              Begin Expedition
            </span>
            {/* Hover Glare Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shine_1s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </button>
        </motion.div>

      </motion.div>
    </section>
  );
}