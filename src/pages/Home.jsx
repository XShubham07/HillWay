// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import Features from "../components/Features";
import ReviewsCarousel from "../components/ReviewsCarousel";
import { FaArrowRight, FaStar, FaCompass } from "react-icons/fa";
import { DESTINATION_DATA } from "../data/destinationsData";

// --- 1. DATA PREP ---
const SELECTED_INDICES = [0, 1, 9]; 

const HIGHLIGHT_DESTINATIONS = SELECTED_INDICES.map(index => {
  const dest = DESTINATION_DATA[index];
  return {
    id: dest.id,
    name: dest.name,
    tag: dest.tagline,
    desc: dest.overview.slice(0, 80) + "...",
    img: dest.img,
    rating: 4.9,
  };
});

const LOOPING_NAMES = ["Gangtok", "Zuluk", "Ravangla", "Lachung", "Pelling"];

// --- 2. MICRO-COMPONENTS ---

const LoopingHeroTitle = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOOPING_NAMES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const longestName = LOOPING_NAMES.reduce((a, b) => (a.length > b.length ? a : b));

  return (
    <div className="mb-10 px-4 md:px-0">
      <div className="flex flex-col items-start">
        <span className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase mb-2 pl-1 border-l-2 border-yellow-500">
          Discover The Unseen
        </span>
        
        <h2 className="font-black text-5xl md:text-8xl text-white tracking-tighter leading-[0.9] uppercase">
          Explore <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500">
             <span className="opacity-0 font-black tracking-tighter">
                {longestName}
             </span> 
             
             <AnimatePresence mode="wait">
              <motion.span
                key={LOOPING_NAMES[index]}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }} 
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent font-black tracking-tighter" 
              >
                {LOOPING_NAMES[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h2>
        
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-yellow-500 mt-6 rounded-full" />
      </div>
    </div>
  );
};

const DestinationCard = ({ dest, index }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onClick={() => navigate("/destinations")}
      className="group relative flex-shrink-0 w-[85vw] md:w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden cursor-pointer snap-center border border-white/10 bg-gray-900/50"
      // Optimization: Hint browser about changes
      style={{ willChange: "transform, opacity" }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8 }}
          src={dest.img}
          alt={dest.name}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent opacity-90" />

      <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
        <FaCompass className="text-yellow-400 text-xs animate-pulse" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{dest.tag}</span>
      </div>

      <div className="absolute bottom-0 w-full p-6 md:p-8">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-none tracking-tight mb-2">
            {dest.name}
          </h3>
          <p className="text-gray-300 text-sm line-clamp-2 max-w-sm mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            {dest.desc}
          </p>
          
          <div className="inline-flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-widest border-b border-yellow-400/30 pb-1 group-hover:border-yellow-400 transition-colors">
            View Details
            <FaArrowRight className="text-[10px]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 3. MAIN COMPONENT ---
export default function Home() {
  const navigate = useNavigate();
  const [featuredTours, setFeaturedTours] = useState([]);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    fetch("https://admin.hillway.in/api/tours")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const featured = data.data.filter((t) => t.featured).slice(0, 3);
          setFeaturedTours(featured);
        }
      });
  }, []);

  return (
    <>
      {/* GLOBAL PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-emerald-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* FIXED AMBIENT BACKGROUND - OPTIMIZED */}
      <div className="fixed inset-0 z-[-1] bg-[#022c22] pointer-events-none">
        {/* Removed animate-pulse and mix-blend-overlay on large elements to fix lag */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
        
        {/* Static blurred orbs are much faster than animated ones */}
        <div 
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]"
          style={{ willChange: "transform" }}
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[80px]"
          style={{ willChange: "transform" }}
        />
      </div>

      <div className="min-h-screen">
        <Hero />

        {/* --- SECTION 1: DESTINATIONS --- */}
        <section className="relative py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            
            <LoopingHeroTitle />

            <div className="
              flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 
              md:grid md:grid-cols-3 md:gap-6 md:px-6 md:pb-0 
              scrollbar-hide
            ">
              {HIGHLIGHT_DESTINATIONS.map((dest, i) => (
                <DestinationCard key={dest.id} dest={dest} index={i} />
              ))}
            </div>

            <div className="mt-8 px-4 md:px-6 flex justify-end">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/destinations")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-xs md:text-sm rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-500 inline-flex items-center gap-2 uppercase tracking-wide"
              >
                View Full Map
                <FaArrowRight className="text-xs" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: FEATURES --- */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05382c]/50 to-transparent pointer-events-none" />
          <Features />
        </div>

        {/* --- SECTION 3: CURATED PACKAGES --- */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6"
            >
              <div>
                <span className="text-yellow-400 font-bold tracking-[0.2em] text-xs uppercase mb-2 block">
                  Trending Packages
                </span>
                <h2 className="font-black text-4xl md:text-7xl text-white tracking-tighter uppercase leading-[0.9]">
                  Curated<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400">Tours</span>
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-yellow-500 mt-6 rounded-full" />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/tours")}
                className="hidden md:flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-sm shadow-lg hover:shadow-emerald-500/30 transition-all duration-500 uppercase tracking-wide"
              >
                Explore All Packages
                <FaArrowRight className="text-sm" />
              </motion.button>
            </motion.div>

            {featuredTours.length > 0 ? (
               <PackageGrid list={featuredTours} onView={(p) => navigate(`/tours/${p._id}`)} />
            ) : (
              <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-3xl">
                 <p className="text-emerald-400/50 uppercase tracking-widest animate-pulse text-sm">Loading Collection...</p>
              </div>
            )}
            
            <div className="mt-8 md:hidden flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/tours")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-xs shadow-lg hover:shadow-emerald-500/30 transition-all duration-500 uppercase tracking-wide w-full inline-flex items-center justify-center gap-2"
              >
                View All Tours
                <FaArrowRight className="text-xs" />
              </motion.button>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: REVIEWS --- */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center mb-8"
            >
              <FaStar className="inline-block text-yellow-400 text-xl mb-3 animate-spin-slow" />
              <h2 className="text-3xl md:text-5xl font-black text-white mb-2 uppercase tracking-tight">Traveler Diaries</h2>
              <div className="h-1 w-12 bg-gradient-to-r from-emerald-400 to-yellow-400 mx-auto rounded-full" />
            </motion.div>
            
            <ReviewsCarousel />
          </div>
        </section>

        {/* --- SECTION 5: FINAL CTA --- */}
        <section className="py-16 px-4 relative">
          <div className="max-w-5xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-emerald-900 to-[#022c22] border border-white/10 p-8 md:p-16 text-center">
             <div className="absolute inset-0 bg-[url('/mountain.webp')] bg-cover bg-center opacity-20 mix-blend-overlay" />
             
             <div className="relative z-10 space-y-6">
               <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                 Ready to <br/> <span className="text-yellow-400">Ascend?</span>
               </h2>
               <p className="text-gray-300 max-w-lg mx-auto text-base md:text-lg">
                 Your customized itinerary is just one click away. Experience the mountains like never before.
               </p>
               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => navigate("/contact")}
                 className="px-8 py-4 bg-white text-emerald-950 font-black text-sm md:text-base rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow uppercase tracking-wide"
               >
                 Start Planning Now
               </motion.button>
             </div>
          </div>
        </section>

        <div className="h-10" />
      </div>
    </>
  );
}