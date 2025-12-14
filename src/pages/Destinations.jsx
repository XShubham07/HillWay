import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FaMapMarkerAlt, FaStar, FaArrowRight, FaPlane, FaTrain, FaCar, 
  FaCamera, FaHiking, FaInfoCircle, FaMountain, FaClock, FaCloudSun
} from "react-icons/fa";
import { DESTINATION_DATA } from "../data/destinationsData";

const CATEGORIES = ["All", "North Sikkim", "East Sikkim", "West Sikkim", "South Sikkim", "Darjeeling"];

// --- PREMIUM LAZY IMAGE COMPONENT ---
const PremiumImage = memo(({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-emerald-900 ${className}`}>
      <div 
        className={`absolute inset-0 bg-emerald-800 animate-pulse transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} 
      />
      <img 
        src={imgSrc || src}
        alt={alt} 
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out transform ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
      />
    </div>
  );
});
PremiumImage.displayName = "PremiumImage";

// --- SUB-COMPONENTS ---
const TabButton = ({ active, id, label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 whitespace-nowrap flex-shrink-0 ${
      active === id 
        ? 'bg-[#D9A441] text-black shadow-lg shadow-yellow-500/20' 
        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
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
     <div className="h-48 w-full rounded-xl overflow-hidden mb-4 relative shadow-lg">
        <PremiumImage src={attr.img} alt={attr.name} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white font-bold uppercase tracking-wider border border-white/10 shadow-sm">
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
        <div key={idx} className="bg-[#022c22] rounded-2xl overflow-hidden border border-white/10 hover:border-[#D9A441]/50 transition-all group hover:-translate-y-1 duration-300 shadow-xl">
          <div className="h-48 relative">
            <PremiumImage src={attr.img} alt={attr.name} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent" />
            <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
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
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const categoryRefs = useRef({});

  const filteredDestinations = useMemo(() => {
    return DESTINATION_DATA.filter(dest => 
      activeCategory === "All" || dest.region === activeCategory
    );
  }, [activeCategory]);

  useEffect(() => {
    if (filteredDestinations.length > 0 && mainView === "destinations") {
      const exists = filteredDestinations.find(d => d.id === selectedId);
      if (!exists) setSelectedId(filteredDestinations[0].id);
    }
  }, [activeCategory, filteredDestinations, selectedId, mainView]);

  const currentDest = DESTINATION_DATA.find(d => d.id === selectedId) || DESTINATION_DATA[0];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleDestChange = (id) => {
    setSelectedId(id);
    setActiveTab('guide');
    if (window.innerWidth < 1024 && contentRef.current) {
      setTimeout(() => contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  };

  // Handle category change with auto-scroll
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    // Scroll the clicked button into view
    if (categoryRefs.current[cat]) {
      categoryRefs.current[cat].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-white font-sans selection:bg-[#D9A441] selection:text-black pb-20">
      
      <div className="relative z-10 pt-20 lg:pt-32 container mx-auto px-4 max-w-[1400px]">

         {/* MAIN VIEW TOGGLE */}
         <div className="flex justify-center mb-6">
            <div className="bg-white/5 p-1.5 rounded-full flex gap-1 border border-white/10 shadow-2xl">
               <button 
                 onClick={() => setMainView("destinations")}
                 className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${mainView === "destinations" ? "bg-[#D9A441] text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
               >
                 Destinations
               </button>
               <button 
                 onClick={() => setMainView("all-attractions")}
                 className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${mainView === "all-attractions" ? "bg-[#D9A441] text-black shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
               >
                 All Attractions
               </button>
            </div>
         </div>

         {/* VIEW 1: DESTINATIONS DASHBOARD */}
         {mainView === "destinations" && (
           <>
             {/* FIXED CATEGORY BAR - No gap */}
             <div className="sticky top-[64px] z-50 bg-[#022c22] py-4 -mx-4 px-4 mb-6 border-b border-white/10 shadow-2xl">
                <div className="flex gap-3 md:gap-4 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth">
                   {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        ref={el => categoryRefs.current[cat] = el}
                        onClick={() => handleCategoryChange(cat)}
                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border flex-shrink-0 ${
                           activeCategory === cat 
                             ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                             : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                   ))}
                </div>
             </div>

             <div className="flex flex-col lg:flex-row gap-8">
                {/* LIST SIDEBAR */}
                <div 
                  className="w-full lg:w-[350px] shrink-0 flex flex-col h-[auto] lg:h-[calc(100vh-200px)] lg:sticky lg:top-44"
                >
                   <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#D9A441] mb-5 pl-1">
                     {activeCategory === "All" ? "Select Location" : activeCategory} ({filteredDestinations.length})
                   </h2>
                   <div 
                     className="flex lg:flex-col gap-4 overflow-x-auto overflow-y-auto lg:pr-2 pb-4 lg:pb-20 scrollbar-hide custom-scrollbar px-0.5 py-0.5"
                     style={{ overscrollBehavior: 'contain' }}
                   >
                      {filteredDestinations.map(dest => (
                        <div 
                          key={dest.id}
                          onClick={() => handleDestChange(dest.id)}
                          className={`flex items-center gap-4 rounded-2xl cursor-pointer transition-all duration-300 min-w-[280px] lg:min-w-0 p-4 ${
                            selectedId === dest.id 
                              ? 'bg-gradient-to-br from-[#022c22] to-emerald-900/20 border-2 border-[#D9A441] shadow-[0_0_30px_rgba(217,164,65,0.3)]' 
                              : 'bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20 opacity-80 hover:opacity-100'
                          }`}
                        >
                           <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md shrink-0 bg-emerald-900">
                              <PremiumImage src={dest.img} alt={dest.name} className="w-full h-full" />
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className={`font-bold text-lg truncate transition-colors ${selectedId === dest.id ? 'text-white' : 'text-gray-300'}`}>{dest.name}</h4>
                              <p className="text-[10px] text-gray-500 uppercase truncate font-bold tracking-wider">{dest.region}</p>
                           </div>
                           {selectedId === dest.id && (
                             <div className="w-3 h-3 rounded-full bg-[#D9A441] shadow-[0_0_15px_#D9A441] animate-pulse" />
                           )}
                        </div>
                      ))}
                   </div>
                </div>

                {/* CONTENT */}
                <div ref={contentRef} className="flex-1 bg-[#022c22]/80 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[800px] flex flex-col relative">
                   
                   {/* Hero */}
                   <div className="relative h-[350px] lg:h-[450px] shrink-0 bg-emerald-900">
                      <PremiumImage src={currentDest.img} alt={currentDest.name} className="absolute inset-0 w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12">
                         <div className="flex gap-2 mb-4">
                           <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-[#D9A441] text-[10px] font-black uppercase tracking-widest rounded-md">
                             {currentDest.region}
                           </span>
                         </div>
                         <h1 className="text-5xl lg:text-8xl font-black text-white mb-2 tracking-tight drop-shadow-xl">{currentDest.name}</h1>
                         <p className="text-xl lg:text-2xl text-emerald-100 font-light italic">{currentDest.tagline}</p>
                      </div>
                   </div>

                   {/* Stats */}
                   <div className="grid grid-cols-3 border-y border-white/10 bg-black/20 divide-x divide-white/10">
                      <div className="p-5 text-center"><p className="text-emerald-200 text-[10px] uppercase font-bold mb-1"><FaMountain className="inline mr-1 text-[#D9A441]"/> Elevation</p><p className="text-white font-bold text-lg">{currentDest.stats.alt}</p></div>
                      <div className="p-5 text-center"><p className="text-emerald-200 text-[10px] uppercase font-bold mb-1"><FaCloudSun className="inline mr-1 text-[#D9A441]"/> Weather</p><p className="text-white font-bold text-lg">{currentDest.stats.temp}</p></div>
                      <div className="p-5 text-center"><p className="text-emerald-200 text-[10px] uppercase font-bold mb-1"><FaClock className="inline mr-1 text-[#D9A441]"/> Best Time</p><p className="text-white font-bold text-lg">{currentDest.stats.best}</p></div>
                   </div>

                   {/* Tabs Content */}
                   <div className="p-6 lg:p-12 flex-1">
                      {/* HORIZONTAL SCROLLABLE TABS */}
                      <div className="mb-10 border-b border-white/10 pb-6 -mx-6 px-6 lg:mx-0 lg:px-0">
                        <div className="flex gap-3 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth snap-x snap-mandatory">
                          <TabButton active={activeTab} id="guide" label="Tour Guide" icon={<FaInfoCircle />} onClick={() => setActiveTab('guide')} />
                          <TabButton active={activeTab} id="attractions" label="Attractions" icon={<FaMapMarkerAlt />} onClick={() => setActiveTab('attractions')} />
                          <TabButton active={activeTab} id="todo" label="Things To Do" icon={<FaHiking />} onClick={() => setActiveTab('todo')} />
                          <TabButton active={activeTab} id="reach" label="How to Reach" icon={<FaPlane />} onClick={() => setActiveTab('reach')} />
                        </div>
                      </div>

                      <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                          {activeTab === 'guide' && (
                            <motion.div key="guide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                              <div>
                                <SectionHeading title={`About ${currentDest.name}`} icon={<FaInfoCircle />} />
                                <p className="text-emerald-50 text-lg leading-loose font-light border-l-4 border-[#D9A441] pl-6 bg-emerald-900/40 p-6 rounded-r-2xl shadow-inner">{currentDest.overview}</p>
                              </div>
                            </motion.div>
                          )}
                          {activeTab === 'attractions' && (
                            <motion.div key="attractions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                              <SectionHeading title="Top Attractions" icon={<FaMapMarkerAlt />} />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentDest.attractions.map((attr, i) => (<AttractionCard key={i} attr={attr} />))}
                              </div>
                            </motion.div>
                          )}
                          {activeTab === 'todo' && (
                            <motion.div key="todo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                               <SectionHeading title="Experiences" icon={<FaStar />} />
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {currentDest.thingsToDo.map((item, i) => (<TodoCard key={i} item={item} />))}
                               </div>
                            </motion.div>
                          )}
                          {activeTab === 'reach' && (
                            <motion.div key="reach" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                               <SectionHeading title="Connectivity" icon={<FaPlane />} />
                               {[
                                  { mode: 'By Air', icon: <FaPlane />, desc: currentDest.howToReach.air, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                                  { mode: 'By Train', icon: <FaTrain />, desc: currentDest.howToReach.rail, color: 'text-orange-400', bg: 'bg-orange-500/20' },
                                  { mode: 'By Road', icon: <FaCar />, desc: currentDest.howToReach.road, color: 'text-green-400', bg: 'bg-green-500/20' }
                               ].map((item, i) => (
                                 <div key={i} className="bg-[#022c22] p-8 rounded-2xl border border-white/10 flex gap-6 items-start hover:border-white/20 transition-colors">
                                    <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} text-2xl shrink-0`}>{item.icon}</div>
                                    <div><h4 className="text-xl font-bold text-white mb-2">{item.mode}</h4><p className="text-emerald-50 text-base leading-relaxed">{item.desc}</p></div>
                                 </div>
                               ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      
                      <div className="mt-16 pt-8 border-t border-white/10 flex justify-center">
                         <button onClick={() => navigate('/tours')} className="group flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-[#D9A441] to-yellow-500 hover:from-[#c29032] hover:to-yellow-400 text-black font-black text-xl rounded-full shadow-[0_0_40px_rgba(217,164,65,0.3)] transition-all transform hover:scale-105 active:scale-95">
                           Explore Packages <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           </>
         )}

         {/* VIEW 2: ALL ATTRACTIONS */}
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
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
