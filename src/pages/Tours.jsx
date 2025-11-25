// src/pages/Tours.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import { tourData } from "../data/mockTours";

// Tour Card Component
function TourCard({ tour, onView }) {
  return (
    <div 
      className="tour-card-mobile bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
      onClick={() => onView(tour)}
      style={{ minWidth: '280px', maxWidth: '280px', flexShrink: 0 }}
    >
      <div className="relative" style={{ height: '180px' }}>
        <img 
          src={tour.img} 
          alt={tour.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          {tour.days}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>{tour.title}</h3>
        <p className="text-gray-600 text-sm mb-3" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>{tour.summary}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-xl font-bold text-blue-600">{tour.price}</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Tours(){
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Real tours from your data
  const realTours = tourData.map(tour => ({
    id: tour.id, 
    title: tour.title.split(' - ')[0], 
    days: tour.title.match(/(\d+)\s*N\s*\/\s*(\d+)\s*D/)?.[0] || 'Custom Days',
    price: '₹' + tour.basePrice.toLocaleString('en-IN'),
    img: tour.img,
    summary: tour.subtitle,
  }));
  
  // Generic mock tours
  const genericTours = Array.from({length: 6}).map((_, i) => ({
    id: `generic-${i + 4}`, 
    title: `Adventure Trek ${i + 4}`,
    days: (4 + (i % 3)) + 'N/' + (5 + (i % 3)) + 'D',
    img: i % 2 === 0 ? '/g3.webp' : '/g69.webp', 
    price: '₹' + (15000 + i * 1500).toLocaleString('en-IN'),
    summary: 'A thrilling high-altitude trek for seasoned adventurers.',
  }));
  
  const all = [...realTours, ...genericTours];
  const [list, setList] = useState(all);
  const [showFilters, setShowFilters] = useState(false);
  
  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Split tours into rows of 3
  const rows = [];
  for (let i = 0; i < list.length; i += 3) {
    rows.push(list.slice(i, i + 3));
  }
  
  const isMobile = windowWidth < 1024;
  
  function applyFilters(f){ 
    setList(all.slice(0, 6)); 
  }
  
  function onView(p){ 
    navigate(`/tours/${p.id}`); 
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-24">
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 3fr', gap: '32px' }}>
        {/* Filters Sidebar - Desktop Only */}
        {!isMobile && (
          <aside>
            <Filters onChange={applyFilters} />
          </aside>
        )}
        
        {/* Main Content */}
        <div>
          <SearchBar onSearch={(q) => console.log('search', q)} />
          
          {/* Mobile Filter Button */}
          {isMobile && (
            <button 
              className="w-full mt-4 bg-white text-gray-700 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          )}
          
          {/* Mobile Filters Panel */}
          {isMobile && showFilters && (
            <div style={{ marginTop: '16px' }}>
              <Filters onChange={applyFilters} />
            </div>
          )}
          
          {/* Tours Display */}
          <div style={{ marginTop: '24px' }}>
            {/* Mobile: Scrollable rows (3 cards per row) */}
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {rows.map((row, idx) => (
                  <div key={idx}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', marginBottom: '12px', paddingLeft: '4px' }}>
                      Row {idx + 1}
                    </h3>
                    <div 
                      className="tours-scroll-container"
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        gap: '16px',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        paddingBottom: '16px',
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        width: '100%'
                      }}
                    >
                      {row.map(tour => (
                        <div key={tour.id} style={{ scrollSnapAlign: 'start', flex: '0 0 auto' }}>
                          <TourCard tour={tour} onView={onView} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Desktop: Grid layout */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {list.map(tour => (
                  <TourCard key={tour.id} tour={tour} onView={onView} />
                ))}
              </div>
            )}
          </div>
          
          {/* Results count */}
          <div style={{ marginTop: '32px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Showing {list.length} tours
          </div>
        </div>
      </div>
      
      <style>{`
        .tours-scroll-container {
          flex-wrap: nowrap !important;
        }
        
        .tours-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .tour-card-mobile {
          flex-shrink: 0 !important;
        }
        
        @media (hover: hover) {
          .tour-card-mobile:hover {
            transform: translateY(-4px);
          }
        }
        
        /* Force no wrapping on mobile */
        @media (max-width: 1024px) {
          .tours-scroll-container {
            flex-wrap: nowrap !important;
            overflow-x: scroll !important;
          }
        }
      `}</style>
    </div>
  );
}