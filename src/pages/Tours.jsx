// src/pages/Tours.jsx
import { useState, useEffect, useRef, memo, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar";

// -----------------------------------------
// TOUR CARD (simple, no stagger)
// -----------------------------------------
const TourCard = memo(({ tour, onView, style = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeOut"
      }}
      className="tour-card-mobile"
      onClick={() => onView(tour)}
      style={{
        minWidth: "260px",
        width: style.width || "260px",
        backgroundColor: "white",
        borderRadius: "24px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        willChange: "transform",
        ...style
      }}
    >
      <div
        style={{
          position: "relative",
          height: "320px",
          backgroundColor: "#f3f4f6"
        }}
      >
        <img
          src={tour.img}
          alt={tour.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 55%)"
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "rgba(255,255,255,0.95)",
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 800,
            color: "#1f2937",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          {tour.days}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "20px",
            right: "20px"
          }}
        >
          <h3
            style={{
              fontWeight: 900,
              fontSize: "24px",
              color: "white",
              marginBottom: "4px",
              lineHeight: "1.1",
              textShadow: "0 4px 12px rgba(0,0,0,0.5)"
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
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden"
              }}
            >
              {tour.summary}
            </p>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "10px",
                  color: "#d1d5db",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                Starting From
              </span>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#fbbf24",
                  textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                }}
              >
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
// 3D STACKED MOBILE CAROUSEL (buttery + no first-jank)
// -----------------------------------------
const Mobile3DCarousel = ({ items, onView }) => {
  const scrollRef = useRef(null);
  const ticking = useRef(false);

  const updateCards = () => {
    const container = scrollRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const viewportCenter = containerRect.left + containerRect.width / 2;
    const children = Array.from(
      container.querySelectorAll(".carousel-item")
    );
    const maxDistance = containerRect.width / 1.35;

    // READ phase
    const metrics = children.map((child) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const rawDistance = Math.abs(viewportCenter - childCenter);
      const distance = Math.max(0, rawDistance - 4);
      let progress = Math.min(distance / maxDistance, 1);

      // smooth ease-out curve
      progress = progress * progress * (3 - 2 * progress);

      const scale = 1.12 - progress * 0.26;
      const zIndex = 20 - Math.round(progress * 10);

      return { child, scale, zIndex };
    });

    // WRITE phase
    metrics.forEach(({ child, scale, zIndex }) => {
      child.style.transform = `translate3d(-36px, 0, 0) scale(${scale})`;
      child.style.zIndex = zIndex;
    });

    ticking.current = false;
  };

  const handleScroll = () => {
    if (!ticking.current) {
      ticking.current = true;
      window.requestAnimationFrame(updateCards);
    }
  };

  // center first card + warm up
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const children = container.querySelectorAll(".carousel-item");
    if (!children.length) return;

    const first = children[0];
    const containerWidth = container.offsetWidth;
    const cardWidth = first.offsetWidth;

    const scrollOffset =
      first.offsetLeft - (containerWidth / 2 - cardWidth / 2);

    container.scrollLeft = scrollOffset > 0 ? scrollOffset : 0;

    // warm-up: run twice before user scroll
    updateCards();
    requestAnimationFrame(updateCards);
  }, [items]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateCards();
    container.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
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
        position: "relative",
        touchAction: "pan-x pan-y",
        WebkitOverflowScrolling: "touch"
      }}
    >
      <div style={{ minWidth: "calc(50% - 94px)", flexShrink: 0 }} />

      {items.map((tour) => (
        <div
          key={tour.id}
          className="carousel-item"
          style={{
            scrollSnapAlign: "center",
            flexShrink: 0,
            transform: "translate3d(-36px, 0, 0) scale(1.12)",
            position: "relative"
          }}
        >
          <TourCard tour={tour} onView={onView} />
        </div>
      ))}

      <div style={{ minWidth: "calc(50% - 94px)", flexShrink: 0 }} />
    </div>
  );
};

// -----------------------------------------
// MAIN TOURS PAGE
// -----------------------------------------
export default function Tours() {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD DATA
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
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 1024;

  const onView = (p) => {
    navigate(`/tours/${p.id}`);
  };

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        marginTop: "0.5cm",
        padding: isMobile ? "16px 0" : "24px 16px",
        marginBottom: "96px",
        overflowX: "hidden",
        paddingTop: isMobile ? "88px" : undefined
      }}
    >
      <div style={{ padding: isMobile ? "0 16px" : "0" }}>
        <SearchBar onSearch={(q) => console.log("search", q)} />

        <div style={{ marginTop: "24px" }}>
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading Tours...
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No Tours Found
            </div>
          ) : isMobile ? (
            <>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#1f2937",
                  paddingLeft: "16px"
                }}
              >
                All Tours
              </h3>

              <div style={{ margin: "0 -16px" }}>
                <Mobile3DCarousel items={list} onView={onView} />
              </div>
            </>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px"
              }}
            >
              {list.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onView={onView}
                  style={{
                    width: "100%",
                    minWidth: 0
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "14px"
          }}
        >
          Showing {list.length} tours
        </div>
      </div>

      <style>{`
        .mobile-3d-scroll::-webkit-scrollbar {
          display: none;
        }
        .mobile-3d-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-snap-type: x proximity;
        }

        .tour-card-mobile {
          -webkit-tap-highlight-color: transparent;
          will-change: transform;
        }

        .carousel-item {
          transition: transform 0.18s ease-out;
          will-change: transform;
        }

        @media (min-width: 1025px) {
          .tour-card-mobile:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 18px 40px rgba(0,0,0,0.18) !important;
            z-index: 10;
          }
        }
      `}</style>
    </div>
  );
}
