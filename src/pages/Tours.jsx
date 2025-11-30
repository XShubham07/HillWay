import React, { useState, useEffect, useRef, memo, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// -----------------------------------------
// 1. OPTIMIZED BACKGROUND (FIX FOR LAG)
// -----------------------------------------
// Replaced heavy animated blobs/blurs with static CSS gradients.
// This frees up the GPU and Main Thread for smooth scrolling.
const SunriseDepthBackground = memo(() => {
  return (
    <div className="fixed inset-0 z-[-1] w-full h-full bg-[#022c22] pointer-events-none transform-gpu">
      {/* Static Gradients - Zero Animation Cost */}
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
      
      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{ 
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
        }}
      />

      {/* Bottom Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/20 to-transparent" />
    </div>
  );
});
SunriseDepthBackground.displayName = "SunriseDepthBackground";

// -----------------------------------------
// 2. OPTIMIZED SKELETON
// -----------------------------------------
const TourCardSkeleton = memo(({ style = {} }) => (
  <div
    className="tour-card-skeleton"
    style={{
      minWidth: "260px",
      width: style.width || "260px",
      height: "320px",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: "24px",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
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
// 3. OPTIMIZED TOUR CARD
// -----------------------------------------
const TourCard = memo(({ tour, onView, style = {}, index = 0, isCarousel = false }) => {
  // Use simple CSS transition for hover instead of heavy motion variants where possible
  return (
    <motion.div
      initial={!isCarousel ? { opacity: 0, y: 20 } : {}}
      whileInView={!isCarousel ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true, margin: "50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      
      role="button"
      tabIndex={0}
      className="tour-card-mobile group relative"
      onClick={() => onView(tour)}
      onKeyDown={(e) => e.key === "Enter" && onView(tour)}
      style={{
        minWidth: isCarousel ? "260px" : 0,
        width: isCarousel ? (style.width || "260px") : "100%",
        backgroundColor: "white",
        borderRadius: "24px",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        transform: "translateZ(0)", // Force GPU
        backfaceVisibility: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "relative", height: "320px", backgroundColor: "#f3f4f6" }}>
        {/* Image with simple scale on hover via CSS group-hover */}
        <img
          src={tour.img}
          alt={tour.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

        {/* Days Badge */}
        <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-900 shadow-sm z-10">
          {tour.days}
        </div>

        {/* Content */}
        <div className="absolute bottom-6 left-5 right-5 z-10">
          <h3 className="text-2xl font-black text-white mb-1 leading-none drop-shadow-md">{tour.title}</h3>
          
          <div className="flex justify-between items-end mt-2">
            <p className="text-gray-200 text-xs font-medium line-clamp-2 max-w-[65%] leading-snug">
              {tour.summary}
            </p>
            <div className="text-right shrink-0">
              <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting</span>
              <span className="block text-xl font-extrabold text-amber-400 drop-shadow-md group-hover:text-amber-300 transition-colors">
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
// 4. MOBILE 3D CAROUSEL (Unchanged - Logic is fine)
// -----------------------------------------
const Mobile3DCarousel = ({ items, onView, isMobile }) => {
  const scrollRef = useRef(null);
  const ticking = useRef(false);

  const updateCards = () => {
    const container = scrollRef.current;
    if (!container) {
      ticking.current = false;
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const viewportCenter = containerRect.left + containerRect.width / 2;
    const maxDistance = containerRect.width / 1.35;

    const nodes = Array.from(container.querySelectorAll('.carousel-item'));
    
    const updates = nodes.map(child => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;
        const rawDistance = Math.abs(viewportCenter - childCenter);
        return { child, rawDistance };
    });

    updates.forEach(({ child, rawDistance }) => {
      const distance = Math.max(0, rawDistance - 4);
      let progress = distance / maxDistance;
      if (progress > 1) progress = 1;
      progress = progress * progress * (3 - 2 * progress);

      const scale = 1.12 - progress * 0.26;
      const zIndex = 20 - Math.round(progress * 10);
      const opacity = 1 - progress * 0.3;

      if (isMobile) {
        child.style.transform = `translate3d(-36px, 0, 0) scale(${scale})`;
        child.style.zIndex = zIndex;
        child.style.opacity = opacity;
      } else {
        child.style.transform = '';
        child.style.zIndex = '';
        child.style.opacity = '';
      }
    });

    ticking.current = false;
  };

  const handleScroll = () => {
    if (!ticking.current) {
      ticking.current = true;
      window.requestAnimationFrame(updateCards);
    }
  };

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const children = container.querySelectorAll('.carousel-item');
    if (children.length > 0) {
      const first = children[0];
      const scrollOffset = first.offsetLeft - (container.offsetWidth / 2 - first.offsetWidth / 2);
      container.scrollLeft = Math.max(0, scrollOffset);
    }
    updateCards();
  }, [items, isMobile]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
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
        WebkitOverflowScrolling: 'touch',
        perspective: '1000px',
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
            position: 'relative',
            willChange: isMobile ? 'transform, opacity' : 'auto',
            transformStyle: isMobile ? 'preserve-3d' : 'flat',
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
// MAIN PAGE
// -----------------------------------------
export default function Tours() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

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
          }));
          setList(formatted);
        }
        requestAnimationFrame(() => setLoading(false));
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
        timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(timeoutId);
    }
  }, []);

  const isMobile = windowWidth < 1024;
  const onView = (p) => navigate(`/tours/${p.id}`);

  return (
    <div className="relative min-h-screen" style={{ isolation: 'isolate' }}>
      <SunriseDepthBackground />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '16px 0' : '24px 16px', marginBottom: '96px', paddingTop: isMobile ? '88px' : '100px' }}>
        <div style={{ padding: isMobile ? '0 16px' : '0' }}>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg tracking-tight font-montserrat">Explore Packages</h1>
            <p className="text-emerald-100/80 mt-2 text-sm md:text-base font-medium">Handpicked adventures designed for you</p>
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
            ) : list.length === 0 ? (
              <div className="text-center py-20 text-white/60 font-bold text-lg border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">No Tours Found</div>
            ) : isMobile ? (
              <div style={{ margin: '0 -16px' }}>
                <Mobile3DCarousel items={list} onView={onView} isMobile={isMobile} />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {list.map((tour, idx) => (
                  <TourCard key={tour.id} tour={tour} onView={onView} index={idx} style={{ width: '100%', minWidth: 0 }} />
                ))}
              </div>
            )}
          </div>

          {!loading && (
            <div style={{ marginTop: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>
              Showing {list.length} tours
            </div>
          )}
        </div>

        <style>{`
          .mobile-3d-scroll::-webkit-scrollbar { display: none; }
          .mobile-3d-scroll { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x proximity; }
          .tour-card-mobile { -webkit-tap-highlight-color: transparent; }
          .carousel-item { contain: layout paint; }
          
          /* Simplified Desktop Hover */
          @media (min-width: 1025px) {
            .tour-card-mobile:hover { 
              transform: translateY(-4px); 
              box-shadow: 0 12px 24px rgba(0,0,0,0.2); 
            }
          }
        `}</style>
      </div>
    </div>
  );
}