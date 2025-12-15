// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ICONS
import {
  FaHome, FaMountain, FaPhone, FaWhatsapp,
  FaBars, FaTimes, FaSearch, FaStar, FaMapMarkedAlt, FaInfo, FaUsers, FaChevronDown, FaBlog
} from "react-icons/fa";

// COLORS
const COLORS = {
  navy: "#102A43",
  gold: "#D9A441",
  white: "#FFFFFF",
  stone: "#D7DCE2",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.position = "static";
    };
  }, [open]);

  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/tours", label: "All Tours", icon: <FaMountain /> },
    { path: "/destinations", label: "Destinations", icon: <FaMapMarkedAlt /> },
    { path: "/status", label: "Track Booking", icon: <FaSearch /> },
    { path: "/about", label: "About Us", icon: <FaInfo /> },
    { path: "/contact", label: "Contact", icon: <FaPhone style={{ transform: 'scaleX(-1)' }} /> },
  ];

  const communityLinks = [
    { path: "/reviews", label: "Reviews", icon: <FaStar />, isInternal: true },
    { path: "https://blogs.hillway.in", label: "Blog", icon: <FaBlog />, isInternal: false },
  ];

  const whatsappLink = `https://wa.me/917004165004?text=Hi! I'm interested in booking a tour.`;

  return (
    <>
      <style>{`
        .aqua-glass {
          background: rgba(16, 42, 67, 0.65) !important;
          backdrop-filter: blur(25px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(25px) saturate(200%) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25);
        }

        .mobile-sheet {
           background: rgba(16, 42, 67, 0.95);
           backdrop-filter: blur(30px) saturate(180%);
           -webkit-backdrop-filter: blur(30px) saturate(180%);
           border-top: 1px solid rgba(255, 255, 255, 0.2);
           box-shadow: 0 -10px 50px rgba(0,0,0,0.7);
        }
      `}</style>

      {/* DESKTOP NAVBAR */}
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
                      <motion.div 
                        layoutId="active-bg" 
                        className="absolute inset-0 rounded-full -z-10" 
                        style={{ background: COLORS.gold, boxShadow: "0 0 15px rgba(217, 164, 65, 0.4)" }} 
                      />
                    )}
                    <AnimatePresence mode="popLayout">
                      {isActive && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="relative z-10 flex items-center justify-center"
                        >
                          {link.icon}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.span layout className="relative z-10">{link.label}</motion.span>
                  </Link>
                );
              })}

              {/* COMMUNITY DROPDOWN */}
              <div 
                className="relative"
                onMouseEnter={() => setCommunityOpen(true)}
                onMouseLeave={() => setCommunityOpen(false)}
              >
                <button
                  className="relative px-6 py-2.5 rounded-full text-sm transition-colors duration-300 z-10 flex items-center gap-2 overflow-hidden"
                  style={{
                    color: location.pathname === '/reviews' ? COLORS.navy : COLORS.stone,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: location.pathname === '/reviews' ? 700 : 500,
                  }}
                >
                  {location.pathname === '/reviews' && (
                    <motion.div 
                      layoutId="active-bg" 
                      className="absolute inset-0 rounded-full -z-10" 
                      style={{ background: COLORS.gold, boxShadow: "0 0 15px rgba(217, 164, 65, 0.4)" }} 
                    />
                  )}
                  <FaUsers />
                  <span>Community</span>
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${communityOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {communityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 bg-[#102A43]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden min-w-[180px]"
                    >
                      {communityLinks.map((link) => {
                        const isActive = link.isInternal && location.pathname === link.path;
                        
                        if (link.isInternal) {
                          return (
                            <Link
                              key={link.path}
                              to={link.path}
                              className={`flex items-center gap-3 px-5 py-3 transition-all duration-200 ${
                                isActive 
                                  ? 'bg-[#D9A441] text-[#102A43] font-bold' 
                                  : 'hover:bg-white/5 text-white font-medium'
                              }`}
                            >
                              <span className={`text-base ${isActive ? 'text-[#102A43]' : 'text-cyan-400'}`}>
                                {link.icon}
                              </span>
                              <span className="text-sm">{link.label}</span>
                            </Link>
                          );
                        }

                        // External link (Blog)
                        return (
                          <a
                            key={link.path}
                            href={link.path}
                            className="flex items-center gap-3 px-5 py-3 transition-all duration-200 hover:bg-white/5 text-white font-medium"
                          >
                            <span className="text-base text-cyan-400">
                              {link.icon}
                            </span>
                            <span className="text-sm">{link.label}</span>
                          </a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-full shadow-lg bg-[#1F4F3C] border border-white/10 hover:scale-105 transition-transform">
              <FaWhatsapp size={20} /> WhatsApp
            </a>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE HEADER */}
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

            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-sm bg-white/10 border border-white/20 backdrop-blur-md active:scale-95 transition-transform touch-manipulation"
            >
              <FaBars size={12} /> MENU
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-[9998] backdrop-blur-[4px]"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-[9999] rounded-t-[2rem] overflow-hidden mobile-sheet flex flex-col"
            >
              
              <div className="relative pt-3 pb-2 px-6 flex items-center justify-between border-b border-white/5">
                <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Quick Menu</span>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white/70 hover:bg-white/10 active:scale-95 transition-transform touch-manipulation"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="p-4 flex flex-col">
                {navLinks.map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <div key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-[#D9A441] text-[#102A43] font-bold shadow-lg shadow-orange-500/20' 
                            : 'hover:bg-white/5 text-white font-medium'
                        }`}
                      >
                        <span className={`text-lg w-6 flex justify-center ${isActive ? 'text-[#102A43]' : 'text-cyan-400'}`}>
                          {link.icon}
                        </span>
                        <span className="text-sm tracking-wide">{link.label}</span>
                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#102A43]" />}
                      </Link>
                      {i < navLinks.length - 1 && (
                        <div className="h-[1px] bg-white/5 ml-[3rem] mr-4 my-[2px]" />
                      )}
                    </div>
                  );
                })}

                {/* Community Section */}
                <div className="mt-2">
                  <div className="flex items-center gap-2 px-4 py-2 text-white/60 text-xs font-bold uppercase tracking-wider">
                    <FaUsers className="text-cyan-400" />
                    <span>Community</span>
                  </div>
                  {communityLinks.map((link, i) => {
                    const isActive = link.isInternal && location.pathname === link.path;
                    
                    if (link.isInternal) {
                      return (
                        <div key={link.path}>
                          <Link
                            to={link.path}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ml-4 ${
                              isActive 
                                ? 'bg-[#D9A441] text-[#102A43] font-bold shadow-lg shadow-orange-500/20' 
                                : 'hover:bg-white/5 text-white font-medium'
                            }`}
                          >
                            <span className={`text-lg w-6 flex justify-center ${isActive ? 'text-[#102A43]' : 'text-cyan-400'}`}>
                              {link.icon}
                            </span>
                            <span className="text-sm tracking-wide">{link.label}</span>
                            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#102A43]" />}
                          </Link>
                          {i < communityLinks.length - 1 && (
                            <div className="h-[1px] bg-white/5 ml-[3rem] mr-4 my-[2px]" />
                          )}
                        </div>
                      );
                    }

                    // External link (Blog)
                    return (
                      <div key={link.path}>
                        <a
                          href={link.path}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ml-4 hover:bg-white/5 text-white font-medium"
                        >
                          <span className="text-lg w-6 flex justify-center text-cyan-400">
                            {link.icon}
                          </span>
                          <span className="text-sm tracking-wide">{link.label}</span>
                        </a>
                        {i < communityLinks.length - 1 && (
                          <div className="h-[1px] bg-white/5 ml-[3rem] mr-4 my-[2px]" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="h-[1px] bg-white/10 mx-5 my-2" />

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform bg-[#1F4F3C] border border-white/10 mx-2 touch-manipulation"
                >
                  <FaWhatsapp size={18} />
                  <span className="text-sm">Chat on WhatsApp</span>
                </a>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}