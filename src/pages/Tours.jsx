// src/pages/Tours.jsx
import { useState, useEffect, useRef, memo, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";

// -----------------------------------------
// OPTIMIZED SKELETON (No Layout Shift)
// -----------------------------------------
const TourCardSkeleton = ({ style = {} }) => (
  <div
    className="tour-card-skeleton"
    style={{
      minWidth: "260px",
      width: style.width || "260px",
      height: "320px",
      backgroundColor: "#e5e7eb",
      borderRadius: "24px",
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
      transform: "translateZ(0)", // Force GPU
      ...style
    }}
  >
    {/* Shimmer Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skeleton-shimmer" />
    
    {/* Badge */}
    <div className="absolute top-4 right-4 w-16 h-6 bg-gray-300 rounded-full" />

    {/* Bottom Content */}
    <div className="absolute bottom-6 left-5 right-5">
      <div className="w-3/4 h-7 bg-gray-300 rounded-md mb-3" />
      
      <div className="flex justify-between items-end">
        <div className="w-1/2 space-y-2">
           <div className="w-full h-3 bg-gray-300 rounded" />
           <div className="w-4/5 h-3 bg-gray-300 rounded" />
        </div>
        <div className="flex flex-col items-end gap-1">
           <div className="w-12 h-2 bg-gray-300 rounded" />
           <div className="w-20 h-6 bg-gray-300 rounded" />
        </div>
      </div>
    </div>

    <style>{`
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .skeleton-shimmer {
        animation: shimmer 1.5s infinite linear;
        will-change: transform;
      }
    `}</style>
  </div>
);

// -----------------------------------------
// ULTRA-SMOOTH TOUR CARD
// -----------------------------------------
const TourCard = memo(({ tour, onView, style = {}, index = 0 }) => {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      // --- BULLET ANIMATION (Left to Right) ---
      initial={{ opacity: 0, x: -50 }} 
      animate={{ opacity: 1, x: 0 }}
      whileHover="hover" // Enable hover state for children variants
      transition={{
        duration: 0.5, 
        delay: index * 0.1, // Smooth Stagger
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      className="tour-card-mobile group relative"
      onClick={() => onView(tour)}
      onKeyDown={(e) => e.key === 'Enter' && onView(tour)}
      style={{
        minWidth: "260px",
        width: style.width || "260px",
        backgroundColor: "white",
        borderRadius: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        willChange: "transform, opacity", // Hint browser to optimize
        backfaceVisibility: "hidden",
        contain: "content", 
        ...style
      }}
    >
      <div
        style={{
          position: "relative",
          height: "320px",
          backgroundColor: "#f3f4f6",
          overflow: "hidden"
        }}
      >
        {/* Optimized Image with Hover Zoom Variant */}
        <motion.img
          src={tour.img}
          alt={tour.title}
          loading="lazy"
          decoding="async" 
          variants={{
            hover: { scale: 1.05 }
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            willChange: "transform"
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)",
            pointerEvents: "none"
          }}
        />

        {/* Badge */}
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
            zIndex: 10
          }}
        >
          {tour.days}
        </div>

        {/* Content */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "20px",
            right: "20px",
            zIndex: 10
          }}
        >
          <h3
            style={{
              fontWeight: 900,
              fontSize: "24px",
              color: "white",
              marginBottom: "4px",
              lineHeight: "1.1",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)"
            }}
          >
            {tour.title}
          </h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "8px"
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#e5e7eb",
                fontWeight: 500,
                margin: 0,
                maxWidth: "60%",
                lineHeight: "1.4",
                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {tour.summary}
            </p>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {/* Slide In Label */}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (index * 0.05), duration: 0.4 }}
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#d1d5db",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)"
                }}
              >
                Starting From
              </motion.span>
              
              {/* Price Animation on Hover */}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                variants={{
                    hover: { 
                        scale: 1.1, 
                        color: "#fbbf24",
                        textShadow: "0 0 12px rgba(251, 191, 36, 0.6)" 
                    }
                }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "block",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#fbbf24",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  transformOrigin: "right bottom"
                }}
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
// 3D CAROUSEL (Perf Optimized)
// -----------------------------------------
const Mobile3DCarousel = ({ items, onView }) => {
  const scrollRef = useRef(null);
  const ticking = useRef(false);

  const updateCards = () => {
    const container = scrollRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const viewportCenter = containerRect.left + containerRect.width / 2;
    const children = container.children;
    
    const maxDistance = containerRect.width / 1.35;

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child.classList.contains("carousel-item")) continue;

        const rect = child.getBoundingClientRect();
        const childCenter = rect.left + rect.width / 2;
        const rawDistance = Math.abs(viewportCenter - childCenter);
        const distance = Math.max(0, rawDistance - 4);
        
        let progress = distance / maxDistance;
        if (progress > 1) progress = 1;

        progress = progress * progress * (3 - 2 * progress);

        const scale = 1.12 - progress * 0.26;
        const zIndex = 20 - Math.round(progress * 10);

        child.style.transform = `translate3d(-36px, 0, 0) scale(${scale})`;
        child.style.zIndex = zIndex;
    }

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
    
    const children = container.querySelectorAll(".carousel-item");
    if (children.length > 0) {
        const first = children[0];
        const scrollOffset = first.offsetLeft - (container.offsetWidth / 2 - first.offsetWidth / 2);
        container.scrollLeft = Math.max(0, scrollOffset);
    }

    updateCards();
  }, [items]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="mobile-3d-scroll"
      style={{
        display: "flex",
        overflowX: "auto",
        scrollSnapType: "x proximity",
        padding: "30px 0px",
        touchAction: "pan-x",
        WebkitOverflowScrolling: "touch"
      }}
    >
      <div style={{ minWidth: "calc(50% - 94px)", flexShrink: 0 }} />
      {items.map((tour, idx) => (
        <div key={tour.id} className="carousel-item" style={{ scrollSnapAlign: "center", flexShrink: 0, position: "relative" }}>
          <TourCard tour={tour} onView={onView} index={idx} />
        </div>
      ))}
      <div style={{ minWidth: "calc(50% - 94px)", flexShrink: 0 }} />
    </div>
  );
};

