import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRupeeSign,
  FaCheckCircle, FaTimesCircle, FaBed, FaWifi, FaShower,
  FaMountain, FaUtensils, FaUsers, FaChevronDown, FaShareAlt, FaLink
} from "react-icons/fa";
import { useState, useEffect } from "react";
import BookingSidebar from "../components/BookingSidebar";

// --- FONT STYLES INJECTION ---
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@600;700&display=swap');
  
  .font-montserrat { font-family: 'Montserrat', sans-serif; font-weight: 600; }
  .font-inter { font-family: 'Inter', sans-serif; }
  
  /* Smooth Scroll Behavior */
  html { scroll-behavior: smooth; }
  
  /* Hide Scrollbar */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

export default function TourDetailsPage() {
  const { id } = useParams();
  
  // --- STATE ---
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);

  // --- SCROLL TO TOP ---
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  // --- FETCH DATA ---
  useEffect(() => {
    if(!id) return;
    setLoading(true);
    fetch(`/api/tours/${id}`)
      .then(res => res.json())
      .then(data => {
        if(data.success) {
            const tourData = data.data;
            if (!tourData.images || tourData.images.length === 0) {
                tourData.images = tourData.img ? [tourData.img] : ['/placeholder.jpg'];
            }
            setTour(tourData);
        }
        setTimeout(() => setLoading(false), 500); 
      })
      .catch(err => {
        console.error("Failed to load tour", err);
        setLoading(false);
      });
  }, [id]);

  // --- SLIDESHOW ---
  useEffect(() => {
    if (!tour || !tour.images || tour.images.length <= 1) return;
    const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % tour.images.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [tour]); 

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const overviewText = tour?.description || tour?.subtitle || "";
  const faqs = tour?.faqs?.length > 0 ? tour.faqs : [];

  // --- ROUNDED SKELETON LOADER ---
  const SkeletonLoader = () => (
    <div className="animate-pulse w-full max-w-[1400px] mx-auto px-4 pt-28 pb-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 w-full">
          {/* Image Bone */}
          <div className="h-[28rem] md:h-[32rem] bg-white/5 rounded-[2.5rem] w-full mb-10 shadow-lg" />
          
          {/* Title Bones */}
          <div className="space-y-4 mb-8">
            <div className="h-10 md:h-14 bg-white/5 rounded-full w-3/4" />
            <div className="h-6 bg-white/5 rounded-full w-1/2" />
          </div>

          {/* Stats Grid Bones */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white/5 rounded-[2rem]" />
            ))}
          </div>

          {/* Tabs Bones */}
          <div className="flex gap-4 overflow-hidden mb-8 pl-1">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="h-12 w-32 bg-white/5 rounded-full shrink-0" />
             ))}
          </div>

          {/* Content Block Bone */}
          <div className="h-96 bg-white/5 rounded-[3rem] w-full border border-white/5" />
        </div>

        {/* Sidebar Bone */}
        <div className="hidden lg:block w-[480px] shrink-0">
          <div className="h-[600px] bg-white/5 rounded-[3rem] border border-white/5" />
        </div>
      </div>
    </div>
  );

  // --- 404 STATE ---
  if (!loading && !tour) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#022c22] text-white font-montserrat">
      <h1 className="text-6xl font-bold text-[#D9A441] mb-4">404</h1>
      <p className="text-2xl font-inter font-light text-gray-400">Experience Not Found</p>
      <button onClick={() => window.history.back()} className="mt-8 px-8 py-3 border border-[#D9A441] text-[#D9A441] rounded-full hover:bg-[#D9A441] hover:text-black transition duration-300 font-montserrat">
        Return Home
      </button>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white bg-[#022c22] selection:bg-[#D9A441] selection:text-black">
      <style>{fontStyles}</style>
      
      {/* --- BACKGROUND (Sunrise Gold Depth Effect) --- */}
      <div className="fixed inset-0 z-[-1] bg-[#022c22]">
         {/* Noise Texture */}
         <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none"></div>
         
         {/* The Sunrise Glow (Top Center) */}
         <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-[#D9A441] opacity-15 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
         
         {/* Deep Shadow Gradient (Bottom Up) */}
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#022c22]/40 to-[#022c22] pointer-events-none"></div>
      </div>
      
      {loading ? (
        <SkeletonLoader />
      ) : (
        /* MAIN CONTENT WRAPPER */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-32 lg:pb-12 pt-28"
        >
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* LEFT COLUMN - Content */}
            <div className="flex-1 min-w-0 w-full">

              {/* 1. HERO GALLERY */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 h-[28rem] md:h-[34rem] bg-black/40 will-change-transform">
                  <AnimatePresence mode="wait">
                      <motion.img
                          key={currentImageIndex}
                          src={tour.images[currentImageIndex]}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="eager"
                      />
                  </AnimatePresence>
                  
                  {/* Indicators */}
                  {tour.images.length > 1 && (
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                          {tour.images.map((_, i) => (
                              <button
                                  key={i}
                                  onClick={() => setCurrentImageIndex(i)}
                                  className={`h-1.5 rounded-full transition-all duration-500 shadow-sm backdrop-blur-md ${i === currentImageIndex ? 'bg-[#D9A441] w-8' : 'bg-white/40 w-2 hover:bg-white/80'}`}
                              />
                          ))}
                      </div>
                  )}
                  
                  {/* Navigation */}
                  {tour.images.length > 1 && (
                    <>
                      <button onClick={() => setCurrentImageIndex(prev => (prev - 1 + tour.images.length) % tour.images.length)} className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/10 hover:bg-black/50 text-white/70 hover:text-[#D9A441] rounded-full opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-md border border-white/5 font-inter font-light text-xl">‹</button>
                      <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % tour.images.length)} className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/10 hover:bg-black/50 text-white/70 hover:text-[#D9A441] rounded-full opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-md border border-white/5 font-inter font-light text-xl">›</button>
                    </>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
              </motion.div>

              {/* 2. TITLE & DETAILS */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-12">
                <h1 className="text-4xl md:text-5xl font-montserrat font-semibold tracking-tight text-white drop-shadow-lg leading-[1.1]">
                  {tour.title}
                </h1>
                <p className="text-lg md:text-xl font-inter text-emerald-100/70 mt-4 font-light tracking-wide">{tour.subtitle}</p>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                  <div className="flex items-center gap-2 text-gray-200 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-sm">
                    <FaMapMarkerAlt className="text-[#D9A441]" />
                    <span className="font-inter font-light tracking-wide text-sm">{tour.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-[#D9A441] bg-white/5 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm">
                        <FaStar />
                        <span className="text-white font-inter font-medium">{tour.rating}</span>
                      </div>

                      <button 
                          onClick={handleShare}
                          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-[#D9A441] hover:border-[#D9A441] hover:text-black transition-all duration-300 group"
                      >
                          <FaShareAlt className="text-sm group-hover:scale-110 transition-transform" />
                      </button>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-5 mt-10">
                  {[
                    { icon: <FaRupeeSign />, label: "Starting", value: `₹${tour.basePrice.toLocaleString()}` },
                    { icon: <FaCalendarAlt />, label: "Duration", value: `${tour.nights}N / ${tour.nights + 1}D` },
                    { icon: <FaUsers />, label: "Type", value: "Group Tour" }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 hover:border-[#D9A441]/30 transition duration-300 group"
                    >
                      <span className="text-[#D9A441] mb-3 text-2xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <p className="text-[10px] md:text-xs text-emerald-200/50 uppercase tracking-widest font-montserrat font-semibold mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm md:text-lg font-inter font-medium text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tabs */}
                <div className="mt-16 w-full relative z-20">
                  <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x">
                    {[{ id: "overview", label: "Overview" }, { id: "itinerary", label: "Itinerary" }, { id: "food", label: "Food & Stay" }, { id: "reviews", label: "Reviews" }, { id: "faq", label: "FAQ" }].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`
                          whitespace-nowrap flex-shrink-0 px-8 py-3.5 rounded-full font-montserrat text-sm transition-all duration-300 ease-out border snap-start
                          ${activeTab === t.id
                            ? "bg-[#D9A441] text-black border-[#D9A441] shadow-[0_5px_15px_rgba(217,164,65,0.2)] font-semibold"
                            : "bg-white/5 text-emerald-100/60 border-white/5 hover:bg-white/10 hover:text-white font-medium"
                          }
                        `}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 p-6 md:p-12 bg-black/20 border border-white/5 rounded-[2.5rem] backdrop-blur-md min-h-[300px]">
                    <AnimatePresence mode="wait">
                        
                        {/* OVERVIEW TAB */}
                        {activeTab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                            <div className="prose prose-invert max-w-none">
                               <p className="text-emerald-50/80 text-lg leading-loose font-inter font-light whitespace-pre-wrap">{overviewText}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                              <div className="bg-emerald-900/10 p-8 rounded-[2rem] border border-emerald-500/10">
                                  <h3 className="text-lg font-montserrat font-semibold text-emerald-400 mb-5 flex items-center gap-2"><FaCheckCircle /> Included</h3>
                                  <ul className="space-y-4">
                                  {tour.inclusions?.map((item, i) => (
                                      <li key={i} className="flex items-start gap-3 text-emerald-100/80 text-sm font-inter font-light"><span className="text-emerald-400 mt-0.5">✓</span> {item}</li>
                                  ))}
                                  </ul>
                              </div>
                              <div className="bg-red-900/10 p-8 rounded-[2rem] border border-red-500/10">
                                  <h3 className="text-lg font-montserrat font-semibold text-red-400 mb-5 flex items-center gap-2"><FaTimesCircle /> Excluded</h3>
                                  <ul className="space-y-4">
                                  {["Personal Expenses", "Airfare / Train Tickets", "Lunch", "Entry Fees"].map((item, i) => (
                                      <li key={i} className="flex items-start gap-3 text-gray-400 text-sm font-inter font-light"><span className="text-red-500 mt-0.5">✕</span> {item}</li>
                                  ))}
                                  </ul>
                              </div>
                            </div>
                        </motion.div>
                        )}

                        {/* SLEEK ITINERARY TAB (MOBILE OPTIMIZED) */}
                        {activeTab === "itinerary" && (
                        <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pl-1">
                           {/* Vertical Timeline Container */}
                           <div className="relative border-l border-white/10 ml-2 md:ml-4 space-y-10 pb-4">
                              {tour.itinerary?.map((item, i) => (
                              <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{delay: i * 0.1}} 
                                className="relative pl-8 md:pl-12"
                              >
                                  {/* Timeline Dot with Glow */}
                                  <div className="absolute -left-[7px] top-1.5 flex items-center justify-center w-[15px] h-[15px] rounded-full bg-[#022c22] border-2 border-[#D9A441] shadow-[0_0_12px_rgba(217,164,65,0.6)] z-10"></div>
                                  
                                  {/* Content */}
                                  <div className="flex flex-col gap-3">
                                      {/* Header */}
                                      <div className="flex flex-wrap items-baseline gap-3">
                                          <span className="text-[#D9A441] font-inter font-medium text-lg">
                                            Day {item.day}
                                          </span>
                                          <h3 className="text-lg md:text-xl font-montserrat font-semibold text-white leading-tight">
                                            {item.title}
                                          </h3>
                                      </div>

                                      {/* Details Card */}
                                      <div className="mt-1 text-emerald-100/70 text-sm md:text-base font-inter font-light leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition duration-300">
                                          <ul className="space-y-3">
                                            {item.details?.split('\n').filter(l => l.trim()).map((s, idx) => (
                                              <li key={idx} className="flex items-start gap-3">
                                                <span className="text-[#D9A441] mt-2 text-[5px] shrink-0 opacity-70">●</span>
                                                <span>{s.trim()}</span>
                                              </li>
                                            ))}
                                          </ul>
                                      </div>
                                  </div>
                              </motion.div>
                              ))}
                           </div>
                        </motion.div>
                        )}
                        
                        {/* FOOD TAB */}
                        {activeTab === "food" && (
                        <motion.div key="food" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-montserrat font-semibold text-[#D9A441] mb-6 flex items-center gap-3">
                                    <FaBed className="text-xl" /> Premium Accommodation
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[{ icon: <FaUsers />, text: "Twin Sharing" }, { icon: <FaWifi />, text: "Free WiFi" }, { icon: <FaShower />, text: "Hot Water" }, { icon: <FaMountain />, text: "Scenic View" }].map((am, k) => (
                                        <div key={k} className="flex flex-col items-center justify-center bg-white/5 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                                            <span className="text-[#D9A441] mb-3 text-2xl">{am.icon}</span>
                                            <span className="text-sm text-gray-200 font-inter font-light">{am.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-montserrat font-semibold text-[#D9A441] mb-6 flex items-center gap-3">
                                    <FaUtensils className="text-xl" /> Culinary Experience
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tour.itinerary?.map((day, idx) => (
                                        <div key={idx} className="flex items-center gap-5 bg-white/5 p-5 rounded-[2rem] border border-white/5">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-900/30 flex items-center justify-center text-sm font-bold text-[#D9A441] shrink-0 border border-[#D9A441]/20 font-inter">
                                                D{day.day}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap gap-2">
                                                    {day.meals?.length > 0 ? (
                                                        day.meals.map((m, i) => (
                                                            <span key={i} className="text-xs font-medium text-black bg-[#D9A441] px-4 py-1.5 rounded-full tracking-wide font-montserrat">
                                                                {m}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-500 italic font-inter font-light">No meals included</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTab === "reviews" && (
                        <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            {tour.reviews?.length > 0 ? tour.reviews.map((r, i) => (
                                <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center text-[#D9A441] font-inter font-bold text-lg border border-white/10">{r.name.charAt(0)}</div>
                                            <div>
                                                <h4 className="font-semibold text-white text-base font-montserrat">{r.name}</h4>
                                                <div className="flex text-[#D9A441] text-xs mt-1 gap-0.5">{[...Array(5)].map((_, k) => <FaStar key={k} className={k < r.rating ? "text-[#D9A441]" : "text-gray-700"} />)}</div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 font-inter font-light">{r.date}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed pl-16 font-inter font-light italic">"{r.text}"</p>
                                </div>
                            )) : <div className="text-center py-20 text-gray-400 bg-white/5 rounded-[2rem] border border-white/10 border-dashed font-inter font-light"><p>No reviews yet.</p></div>}
                        </motion.div>
                        )}

                        {/* FAQ TAB */}
                        {activeTab === "faq" && (
                        <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                            {faqs.map((f, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-[1.5rem] overflow-hidden hover:bg-white/10 transition">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 flex justify-between items-center text-left focus:outline-none">
                                    <span className="font-semibold text-emerald-50 text-sm md:text-base pr-4 font-montserrat">{f.q}</span>
                                    <FaChevronDown className={`text-[#D9A441] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/20">
                                            <div className="p-6 pt-0"><p className="text-emerald-100/70 text-sm leading-relaxed pt-4 border-t border-white/10 font-inter font-light">{f.a}</p></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            ))}
                        </motion.div>
                        )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* 3. SIDEBAR */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="hidden lg:block w-[480px] shrink-0 sticky top-28 h-fit">
              <BookingSidebar tour={tour} />
            </motion.div>

          </div>
        </motion.div>
      )}

      {/* MOBILE FLOATING BUTTON */}
      {!loading && (
          <div className="lg:hidden fixed bottom-4 left-0 right-0 px-4 z-[9999] pointer-events-none">
            <div className="pointer-events-auto"><BookingSidebar tour={tour} /></div>
          </div>
      )}

      {/* --- SHARE TOAST --- */}
      <AnimatePresence>
        {showShareToast && (
            <motion.div 
                initial={{ opacity: 0, y: 50 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full border border-[#D9A441]/50 shadow-[0_0_20px_rgba(217,164,65,0.3)] flex items-center gap-3 font-montserrat"
            >
                <FaLink className="text-[#D9A441]" />
                <span className="font-semibold text-sm">Link Copied!</span>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}