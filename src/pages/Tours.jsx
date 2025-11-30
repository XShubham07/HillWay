// src/pages/Tours.jsx
import React, { useState, useEffect, useRef, memo, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Removed useScroll, useTransform to save resources

// -----------------------------------------
// INTERNAL COMPONENT: OPTIMIZED BACKGROUND
// -----------------------------------------
// FIX: Removed scroll-linked animations (useScroll). 
// Replaced with CSS-based floating animations to free up the main thread.
const SunriseDepthBackground = memo(() => {
  return (
    <div className="fixed inset-0 z-[-1] w-full h-full overflow-hidden bg-[#022c22] pointer-events-none transform-gpu">
      {/* Noise Texture - Added translateZ to force GPU layer */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{ 
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          transform: "translateZ(0)" 
        }}
      />

      {/* Sun - Decoupled from Scroll, just breathing animation */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1], 
          opacity: [0.22, 0.32, 0.22],
          y: [0, -15, 0] // Gentle floating instead of scroll transform
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform, opacity" }}
        className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[80vw] md:w-[50vw] aspect-square rounded-full bg-gradient-to-b from-[#D9A441] to-[#fbbf24] blur-[100px] md:blur-[120px] mix-blend-screen"
      />

      {/* Right Blob */}
      <motion.div
        animate={{ 
          x: [0, 20, 0], 
          y: [0, 20, 0],
          opacity: [0.08, 0.18, 0.08] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ willChange: "transform, opacity" }}
        className="absolute top-[30%] -right-[10%] w-[40vw] h-[40vw] bg-[#1F4F3C] blur-[80px] md:blur-[100px] rounded-full mix-blend-screen"
      />

      {/* Left Blob */}
      <motion.div
        animate={{ 
          x: [0, -30, 0], 
          y: [0, -20, 0],
          opacity: [0.05, 0.15, 0.05] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ willChange: "transform, opacity" }}
        className="absolute top-[50%] -left-[10%] w-[45vw] h-[45vw] bg-[#0891b2] blur-[100px] md:blur-[120px] rounded-full mix-blend-screen"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/40 to-transparent" />
    </div>
  );
});
SunriseDepthBackground.displayName = "SunriseDepthBackground";

// -----------------------------------------
// OPTIMIZED SKELETON
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
      transform: "translateZ(0)",
      border: "1px solid rgba(255,255,255,0.1)",
      ...style,
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
    <div className="absolute top-4 right-4 w-16 h-6 bg-white/10 rounded-full" />
    <div className="absolute bottom-6 left-5 right-5">
      <div className="w-3/4 h-7 bg-white/10 rounded-md mb-3" />
      <div className="flex justify-between items-end">
        <div className="w-1/2 space-y-2">
          <div className="w-full h-3 bg-white/10 rounded" />
          <div className="w-4/5 h-3 bg-white/10 rounded" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="w-12 h-2 bg-white/10 rounded" />
          <div className="w-20 h-6 bg-white/10 rounded" />
        </div>
      </div>
    </div>
    <style>{`
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      .skeleton-shimmer { animation: shimmer 1.5s infinite linear; will-change: transform; }
    `}</style>
  </div>
));
TourCardSkeleton.displayName = "TourCardSkeleton";

// -----------------------------------------
// ULTRA-SMOOTH TOUR CARD
// -----------------------------------------
const TourCard = memo(({ tour, onView, style = {}, index = 0, isCarousel = false }) => {
  const animProps = isCarousel
    ? {}
    : {
        initial: { opacity: 0, y: 20 }, // Changed x to y for subtler list entry
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "50px" },
        transition: { duration: 0.4, delay: index * 0.05, ease: "easeOut" },
      };

  const cardWidthStyle = isCarousel
    ? { minWidth: "260px", width: style.width || "260px" }
    : { minWidth: 0, width: "100%" };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      {...animProps}
      whileHover="hover"
      className="tour-card-mobile group relative"
      onClick={() => onView(tour)}
      onKeyDown={(e) => e.key === "Enter" && onView(tour)}
      style={{
        ...cardWidthStyle,
        backgroundColor: "white",
        borderRadius: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        transform: "translateZ(0)", // Force GPU
        backfaceVisibility: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "relative", height: "320px", backgroundColor: "#f3f4f6", overflow: "hidden" }}>
        <motion.img
          src={tour.img}
          alt={tour.title}
          loading="lazy"
          decoding="async"
          variants={{ hover: { scale: 1.06 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: "100%", height: "100%", objectFit: "cover", willChange: "transform" }}
        />

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)", pointerEvents: "none" }} />

        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "rgba(255,255,255,0.98)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 800,
            color: "#111827",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 10,
          }}
        >
          {tour.days}
        </div>

        <div style={{ position: "absolute", bottom: "24px", left: "20px", right: "20px", zIndex: 10 }}>
          <h3 style={{ fontWeight: 900, fontSize: "22px", color: "white", marginBottom: "4px", lineHeight: "1.1", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{tour.title}</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "8px" }}>
            <p style={{ fontSize: "13px", color: "#e5e7eb", fontWeight: 500, margin: 0, maxWidth: "65%", lineHeight: "1.4", textShadow: "0 1px 4px rgba(0,0,0,0.6)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{tour.summary}</p>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ display: "block", fontSize: "10px", color: "#d1d5db", textTransform: "uppercase", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>Starting From</span>
              <motion.span
                variants={{ hover: { scale: 1.08, color: "#fbbf24", textShadow: "0 0 8px rgba(251,191,36,0.45)" } }}
                transition={{ duration: 0.25 }}
                style={{ display: "block", fontSize: "18px", fontWeight: 800, color: "#fbbf24", textShadow: "0 2px 4px rgba(0,0,0,0.5)", transformOrigin: "right bottom" }}
              >
                {tour.price}
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
TourCard.displayName = "TourCard";

// -----------------------------------------
// 3D CAROUSEL (Perf Optimized: Batched Reads/Writes)
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
    
    // Batch Reads
    const updates = nodes.map(child => {
        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;
        const rawDistance = Math.abs(viewportCenter - childCenter);
        return { child, rawDistance };
    });

    // Batch Writes
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

    // Center initial scroll
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
    // Mocking fetch if API isn't ready, or use real fetch
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

      <div style={{ maxWidth: '1280px', margin: '0 auto', marginTop: '0.5cm', padding: isMobile ? '16px 0' : '24px 16px', marginBottom: '96px', paddingTop: isMobile ? '88px' : '100px' }}>
        <div style={{ padding: isMobile ? '0 16px' : '0' }}>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8 text-center md:text-left">
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
          /* Optimized hover for desktop only */
          @media (min-width: 1025px) {
            .tour-card-mobile:hover { transform: translateY(-6px) translateZ(0); box-shadow: 0 16px 32px rgba(0,0,0,0.22); }
          }
        `}</style>
      </div>
    </div>
  );
}