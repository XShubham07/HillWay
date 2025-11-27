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
  FaUsers // Added for Group Type
} from "react-icons/fa";
import { getTourById } from "../data/mockTours";
import { useState, useEffect } from "react";
import BookingSidebar from "../components/BookingSidebar";

export default function TourDetailsPage() {
  const { id } = useParams();
  const tour = getTourById(id);
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(null);

  /* MOUSE GLOW */
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

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-white">
        <h1 className="text-4xl font-bold text-red-500">404: Tour Not Found</h1>
      </div>
    );
  }

  const overviewText = tour.details ?? tour.description ?? "";

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
    // Added 'w-full overflow-x-hidden' to fix mobile bleeding
    <div className="relative min-h-screen w-full overflow-x-hidden text-white">
      
      {/* --- CSS OVERRIDE --- */}
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
          padding-bottom: 8px;
        }
        .force-horizontal-scroll::-webkit-scrollbar {
          display: none !important;
        }
        .scroll-item {
          flex: 0 0 auto !important;
          white-space: nowrap !important;
        }
      `}</style>

      {/* BG */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#102A43] via-[#1F4F3C] to-[#2E6F95]">
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

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-28 lg:pb-12 pt-8 mt-[1.4cm] lg:-mt-[0.5cm]"
      >
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT */}
          <div className="w-full lg:w-2/3">

            <motion.img
              src={tour.img}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl border border-white/10 shadow-xl"
              whileHover={{ scale: 1.02 }}
            />

            {/* Title + Subtitle */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold tracking-wide text-white drop-shadow-lg mt-6 break-words">
              {tour.title}
            </h1>
            <p className="text-base md:text-lg text-gray-300 mt-2">{tour.subtitle}</p>

            {/* Location & Rating Row (Updated) */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-base md:text-lg">
              {/* Location */}
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#D9A441]" />
                <span>{tour.location}</span>
              </div>

              {/* Separator (Hidden on very small screens) */}
              <div className="hidden sm:block w-1.5 h-1.5 bg-gray-500 rounded-full" />

              {/* Rating Moved Here */}
              <div className="flex items-center gap-2 text-[#D9A441]">
                <FaStar />
                <span className="text-white font-bold">{tour.rating}</span>
                <span className="text-gray-400 text-sm font-normal">(4.8/5 Reviews)</span>
              </div>
            </div>

            {/* INFO CARDS - REPLACED RATING WITH GROUP TYPE */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#D9A441] text-black">
                  <FaRupeeSign />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Starting From</p>
                  <p className="text-xl font-bold">₹{tour.basePrice}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#2E6F95]">
                  <FaCalendarAlt />
                </div>
                <div>
                  <p className="text-xs text-gray-300">Duration</p>
                  <p className="text-xl font-bold">{tour.nights} Nights</p>
                </div>
              </div>

              {/* CHANGED: Rating Card -> Group Type Card */}
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#1F4F3C]">
                  <FaUsers /> {/* User Icon */}
                </div>
                <div>
                  <p className="text-xs text-gray-300">Group Type</p>
                  <p className="text-xl font-bold">Mixed</p>
                </div>
              </div>
            </div>

            {/* TABS - FORCED HORIZONTAL SCROLL */}
            <div className="mt-10 w-full overflow-hidden">
              <div className="force-horizontal-scroll gap-3 max-w-full">
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
                      scroll-item px-4 py-2 rounded-lg font-semibold
                      ${activeTab === t.id
                        ? "bg-[#D9A441]/20 border border-[#D9A441]/40 text-[#D9A441]"
                        : "bg-white/10 text-gray-200"
                      }
                    `}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 md:p-6 bg-white/10 border border-white/20 rounded-xl">

                {/* OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="text-gray-200 text-lg leading-relaxed">
                    <p>{overviewText || "This tour offers a premium travel experience."}</p>

                    {/* INCLUSIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-10">
                      <div>
                        <h3 className="text-2xl font-bold text-emerald-300 mb-4">What’s Included?</h3>
                        {tour.inclusions.map((item, i) => (
                          <div key={i} className="flex items-start gap-3 mb-3">
                            <FaCheckCircle className="text-emerald-300 mt-1 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-red-300 mb-4">What’s Not Included?</h3>
                        {[
                          "Airfare / Train Tickets",
                          "Personal Expenses",
                          "Lunch During Travel",
                          "Extra Activities & Entry Fees"
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3 mb-3">
                            <FaTimesCircle className="text-red-400 mt-1 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ITINERARY */}
                {activeTab === "itinerary" && (
                  <div className="space-y-8">
                    {tour.itinerary.map((item, i) => (
                      <div key={i} className="relative pl-14">
                        {i < tour.itinerary.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-full bg-[#2E6F95]" />
                        )}

                        <div className="absolute left-0 top-0">
                          <div className="w-12 h-12 rounded-full bg-[#2E6F95] flex items-center justify-center font-bold">
                            {item.day}
                          </div>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <h3 className="text-xl font-bold">{item.title}</h3>
                          <p className="text-gray-300 mt-2">{item.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* FOOD & STAY */}
                {activeTab === "food" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* ACCOMMODATION CARD */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#1F4F3C]/40 to-[#1F4F3C]/5 border border-[#1F4F3C]/30 overflow-hidden">
                      <div className="p-4 bg-[#1F4F3C]/30 flex items-center gap-3 border-b border-[#1F4F3C]/30">
                        <div className="p-2 bg-emerald-400/20 rounded-lg text-emerald-300">
                           <FaBed size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-100">The Stay</h3>
                      </div>
                      
                      <div className="p-6 space-y-6">
                        <div className="text-sm text-emerald-200/70 uppercase tracking-widest font-semibold">Amenities Included</div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { icon: FaBed, label: "Twin/Triple Sharing" },
                            { icon: FaShower, label: "Geyser Included" },
                            { icon: FaWifi, label: "Free WiFi" },
                            { icon: FaMountain, label: "Mountain View" },
                          ].map((feat, i) => (
                             <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/20 border border-white/5 text-center gap-2 hover:bg-black/40 transition">
                                <feat.icon className="text-2xl text-emerald-300" />
                                <span className="text-xs text-gray-300 font-medium">{feat.label}</span>
                             </div>
                          ))}
                        </div>
                        <div className="text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm">
                           Premium Standard / Panoramic Rooms available based on selection.
                        </div>
                      </div>
                    </div>

                    {/* FOOD CARD */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#D9A441]/20 to-[#D9A441]/5 border border-[#D9A441]/30 overflow-hidden">
                       <div className="p-4 bg-[#D9A441]/20 flex items-center gap-3 border-b border-[#D9A441]/30">
                        <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-300">
                           <FaUtensils size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-yellow-100">Meal Plan</h3>
                      </div>

                      <div className="p-6">
                        <div className="space-y-4">
                          {[
                             { day: "Day 1", meals: ["Dinner"], icon: FaConciergeBell },
                             { day: "Day 2", meals: ["Breakfast", "Lunch", "Dinner"], icon: FaUtensils },
                             { day: "Day 3", meals: ["Breakfast", "Lunch", "Dinner"], icon: FaUtensils },
                             { day: "Day 4", meals: ["Breakfast"], icon: FaCoffee },
                          ].map((plan, i) => (
                             <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-black/20 border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-[#D9A441]/20 flex items-center justify-center text-[#D9A441] shrink-0 font-bold text-xs border border-[#D9A441]/30">
                                   {plan.day.split(" ")[1]}
                                </div>
                                <div>
                                   <div className="text-xs text-[#D9A441] font-semibold uppercase tracking-wider mb-0.5">{plan.day}</div>
                                   <div className="flex flex-wrap gap-2 text-sm text-gray-200">
                                      {plan.meals.join(" • ")}
                                   </div>
                                </div>
                                <div className="ml-auto text-gray-500">
                                   <plan.icon />
                                </div>
                             </div>
                          ))}
                        </div>
                        
                        <div className="mt-6 text-xs text-center text-gray-400 italic">
                          * Special dietary requirements can be requested after booking.
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* REVIEWS */}
                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-2xl font-bold text-[#D9A441] mb-3">Reviews</h3>
                    <p className="text-gray-300">No reviews yet.</p>
                  </div>
                )}

                {/* FAQ TAB CONTENT */}
                {activeTab === "faq" && (
                  <div>
                    <h3 className="text-2xl font-bold text-[#D9A441] mb-6 flex items-center gap-3">
                      <FaQuestionCircle /> Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      {faqs.map((faq, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition">
                          <button
                            onClick={() => toggleFaq(i)}
                            className="w-full p-4 flex justify-between items-center text-left focus:outline-none"
                          >
                            <h4 className="font-bold text-lg text-white pr-4">
                              {faq.q}
                            </h4>
                            <FaChevronDown
                              className={`text-sm text-[#D9A441] shrink-0 transition-transform duration-300 ${
                                openFaq === i ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          
                          <AnimatePresence>
                            {openFaq === i && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-0">
                                  <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                                    {faq.a}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* SIDEBAR DESKTOP */}
          <div className="hidden lg:block w-80 shrink-0">
            <BookingSidebar tour={tour} />
          </div>
        </div>
      </motion.div>

      {/* MOBILE FLOATING BOOKING */}
      <div className="lg:hidden fixed bottom-4 left-0 right-0 px-6 z-[9999] pointer-events-none">
        <div className="pointer-events-auto">
          <BookingSidebar tour={tour} />
        </div>
      </div>
    </div>
  );
}