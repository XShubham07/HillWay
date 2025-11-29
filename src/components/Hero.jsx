// src/components/Hero.jsx
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scroll Physics
  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  // Effects
  const bgScale = useTransform(smoothScroll, [0, 1000], [1.4, 1]);
  const contentScale = useTransform(smoothScroll, [0, 500], [1, 1.5]);
  const contentOpacity = useTransform(smoothScroll, [0, 300], [1, 0]);
  const contentY = useTransform(smoothScroll, [0, 500], [0, 100]);

  // PREMIUM CUTOUT TEXT STYLE
  const mountainCutout = {
    backgroundImage: `
      url('/mountain.webp'),
      radial-gradient(circle at 50% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0))
    `,
    backgroundSize: "cover",
    backgroundPosition: "center 55%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    filter: "brightness(1.25) contrast(1.2)",
    animation: "shineMove 6s ease-in-out infinite",
    willChange: "background-position, filter",
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]">

      {/* Background */}
      <motion.div
        style={{ scale: bgScale, willChange: "transform" }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/mountain.webp')",
            filter: "brightness(0.85) contrast(1.1)",
            transform: "translateZ(0)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center flex flex-col items-center"
        style={{
          scale: contentScale,
          opacity: contentOpacity,
          y: contentY,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Tagline */}
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider drop-shadow-md mb-2">
          Your Way to
        </h2>

        {/* PREMIUM TYPOGRAPHY */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter flex flex-col items-center gap-0">

          {/* THE */}
          <motion.span
            style={mountainCutout}
            className="block relative"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            THE
          </motion.span>

          {/* MOUNTAINS */}
          <motion.span
            style={mountainCutout}
            className="block relative"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            MOUNTAINS
          </motion.span>
        </h1>

        {/* Description */}
        <p className="mt-8 text-lg md:text-xl text-white/90 font-medium max-w-xl mx-auto drop-shadow-lg">
          Experience the altitude. Premium tours and hidden trails awaiting your arrival.
        </p>

        {/* CTA */}
        <motion.div className="mt-10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button
            onClick={() => navigate("/tours")}
            className="px-10 py-4 bg-white text-black rounded-full font-extrabold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.5)]"
          >
            Start Journey
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-[26px] h-[42px] border-2 border-white/50 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
