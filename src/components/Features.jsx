import { useEffect, useRef, useState, memo } from "react";
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
   Media query helper - OPTIMIZED
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
   Counter - OPTIMIZED
---------------------------- */
const AnimatedCounter = memo(({ end, duration = 2, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let raf;

    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / (duration * 1000), 1);

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
});
AnimatedCounter.displayName = "AnimatedCounter";

/* ---------------------------
   Data
---------------------------- */
const stats = [
  { icon: <FaUsers size={24} />, value: 100, suffix: "+", label: "Happy Travelers and Counting", gradient: "from-emerald-400 to-teal-500" },
  { icon: <FaGlobeAsia size={24} />, value: 10, suffix: "+", label: "Destinations", gradient: "from-amber-400 to-orange-500" },
  { icon: <FaStar size={24} />, value: 4.7, suffix: "", label: "Average Rating", gradient: "from-yellow-400 to-yellow-600", decimals: true },
];

const features = [
  { icon: <FaWallet size={32} />, title: "Best Price Guarantee", desc: "Transparent pricing with no hidden costs. Get the best deals on every booking.", gradient: "from-emerald-400 to-teal-600" },
  { icon: <FaMapMarkedAlt size={32} />, title: "Curated Destinations", desc: "Handpicked locations from pristine valleys to vibrant cultural hubs.", gradient: "from-blue-400 to-cyan-600" },
  { icon: <FaTicketAlt size={32} />, title: "Instant Booking", desc: "Book your dream adventure in seconds with our seamless platform.", gradient: "from-purple-400 to-pink-600" },
  { icon: <FaHeadset size={32} />, title: "24/7 Support", desc: "Expert travel consultants ready to assist you anytime, anywhere.", gradient: "from-orange-400 to-red-600" },
];

/* ---------------------------
   Premium bottom-up reveal
---------------------------- */
const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.05,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/* ---------------------------
   Stat card - MEMOIZED
---------------------------- */
const SimpleStat = memo(({ stat, index }) => {
  const statRef = useRef(null);
  const isInView = useInView(statRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={statRef}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group transform-gpu will-change-transform"
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
});
SimpleStat.displayName = "SimpleStat";

/* ---------------------------
   Card shell - MEMOIZED
---------------------------- */
const FeatureCardShell = memo(({ feature, bottomLineNode }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 group transform-gpu will-change-transform">
      <div className="flex gap-4 md:gap-6 p-5 md:p-8">
        <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg relative`}>
          <div className="scale-75 md:scale-90">{feature.icon}</div>
          <div className={`absolute inset-0 rounded-xl md:rounded-2xl blur-md opacity-20 bg-gradient-to-br ${feature.gradient}`} />
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
});
FeatureCardShell.displayName = "FeatureCardShell";

/* ---------------------------
   Desktop: hover line + scale - MEMOIZED
---------------------------- */
const DesktopHoverCard = memo(({ feature, index }) => {
  return (
    <motion.div
      custom={index}
      variants={cardReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ scale: 1.03 }}
      className="group relative w-full transform-gpu will-change-transform"
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
});
DesktopHoverCard.displayName = "DesktopHoverCard";

/* ---------------------------
   Mobile: ULTRA OPTIMIZED SMOOTH CAROUSEL - FIXED
---------------------------- */
const MobileScrollFocusCard = memo(({ feature, index }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Optimized intersection observer with proper cleanup
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { 
        threshold: [0, 0.1, 0.5],
        rootMargin: "50px 0px 50px 0px"
      }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // CRITICAL: Use smooth flag to prevent janky animations
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"],
  });

  // FIXED: Don't wrap useTransform in useMemo - it's already optimized
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.95, 1.00, 1.04, 1.00, 0.95]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.75, 0.9, 1, 0.9, 0.75]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [6, 0, 6]
  );

  const lineScale = useTransform(
    scrollYProgress,
    [0.35, 0.5, 0.65],
    [0, 1, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{
        scale: isInView ? scale : 0.95,
        opacity: isInView ? opacity : 0.75,
        y: isInView ? y : 6,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full transform-gpu will-change-transform"
    >
      <FeatureCardShell
        feature={feature}
        bottomLineNode={
          <motion.div
            style={{
              scaleX: isInView ? lineScale : 0,
            }}
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-2xl origin-left transform-gpu will-change-transform`}
          />
        }
      />
    </motion.div>
  );
});
MobileScrollFocusCard.displayName = "MobileScrollFocusCard";

/* ---------------------------
   Main component
---------------------------- */
export default function Features() {
  // Breakpoint at 1024px for desktop
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <section className="relative py-12 md:py-20 lg:py-24 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 md:mb-14 text-left"
        >
          <span className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase mb-2 block pl-1 border-l-2 border-yellow-500">
            Premium Experience
          </span>

          <h2 className="font-black text-4xl md:text-7xl text-white tracking-tighter uppercase leading-[0.9] mb-6">
            Why Travel <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">
              With Us?
            </span>
          </h2>

          <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-yellow-500 mt-6 mb-8 rounded-full" />

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
          <div className="flex flex-col gap-8 pb-10">
            {features.map((feature, index) => (
              <MobileScrollFocusCard key={index} feature={feature} index={index} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-8 md:mt-14 text-center"
        >
          <button className="px-8 py-3 md:px-10 md:py-5 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white font-bold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-500 inline-flex items-center gap-2 hover:scale-105 transform-gpu will-change-transform">
            Start Your Journey
            <FaArrowRight className="text-xs" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}