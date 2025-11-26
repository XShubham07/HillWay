// src/pages/Tours.jsx
import { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion"; // Added Animation Library
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import { tourData } from "../data/mockTours";

// --- ANIMATION VARIANTS (Slide Up + Zoom) ---
const mobileRowVariant = {
  hidden: { 
    opacity: 0, 
    y: 80,         // Starts 80px down
    scale: 0.9     // Starts slightly zoomed out (90%)
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,      // Zooms to 100%
    transition: { 
      duration: 0.7, 
      ease: "easeOut" 
    }
  }
};

// --- MEMOIZED CARD COMPONENT ---
const TourCard = memo(({ tour, onView, style = {} }) => {
  return (
    <div 
      className="tour-card-mobile"
      onClick={() => onView(tour)}
      style={{ 
        minWidth: '260px', 
        width: '260px',
        backgroundColor: 'white',
        borderRadius: '24px', 
        boxShadow: '0 15px 40px rgba(0,0,0,0.12)', 
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        ...style 
      }}
    >
      <div style={{ 
        position: 'relative', 
        height: '320px',
        backgroundColor: '#f3f4f6'
      }}>
        <img 
          src={tour.img} 
          alt={tour.title}
          loading="lazy"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
        />
        <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 55%)'
        }} />

        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 800,
          color: '#1f2937',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {tour.days}
        </div>

        <div style={{ position: 'absolute', bottom: '24px', left: '20px', right: '20px' }}>
            <h3 style={{
                fontWeight: 900,
                fontSize: '24px',
                color: 'white',
                marginBottom: '8px',
                lineHeight: '1.1',
                textShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}>{tour.title}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                 <span style={{ fontSize: '20px', fontWeight: 800, color: '#fbbf24', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {tour.price}
                 </span>
                 <button 
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '10px 24px',
                        borderRadius: '30px',
                        fontSize: '13px',
                        fontWeight: 800,
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                 >
                    View
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
});

TourCard.displayName = 'TourCard';

// --- STACKED CAROUSEL COMPONENT ---
const Mobile3DCarousel = ({ items, onView }) => {
    const scrollRef = useRef(null);
    const ticking = useRef(false);

    const updateCards = () => {
        const container = scrollRef.current;
        if (!container) return;

        const centerPoint = container.scrollLeft + container.offsetWidth / 2;
        const children = Array.from(container.querySelectorAll('.carousel-item'));

        children.forEach((child) => {
            const childCenter = child.offsetLeft + (child.offsetWidth / 2);
            const distance = Math.abs(centerPoint - childCenter);
            const maxDistance = container.offsetWidth / 1.8; 
            let progress = Math.min(distance / maxDistance, 1);

            const scale = 1.15 - (0.3 * progress); 
            const zIndex = 10 - Math.round(progress * 5);

            child.style.transform = `scale(${scale})`;
            child.style.zIndex = zIndex;
        });

        ticking.current = false;
    };

    const handleScroll = () => {
        if (!ticking.current) {
            window.requestAnimationFrame(updateCards);
            ticking.current = true;
        }
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            updateCards();
            container.addEventListener('scroll', handleScroll, { passive: true });
            window.addEventListener('resize', handleScroll);
        }
        return () => {
            container?.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [items]);

    return (
        <div 
            ref={scrollRef}
            className="mobile-3d-scroll"
            style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                alignItems: 'center',
                padding: '30px 16px', 
                position: 'relative',
                zIndex: 0,
                width: '100%',
                touchAction: 'pan-x pan-y', 
                WebkitOverflowScrolling: 'touch',
            }}
        >
            <div style={{ minWidth: '18px', flexShrink: 0 }} />

            {items.map((tour) => (
                <div 
                    key={tour.id} 
                    className="carousel-item"
                    style={{ 
                        scrollSnapAlign: 'center', 
                        flexShrink: 0,
                        margin: '0 -36px', 
                        transition: 'transform 0.1s ease-out', 
                        position: 'relative'
                    }}
                >
                    <TourCard tour={tour} onView={onView} />
                </div>
            ))}

            <div style={{ minWidth: '18px', flexShrink: 0 }} />
        </div>
    );
};

