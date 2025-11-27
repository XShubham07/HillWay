// src/pages/TourDetailsPage.jsx
import { useParams } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaBed,
  FaWifi,
  FaShower,
  FaMountain,
  FaUtensils,
  FaCoffee,
  FaConciergeBell,
  FaQuestionCircle,
  FaChevronDown,
  FaUsers
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

  // --- FETCH DATA FROM API ---
  useEffect(() => {
    if(!id) return;
    setLoading(true);
    fetch(`/api/tours/${id}`)
      .then(res => res.json())
      .then(data => {
        if(data.success) setTour(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  /* MOUSE GLOW EFFECT */
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
    <div className="min-h-screen flex items-center justify-center bg-[#102A43] text-white text-xl font-medium tracking-wide">
      Loading Tour Details...
    </div>
  );
  
  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#102A43] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-2">404</h1>
          <p className="text-xl">Tour Not Found</p>
        </div>
      </div>
    );
  }

  const overviewText = tour.description || tour.subtitle || "";

  const faqs = [
    { q: "Is this tour suitable for children?", a: "Yes, this is a family-friendly tour. However, please check the itinerary for any strenuous trekking activities." },
    { q: "What is the cancellation policy?", a: "Cancellations made 7 days prior to the trip attract a 20% deduction. No refunds for cancellations within 24 hours." },
    { q: "Are entry fees included?", a: "Entry fees to monuments and parks are generally not included unless specified in the Inclusions section." },
    { q: "What kind of clothing should I pack?", a: "We recommend comfortable walking shoes and layers. For mountain destinations, heavy woolens are advised." }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-white bg-[#102A43]">
      
      {/* --- STYLES --- */}
      <style>{`
        .force-horizontal-scroll {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          overflow-x: auto !important;
          width: 100% !important;
          -webkit-overflow-scrolling: touch !important;
          scrollbar-width: none;
          -ms-overflow-style: none;
          /* Fix for button clipping */
          padding-top: 16px; 
          padding-bottom: 16px;
        }
        .force-horizontal-scroll::-webkit-scrollbar {
          display: none !important;
        }
        .scroll-item {
          flex: 0 0 auto !important;
          white-space: nowrap !important;
        }
        
        /* Custom Scrollbar for Meal List */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
      `}</style>

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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 lg:pb-12 pt-24"
      >
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT COLUMN (Content) */}
          <div className="w-full lg:w-2/3">

            {/* Hero Image */}
            <motion.img
              src={tour.img}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl border border-white/10 shadow-2xl"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            />

            {/* Title & Subtitle */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-wide text-white drop-shadow-lg mt-8 break-words leading-tight">
              {tour.title}
            </h1>
            <p className="text-base md:text-lg text-gray-300 mt-2 font-light">{tour.subtitle}</p>

            {/* Location & Rating */}
            <div className="flex flex-wrap items-center gap-4 mt-5 text-base md:text-lg">
              <div className="flex items-center gap-2 text-gray-200">
                <FaMapMarkerAlt className="text-[#D9A441]" />
                <span>{tour.location}</span>
              </div>
              <div className="hidden sm:block w-1.5 h-1.5 bg-gray-500 rounded-full" />
              <div className="flex items-center gap-2 text-[#D9A441]">
                <FaStar />
                <span className="text-white font-bold">{tour.rating}</span>
                <span className="text-gray-400 text-sm font-normal ml-1">(4.8/5 Reviews)</span>
              </div>
            </div>

            {/* INFO CARDS (Rectangle Style) */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/10 transition">
                <div className="text-[#D9A441] mb-1 text-xl"><FaRupeeSign /></div>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide font-bold">Starting</p>
                <p className="text-sm sm:text-lg font-bold leading-tight text-white">₹{tour.basePrice}</p>
              </div>
              
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/10 transition">
                <div className="text-[#2E6F95] mb-1 text-xl"><FaCalendarAlt /></div>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide font-bold">Duration</p>
                <p className="text-sm sm:text-lg font-bold leading-tight text-white">{tour.nights}N / {tour.nights + 1}D</p>
              </div>
              
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center backdrop-blur-sm hover:bg-white/10 transition">
                <div className="text-[#1F4F3C] mb-1 text-xl"><FaUsers /></div>
                <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide font-bold">Type</p>
                <p className="text-sm sm:text-lg font-bold leading-tight text-white">Mixed</p>
              </div>
            </div>

            {/* TABS & CONTENT SECTION */}
            <div className="mt-12 w-full relative z-20">
              
              {/* Tab Buttons (Pill Shape + Zoom) */}
              <div className="force-horizontal-scroll gap-3 max-w-full px-1">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "itinerary", label: "Itinerary" },
                  { id: "food", label: "Food & Stay" },
                  { id: "reviews", label: "Reviews" },
                  { id: "faq", label: "FAQ" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`
                      scroll-item px-6 py-2.5 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ease-out border
                      ${activeTab === t.id
                        ? "bg-[#D9A441] text-black border-[#D9A441] shadow-lg scale-105 z-10"
                        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30"
                      }
                    `}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content Panel */}
              <div className="mt-6 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl min-h-[300px]">
                
                {/* OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-8 animate-fade-in">
                    <p className="text-gray-200 text-lg leading-relaxed font-light">{overviewText}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                          <FaCheckCircle /> What's Included
                        </h3>
                        <ul className="space-y-3">
                          {tour.inclusions?.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                              <span className="text-emerald-400 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                          <FaTimesCircle /> What's Excluded
                        </h3>
                        <ul className="space-y-3">
                          {["Personal Expenses", "Airfare / Train Tickets", "Lunch", "Entry Fees to Monuments"].map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                              <span className="text-red-400 mt-0.5">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* ITINERARY */}
                {activeTab === "itinerary" && (
                  <div className="space-y-6">
                    {tour.itinerary?.map((item, i) => (
                      <div key={i} className="flex gap-4 relative group">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-[#2E6F95] flex items-center justify-center font-bold text-white shadow-lg z-10 border-2 border-[#102A43]">
                            {item.day}
                          </div>
                          {i !== tour.itinerary.length - 1 && (
                            <div className="w-0.5 h-full bg-white/10 mt-2 group-hover:bg-white/30 transition-colors" />
                          )}
                        </div>
                        <div className="bg-white/5 p-5 rounded-xl border border-white/10 flex-1 mb-2 hover:bg-white/10 transition duration-300">
                          <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-gray-400 text-sm leading-relaxed">{item.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* FOOD & STAY - DYNAMIC MEALS */}
                {activeTab === "food" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Stay Card */}
                     <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="p-2.5 bg-[#D9A441]/20 rounded-xl text-[#D9A441]"><FaBed size={22} /></div>
                            <h3 className="text-xl font-bold text-white">The Stay</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                           {[
                                { icon: <FaUsers />, text: "Twin Sharing" },
                                { icon: <FaWifi />, text: "Free WiFi" },
                                { icon: <FaShower />, text: "Geyser" },
                                { icon: <FaMountain />, text: "View Rooms" }
                           ].map((am, k) => (
                               <div key={k} className="flex flex-col items-center justify-center bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-black/30 transition cursor-default">
                                   <span className="text-[#D9A441] mb-2 text-xl">{am.icon}</span>
                                   <span className="text-xs text-gray-300 font-medium">{am.text}</span>
                               </div>
                           ))}
                        </div>
                     </div>

                     {/* Dynamic Meal Plan Card */}
                     <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 shadow-lg flex flex-col">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <div className="p-2.5 bg-[#D9A441]/20 rounded-xl text-[#D9A441]"><FaUtensils size={22} /></div>
                            <h3 className="text-xl font-bold text-white">Daily Meal Plan</h3>
                        </div>
                        
                        <div className="space-y-3 overflow-y-auto custom-scroll pr-1 flex-1">
                           {tour.itinerary?.map((day, idx) => (
                               <div key={idx} className="flex items-start gap-3 bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition">
                                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-[#D9A441] shrink-0 border border-white/5">
                                      D{day.day}
                                   </div>
                                   <div className="flex-1">
                                       <p className="font-semibold text-white text-sm mb-1">Day {day.day}</p>
                                       <div className="flex flex-wrap gap-2">
                                           {day.meals && day.meals.length > 0 ? (
                                               day.meals.map((meal, mIdx) => (
                                                   <span key={mIdx} className="text-[10px] font-medium text-gray-300 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                                                       {meal}
                                                   </span>
                                               ))
                                           ) : (
                                               <span className="text-[10px] text-gray-500 italic">No meals included</span>
                                           )}
                                       </div>
                                   </div>
                               </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {/* REVIEWS */}
                {activeTab === "reviews" && (
                  <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/10 dashed">
                    <div className="text-4xl mb-2">🌟</div>
                    <p>No reviews yet. Be the first to share your experience!</p>
                  </div>
                )}

                {/* FAQ */}
                {activeTab === "faq" && (
                  <div className="space-y-4">
                    {faqs.map((faq, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                        <button onClick={() => toggleFaq(i)} className="w-full p-5 flex justify-between items-center text-left hover:bg-white/5 transition duration-200">
                          <span className="font-bold text-white text-sm md:text-base pr-4">{faq.q}</span>
                          <FaChevronDown className={`text-[#D9A441] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden bg-black/20"
                            >
                              <div className="p-5 pt-0">
                                <p className="text-gray-300 text-sm leading-relaxed pt-4 border-t border-white/10">{faq.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Booking Sidebar - Desktop) */}
          <div className="hidden lg:block w-80 shrink-0">
            <BookingSidebar tour={tour} />
          </div>

        </div>
      </motion.div>

      {/* MOBILE FLOATING BOOKING BUTTON */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 px-4 z-[9999] pointer-events-none">
        <div className="pointer-events-auto">
          <BookingSidebar tour={tour} />
        </div>
      </div>

    </div>
  );
}