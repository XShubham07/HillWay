// src/components/Features.jsx
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  FaWallet,
  FaMapMarkedAlt,
  FaTicketAlt,
  FaHeadset,
  FaUsers,
  FaGlobeAsia,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";

/* ---------------------------
   Media query helper
---------------------------- */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    onChange(mq);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [query]);

  return matches;
}

/* ---------------------------
   Counter
---------------------------- */
const AnimatedCounter = ({ end, duration = 2, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let raf;

    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const p = (ts - startTime) / (duration * 1000);

      if (p < 1) {
        setCount(Math.floor(end * p));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration]);

  return (
    <span ref={countRef}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ---------------------------
   Data
---------------------------- */
const stats = [
  { icon: <FaUsers size={24} />, value: 15000, suffix: "+", label: "Happy Travelers", gradient: "from-emerald-400 to-teal-500" },
  { icon: <FaGlobeAsia size={24} />, value: 50, suffix: "+", label: "Destinations", gradient: "from-amber-400 to-orange-500" },
  { icon: <FaStar size={24} />, value: 4.9, suffix: "", label: "Average Rating", gradient: "from-yellow-400 to-yellow-600", decimals: true },
];

const features = [
  { icon: <FaWallet size={32} />, title: "Best Price Guarantee", desc: "Transparent pricing with no hidden costs. Get the best deals on every booking.", gradient: "from-emerald-400 to-teal-600" },
  { icon: <FaMapMarkedAlt size={32} />, title: "Curated Destinations", desc: "Handpicked locations from pristine valleys to vibrant cultural hubs.", gradient: "from-blue-400 to-cyan-600" },
  { icon: <FaTicketAlt size={32} />, title: "Instant Booking", desc: "Book your dream adventure in seconds with our seamless platform.", gradient: "from-purple-400 to-pink-600" },
  { icon: <FaHeadset size={32} />, title: "24/7 Support", desc: "Expert travel consultants ready to assist you anytime, anywhere.", gradient: "from-orange-400 to-red-600" },
];

/* ---------------------------
   Premium bottom-up reveal (perf oriented)
---------------------------- */
const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.06,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/* ---------------------------
   Stat card
---------------------------- */
const SimpleStat = ({ stat, index }) => {
  const statRef = useRef(null);
  const isInView = useInView(statRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={statRef}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group"
    >
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 flex items-center justify-center text-white flex-shrink-0`}>
        {stat.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className={`text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}>
          {isInView ? (
            stat.decimals ? (
              <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2} />
            ) : (
              <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2.5} />
            )
          ) : (
            `0${stat.suffix}`
          )}
        </div>
        <p className="text-white text-xs md:text-sm lg:text-base font-medium mt-1 truncate">{stat.label}</p>
      </div>
    </motion.div>
  );
};

/* ---------------------------
   Card shell (clipped line)
---------------------------- */
function FeatureCardShell({ feature, bottomLineNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10">
      <div className="flex gap-4 md:gap-6 p-5 md:p-8">
        <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg relative`}>
          <div className="scale-75 md:scale-90">{feature.icon}</div>
          <div className={`absolute inset-0 rounded-xl md:rounded-2xl blur-lg opacity-20 bg-gradient-to-br ${feature.gradient}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-3 md:mb-4">{feature.desc}</p>

          <div className="hidden md:flex items-center gap-2 text-xs md:text-sm font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Learn More</span>
            <FaArrowRight className="text-xs" />
          </div>
        </div>
      </div>

      {bottomLineNode}
    </div>
  );
}

/* ---------------------------
   Desktop: hover line + scale
---------------------------- */
const DesktopHoverCard = ({ feature, index }) => {
  return (
    <motion.div
      custom={index}
      variants={cardReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-110px" }}
      whileHover={{ scale: 1.03 }}
      className="group relative w-full"
      style={{ willChange: "transform" }}
    >
      <FeatureCardShell
        feature={feature}
        bottomLineNode={
          <div
            className={[
              "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
              feature.gradient,
              "scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left",
              "rounded-b-2xl md:rounded-b-3xl",
            ].join(" ")}
          />
        }
      />
    </motion.div>
  );
};

/* ---------------------------
   Mobile: one-by-one focus on scroll (vertical list)
   Key idea:
   - narrow “active zone” around center so only one card pops at a time. [web:2][web:48]
---------------------------- */
const MobileScrollFocusCard = ({ feature, index }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    // narrow band to force one-by-one feel
    // 0: just entering, 0.5: near center focus, 1: leaving
    offset: ["start 85%", "center 55%", "end 30%"],
  });

  // Bigger pop (more noticeable)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1.08, 0.93]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 1, 0.55]);

  // Line reveal synced with focus (only in focus window)
  const lineScale = useTransform(scrollYProgress, [0.28, 0.5, 0.72], [0, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className="group w-full"
      style={{ scale, opacity, willChange: "transform" }}
    >
      <FeatureCardShell
        feature={feature}
        bottomLineNode={
          <motion.div
            style={{ scaleX: lineScale, transformOrigin: "left" }}
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl`}
          />
        }
      />
    </motion.div>
  );
};

/* ---------------------------
   Main component
---------------------------- */
export default function Features() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section className="relative py-12 md:py-20 lg:py-24 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Heading (already good in your design) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-110px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center md:text-left mb-8 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Premium Experience
            </span>
          </div>

          <h2 className="font-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-none">
            <span className="text-white">Why Travel</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent">
              With Us?
            </span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed">
            Join thousands who've discovered the perfect blend of luxury, adventure, and authenticity.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
          {stats.map((stat, index) => (
            <SimpleStat key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Features */}
        {isDesktop ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8">
            {features.map((feature, index) => (
              <DesktopHoverCard key={index} feature={feature} index={index} />
            ))}
          </div>
        ) : (
          // More spacing helps “one-by-one” focus (prevents two cards being near center)
          <div className="grid grid-cols-1 gap-7">
            {features.map((feature, index) => (
              <MobileScrollFocusCard key={index} feature={feature} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-110px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 md:mt-14 text-center"
        >
          <button className="px-8 py-3 md:px-10 md:py-5 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white font-bold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-500 inline-flex items-center gap-2 hover:scale-105">
            Start Your Journey
            <FaArrowRight className="text-xs" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
