// src/pages/Destinations.jsx
import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO"; // FIXED: Import SEO
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt, FaStar, FaArrowRight, FaPlane, FaTrain, FaCar,
  FaCamera, FaHiking, FaInfoCircle, FaMountain, FaClock, FaCloudSun,
  FaChevronUp, FaChevronDown
} from "react-icons/fa";
import { DESTINATION_DATA } from "../data/destinationsData";

const CATEGORIES = ["All", "North Sikkim", "East Sikkim", "West Sikkim", "South Sikkim", "Darjeeling"];

// --- OPTIMIZED IMAGE COMPONENT ---
const PremiumImage = memo(({ src, alt, className, priority = false }) => {
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50%' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-emerald-950 ${className}`}>
      <div
        className={`absolute inset-0 bg-emerald-900 transition-opacity duration-500 z-10 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
      />

      {(isVisible || priority) && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ease-out will-change-transform ${isLoaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-sm'}`}
        />
      )}
    </div>
  );
});
PremiumImage.displayName = "PremiumImage";

// --- SUB-COMPONENTS ---
const TabButton = ({ active, id, label, icon, onClick, buttonRef }) => (
  <button
    ref={buttonRef}
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap flex-shrink-0 border ${active === id
      ? 'bg-[#D9A441] text-black border-[#D9A441] shadow-lg scale-105'
      : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'
      }`}
  >
    {icon} {label}
  </button>
);

const SectionHeading = ({ title, icon }) => (
  <h3 className="flex items-center gap-3 text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
    <span className="text-[#D9A441]">{icon}</span> {title}
  </h3>
);

const AttractionCard = ({ attr }) => (
  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors h-full flex flex-col group overflow-hidden">
    <div className="h-48 w-full rounded-xl overflow-hidden mb-4 relative shadow-lg bg-emerald-900">
      <PremiumImage src={attr.img} alt={attr.name} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
      <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/80 text-[10px] text-white font-bold uppercase tracking-wider border border-white/10 shadow-sm">
        {attr.type}
      </span>
    </div>
    <h4 className="text-xl font-bold text-white mb-2">{attr.name}</h4>
    <p className="text-gray-300 text-sm leading-relaxed flex-1">{attr.desc}</p>
  </div>
);

const TodoCard = ({ item }) => (
  <div className="flex gap-5 bg-[#022c22] p-6 rounded-2xl border border-white/10 hover:border-[#D9A441]/50 transition-colors group h-full">
    <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center text-[#D9A441] text-2xl shrink-0 group-hover:rotate-12 transition-transform duration-300 border border-white/5">
      {item.icon}
    </div>
    <div>
      <h5 className="text-lg font-bold text-white mb-2">{item.text}</h5>
      <p className="text-sm text-gray-200 leading-relaxed">{item.detail}</p>
    </div>
  </div>
);

const GroupedAttractionRow = ({ dest }) => (
  <div className="mb-16">
    <div className="flex items-end gap-4 mb-8 pb-4 border-b border-white/10">
      <h2
        className="text-4xl font-black text-[#D9A441] tracking-tight leading-none"
        style={{ textShadow: "0 0 30px rgba(217, 164, 65, 0.2)" }}
      >
        {dest.name}
      </h2>
      <span className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-1">{dest.region}</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dest.attractions.map((attr, idx) => (
        <div key={idx} className="bg-[#022c22] rounded-2xl overflow-hidden border border-white/10 hover:border-[#D9A441]/50 transition-colors group hover:-translate-y-1 duration-300 shadow-xl">
          <div className="h-48 relative bg-emerald-900">
            <PremiumImage src={attr.img} alt={attr.name} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent" />
            <span className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
              {attr.type}
            </span>
          </div>
          <div className="p-5 relative">
            <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#D9A441] transition-colors">{attr.name}</h4>
            <p className="text-gray-200 text-xs leading-relaxed line-clamp-3">{attr.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function Destinations() {
  const [mainView, setMainView] = useState("destinations");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(DESTINATION_DATA[0].id);
  const [activeTab, setActiveTab] = useState('guide');

  /* --- REFS --- */
  const sidebarListRef = useRef(null);
  const tabsScrollRef = useRef(null);
  const categoryRefs = useRef({});
  const tabRefs = useRef({});
  const contentRef = useRef(null);




  const scrollSidebar = (direction) => {
    if (sidebarListRef.current) {
      const scrollAmount = 200;
      sidebarListRef.current.scrollBy({
        top: direction === 'up' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (location.state && location.state.id) {
      const targetId = location.state.id;
      const targetDest = DESTINATION_DATA.find(d => d.id === targetId);

      if (targetDest) {
        setSelectedId(targetId);
        setMainView("destinations");
        setActiveCategory(targetDest.region);
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }
  }, [location.state]);

  const filteredDestinations = useMemo(() => {
    return DESTINATION_DATA.filter(dest =>
      activeCategory === "All" || dest.region === activeCategory
    );
  }, [activeCategory]);

  useEffect(() => {
    if (!location.state && filteredDestinations.length > 0 && mainView === "destinations") {
      const exists = filteredDestinations.find(d => d.id === selectedId);
      if (!exists) setSelectedId(filteredDestinations[0].id);
    }
  }, [activeCategory, filteredDestinations, selectedId, mainView, location.state]);

  const currentDest = DESTINATION_DATA.find(d => d.id === selectedId) || DESTINATION_DATA[0];

  useEffect(() => {
    if (!location.state) window.scrollTo(0, 0);
  }, []);

  const handleDestChange = (id) => {
    setSelectedId(id);
    setActiveTab('guide');
    if (tabsScrollRef.current) tabsScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });

    if (window.innerWidth < 1024 && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (categoryRefs.current[cat]) {
      categoryRefs.current[cat].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);

    // Smoothly slide the clicked button to the FIRST position (left)
    if (tabRefs.current[tabId] && tabsScrollRef.current) {
      const container = tabsScrollRef.current;
      const button = tabRefs.current[tabId];

      // Calculate how much we need to scroll.
      // button.offsetLeft gives distance from container's left edge (including padding)
      // We subtract 24px (the padding-left value) so it aligns perfectly with the edge visually
      const scrollTarget = button.offsetLeft - 24;

      container.scrollTo({
        left: scrollTarget,
        behavior: 'smooth'
      });
    }
  };

  const handleExploreRedirect = () => {
    const targetLocation = activeCategory === "All" ? "All" : currentDest.region;
    navigate('/tours', { state: { location: targetLocation } });
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-white font-sans selection:bg-[#D9A441] selection:text-black pb-20">
      <SEO pageId="destinations" />

      <div className="relative z-10 pt-20 lg:pt-32 container mx-auto px-4 max-w-[1400px]">

        {/* MAIN VIEW TOGGLE */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#05382c] p-1.5 rounded-full flex gap-1 border border-white/10 shadow-xl">
            <button
              onClick={() => setMainView("destinations")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-colors duration-200 ${mainView === "destinations" ? "bg-[#D9A441] text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              Destinations
            </button>
            <button
              onClick={() => setMainView("all-attractions")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-colors duration-200 ${mainView === "all-attractions" ? "bg-[#D9A441] text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              All Attractions
            </button>
          </div>
        </div>

        {mainView === "destinations" && (
          <>
            {/* CATEGORY BAR */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#05382c] p-2 rounded-2xl border border-white/10 shadow-xl max-w-[95vw] overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      ref={el => categoryRefs.current[cat] = el}
                      onClick={() => handleCategoryChange(cat)}
                      className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-200 border flex-shrink-0 ${activeCategory === cat
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">

              {/* SIDEBAR */}
              <div className="w-full lg:w-[350px] shrink-0 flex flex-col lg:sticky lg:top-32 lg:h-[calc(100vh-120px)]">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#D9A441] mb-5 pl-1 shrink-0">
                  {activeCategory === "All" ? "Select Location" : activeCategory} ({filteredDestinations.length})
                </h2>

                <div className="hidden lg:flex justify-center mb-2 shrink-0">
                  <button
                    onClick={() => scrollSidebar('up')}
                    className="p-2 rounded-full bg-[#05382c] hover:bg-white/10 text-emerald-400 hover:text-[#D9A441] transition-colors border border-white/10"
                  >
                    <FaChevronUp size={14} />
                  </button>
                </div>

                <div
                  ref={sidebarListRef}
                  className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto scrollbar-hide lg:pr-3 pb-4 lg:pb-0 min-h-0 lg:flex-1 scroll-smooth"
                >
                  {filteredDestinations.map(dest => (
                    <div
                      key={dest.id}
                      onClick={() => handleDestChange(dest.id)}
                      className={`flex items-center gap-4 rounded-2xl cursor-pointer transition-colors duration-200 min-w-[280px] lg:min-w-0 p-3 lg:p-4 shrink-0 border-2 ${selectedId === dest.id
                        ? 'bg-[#05382c] border-[#D9A441] shadow-lg'
                        : 'bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10 opacity-70 hover:opacity-100'
                        }`}
                    >
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shadow-md shrink-0 bg-emerald-900">
                        <PremiumImage src={dest.img} alt={dest.name} className="w-full h-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-base lg:text-lg truncate transition-colors duration-200 ${selectedId === dest.id ? 'text-white' : 'text-gray-300'}`}>{dest.name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase truncate font-bold tracking-wider">{dest.region}</p>
                      </div>
                      {selectedId === dest.id && (
                        <div className="w-2 h-2 rounded-full bg-[#D9A441]" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="hidden lg:flex justify-center mt-2 shrink-0">
                  <button
                    onClick={() => scrollSidebar('down')}
                    className="p-2 rounded-full bg-[#05382c] hover:bg-white/10 text-emerald-400 hover:text-[#D9A441] transition-colors border border-white/10"
                  >
                    <FaChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* CONTENT AREA */}
              <div ref={contentRef} className="flex-1 bg-[#022c22] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[800px] flex flex-col relative w-full">

                <div className="relative h-[300px] lg:h-[450px] shrink-0 bg-emerald-900">
                  <PremiumImage
                    src={currentDest.img}
                    alt={currentDest.name}
                    className="absolute inset-0 w-full h-full"
                    priority={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12">
                    <div className="flex gap-2 mb-4">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-sm border border-white/10 text-[#D9A441] text-[10px] font-black uppercase tracking-widest rounded-md">
                        {currentDest.region}
                      </span>
                    </div>
                    <h1 className="text-4xl lg:text-8xl font-black text-white mb-2 tracking-tight drop-shadow-xl">{currentDest.name}</h1>
                    <p className="text-lg lg:text-2xl text-emerald-100 font-light italic">{currentDest.tagline}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 border-y border-white/10 bg-black/20 divide-x divide-white/10">
                  <div className="p-4 lg:p-5 text-center"><p className="text-emerald-200 text-[10px] uppercase font-bold mb-1"><FaMountain className="inline mr-1 text-[#D9A441]" /> Elevation</p><p className="text-white font-bold text-sm lg:text-lg">{currentDest.stats.alt}</p></div>
                  <div className="p-4 lg:p-5 text-center"><p className="text-emerald-200 text-[10px] uppercase font-bold mb-1"><FaCloudSun className="inline mr-1 text-[#D9A441]" /> Weather</p><p className="text-white font-bold text-sm lg:text-lg">{currentDest.stats.temp}</p></div>
                  <div className="p-4 lg:p-5 text-center"><p className="text-emerald-200 text-[10px] uppercase font-bold mb-1"><FaClock className="inline mr-1 text-[#D9A441]" /> Best Time</p><p className="text-white font-bold text-sm lg:text-lg">{currentDest.stats.best}</p></div>
                </div>

                <div className="p-6 lg:p-12 flex-1">

                  {/* --- FIXED TABS CONTAINER --- */}
                  {/* Reduced bottom padding of the wrapper (pb-2) because we added padding inside the scrolling container (py-5) */}
                  <div className="mb-10 border-b border-white/10 pb-2 -mx-6 lg:mx-0 lg:px-0">
                    <div
                      ref={tabsScrollRef}
                      // Increased py-5 to prevent clipping. Removed snap-x.
                      className="flex gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth px-6 py-5 lg:px-0"
                    >
                      <TabButton
                        buttonRef={el => tabRefs.current['guide'] = el}
                        active={activeTab} id="guide" label="Tour Guide" icon={<FaInfoCircle />}
                        onClick={() => handleTabClick('guide')}
                      />
                      <TabButton
                        buttonRef={el => tabRefs.current['attractions'] = el}
                        active={activeTab} id="attractions" label="Attractions" icon={<FaMapMarkerAlt />}
                        onClick={() => handleTabClick('attractions')}
                      />
                      <TabButton
                        buttonRef={el => tabRefs.current['todo'] = el}
                        active={activeTab} id="todo" label="Things To Do" icon={<FaHiking />}
                        onClick={() => handleTabClick('todo')}
                      />
                      <TabButton
                        buttonRef={el => tabRefs.current['reach'] = el}
                        active={activeTab} id="reach" label="How to Reach" icon={<FaPlane />}
                        onClick={() => handleTabClick('reach')}
                      />
                    </div>
                  </div>

                  <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                      {activeTab === 'guide' && (
                        <motion.div key="guide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                          <div>
                            <SectionHeading title={`About ${currentDest.name}`} icon={<FaInfoCircle />} />
                            <p className="text-emerald-50 text-base lg:text-lg leading-loose font-light border-l-4 border-[#D9A441] pl-6 bg-[#05382c] p-6 rounded-r-2xl shadow-inner">{currentDest.overview}</p>
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'attractions' && (
                        <motion.div key="attractions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                          <SectionHeading title="Top Attractions" icon={<FaMapMarkerAlt />} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentDest.attractions.map((attr, i) => (<AttractionCard key={i} attr={attr} />))}
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'todo' && (
                        <motion.div key="todo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                          <SectionHeading title="Experiences" icon={<FaStar />} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentDest.thingsToDo.map((item, i) => (<TodoCard key={i} item={item} />))}
                          </div>
                        </motion.div>
                      )}
                      {activeTab === 'reach' && (
                        <motion.div key="reach" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
                          <SectionHeading title="Connectivity" icon={<FaPlane />} />
                          {[
                            { mode: 'By Air', icon: <FaPlane />, desc: currentDest.howToReach.air, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                            { mode: 'By Train', icon: <FaTrain />, desc: currentDest.howToReach.rail, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                            { mode: 'By Road', icon: <FaCar />, desc: currentDest.howToReach.road, color: 'text-green-400', bg: 'bg-green-500/10' }
                          ].map((item, i) => (
                            <div key={i} className="bg-[#05382c] p-8 rounded-2xl border border-white/10 flex gap-6 items-start">
                              <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} text-2xl shrink-0`}>{item.icon}</div>
                              <div><h4 className="text-xl font-bold text-white mb-2">{item.mode}</h4><p className="text-emerald-50 text-base leading-relaxed">{item.desc}</p></div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-16 pt-8 border-t border-white/10 flex justify-center">
                    <button onClick={handleExploreRedirect} className="group flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#D9A441] to-yellow-500 hover:from-[#c29032] hover:to-yellow-400 text-black font-black text-xl rounded-full shadow-[0_0_40px_rgba(217,164,65,0.3)] transition-transform transform hover:scale-105 active:scale-95">
                      Explore Packages <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {mainView === "all-attractions" && (
          <div className="space-y-24 pb-20">
            {DESTINATION_DATA.map((dest) => (
              <div key={dest.id}>
                <GroupedAttractionRow dest={dest} />
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { 
          -ms-overflow-style: none; 
          scrollbar-width: none; 
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
}