// src/components/Features.jsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  FaWallet, 
  FaMapMarkedAlt, 
  FaTicketAlt, 
  FaHeadset 
} from "react-icons/fa"; 

// --- DATA ---
const features = [
  {
    icon: <FaWallet size={26} />,
    title: "Best Price",
    desc: "Competitive rates without compromising quality."
  },
  {
    icon: <FaMapMarkedAlt size={26} />,
    title: "Diverse Locations",
    desc: "From hidden trails to bustling cities."
  },
  {
    icon: <FaTicketAlt size={26} />,
    title: "Easy Booking",
    desc: "Seamless process, confirmed in clicks."
  },
  {
    icon: <FaHeadset size={26} />,
    title: "24/7 Support",
    desc: "Round the clock assistance for you."
  }
];

// --- SUB-COMPONENT ---
const FeatureCard = ({ f, index }) => {
  const ref = useRef(null);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth Scale Logic (Center Zoom)
  // Removed Opacity transform to prevent flicker
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);

  // Icon Animation Variants (Spin + Scale)
  const iconVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180, 
      opacity: 0 
    },
    visible: {
      scale: 1, 
      rotate: 0,   
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: 0.2 
      }
    }
  };

  return (
    // 1. Entrance Wrapper
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 60 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { type: "spring", stiffness: 60, damping: 20 }
        }
      }}
      className="relative z-10"
      // Force initial state to prevent flash
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-10%" }}
    >
      {/* 2. Scroll Zoom Wrapper (Uses CSS Class .glass-card) */}
      <motion.div
        style={{ scale }}
        className="glass-card p-8 flex flex-col items-center text-center group relative hover:bg-white/50 transition-colors duration-500"
      >
        {/* 3. Icon Wrapper */}
        <motion.div
          variants={iconVariants}
          // HOVER: Smooth Re-spin
          whileHover={{ 
            rotate: 360, 
            scale: 1.15,
            transition: { duration: 0.6, ease: "easeInOut" } 
          }}
          className="
            icon-wrapper
            w-20 h-20 mb-6 rounded-2xl 
            accent-gradient
            flex items-center justify-center text-white
            shadow-lg shadow-teal-500/20
            cursor-pointer
          "
        >
          {f.icon}
        </motion.div>

        <h3 className="font-bold text-xl text-gray-900 mb-3 tracking-wide pointer-events-none">
          {f.title}
        </h3>
        
        <p className="text-sm text-gray-700 font-medium leading-relaxed transition-colors pointer-events-none">
          {f.desc}
        </p>
        
        {/* Hover Bottom Bar */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 accent-gradient rounded-full transition-all duration-500 group-hover:w-1/3 opacity-0 group-hover:opacity-100" />
      </motion.div>
    </motion.div>
  );
};

export default function Features() {
  return (
    <section className="py-24 px-6 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto features-isolation">

        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight drop-shadow-sm">
            Why Choose HillWay?
          </h2>
          <p className="text-gray-600 mt-4 text-lg font-medium">
            Experience the difference with our premium services
          </p>
        </motion.div>

        {/* Grid Container */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.25 }
            }
          }}
        >
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} index={i} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}