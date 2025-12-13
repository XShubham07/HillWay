import React, { useState, useEffect, useRef, memo, useLayoutEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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
        scale: 1.1,
        zIndex: 50,
      } : {}}
      role="button"
      tabIndex={0}
      className="tour-card-smooth group relative"
      onClick={() => onView(tour)}
      onKeyDown={(e) => e.key === "Enter" && onView(tour)}
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
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
        isolation: "isolate",
        maskImage: "radial-gradient(white, black)",
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        ...style,
      }}
    >
      <div style={{ position: "relative", height: "320px", backgroundColor: "#f3f4f6" }}>

        {/* Image with Lazy Loading */}
        <img
          src={tour.img}
          alt={tour.title}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "translate3d(0,0,0)",
          }}
          className="group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
          {tour.tags && tour.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wide">
              {tag}
            </span>
          ))}
        </div>

        {/* Days Badge */}
        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-900 shadow-sm z-10 transition-all duration-500 group-hover:bg-[#D9A441] group-hover:scale-105">
          {tour.days}
        </div>

        <div className="absolute bottom-6 left-5 right-5 z-10">
          <h3 className="text-2xl font-black text-white mb-1 leading-none drop-shadow-md transition-all duration-500 group-hover:translate-y-[-2px]">
            {tour.title}
          </h3>

          <div className="flex justify-between items-end mt-2">
            <p className="text-gray-200 text-xs font-medium line-clamp-2 max-w-[65%] leading-snug transition-all duration-500 group-hover:text-white">
              {tour.summary}
            </p>
            <div className="text-right shrink-0 transition-all duration-500 group-hover:scale-105">
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
// 4. CAROUSEL (OPTIMIZED FOR SMOOTH SCROLL)
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
// 5. FILTER BAR
// -----------------------------------------
const AVAILABLE_TAGS = ["All", "Group", "Couple", "Honeymoon", "Adventure", "Romantic", "Family", "Solo"];

const FilterBar = ({ activeTag, setActiveTag }) => (
  <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
    {AVAILABLE_TAGS.map((tag) => (
      <button
        key={tag}
        onClick={() => setActiveTag(tag)}
        className={`
          whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border
          ${activeTag === tag
            ? "bg-[#D9A441] text-black border-[#D9A441] shadow-[0_0_20px_rgba(217,164,65,0.3)] scale-105"
            : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"}
        `}
      >
        {tag}
      </button>
    ))}
  </div>
);

// -----------------------------------------
// MAIN PAGE
// -----------------------------------------
export default function Tours() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    fetch('/api/tours')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.data.map((t) => ({
            id: t._id,
            title: t.title,
            days: t.nights ? `${t.nights}N / ${t.nights + 1}D` : 'Custom',
            price: `₹${t.basePrice.toLocaleString('en-IN')}`,
            img: t.img,
            summary: t.subtitle,
            tags: t.tags || []
          }));
          setList(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
  const onView = (p) => navigate(`/tours/${p.id}`);

  const filteredList = useMemo(() => {
    if (activeTag === "All") return list;
    return list.filter(tour =>
      tour.tags.some(t => t.toUpperCase() === activeTag.toUpperCase())
    );
  }, [list, activeTag]);

  return (
    <div className="relative min-h-screen" style={{ isolation: 'isolate' }}>
      <SunriseDepthBackground />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '16px 0' : '24px 16px', marginBottom: '96px', paddingTop: isMobile ? '88px' : '100px' }}>
        <div style={{ padding: isMobile ? '0 16px' : '0' }}>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight font-montserrat">Explore Packages</h1>
            <p className="text-emerald-100/80 mt-2 text-sm md:text-base font-medium mb-8">Handpicked adventures designed for you</p>

            <FilterBar activeTag={activeTag} setActiveTag={setActiveTag} />
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
                No tours found for "{activeTag}"
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
          
          /* Prevent scroll jank */
          * {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        `}</style>
      </div>
    </div>
  );
}