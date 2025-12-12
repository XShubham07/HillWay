// src/pages/TourDetailsPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRupeeSign,
  FaCheckCircle, FaTimesCircle, FaBed, FaWifi, FaShower,
  FaMountain, FaUtensils, FaUsers, FaChevronDown, FaShareAlt,
  FaPenNib, FaEnvelope, FaMobileAlt, FaExclamationTriangle, FaPlus, FaMinus
} from "react-icons/fa";
import { useState, useEffect, memo, useMemo, useRef } from "react";
import BookingSidebar from "../components/BookingSidebar";

// --- GLOBAL STYLES & SCROLL OPTIMIZATION ---
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Montserrat:wght@600;700&display=swap');
  
  .font-montserrat { font-family: 'Montserrat', sans-serif; font-weight: 600; }
  .font-inter { font-family: 'Inter', sans-serif; }
  
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  /* Mobile Performance Fixes */
  .gpu-layer {
    transform: translate3d(0,0,0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
`;

// --- MEMOIZED BACKGROUND (Optimized for Mobile) ---
const Background = memo(() => (
  <div className="fixed top-0 left-0 w-full h-[120vh] z-[-1] bg-[#022c22] pointer-events-none gpu-layer">
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[40%] bg-[#D9A441] opacity-10 blur-[60px] md:blur-[100px] rounded-full mix-blend-screen"></div>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#022c22]/60 to-[#022c22]"></div>
  </div>
));
Background.displayName = "Background";

// --- ITINERARY ACCORDION ITEM (Mobile) ---
const ItineraryItem = ({ item, isOpen, onClick }) => {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-4 transition-colors hover:bg-white/10">
      <button
        onClick={onClick}
        className="w-full p-5 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-4">
          <div className="bg-[#D9A441] text-black font-bold text-xs px-2 py-1 rounded">Day {item.day}</div>
          <h3 className="font-montserrat font-semibold text-white text-sm md:text-base pr-2">{item.title}</h3>
        </div>
        <div className="text-[#D9A441] text-sm">
          {isOpen ? <FaMinus /> : <FaPlus />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-white/5">
              <ul className="space-y-3 mt-3">
                {item.details?.split('\n').filter(l => l.trim()).map((s, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 font-inter font-light leading-relaxed">
                    <span className="text-[#D9A441] mt-1.5 text-[6px] shrink-0 opacity-70">●</span>
                    <span>{s.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MEMOIZED SIDEBAR WRAPPER ---
const MemoizedSidebar = memo(({ tour }) => <BookingSidebar tour={tour} />);
MemoizedSidebar.displayName = "MemoizedSidebar";

export default function TourDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // References for Smooth Scrolling
  const contentRef = useRef(null);
  const tabsContainerRef = useRef(null);

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareToast, setShowShareToast] = useState(false);
  const [globalNotes, setGlobalNotes] = useState({ stayNote: '', foodNote: '' });

  // Itinerary Accordion State (Mobile)
  const [openDay, setOpenDay] = useState(0);

  // Review System State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewInput, setReviewInput] = useState({ title: '', name: '', email: '', mobile: '', rating: 5, text: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Duplicate Review State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateReviewData, setDuplicateReviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- 1. SCROLL TO TOP ---
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [id]);

  // --- 2. OPTIMIZED DATA FETCHING (Parallel & Non-blocking) ---
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const controller = new AbortController();

    // Fetch Tour (Critical - sets loading to false immediately when done)
    fetch(`/api/tours/${id}`, { signal: controller.signal })
      .then(res => res.json())
      .then(tourData => {
        if (tourData.success) {
          const t = tourData.data;
          if (!t.images || t.images.length === 0) t.images = t.img ? [t.img] : ['/placeholder.jpg'];
          setTour(t);
          setLoading(false); // Stop loading immediately
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') setLoading(false);
      });

    // Fetch Pricing (Background - updates state silently)
    fetch('/api/pricing', { signal: controller.signal })
      .then(res => res.json())
      .then(pricingData => {
        if (pricingData.success && pricingData.data) {
          setGlobalNotes({
            stayNote: pricingData.data.stayNote || '',
            foodNote: pricingData.data.foodNote || ''
          });
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [id]);

  // --- 3. SLIDESHOW (SLIDE ANIMATION) ---
  useEffect(() => {
    if (!tour || !tour.images || tour.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % tour.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tour]);

  // --- 4. SMART TAB HANDLER ---
  const handleTabChange = (tId, e) => {
    setActiveTab(tId);

    // 1. Smoothly center the clicked tab in the horizontal list
    e.target.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'center' 
    });

    // 2. On Mobile: Scroll page slightly to focus content
    if (window.innerWidth < 1024 && contentRef.current) {
        const yOffset = -140; // Adjust for sticky header
        const y = contentRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
        
        if (window.lenis) {
            window.lenis.scrollTo(y, { duration: 1.2 });
        } else {
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  // --- 5. REVIEW LOGIC ---
  const handleEditReview = () => {
    if (duplicateReviewData) {
      setReviewInput({ ...duplicateReviewData, rating: duplicateReviewData.rating || 5, text: duplicateReviewData.text || "" });
      setIsEditing(true); setShowDuplicateModal(false); setShowReviewForm(true);
    }
  };
  const handleCancelReview = () => {
    setShowDuplicateModal(false); setDuplicateReviewData(null); setReviewInput({ title: '', name: '', email: '', mobile: '', rating: 5, text: '' }); setIsEditing(false);
  };
  const handleSubmitReview = async (e) => {
    e.preventDefault(); setSubmittingReview(true);
    if (!/^[6-9]\d{9}$/.test(reviewInput.mobile)) { alert("Please enter a valid 10-digit Indian mobile number."); setSubmittingReview(false); return; }

    if (!isEditing) {
      const existing = tour.reviews?.find(r => r.mobile === reviewInput.mobile);
      if (existing) { setDuplicateReviewData(existing); setShowDuplicateModal(true); setSubmittingReview(false); return; }
    }

    try {
      if (isEditing && duplicateReviewData?._id) await fetch(`/api/reviews?tourId=${tour._id}&reviewId=${duplicateReviewData._id}`, { method: 'DELETE' });
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tourId: tour._id, ...reviewInput }) });
      const data = await res.json();
      if (data.success) {
        setTour(prev => ({ ...prev, reviews: data.data })); setShowReviewForm(false); setReviewInput({ title: '', name: '', email: '', mobile: '', rating: 5, text: '' }); setIsEditing(false); setDuplicateReviewData(null); alert(isEditing ? "Review updated!" : "Review submitted!");
      } else { alert("Failed to post review."); }
    } catch (err) { alert("Error connecting."); }
    setSubmittingReview(false);
  };

  const overviewText = useMemo(() => tour?.description || tour?.subtitle || "", [tour]);
  const faqs = useMemo(() => tour?.faqs?.length > 0 ? tour.faqs : [], [tour]);

  // --- 6. HELPER: PARSE NOTES TO BULLETS ---
  const renderNotesWithBullets = (note) => {
    if (!note) return null;
    const lines = note.split('\n').filter(line => line.trim() !== '');
    return (
      <ul className="space-y-2 mt-2">
        {lines.map((line, index) => (
          <li key={index} className="flex items-start gap-2 text-red-300/90 text-sm font-inter italic">
            <span className="text-red-400 mt-1.5 text-[6px] shrink-0 opacity-80">●</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    );
  };

  // --- SKELETON LOADER ---
  const SkeletonLoader = () => (
    <div className="animate-pulse w-full max-w-[1400px] mx-auto px-4 pt-28 pb-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 w-full">
          <div className="h-[28rem] md:h-[32rem] bg-white/5 rounded-[2.5rem] w-full mb-10" />
          <div className="h-10 bg-white/5 rounded-full w-3/4 mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-10"> {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white/5 rounded-[2rem]" />)} </div>
        </div>
        <div className="hidden lg:block w-[480px] shrink-0"><div className="h-[600px] bg-white/5 rounded-[3rem]" /></div>
      </div>
    </div>
  );

  if (!loading && !tour) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#022c22] text-white"><h1 className="text-6xl font-bold text-[#D9A441]">404</h1><button onClick={() => window.history.back()} className="mt-8 px-8 py-3 border border-[#D9A441] text-[#D9A441] rounded-full">Return Home</button></div>;

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden text-white bg-[#022c22] selection:bg-[#D9A441] selection:text-black">
      <style>{fontStyles}</style>
      <Background />

      {/* DUPLICATE MODAL */}
      <AnimatePresence>
        {showDuplicateModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-400 text-3xl"><FaExclamationTriangle /></div>
              <h3 className="text-xl font-bold text-white mb-2">Review Exists</h3>
              <p className="text-gray-400 text-sm mb-8">You have already submitted a review. Edit instead?</p>
              <div className="flex gap-3"><button onClick={handleCancelReview} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-bold">Cancel</button><button onClick={handleEditReview} className="flex-1 py-3 rounded-xl bg-[#D9A441] text-black font-bold">Edit</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? <SkeletonLoader /> : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-32 lg:pb-12 pt-28">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* LEFT CONTENT */}
            <div className="flex-1 min-w-0 w-full">

              {/* 1. HERO GALLERY (SLIDE ANIMATION) */}
              <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/50 border border-white/10 h-[28rem] md:h-[34rem] bg-black/40 transform-gpu will-change-transform">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={currentImageIndex}
                    src={tour.images[currentImageIndex]}
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                </AnimatePresence>
                {/* Indicators */}
                {tour.images.length > 1 && (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {tour.images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImageIndex(i)} className={`h-1.5 rounded-full transition-all duration-500 shadow-sm backdrop-blur-md ${i === currentImageIndex ? 'bg-[#D9A441] w-8' : 'bg-white/40 w-2 hover:bg-white/80'}`} />
                    ))}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 pointer-events-none" />
              </div>

              {/* 2. TITLE */}
              <div className="mt-12">
                <h1 className="text-4xl md:text-5xl font-montserrat font-semibold tracking-tight text-white drop-shadow-lg leading-[1.1]">{tour.title}</h1>
                <p className="text-lg md:text-xl font-inter text-emerald-100/70 mt-4 font-light tracking-wide">{tour.subtitle}</p>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                  <div className="flex items-center gap-2 text-gray-200 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-sm"><FaMapMarkerAlt className="text-[#D9A441]" /><span className="font-inter font-light tracking-wide text-sm">{tour.location}</span></div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-[#D9A441] bg-white/5 px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-sm"><FaStar /><span className="text-white font-inter font-medium">{tour.rating}</span></div>
                    <button onClick={handleShare} className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-[#D9A441] hover:border-[#D9A441] hover:text-black transition-all duration-300 group"><FaShareAlt className="text-sm group-hover:scale-110 transition-transform" /></button>
                  </div>
                </div>

                {/* INFO CARDS */}
                <div className="grid grid-cols-3 gap-5 mt-10">
                  {[{ icon: <FaRupeeSign />, label: "Starting", value: `₹${tour.basePrice.toLocaleString()}` }, { icon: <FaCalendarAlt />, label: "Duration", value: `${tour.nights}N / ${tour.nights + 1}D` }, { icon: <FaUsers />, label: "Type", value: "Group Tour" }].map((item, index) => (
                    <div key={index} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center backdrop-blur-md hover:bg-white/10 transition duration-300 group">
                      <span className="text-[#D9A441] mb-3 text-2xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                      <p className="text-[10px] md:text-xs text-emerald-200/50 uppercase tracking-widest font-montserrat font-semibold mb-1">{item.label}</p>
                      <p className="text-sm md:text-lg font-inter font-medium text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* TABS CONTAINER */}
                <div className="mt-16 w-full relative z-20">
                  <div ref={tabsContainerRef} className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide snap-x">
                    {[{ id: "overview", label: "Overview" }, { id: "itinerary", label: "Itinerary" }, { id: "food", label: "Food & Stay" }, { id: "reviews", label: "Reviews" }, { id: "faq", label: "FAQ" }].map((t) => (
                      <button 
                        key={t.id} 
                        onClick={(e) => handleTabChange(t.id, e)} 
                        className={`whitespace-nowrap flex-shrink-0 px-8 py-3.5 rounded-full font-montserrat text-sm transition-all duration-300 ease-out border snap-start ${activeTab === t.id ? "bg-[#D9A441] text-black border-[#D9A441] shadow-[0_5px_15px_rgba(217,164,65,0.2)] font-semibold" : "bg-white/5 text-emerald-100/60 border-white/5 hover:bg-white/10 hover:text-white font-medium"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* TAB CONTENT AREA */}
                  <div ref={contentRef} className="mt-4 p-6 md:p-12 bg-black/20 border border-white/5 rounded-[2.5rem] backdrop-blur-md min-h-[300px]">
                    <AnimatePresence mode="wait">
                      {activeTab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                          <div className="prose prose-invert max-w-none"><p className="text-emerald-50/80 text-lg leading-loose font-inter font-light whitespace-pre-wrap">{overviewText}</p></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                            <div className="bg-emerald-900/10 p-8 rounded-[2rem] border border-emerald-500/10"><h3 className="text-lg font-montserrat font-semibold text-emerald-400 mb-5 flex items-center gap-2"><FaCheckCircle /> Included</h3><ul className="space-y-4">{tour.inclusions?.map((item, i) => (<li key={i} className="flex items-start gap-3 text-emerald-100/80 text-sm font-inter font-light"><span className="text-emerald-400 mt-0.5">✓</span> {item}</li>))}</ul></div>
                            <div className="bg-red-900/10 p-8 rounded-[2rem] border border-red-500/10"><h3 className="text-lg font-montserrat font-semibold text-red-400 mb-5 flex items-center gap-2"><FaTimesCircle /> Excluded</h3><ul className="space-y-4">{["Personal Expenses", "Airfare / Train Tickets", "Lunch", "Entry Fees"].map((item, i) => (<li key={i} className="flex items-start gap-3 text-gray-400 text-sm font-inter font-light"><span className="text-red-500 mt-0.5">✕</span> {item}</li>))}</ul></div>
                          </div>
                        </motion.div>
                      )}

                      {/* ITINERARY TAB */}
                      {activeTab === "itinerary" && (
                        <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pl-1">
                          {/* MOBILE VIEW */}
                          <div className="block md:hidden space-y-2">
                            {tour.itinerary?.map((item, i) => (
                              <ItineraryItem
                                key={i}
                                item={item}
                                isOpen={openDay === i}
                                onClick={() => setOpenDay(openDay === i ? -1 : i)}
                              />
                            ))}
                          </div>
                          {/* DESKTOP VIEW */}
                          <div className="hidden md:block relative border-l border-white/10 ml-2 md:ml-4 space-y-10 pb-4">
                            {tour.itinerary?.map((item, i) => (
                              <div key={i} className="relative pl-8 md:pl-12">
                                <div className="absolute -left-[7px] top-1.5 flex items-center justify-center w-[15px] h-[15px] rounded-full bg-[#022c22] border-2 border-[#D9A441] shadow-[0_0_12px_rgba(217,164,65,0.6)] z-10"></div>
                                <div className="flex flex-col gap-3">
                                  <div className="flex flex-wrap items-baseline gap-3"><span className="text-[#D9A441] font-inter font-medium text-lg">Day {item.day}</span><h3 className="text-lg md:text-xl font-montserrat font-semibold text-white leading-tight">{item.title}</h3></div>
                                  <div className="mt-1 text-emerald-100/70 text-sm md:text-base font-inter font-light leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition duration-300">
                                    <ul className="space-y-3">{item.details?.split('\n').filter(l => l.trim()).map((s, idx) => (<li key={idx} className="flex items-start gap-3"><span className="text-[#D9A441] mt-2 text-[5px] shrink-0 opacity-70">●</span><span>{s.trim()}</span></li>))}</ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* FOOD & STAY */}
                      {activeTab === "food" && (
                        <motion.div key="food" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                          <div>
                            <h3 className="text-2xl font-montserrat font-semibold text-[#D9A441] mb-6 flex items-center gap-3"><FaBed className="text-xl" /> Accommodation</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[{ icon: <FaUsers />, text: "Twin Sharing" }, { icon: <FaWifi />, text: "Free WiFi" }, { icon: <FaShower />, text: "Hot Water" }, { icon: <FaMountain />, text: "Scenic View" }].map((am, k) => (<div key={k} className="flex flex-col items-center justify-center bg-white/5 p-6 rounded-[2rem] border border-white/5 backdrop-blur-sm"><span className="text-[#D9A441] mb-3 text-2xl">{am.icon}</span><span className="text-sm text-gray-200 font-inter font-light">{am.text}</span></div>))}</div>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="flex flex-col">
                              <h3 className="text-xl font-montserrat font-semibold text-white mb-6 flex items-center gap-3"><FaBed className="text-[#D9A441]" /> Stay</h3>
                              <div className="space-y-4">{tour.itinerary?.map((day, idx) => (<div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition"><div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center text-sm font-bold text-purple-400 shrink-0 border border-purple-500/20 font-inter">D{day.day}</div><div className="text-gray-300 text-sm font-medium">{day.stay || <span className="text-gray-500 italic font-light">Standard Stay</span>}</div></div>))}</div>
                              {globalNotes.stayNote && (
                                <div className="mt-6 bg-red-900/10 p-5 rounded-xl border border-red-500/10">
                                  <h4 className="text-red-400 font-bold text-xs uppercase mb-2">Important Stay Policy:</h4>
                                  {renderNotesWithBullets(globalNotes.stayNote)}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-xl font-montserrat font-semibold text-white mb-6 flex items-center gap-3"><FaUtensils className="text-[#D9A441]" /> Food</h3>
                              <div className="space-y-4">{tour.itinerary?.map((day, idx) => (<div key={idx} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition"><div className="w-12 h-12 rounded-xl bg-orange-900/30 flex items-center justify-center text-sm font-bold text-orange-400 shrink-0 border border-orange-500/20 font-inter">D{day.day}</div><div className="flex-1"><div className="flex flex-wrap gap-2">{day.meals?.length > 0 ? (day.meals.map((m, i) => (<span key={i} className="text-[10px] font-bold text-black bg-[#D9A441] px-2 py-1 rounded-md tracking-wide font-montserrat uppercase">{m}</span>))) : (<span className="text-xs text-gray-500 italic font-inter font-light">No meals</span>)}</div></div></div>))}</div>
                              {globalNotes.foodNote && (
                                <div className="mt-6 bg-red-900/10 p-5 rounded-xl border border-red-500/10">
                                  <h4 className="text-red-400 font-bold text-xs uppercase mb-2">Important Food Policy:</h4>
                                  {renderNotesWithBullets(globalNotes.foodNote)}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* REVIEWS */}
                      {activeTab === "reviews" && (
                        <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-montserrat font-semibold text-white">Traveler Experiences</h3>
                            <button onClick={() => setShowReviewForm(!showReviewForm)} className="px-4 py-2 bg-[#D9A441] text-black text-sm font-bold rounded-full hover:bg-white transition flex items-center gap-2"><FaPenNib /> Write Review</button>
                          </div>
                          <AnimatePresence>{showReviewForm && (<motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} onSubmit={handleSubmitReview} className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8 overflow-hidden backdrop-blur-md"><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"><div><label className="text-xs text-gray-400 block mb-1 font-bold uppercase">Your Name</label><input required className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#D9A441]" value={reviewInput.name} onChange={e => setReviewInput({ ...reviewInput, name: e.target.value })} /></div><div><label className="text-xs text-gray-400 block mb-1 font-bold uppercase">Rating</label><div className="flex gap-2 mt-2">{[1, 2, 3, 4, 5].map((star) => (<button type="button" key={star} onClick={() => setReviewInput({ ...reviewInput, rating: star })} className={`text-lg transition ${star <= reviewInput.rating ? 'text-[#D9A441]' : 'text-gray-600'}`}><FaStar /></button>))}</div></div><div><label className="text-xs text-gray-400 block mb-1 font-bold uppercase">Mobile (Private)</label><input required type="tel" placeholder="10 digit number" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#D9A441]" value={reviewInput.mobile} onChange={e => { const val = e.target.value.replace(/\D/g, ""); if (val.length <= 10) setReviewInput({ ...reviewInput, mobile: val }); }} /></div><div><label className="text-xs text-gray-400 block mb-1 font-bold uppercase">Email (Private)</label><input required type="email" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#D9A441]" value={reviewInput.email} onChange={e => setReviewInput({ ...reviewInput, email: e.target.value })} /></div></div><div className="mb-4"><label className="text-xs text-gray-400 block mb-1 font-bold uppercase">Review Title</label><input required placeholder="e.g. Awesome Experience!" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#D9A441]" value={reviewInput.title} onChange={e => setReviewInput({ ...reviewInput, title: e.target.value })} /></div><div className="mb-4"><label className="text-xs text-gray-400 block mb-1 font-bold uppercase">Your Experience</label><textarea required rows={3} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#D9A441]" value={reviewInput.text} onChange={e => setReviewInput({ ...reviewInput, text: e.target.value })} /></div><div className="flex justify-end gap-3"><button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-gray-400 text-sm hover:text-white font-bold">Cancel</button><button disabled={submittingReview} className="px-6 py-2 bg-[#D9A441] text-black font-bold rounded-lg hover:bg-white transition text-sm">{submittingReview ? "Posting..." : (isEditing ? "Update Review" : "Submit Review")}</button></div></motion.form>)}</AnimatePresence>
                          {tour.reviews?.length > 0 ? (<>{tour.reviews.slice().reverse().slice(0, 5).map((r, i) => (<div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:border-white/10 transition duration-300"><div className="flex flex-col gap-2 mb-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D9A441] to-orange-600 flex items-center justify-center text-black font-bold text-lg border border-white/10">{r.name.charAt(0).toUpperCase()}</div><div><div className="flex items-center gap-2"><h4 className="font-semibold text-white text-sm font-montserrat">{r.name}</h4><div className="flex items-center gap-1 bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30"><FaCheckCircle className="text-[10px] text-green-400" /><span className="text-[10px] font-bold text-green-400">Verified</span></div></div><span className="text-[10px] text-gray-500 font-inter font-light">{r.date}</span></div></div><div className="pl-14 flex text-[#D9A441] text-xs gap-0.5">{[...Array(5)].map((_, k) => (<FaStar key={k} className={k < r.rating ? "text-[#D9A441]" : "text-gray-700"} />))}</div></div><div className="pl-14">{r.title && <h5 className="text-white font-bold text-base mb-1 block">{r.title}</h5>}<p className="text-gray-300 text-sm leading-relaxed font-inter font-light">"{r.text}"</p></div></div>))}{tour.reviews.length > 5 && (<div className="pt-4 text-center"><button onClick={() => navigate('/reviews')} className="text-sm font-bold text-[#D9A441] hover:text-white transition underline decoration-[#D9A441]/50 hover:decoration-white underline-offset-4">See All {tour.reviews.length} Reviews →</button></div>)}</>) : (<div className="text-center py-12 text-gray-400 bg-white/5 rounded-[2rem] border border-white/10 border-dashed font-inter font-light"><p>No reviews yet. Be the first to share your experience!</p></div>)}
                        </motion.div>
                      )}

                      {activeTab === "faq" && (
                        <motion.div key="faq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                          {faqs.map((f, i) => (<div key={i} className="bg-white/5 border border-white/10 rounded-[1.5rem] overflow-hidden hover:bg-white/10 transition"><button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 flex justify-between items-center text-left focus:outline-none"><span className="font-semibold text-emerald-50 text-sm md:text-base pr-4 font-montserrat">{f.q}</span><FaChevronDown className={`text-[#D9A441] transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} /></button><AnimatePresence>{openFaq === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-black/20"><div className="p-6 pt-0"><p className="text-emerald-100/70 text-sm leading-relaxed pt-4 border-t border-white/10 font-inter font-light">{f.a}</p></div></motion.div>)}</AnimatePresence></div>))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="hidden lg:block w-[480px] shrink-0 sticky top-28 h-fit">
              <MemoizedSidebar tour={tour} />
            </div>
          </div>
        </motion.div>
      )}

      {/* MOBILE SIDEBAR FAB */}
      {!loading && (<div className="lg:hidden fixed bottom-4 left-0 right-0 px-4 z-[9999] pointer-events-none"><div className="pointer-events-auto"><MemoizedSidebar tour={tour} /></div></div>)}

      {/* TOAST */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full border border-[#D9A441]/50 shadow-[0_0_20px_rgba(217,164,65,0.3)] flex items-center gap-3 font-montserrat"><FaEnvelope className="text-[#D9A441]" /><span className="font-semibold text-sm">Link Copied!</span></motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}