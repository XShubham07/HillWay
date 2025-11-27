import { useParams } from "react-router-dom";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRupeeSign, FaCheckCircle, FaTimesCircle, FaBed, FaWifi, FaShower, FaMountain, FaUtensils, FaCoffee, FaConciergeBell, FaQuestionCircle, FaChevronDown, FaUsers } from "react-icons/fa";
import { useState, useEffect } from "react";
import BookingSidebar from "../components/BookingSidebar";

export default function TourDetailsPage() {
  const { id } = useParams();
  
  // REAL DATA STATE
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [openFaq, setOpenFaq] = useState(null);

  // FETCH SINGLE TOUR
  useEffect(() => {
    if(!id) return;
    setLoading(true);
    // Use the ID from the URL to fetch from DB
    fetch(`/api/tours/${id}`) 
      .then(res => res.json())
      .then(data => {
        if(data.success) setTour(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* MOUSE GLOW LOGIC (Same as before) */
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 150 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 150 });
  useEffect(() => {
    const handleMouseMove = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-white bg-[#102A43]">Loading Tour Details...</div>;

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center text-white">
        <h1 className="text-4xl font-bold text-red-500">404: Tour Not Found</h1>
      </div>
    );
  }

  const overviewText = tour.description || tour.subtitle || "";
  const faqs = [ /* ... Same static FAQs for now ... */ ]; 
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  // ... (Rest of the JSX remains EXACTLY THE SAME, just using 'tour' object from DB) ...
  // ...
  // Copy the rest of your return (...) statement from previous code
  // Just make sure you use tour.title, tour.pricing, etc.
  
  return (
     <div className="relative min-h-screen w-full overflow-x-hidden text-white">
        {/* ... Insert your existing Styles and JSX structure here ... */}
        {/* ... Ensure you pass 'tour' to BookingSidebar: <BookingSidebar tour={tour} /> ... */}
        
        {/* Example of a section to guide you where to paste */}
        <style>{`
            .force-horizontal-scroll { display: flex !important; flex-direction: row !important; overflow-x: auto !important; }
            .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
        
        {/* BG */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#102A43] via-[#1F4F3C] to-[#2E6F95]">
           {/* ... BG Animations ... */}
        </div>

        {/* MAIN CONTENT */}
        <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 pb-28 lg:pb-12 pt-8 mt-[1.4cm] lg:-mt-[0.5cm]">
           <div className="flex flex-col lg:flex-row gap-10">
              <div className="w-full lg:w-2/3">
                 <motion.img src={tour.img} className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-xl" />
                 <h1 className="text-3xl md:text-4xl font-bold mt-6">{tour.title}</h1>
                 {/* ... Rest of your UI ... */}
                 
                 {/* TABS LOGIC (Keep existing) */}
                 
              </div>

              {/* SIDEBAR */}
              <div className="hidden lg:block w-80 shrink-0">
                 <BookingSidebar tour={tour} />
              </div>
           </div>
        </motion.div>
        
        {/* MOBILE BOOKING */}
        <div className="lg:hidden fixed bottom-4 left-0 right-0 px-6 z-[9999] pointer-events-none">
           <div className="pointer-events-auto"><BookingSidebar tour={tour} /></div>
        </div>
     </div>
  );
}