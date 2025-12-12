import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import Features from "../components/Features";
import { FaArrowRight } from "react-icons/fa";

// --- CONFIGURATION ---
// 1. All boxes have the SAME height (75% of viewport)
const BOX_HEIGHT_CLASS = "h-[75vh]";
// 2. Sticky Offsets to ensure previous card top is visible (10% gaps)
// Navbar is roughly 10-12%, so we start at 15%
const STICKY_TOPS = ["top-[15%]", "top-[25%]", "top-[35%]"];

const HIGHLIGHT_DESTINATIONS = [
  {
    id: 1,
    name: 'Gangtok',
    tag: 'Sikkim',
    desc: 'The vibrant capital with monasteries & views.',
    img: '/g1.webp',
    gradient: 'from-blue-500 to-cyan-400'
  },
  {
    id: 2,
    name: 'Lachung',
    tag: 'North Sikkim',
    desc: 'Home to the breathtaking Yumthang Valley.',
    img: '/g4.webp',
    gradient: 'from-purple-500 to-pink-400'
  },
  {
    id: 3,
    name: 'Darjeeling',
    tag: 'West Bengal',
    desc: 'The Queen of Hills & Heritage Toy Train.',
    img: '/g2.webp',
    gradient: 'from-amber-500 to-orange-400'
  }
];

// --- REUSABLE CARD COMPONENT ---
const StackingCard = ({ children, index, title, subtitle, colorStr = "blue" }) => {
  return (
    <div
      className={`sticky ${STICKY_TOPS[index]} w-full flex justify-center mb-20`}
      style={{ zIndex: index + 10 }}
    >
      <div
        className={`
          relative 
          w-[90%] md:w-[85%] max-w-7xl 
          ${BOX_HEIGHT_CLASS}
          bg-[#020617] 
          rounded-[3rem] 
          border border-white/10 
          shadow-[0_-10px_40px_rgba(0,0,0,0.6)]
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Top Gradient Line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${colorStr}-500 to-transparent opacity-80`} />

        {/* --- CARD HEADER --- */}
        <div className="shrink-0 pt-8 pb-4 px-6 text-center z-20 bg-[#020617] border-b border-white/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-3">
            <div className={`w-1.5 h-1.5 rounded-full bg-${colorStr}-400 animate-pulse`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest text-${colorStr}-400`}>
              {subtitle}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-2xl">
            {title}
          </h2>
        </div>

        {/* --- CONTENT AREA (Hidden Scrollbar) --- */}
        {/* [&::-webkit-scrollbar]:hidden removes scrollbar on Chrome/Safari/Edge */}
        {/* [-ms-overflow-style:'none'] removes it on IE/Edge */}
        {/* [scrollbar-width:'none'] removes it on Firefox */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] relative z-10 px-4 md:px-10 pb-8 pt-4">
          <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
            {children}
          </div>
        </div>

        {/* Ambient Glows */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[20%] bg-${colorStr}-600/10 rounded-full blur-[80px] pointer-events-none`} />
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const [featuredTours, setFeaturedTours] = useState([]);

  useEffect(() => {
    fetch('/api/tours')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const featured = data.data.filter(t => t.featured).slice(0, 3).map(tour => ({
            id: tour._id,
            title: tour.title,
            subtitle: tour.subtitle,
            basePrice: tour.basePrice,
            img: tour.img,
            images: tour.images || [],
            rating: tour.rating,
            nights: tour.nights
          }));
          setFeaturedTours(featured);
        }
      })
      .catch(err => console.error("Error fetching tours:", err));
  }, []);

  function onView(p) {
    navigate(`/tours/${p.id}`);
  }

  return (
    <div className="relative bg-black min-h-screen selection:bg-purple-500 selection:text-white pb-32">

      {/* 0. HERO */}
      <div className="relative z-0">
        <Hero />
      </div>

      {/* --- CARD 1: WHY CHOOSE US (Index 0) --- */}
      <StackingCard index={0} title="Why Choose Us?" subtitle="Premium Experience" colorStr="indigo">
        <Features />
      </StackingCard>

      {/* --- CARD 2: DESTINATIONS (Index 1) --- */}
      <StackingCard index={1} title="Iconic Locations" subtitle="Explore The Unseen" colorStr="purple">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {HIGHLIGHT_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => navigate('/destinations')}
              className="
                        group relative h-[280px] md:h-[350px] 
                        rounded-[2rem] overflow-hidden cursor-pointer 
                        border border-white/10 hover:border-white/30 
                        shadow-lg transition-all duration-500
                    "
            >
              <img
                src={dest.img}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r ${dest.gradient} text-white mb-2 shadow-lg`}>
                  {dest.tag}
                </span>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-gray-300 text-xs md:text-sm line-clamp-2 opacity-80">{dest.desc}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <FaArrowRight className="text-white text-sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button onClick={() => navigate('/destinations')} className="text-gray-400 hover:text-white font-medium text-sm border-b border-gray-700 hover:border-white transition-colors pb-1">
            View All Destinations
          </button>
        </div>
      </StackingCard>

      {/* --- CARD 3: TRENDING PACKAGES (Index 2) --- */}
      <StackingCard index={2} title="Trending Trips" subtitle="Curated For You" colorStr="emerald">
        <div className="w-full flex flex-col items-center">
          {featuredTours.length === 0 ? (
            <div className="text-white/40 animate-pulse text-lg py-20">Loading luxury experiences...</div>
          ) : (
            <div className="w-full">
              <PackageGrid list={featuredTours} onView={onView} />
            </div>
          )}

          <button
            onClick={() => navigate('/tours')}
            className="
                    mt-12 px-10 py-4 
                    rounded-full bg-white text-black 
                    font-bold text-base 
                    hover:bg-[#10b981] hover:text-white 
                    transition-all duration-300 
                    shadow-[0_0_20px_rgba(255,255,255,0.2)]
                "
          >
            Explore All Packages
          </button>
        </div>
      </StackingCard>

    </div>
  );
}