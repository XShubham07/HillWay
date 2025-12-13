// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ICONS
import {
  FaHome, FaMountain, FaPhone, FaWhatsapp,
  FaBars, FaTimes, FaSearch, FaStar, FaMapMarkedAlt, FaInfo
} from "react-icons/fa";

// COLORS
const COLORS = {
  navy: "#102A43",       // Deep Navy
  gold: "#D9A441",       // Sunrise Gold
  white: "#FFFFFF",
  stone: "#D7DCE2",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  // --- 🧭 NAVIGATION DATA ---
  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/destinations", label: "Destinations", icon: <FaMapMarkedAlt /> },
    { path: "/tours", label: "All Tours", icon: <FaMountain /> },
    { path: "/reviews", label: "Reviews", icon: <FaStar /> },
    { path: "/status", label: "Track Booking", icon: <FaSearch /> },
    { path: "/about", label: "About Us", icon: <FaInfo /> },
    { path: "/contact", label: "Contact", icon: <FaPhone style={{ transform: 'scaleX(-1)' }} /> },
  ];

  const whatsappLink = `https://wa.me/917004165004?text=Hi! I'm interested in booking a tour.`;

  return (
    <>
      <style>{`
        /* Desktop Header Glass */
        .aqua-glass {
          background: rgba(16, 42, 67, 0.65);
          backdrop-filter: blur(25px) saturate(200%);
          -webkit-backdrop-filter: blur(25px) saturate(200%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
        }
        
        /* 🌊 ENHANCED AQUAMORPHISM FOR MOBILE MENU 
           Stronger blur, deeper transparency, frostier borders
        */
        .mobile-menu-glass {
          background: rgba(16, 42, 67, 0.70); /* More transparency to let blur show */
          backdrop-filter: blur(50px) saturate(180%); /* Heavy blur */
          -webkit-backdrop-filter: blur(50px) saturate(180%);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 -10px 60px rgba(0,0,0,0.6);
        }
      `}</style>

      {/* =======================
          🖥️ DESKTOP NAVBAR
      ======================== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="aqua-glass transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
            
            <Link to="/" className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              HillWay
            </Link>

            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-6 py-2.5 rounded-full text-sm transition-colors duration-300 z-10 flex items-center gap-2 overflow-hidden"
                    style={{
                      color: isActive ? COLORS.navy : COLORS.stone,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {isActive && (
                      <motion.div layoutId="active-bg" className="absolute inset-0 rounded-full -z-10" style={{ background: COLORS.gold, boxShadow: "0 0 15px rgba(217, 164, 65, 0.4)" }} />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-full shadow-lg bg-[#1F4F3C] border border-white/10 hover:scale-105 transition-transform">
              <FaWhatsapp size={20} /> WhatsApp
            </a>
          </div>
        </div>
      </motion.nav>

      {/* =======================
          📱 MOBILE HEADER
      ======================== */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="aqua-glass">
          <div className="flex justify-between items-center px-4 py-3">
            <Link to="/" className="text-xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              HillWay
            </Link>

            <motion.button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-sm bg-white/10 border border-white/20 backdrop-blur-md"
              whileTap={{ scale: 0.95 }}
            >
              <FaBars size={12} /> MENU
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* =======================
          📱 MOBILE MENU (Bottom Sheet)
      ======================== */}
      <AnimatePresence>
        {open && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[4px]"
              onClick={() => setOpen(false)}
            />

            {/* Menu Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-[2.5rem] overflow-hidden mobile-menu-glass flex flex-col"
              style={{ maxHeight: '85vh' }} 
            >
              
              {/* Header */}
              <div className="relative pt-4 pb-2 px-6 flex items-center justify-between border-b border-white/5">
                <span className="text-xs font-bold text-white/40 tracking-widest uppercase">Navigation</span>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white/70 hover:bg-white/10"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              {/* Links List */}
              <div className="p-4 flex flex-col">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <div key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-[#D9A441] text-[#102A43] font-bold shadow-lg shadow-orange-500/20' 
                            : 'hover:bg-white/5 text-white font-medium'
                        }`}
                      >
                        <span className={`text-lg ${isActive ? 'text-[#102A43]' : 'text-cyan-400'}`}>
                          {link.icon}
                        </span>
                        <span className="text-base tracking-wide">{link.label}</span>
                        
                        {/* Active Dot */}
                        {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-[#102A43]" />}
                      </Link>

                      {/* Thin Separation Line (Don't show after last item) */}
                      {i < navLinks.length - 1 && (
                        <div className="h-[1px] bg-white/5 mx-5 my-0.5" />
                      )}
                    </div>
                  );
                })}

                {/* Separator before WhatsApp */}
                <div className="h-[1px] bg-white/10 mx-5 my-3" />

                {/* WhatsApp Button */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-transform bg-[#1F4F3C] border border-white/10 mx-2"
                >
                  <FaWhatsapp size={20} />
                  Chat on WhatsApp
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}