// -----------------------------------------
// MAIN PAGE
// -----------------------------------------
export default function Tours() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const formatted = data.data.map((t) => ({
            id: t._id,
            title: t.title,
            days: t.nights ? `${t.nights}N / ${t.nights + 1}D` : "Custom",
            price: `₹${t.basePrice.toLocaleString("en-IN")}`,
            img: t.img,
            summary: t.subtitle
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
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 1024;
  const onView = (p) => navigate(`/tours/${p.id}`);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", marginTop: "0.5cm", padding: isMobile ? "16px 0" : "24px 16px", marginBottom: "96px", paddingTop: isMobile ? "88px" : undefined }}>
      <div style={{ padding: isMobile ? "0 16px" : "0" }}>
        <SearchBar onSearch={(q) => console.log("search", q)} />

        <div style={{ marginTop: "24px" }}>
          {loading ? (
            isMobile ? (
              <div style={{ display: "flex", overflowX: "auto", gap: "16px", paddingBottom: "20px", marginLeft: "-16px", paddingLeft: "16px" }}>
                 {[1, 2, 3].map((i) => <TourCardSkeleton key={i} />)}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                 {[1, 2, 3, 4, 5, 6].map((i) => <TourCardSkeleton key={i} style={{ width: "100%" }} />)}
              </div>
            )
          ) : list.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No Tours Found</div>
          ) : isMobile ? (
            <>
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#1f2937", paddingLeft: "16px" }}>All Tours</h3>
              <div style={{ margin: "0 -16px" }}>
                <Mobile3DCarousel items={list} onView={onView} />
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {list.map((tour, idx) => (
                <TourCard key={tour.id} tour={tour} onView={onView} index={idx} style={{ width: "100%", minWidth: 0 }} />
              ))}
            </div>
          )}
        </div>

        {!loading && <div style={{ marginTop: "32px", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>Showing {list.length} tours</div>}
      </div>

      <style>{`
        .mobile-3d-scroll::-webkit-scrollbar { display: none; }
        .mobile-3d-scroll { -ms-overflow-style: none; scrollbar-width: none; scroll-snap-type: x proximity; }
        .tour-card-mobile { -webkit-tap-highlight-color: transparent; }
        .carousel-item { transition: transform 0.1s linear; will-change: transform; }
        @media (min-width: 1025px) {
          .tour-card-mobile:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 18px 40px rgba(0,0,0,0.18) !important; z-index: 10; }
        }
      `}</style>
    </div>
  );
}