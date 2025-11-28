import { useParams } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRupeeSign,
  FaCheckCircle, FaTimesCircle, FaBed, FaWifi, FaShower,
  FaMountain, FaUtensils, FaUsers, FaChevronDown
} from "react-icons/fa";
import { useState, useEffect } from "react";
import BookingSidebar from "../components/BookingSidebar";

export default function TourDetailsPage() {
  const { id } = useParams();
  
  // --- STATE ---
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    if(!id) return;
    setLoading(true);
    fetch(`/api/tours/${id}`)
      .then(res => res.json())
      .then(data => {
        if(data.success) {
            // Ensure images array exists and is populated
            const tourData = data.data;
            if (!tourData.images || tourData.images.length === 0) {
                tourData.images = tourData.img ? [tourData.img] : ['/placeholder.jpg'];
            }
            setTour(tourData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load tour", err);
        setLoading(false);
      });
  }, [id]);

  // --- AUTOMATIC SLIDESHOW ---
  useEffect(() => {
    // Only run if we have more than 1 image
    if (!tour || !tour.images || tour.images.length <= 1) return;
    
    const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % tour.images.length);
    }, 3500); 
    
    return () => clearInterval(interval);
  }, [tour]); 

  // --- MOUSE GLOW EFFECT ---
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 150 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#102A43] text-white text-xl font-medium tracking-wide animate-pulse">
      Loading Tour Details...
    </div>
  );
  
  if (!tour) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#102A43] text-white">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-2xl">Tour Not Found</p>
      <button onClick={() => window.history.back()} className="mt-8 px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition">
        Go Back
      </button>
    </div>
  );

  const overviewText = tour.description || tour.subtitle || "";
  const faqs = tour.faqs?.length > 0 ? tour.faqs : [];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white bg-[#102A43]">
      
      {/* BACKGROUND ANIMATION */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#102A43] via-[#1F4F3C] to-[#2E6F95]">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ x: [-120, 120] }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          style={{ backgroundImage: "url('/clouds.webp')", backgroundSize: "cover" }}
        />
        <motion.div
          className="fixed inset-0 -z-10 opacity-40"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            background: "radial-gradient(circle, rgba(255,255,255,0.09), transparent 70%)"
          }}
        />
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-32 lg:pb-12 pt-24"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT COLUMN - Content */}
          <div className="flex-1 min-w-0 w-full">

            {/* HERO GALLERY SLIDESHOW */}
            <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-white/10 h-64 sm:h-80 md:h-96 bg-black/40">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImageIndex}
                        src={tour.images[currentImageIndex]}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>
                
                {/* Slideshow Indicators */}
                {tour.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {tour.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all shadow-sm ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                )}
                
                {/* Navigation Arrows */}
                {tour.images.length > 1 && (
                  <>
                    <button onClick={() => setCurrentImageIndex(prev => (prev - 1 + tour.images.length) % tour.images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition">‹</button>
                    <button onClick={() => setCurrentImageIndex(prev => (prev + 1) % tour.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition">›</button>
                  </>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* TITLE & METADATA */}
            <div className="mt-8">
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide text-white drop-shadow-lg leading-tight">
                {tour.title}
              </h1>
              <p className="text-base md:text-lg text-gray-300 mt-2 font-light">{tour.subtitle}</p>

              <div className="flex flex-wrap items-center gap-4 mt-5 text-base md:text-lg">
                <div className="flex items-center gap-2 text-gray-200 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <FaMapMarkerAlt className="text-[#D9A441]" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-2 text-[#D9A441] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <FaStar />
                  <span className="text-white font-bold">{tour.rating}</span>
                </div>
              </div>
            </div>

            {/* INFO CARDS */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-8">
              <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 transition">
                <FaRupeeSign className="text-[#D9A441] mb-2 text-xl sm:text-2xl" />
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Starting</p>
                <p className="text-sm sm:text-xl font-bold leading-tight text-white">₹{tour.basePrice.toLocaleString()}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 transition">
                <FaCalendarAlt className="text-[#2E6F95] mb-2 text-xl sm:text-2xl" />
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Duration</p>
                <p className="text-sm sm:text-xl font-bold leading-tight text-white">{tour.nights}N / {tour.nights + 1}D</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 transition">
                <FaUsers className="text-[#1F4F3C] mb-2 text-xl sm:text-2xl" />
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Type</p>
                <p className="text-sm sm:text-xl font-bold leading-tight text-white">Group</p>
              </div>
            </div>

            {/* TABS */}
            <div className="mt-12 w-full relative z-20">
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x w-full">
                {[{ id: "overview", label: "Overview" }, { id: "itinerary", label: "Itinerary" }, { id: "food", label: "Food & Stay" }, { id: "reviews", label: "Reviews" }, { id: "faq", label: "FAQ" }].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`
                      whitespace-nowrap flex-shrink-0 px-6 py-2.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ease-out border snap-start
                      ${activeTab === t.id
                        ? "bg-[#D9A441] text-black border-[#D9A441] shadow-[0_0_20px_rgba(217,164,65,0.4)] scale-105 z-10"
                        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30"
                      }
                    `}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-md shadow-2xl min-h-[300px]">
                {/* TAB CONTENT */}
                {activeTab === "overview" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="prose prose-invert max-w-none">
                       <p className="text-gray-200 text-lg leading-relaxed font-light whitespace-pre-wrap">{overviewText}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-500/20">
                        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><FaCheckCircle /> Included</h3>
                        <ul className="space-y-3">
                          {tour.inclusions?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-emerald-500 mt-1">✓</span> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-900/20 p-6 rounded-2xl border border-red-500/20">
                        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2"><FaTimesCircle /> Excluded</h3>
                        <ul className="space-y-3">
                          {["Personal Expenses", "Airfare / Train Tickets", "Lunch", "Entry Fees"].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm"><span className="text-red-500 mt-1">✕</span> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "itinerary" && (
                  <div className="space-y-8 pl-1 md:pl-2">
                    {tour.itinerary?.map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 md:gap-6 relative group">
                        <div className="flex flex-col items-center">
                          <div className="w-12 md:w-16 h-12 md:h-8 rounded-full md:rounded-full bg-[#1F4F3C] flex items-center justify-center font-bold text-white text-[10px] md:text-xs shadow-[0_0_15px_rgba(31,79,60,0.6)] z-10 border-2 border-[#D9A441] p-1 text-center leading-tight">
                             <span className="md:hidden">Day<br/>{item.day}</span>
                             <span className="hidden md:inline">Day {item.day}</span>
                          </div>
                          {i !== tour.itinerary.length - 1 && <div className="w-0.5 h-full bg-gradient-to-b from-[#D9A441] to-transparent opacity-30 mt-1 group-hover:opacity-60 transition" />}
                        </div>
                        <div className="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 flex-1 mb-2 hover:bg-white/10 transition duration-300 shadow-lg">
                          <h3 className="text-lg md:text-xl font-bold text-white mb-3">{item.title}</h3>
                          <ul className="list-disc pl-4 space-y-2 marker:text-[#D9A441]">
                            {item.details?.split('\n').filter(l => l.trim()).map((s, idx) => <li key={idx} className="text-gray-300 text-sm leading-relaxed">{s.trim()}</li>)}
                          </ul>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {activeTab === "food" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 shadow-lg h-full">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="p-2.5 bg-[#D9A441]/20 rounded-xl text-[#D9A441]"><FaBed size={22} /></div>
                            <h3 className="text-xl font-bold text-white">The Stay</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           {[{ icon: <FaUsers />, text: "Twin Sharing" }, { icon: <FaWifi />, text: "Free WiFi" }, { icon: <FaShower />, text: "Geyser" }, { icon: <FaMountain />, text: "View Rooms" }].map((am, k) => (
                               <div key={k} className="flex flex-col items-center justify-center bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-black/30 transition cursor-default">
                                   <span className="text-[#D9A441] mb-2 text-xl">{am.icon}</span>
                                   <span className="text-xs text-gray-300 font-medium">{am.text}</span>
                               </div>
                           ))}
                        </div>
                     </motion.div>
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 shadow-lg h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="p-2.5 bg-[#D9A441]/20 rounded-xl text-[#D9A441]"><FaUtensils size={22} /></div>
                            <h3 className="text-xl font-bold text-white">Daily Meal Plan</h3>
                        </div>
                        <div className="space-y-3 overflow-y-auto custom-scroll pr-2 flex-1 max-h-[300px]">
                           {tour.itinerary?.map((day, idx) => (
                               <div key={idx} className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/20 transition">
                                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#D9A441] shrink-0">D{day.day}</div>
                                   <div className="flex-1">
                                       <p className="font-semibold text-white text-sm mb-2">{day.title}</p>
                                       <div className="flex flex-wrap gap-2">{day.meals?.map((m, i) => <span key={i} className="text-[10px] font-bold text-black bg-[#D9A441] px-2 py-1 rounded-md">{m}</span>)}</div>
                                   </div>
                               </div>
                           ))}
                        </div>
                     </motion.div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {tour.reviews?.length > 0 ? tour.reviews.map((r, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 p-5 rounded-2xl border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">{r.name.charAt(0)}</div>
                                    <div><h4 className="font-bold text-white text-sm">{r.name}</h4><div className="flex text-yellow-400 text-xs mt-0.5">{[...Array(5)].map((_, k) => <FaStar key={k} className={k < r.rating ? "text-yellow-400" : "text-gray-600"} />)}</div></div>
                                </div>
                                <span className="text-xs text-gray-500">{r.date}</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed mt-3 pl-13">"{r.text}"</p>
                        </motion.div>
                    )) : <div className="text-center py-16 text-gray-400 bg-white/5 rounded-2xl border border-white/10 border-dashed"><p>No reviews yet.</p></div>}
                  </div>
                )}

                {activeTab === "faq" && (
                  <div className="space-y-4">
                    {faqs.map((f, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition hover:bg-white/10">
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-5 flex justify-between items-center text-left focus:outline-none"><span className="font-bold text-white text-sm md:text-base pr-4">{f.q}</span><FaChevronDown className={`text-[#D9A441] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} /></button>
                        <AnimatePresence>{openFaq === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/20"><div className="p-5 pt-0"><p className="text-gray-300 text-sm leading-relaxed pt-4 border-t border-white/10">{f.a}</p></div></motion.div>)}</AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - SIDEBAR */}
          <div className="hidden lg:block w-[420px] shrink-0">
            <BookingSidebar tour={tour} />
          </div>

        </div>
      </motion.div>

      {/* MOBILE FLOATING BUTTON */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 px-4 z-[9999] pointer-events-none">
        <div className="pointer-events-auto"><BookingSidebar tour={tour} /></div>
      </div>

      <style>{`
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>

    </div>
  );
}