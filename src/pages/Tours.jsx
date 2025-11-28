// src/pages/Tours.jsx
import { useState, useEffect, useRef, memo } from "react";
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion"; 
import SearchBar from "../components/SearchBar";

// --- MEMOIZED CARD COMPONENT ---
const TourCard = memo(({ tour, onView, style = {} }) => {
  return (
    <div 
      className="tour-card-mobile"
      onClick={() => onView(tour)}
      style={{ 
        // Default mobile/carousel styles (Fixed Width)
        minWidth: '260px', 
        width: '260px',
        backgroundColor: 'white',
        borderRadius: '24px', 
        boxShadow: '0 15px 40px rgba(0,0,0,0.12)', 
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        // Allow overriding styles (Essential for Desktop Grid)
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
                padding: '30px 0px', // Removed horizontal padding
                position: 'relative',
                zIndex: 0,
                width: '100%',
                touchAction: 'pan-x pan-y', 
                WebkitOverflowScrolling: 'touch',
            }}
        >
            {/* SPACER LOGIC:
               Card Width = 260px
               Margin = -36px * 2 = -72px
               Effective Layout Width = 188px
               Half Width = 94px
               
               To center: Spacer = 50% screen - 94px
            */}
            <div style={{ minWidth: 'calc(50% - 94px)', flexShrink: 0 }} />

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

            <div style={{ minWidth: 'calc(50% - 94px)', flexShrink: 0 }} />
        </div>
    );
};

// --- MAIN PAGE ---
export default function Tours(){
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [list, setList] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- FETCH REAL DATA ---
  useEffect(() => {
    fetch('/api/tours') // This proxies to localhost:3000
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          const formatted = data.data.map(t => ({
            id: t._id, // Use MongoDB _id
            title: t.title,
            days: t.nights ? `${t.nights}N / ${t.nights + 1}D` : 'Custom',
            price: `₹${t.basePrice.toLocaleString('en-IN')}`,
            img: t.img,
            summary: t.subtitle
          }));
          setList(formatted);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
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
  
  return (
    <div style={{ 
      maxWidth: '1280px', 
      margin: '0 auto', 
      marginTop: '0.5cm', // Content moved down
      padding: isMobile ? '16px 0' : '24px 16px', 
      marginBottom: '96px',
      overflowX: 'hidden',
      paddingTop: isMobile ? '88px' : undefined,
      position: 'relative',
      zIndex: 0
    }}>
      <div style={{ 
        padding: isMobile ? '0 16px' : '0' 
      }}>
        
        <div style={{ minWidth: 0 }}>
          <div style={{ padding: isMobile ? '0' : '0' }}>
             <SearchBar onSearch={(q) => console.log('search', q)} />
          </div>
          
          <div style={{ marginTop: '24px' }}>
            
            {loading ? (
               <div className="text-center py-20 text-gray-500">Loading Tours...</div>
            ) : list.length === 0 ? (
               <div className="text-center py-20 text-gray-500">No Tours Found</div>
            ) : isMobile ? (
              /* MOBILE: STACKED CAROUSELS */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: 800, 
                      color: '#1f2937', 
                      paddingLeft: '16px', 
                      marginBottom: '0px'
                  }}>
                    All Tours
                  </h3>
                  <div style={{ margin: '0 -16px' }}> 
                     <Mobile3DCarousel items={list} onView={onView} />
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop */
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '24px' 
              }}>
                {list.map(tour => (
                  <TourCard 
                    key={tour.id} 
                    tour={tour} 
                    onView={onView} 
                    style={{ width: '100%', minWidth: '0' }} 
                  />
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
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 18px 40px rgba(0,0,0,0.18) !important;
            z-index: 10;
          }
        }
      `}</style>
    </div>
  );
}