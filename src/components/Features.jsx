// src/components/Features.jsx
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Lenis from "@studio-freight/lenis";
import {
  FaWallet,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaHeadset
} from "react-icons/fa";

// Initialize Lenis once at app start for smooth scrolling
if (typeof window !== "undefined") {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

const features = [
  {
    icon: <FaWallet size={28} />,
    title: "Best Price",
    desc: "Competitive rates without compromising quality."
  },
  {
    icon: <FaMapMarkedAlt size={28} />,
    title: "Diverse Locations",
    desc: "From hidden trails to bustling cities."
  },
  {
    icon: <FaTicketAlt size={28} />,
    title: "Easy Booking",
    desc: "Seamless process, confirmed in clicks."
  },
  {
    icon: <FaHeadset size={28} />,
    title: "24/7 Support",
    desc: "Round the clock assistance for you."
  }
];

const FeatureCard = ({ f, index }) => {
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 1024);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isCenter = useInView(cardRef, {
    margin: "-40% 0px -40% 0px",
    amount: 0.5
  });

  return (
    <motion.div
      ref={cardRef}
      className="relative z-10 h-full"
      initial={{
        opacity: 0,
        y: isMobile ? 60 : 0,
        x: isMobile ? 0 : -80,
        scale: 0.9
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0
      }}
      viewport={{ once: true, amount: 0.3 }}
      animate={
        isMobile && isCenter
          ? { scale: 1.1 }
          : { scale: 1 }
      }
      transition={{
        scale: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          mass: 0.8
        },
        default: {
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
          delay: isMobile ? 0 : index * 0.12
        }
      }}
    >
      <motion.div
        className="
          glass-card h-full p-8 
          flex flex-col items-center text-center 
          group relative 
          rounded-3xl border border-white/30
          transition-colors duration-300
        "
        whileHover={!isMobile ? { y: -10 } : {}}
      >
        {/* ICON with background zoom effect on mobile */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          whileHover={!isMobile ? { rotate: 360 } : {}}
          animate={
            isMobile && isCenter
              ? { scale: 1.2 }  // Zoom in background on mobile when card scales
              : { scale: 1 }
          }

          className="
            w-20 h-20 mb-6 rounded-2xl 
            bg-gradient-to-br from-amber-100 via-amber-300 to-orange-300
            text-emerald-800
            flex items-center justify-center
            shadow-lg shadow-amber-500/20
            relative z-20
            cursor-pointer
          "
        >
          {f.icon}
        </motion.div>

        <h3 className="font-bold text-xl text-gray-900 mb-3 tracking-wide">
          {f.title}
        </h3>
        <p className="text-sm text-gray-800 font-medium leading-relaxed">
          {f.desc}
        </p>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500 group-hover:w-1/3 opacity-0 group-hover:opacity-100" />
      </motion.div>
    </motion.div>
  );
};

export default function Features() {
  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER with loading animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-amber-500 tracking-tight drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              type: "spring",
              stiffness: 80,
              damping: 15,
              delay: 0.2
            }}
          >
            Why Choose HillWay?
          </motion.h2>
          <p className="text-gray-700 mt-4 text-lg font-medium">
            Experience the difference with our premium services
          </p>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}