// --- MAIN PAGE ---
export default function Tours(){
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showFilters, setShowFilters] = useState(false);
  
  // Data Generation
  const realTours = tourData.slice(0, 3).map(tour => ({
    id: tour.id, 
    title: tour.title.split(' - ')[0], 
    days: tour.title.match(/(\d+)\s*N\s*\/\s*(\d+)\s*D/)?.[0] || '7Days',
    price: '₹'+ tour.basePrice.toLocaleString('en-IN'),
    img: tour.img,
    summary: tour.subtitle,
  }));
  
  const genericTours = Array.from({length: 6}).map((_, i) => ({
    id: `generic-${i + 4}`, 
    title: `Adventure Trek ${i + 4}`,
    days: (4 + (i % 3)) + 'N/' + (5 + (i % 3)) + 'D',
    img: i % 2 === 0 ? '/g3.webp' : '/g69.webp', 
    price: '₹' + (15000 + i * 1500).toLocaleString('en-IN'),
    summary: 'A thrilling high-altitude trek for seasoned adventurers.',
  }));
  
  const allTours = [...realTours, ...genericTours];
  const [list] = useState(allTours);
  
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const isMobile = windowWidth < 1024;

  const onView = (p) => {
    navigate(`/tours/${p.id}`);
  };
  
  const applyFilters = (f) => { };
  
  return (
    <div style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      padding: isMobile ? '16px 0' : '24px 16px', 
      marginBottom: '96px',
      overflowX: 'hidden',
      paddingTop: isMobile ? '88px' : undefined,
      position: 'relative',
      zIndex: 0
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr', 
        gap: '32px',
        padding: isMobile ? '0 16px' : '0' 
      }}>
        {!isMobile && (
          <aside>
            <Filters onChange={applyFilters} />
          </aside>
        )}
        
        <div style={{ minWidth: 0 }}>
          <div style={{ padding: isMobile ? '0' : '0' }}>
             <SearchBar onSearch={(q) => console.log('search', q)} />
          </div>
          
          {isMobile && (
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{
                width: '100%',
                marginTop: '16px',
                backgroundColor: 'white',
                color: '#374151',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Filters (Icon)
            </button>
          )}
          
          {isMobile && showFilters && (
            <div style={{ marginTop: '16px' }}>
              <Filters onChange={applyFilters} />
            </div>
          )}
          
          <div style={{ marginTop: '24px' }}>
            {isMobile ? (
              /* MOBILE: STACKED CAROUSELS WITH SCROLL ANIMATION */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* ROW 1 - Animated */}
                <motion.div
                  variants={mobileRowVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }} // Triggers when row is 10% inside screen
                >
                  <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 800, 
                      color: '#1f2937', 
                      paddingLeft: '16px', 
                      marginBottom: '0px'
                  }}>
                    Popular Treks
                  </h3>
                  <div style={{ margin: '0 -16px' }}> 
                     <Mobile3DCarousel items={list.slice(0, 3)} onView={onView} />
                  </div>
                </motion.div>

                {/* ROW 2 - Animated */}
                <motion.div
                  variants={mobileRowVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                >
                  <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 800, 
                      color: '#1f2937', 
                      paddingLeft: '16px', 
                      marginBottom: '0px' 
                  }}>
                      Best Sellers
                  </h3>
                  <div style={{ margin: '0 -16px' }}>
                     <Mobile3DCarousel items={list.slice(3, 6)} onView={onView} />
                  </div>
                </motion.div>

                {/* ROW 3 - Animated */}
                <motion.div
                  variants={mobileRowVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                >
                  <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 800, 
                      color: '#1f2937', 
                      paddingLeft: '16px', 
                      marginBottom: '0px' 
                  }}>
                      Weekend Trips
                  </h3>
                  <div style={{ margin: '0 -16px' }}>
                     <Mobile3DCarousel items={list.slice(6, 9)} onView={onView} />
                  </div>
                </motion.div>

              </div>
            ) : (
              /* Desktop Grid - No Scroll Animation Needed Here (or optional) */
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '24px' 
              }}>
                {list.map(tour => (
                  <TourCard key={tour.id} tour={tour} onView={onView} />
                ))}
              </div>
            )}
          </div>
          
          <div style={{ 
            marginTop: '32px', 
            textAlign: 'center', 
            color: '#6b7280', 
            fontSize: '14px' 
          }}>
            Showing {list.length} tours
          </div>
        </div>
      </div>
      
      {/* CSS OVERRIDES */}
      <style>{`
        .mobile-3d-scroll::-webkit-scrollbar {
          display: none;
        }
        .mobile-3d-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .tour-card-mobile {
          -webkit-tap-highlight-color: transparent;
          will-change: transform; 
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
        }

        @media (min-width: 1025px) {
          .tour-card-mobile:hover {
            transform: translateY(-8px) scale(1.069);
            box-shadow: 0 18px 40px rgba(0,0,0,0.18) !important;
          }
        }
      `}</style>
    </div>
  );
}