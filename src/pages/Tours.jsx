import React, { useState, useEffect, useRef, memo, useLayoutEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import { FaMapMarkerAlt, FaTags, FaFilter, FaChevronDown, FaTimes } from "react-icons/fa";

// -----------------------------------------
// 1. OPTIMIZED BACKGROUND
// -----------------------------------------
const SunriseDepthBackground = memo(() => {
  return (
    <div className="fixed inset-0 z-[-1] w-full h-full bg-[#022c22] pointer-events-none transform-gpu">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 0%, rgba(217, 164, 65, 0.15) 0%, transparent 60%),
            radial-gradient(circle at 100% 30%, rgba(31, 79, 60, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 0% 60%, rgba(8, 145, 178, 0.1) 0%, transparent 50%)
          `
        }}
      />
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/20 to-transparent" />
    </div>
  );
});
SunriseDepthBackground.displayName = "SunriseDepthBackground";

// -----------------------------------------
// 2. SKELETON LOADER
// -----------------------------------------
const TourCardSkeleton = memo(({ style = {} }) => (
  <div
    className="tour-card-skeleton"
    style={{
      minWidth: "260px",
      width: style.width || "260px",
      height: "320px",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: "26px",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
      ...style,
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
    <style>{`
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      .skeleton-shimmer { animation: shimmer 1.5s infinite linear; will-change: transform; }
    `}</style>
  </div>
));
TourCardSkeleton.displayName = "TourCardSkeleton";

// -----------------------------------------
// 3. TOUR CARD (ANIMATED)
// -----------------------------------------
const TourCard = memo(({ tour, onView, style = {}, index = 0, isCarousel = false }) => {
  return (
    <motion.div
      transition={{ duration: 0.5, ease: "easeOut" }}
      initial={!isCarousel ? { opacity: 0, y: 30 } : {}}
      animate={!isCarousel ? {
        opacity: 1,
        y: 0,
        transition: {
          opacity: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: isCarousel ? 0 : index * 0.15 },
          y: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: isCarousel ? 0 : index * 0.15 },
        }
      } : {}}
      whileHover={!isCarousel ? {
        scale: 1.05,
        zIndex: 50,
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
      } : {}}
      role="button"
      tabIndex={0}
      className="tour-card-smooth group relative"
      onClick={() => onView(tour)}
      style={{
        minWidth: isCarousel ? "260px" : 0,
        width: isCarousel ? (style.width || "260px") : "100%",
        backgroundColor: "white",
        borderRadius: "26px",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        position: "relative",
        zIndex: 1,
        isolation: "isolate",
        ...style,
      }}
    >
      <div style={{ position: "relative", height: "320px", backgroundColor: "#f3f4f6" }}>

        <img
          src={tour.img}
          alt={tour.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
          {tour.tags && tour.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-900 shadow-sm z-10">
          {tour.days}
        </div>

        <div className="absolute bottom-6 left-5 right-5 z-10">
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]"></span> {tour.location}
          </p>
          <h3 className="text-2xl font-black text-white mb-1 leading-none drop-shadow-md">
            {tour.title}
          </h3>

          <div className="flex justify-between items-end mt-2">
            <p className="text-gray-200 text-xs font-medium line-clamp-2 max-w-[65%] leading-snug">
              {tour.summary}
            </p>
            <div className="text-right shrink-0">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting</span>
              <span className="block text-xl font-extrabold text-[#D9A441] drop-shadow-md">
                {tour.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
TourCard.displayName = "TourCard";

// -----------------------------------------
// 4. CAROUSEL
// -----------------------------------------
const Mobile3DCarousel = ({ items, onView, isMobile }) => {
  const scrollRef = useRef(null);
  const rafRef = useRef(null);

  const updateCards = () => {
    const container = scrollRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const viewportCenter = containerRect.left + containerRect.width / 2;
    const maxDistance = containerRect.width / 1.35;
    const nodes = Array.from(container.querySelectorAll('.carousel-item'));

    nodes.forEach(child => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const distance = Math.max(0, Math.abs(viewportCenter - childCenter) - 4);
      let progress = Math.min(1, distance / maxDistance);

      const scale = 1.12 - (progress * 0.26);
      const opacity = 1 - (progress * 0.3);

      if (isMobile) {
        child.style.transform = `translate3d(-36px, 0, 0) scale(${scale})`;
        child.style.zIndex = 20 - Math.round(progress * 10);
        child.style.opacity = opacity;
      } else {
        child.style.transform = '';
        child.style.zIndex = '';
        child.style.opacity = '';
      }
    });
  };

  const handleScroll = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      updateCards();
      rafRef.current = null;
    });
  };

  useLayoutEffect(() => { updateCards(); }, [isMobile]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  return (
    <div
      ref={scrollRef}
      className="mobile-3d-scroll"
      style={{
        display: 'flex',
        overflowX: 'auto',
        scrollSnapType: 'x proximity',
        padding: '30px 0px',
        touchAction: 'pan-x',
        perspective: '1000px',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'auto',
        willChange: 'scroll-position'
      }}
    >
      <div style={{ minWidth: 'calc(50% - 94px)', flexShrink: 0 }} />
      {items.map((tour, idx) => (
        <div
          key={tour.id}
          className="carousel-item"
          style={{
            scrollSnapAlign: 'center',
            flexShrink: 0,
            willChange: isMobile ? 'transform, opacity' : 'auto',
            transformStyle: isMobile ? 'preserve-3d' : 'flat',
            contain: 'layout style paint'
          }}
        >
          <TourCard tour={tour} onView={onView} index={idx} isCarousel={true} />
        </div>
      ))}
      <div style={{ minWidth: 'calc(50% - 94px)', flexShrink: 0 }} />
    </div>
  );
};

// -----------------------------------------
// 5. NEW DYNAMIC FILTER SECTION
// -----------------------------------------
const AVAILABLE_TAGS = ["All", "Group", "Couple", "Honeymoon", "Adventure", "Romantic", "Family", "Solo"];

const FilterSection = ({ activeTag, setActiveTag, activeLocation, setActiveLocation, locations }) => {
  const [activeMenu, setActiveMenu] = useState(null); // 'location' | 'type' | null

  const toggleMenu = (menu) => {
    if (activeMenu === menu) setActiveMenu(null);
    else setActiveMenu(menu);
  };

  return (
    <div className="space-y-6">
      {/* CONTROL BUTTONS */}
      <div className="flex flex-wrap gap-4">

        {/* Location Button */}
        <button
          onClick={() => toggleMenu('location')}
          className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold transition-all border ${activeMenu === 'location' || activeLocation !== 'All'
              ? 'bg-[#D9A441] text-black border-[#D9A441] shadow-[0_0_20px_rgba(217,164,65,0.3)]'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
        >
          <FaMapMarkerAlt />
          <span className="uppercase tracking-wider text-xs">Location:</span>
          <span>{activeLocation}</span>
          <FaChevronDown className={`ml-2 text-xs transition-transform ${activeMenu === 'location' ? 'rotate-180' : ''}`} />
        </button>

        {/* Travel Type Button */}
        <button
          onClick={() => toggleMenu('type')}
          className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold transition-all border ${activeMenu === 'type' || activeTag !== 'All'
              ? 'bg-[#D9A441] text-black border-[#D9A441] shadow-[0_0_20px_rgba(217,164,65,0.3)]'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
            }`}
        >
          <FaTags />
          <span className="uppercase tracking-wider text-xs">Type:</span>
          <span>{activeTag}</span>
          <FaChevronDown className={`ml-2 text-xs transition-transform ${activeMenu === 'type' ? 'rotate-180' : ''}`} />
        </button>

        {/* Clear Filters (Only shows if something is selected) */}
        {(activeLocation !== 'All' || activeTag !== 'All') && (
          <button
            onClick={() => { setActiveLocation('All'); setActiveTag('All'); setActiveMenu(null); }}
            className="flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
          >
            <FaTimes /> Clear
          </button>
        )}
      </div>

      {/* EXPANDABLE CATEGORY BAR */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl">

              {/* LOCATION PILLS */}
              {activeMenu === 'location' && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setActiveLocation('All'); setActiveMenu(null); }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeLocation === 'All' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-black/40 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'}`}
                  >
                    All Locations
                  </button>
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setActiveLocation(loc); setActiveMenu(null); }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeLocation === loc ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg' : 'bg-black/40 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}

              {/* TAG PILLS */}
              {activeMenu === 'type' && (
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setActiveTag(tag); setActiveMenu(null); }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeTag === tag ? 'bg-[#D9A441] text-black border-[#D9A441] shadow-lg' : 'bg-black/40 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// -----------------------------------------
// MAIN PAGE
// -----------------------------------------
export default function Tours() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [activeTag, setActiveTag] = useState("All");
  const [activeLocation, setActiveLocation] = useState("All");

  // NEW: Global pricing state
  const [globalPricing, setGlobalPricing] = useState({ standardRoomPrice: 1500 });

  // AUTO-SELECT LOCATION FROM REDIRECT
  useEffect(() => {
    if (locationState.state && locationState.state.location) {
      setActiveLocation(locationState.state.location);
    } else {
      setActiveLocation("All");
    }
  }, [locationState]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // FETCH GLOBAL PRICING
  useEffect(() => {
    fetch('https://admin.hillway.in/api/pricing')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setGlobalPricing({
            standardRoomPrice: data.data.standardRoomPrice || 1500
          });
        }
      })
      .catch((err) => console.error('Failed to load pricing', err));
  }, []);

  // FETCH TOURS AND CALCULATE DISPLAY PRICE
  useEffect(() => {
    fetch('https://admin.hillway.in/api/tours')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.data.map((t) => {
            // Calculate display price: basePrice + (standardRoomPrice × night
            const roomPrice = t.pricing?.room?.standard || globalPricing.standardRoomPrice;
            const nights = t.nights || 1;
            const displayPrice = t.basePrice + (roomPrice * nights / 3);

            return {
              id: t._id,
              slug: t.slug,
              title: t.title,
              days: t.nights ? `${t.nights}N / ${t.nights + 1}D` : 'Custom',
              price: `₹${displayPrice.toLocaleString('en-IN')}`, // UPDATED
              img: t.img,
              summary: t.subtitle,
              tags: t.tags || [],
              location: t.location || "Sikkim"
            };
          });
          setList(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [globalPricing]); // Re-run when globalPricing changes

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => { window.removeEventListener('resize', handleResize); clearTimeout(timeoutId); }
  }, []);

  const isMobile = windowWidth < 1024;

  // Updated onView to use slug if available
  const onView = (p) => navigate(`/tours/${p.slug || p.id}`);

  // Derived unique locations
  const availableLocations = useMemo(() => {
    const locs = list.map(t => t.location).filter(Boolean);
    return [...new Set(locs)].sort();
  }, [list]);

  // Filter Logic
  const filteredList = useMemo(() => {
    return list.filter(tour => {
      const tagMatch = activeTag === "All" || tour.tags.some(t => t.toUpperCase() === activeTag.toUpperCase());
      const locationMatch = activeLocation === "All" || tour.location === activeLocation;
      return tagMatch && locationMatch;
    });
  }, [list, activeTag, activeLocation]);

  return (
    <div className="relative min-h-screen" style={{ isolation: 'isolate' }}>

      {/* --- PAGE METADATA --- */}
      <SEO
        title="All Tours - HillWay | Discover Your Next Adventure"
        description="Browse our curated selection of premium tours in Sikkim and Northeast India. Find the perfect package for your dream vacation."
      />

      <SunriseDepthBackground />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '16px 0' : '24px 16px', marginBottom: '96px', paddingTop: isMobile ? '88px' : '100px' }}>
        <div style={{ padding: isMobile ? '0 16px' : '0' }}>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight font-montserrat mb-2">Explore Packages</h1>
            <p className="text-emerald-100/80 mt-2 text-sm md:text-base font-medium mb-10">Handpicked adventures designed for you</p>

            {/* TWO BUTTON FILTER MENU */}
            <FilterSection
              activeTag={activeTag}
              setActiveTag={setActiveTag}
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
              locations={availableLocations}
            />
          </motion.div>

          <div style={{ marginTop: '24px' }}>
            {loading ? (
              isMobile ? (
                <div style={{ display: 'flex', overflowX: 'auto', gap: '16px', paddingBottom: '20px', marginLeft: '-16px', paddingLeft: '16px' }}>
                  {[1, 2, 3].map((i) => <TourCardSkeleton key={i} />)}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => <TourCardSkeleton key={i} style={{ width: '100%' }} />)}
                </div>
              )
            ) : filteredList.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-white/60 font-bold text-lg border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
                No tours found for "{activeTag}" in "{activeLocation}"
              </motion.div>
            ) : isMobile ? (
              <div style={{ margin: '0 -16px' }}>
                <Mobile3DCarousel items={filteredList} onView={onView} isMobile={isMobile} />
              </div>
            ) : (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredList.map((tour, idx) => (
                    <TourCard key={tour.id} tour={tour} onView={onView} index={idx} style={{ width: '100%', minWidth: 0 }} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {!loading && (
            <div style={{ marginTop: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>
              Showing {filteredList.length} tours
            </div>
          )}
        </div>

        <style>{`
          .mobile-3d-scroll::-webkit-scrollbar { display: none; }
          .mobile-3d-scroll { 
            -ms-overflow-style: none; 
            scrollbar-width: none; 
            scroll-snap-type: x proximity;
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          
          @media (min-width: 1025px) {
            .tour-card-smooth {
              -webkit-mask-image: -webkit-radial-gradient(white, black);
              mask-image: radial-gradient(white, black);
              will-change: transform, box-shadow;
            }
            
            .tour-card-smooth:hover { 
              box-shadow: 
                0 20px 40px rgba(0,0,0,0.4),
                0 0 30px rgba(217, 164, 65, 0.15);
            }
          }
          
          .tour-card-smooth { -webkit-tap-highlight-color: transparent; }
          .carousel-item { contain: layout style paint; }
        `}</style>
      </div>
    </div>
  );
}
