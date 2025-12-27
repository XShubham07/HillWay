import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

// ICONS
import {
  FaHome, FaMountain, FaPhone, FaWhatsapp,
  FaBars, FaTimes, FaUsers, FaChevronDown, FaBook, FaStar, FaMapMarkedAlt, FaInfo
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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Store scroll position for iOS lock
  const scrollYRef = useRef(0);
  const location = useLocation();

  // 1. OPTIMIZED SCROLL PROGRESS
  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      // Clamp between 0 and 100 to prevent rubber-band glitches
      const scrolled = Math.min(100, Math.max(0, (winScroll / height) * 100));
      setScrollProgress(scrolled);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. ROCK-SOLID SCROLL LOCK (iOS Compatible)
  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [open]);

  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/tours", label: "All Tours", icon: <FaMountain /> },
    { path: "/destinations", label: "Destinations", icon: <FaMapMarkedAlt /> },
    { path: "/about", label: "About Us", icon: <FaInfo /> },
    { path: "/contact", label: "Contact", icon: <FaPhone style={{ transform: 'scaleX(-1)' }} /> },
  ];

  const communityLinks = [
    { path: "/reviews", label: "Reviews", icon: <FaStar />, isInternal: true },
    { path: "/blogs", label: "Blogs", icon: <FaBook />, isInternal: true },
  ];

  // Fetch contact settings from admin
  const [whatsappNumber, setWhatsappNumber] = useState("917004165004");

  useEffect(() => {
    fetch("https://admin.hillway.in/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          if (data.data.whatsappNumber) setWhatsappNumber(data.data.whatsappNumber);
        }
      })
      .catch((err) => console.error("Failed to load contact settings", err));
  }, []);

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi! I'm interested in booking a tour.`;

  return (
    <>
      <style>{`
        /* OPTIMIZED GLASS CLASSES */
        .aqua-glass {
          background: rgba(16, 42, 67, 0.90); /* Increased opacity slightly for mobile stability */
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
        }

        /* MOBILE SHEET */
        .mobile-sheet {
           background: rgba(16, 42, 67, 0.96);
           backdrop-filter: blur(12px); 
           -webkit-backdrop-filter: blur(12px);
           border-top: 1px solid rgba(255, 255, 255, 0.15);
           box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
           will-change: transform;
           transform: translateZ(0); 
           overscroll-behavior: contain;
        }
        
        .backdrop-lock {
          touch-action: none;
        }

        /* Progress Bar Style */
        .header-progress {
          height: 3px;
          background: linear-gradient(90deg, #10b981 0%, #fbbf24 50%, #10b981 100%);
          transform-origin: left;
          will-change: transform;
          box-shadow: 0 1px 6px rgba(16, 185, 129, 0.4);
        }
      `}</style>

      {/* --- DESKTOP NAVBAR --- */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="aqua-glass transition-all duration-300 relative">
          <div className="max-w-7xl mx-auto px-6 h-[72px] flex justify-between items-center">

            {/* LOGO */}
            <Link to="/">
              <img
                src="/hillway-full-logo.png"
                alt="Hillway"
                className="h-12 w-auto object-contain rounded-lg"
              />
            </Link>

            {/* LINKS */}
            <div className="flex items-center gap-1">
              {navLinks.slice(0, 3).map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-6 py-2.5 rounded-full text-sm transition-colors duration-300 z-10 flex items-center gap-2 overflow-hidden"
                    style={{
                      color: isActive ? COLORS.navy : COLORS.stone,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-bg"
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ background: COLORS.gold }}
                      />
                    )}
                    <span className="relative z-10">{link.icon}</span>
                    <span className="relative z-10">{link.label}</span>
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
                    color: (location.pathname === '/reviews' || location.pathname === '/blogs') ? COLORS.navy : COLORS.stone,
                    fontWeight: (location.pathname === '/reviews' || location.pathname === '/blogs') ? 700 : 500,
                  }}
                >
                  {(location.pathname === '/reviews' || location.pathname === '/blogs') && (
                    <motion.div
                      layoutId="active-bg"
                      className="absolute inset-0 rounded-full -z-10"
                      style={{ background: COLORS.gold }}
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
                      {communityLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 text-white font-medium transition-colors"
                        >
                          <span className="text-cyan-400 text-base">{link.icon}</span>
                          <span className="text-sm">{link.label}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.slice(3).map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-6 py-2.5 rounded-full text-sm transition-colors duration-300 z-10 flex items-center gap-2 overflow-hidden"
                    style={{
                      color: isActive ? COLORS.navy : COLORS.stone,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-bg"
                        className="absolute inset-0 rounded-full -z-10"
                        style={{ background: COLORS.gold }}
                      />
                    )}
                    <span className="relative z-10">{link.icon}</span>
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-full shadow-lg bg-[#1F4F3C] border border-white/10 hover:scale-105 transition-transform">
              <FaWhatsapp size={20} /> WhatsApp
            </a>
          </div>

          {/* DESKTOP PROGRESS BAR (Attached to bottom) */}
          <div
            className="header-progress absolute bottom-0 left-0 w-full"
            style={{ transform: `scaleX(${scrollProgress / 100})` }}
          />
        </div>
      </motion.nav>

      {/* --- MOBILE HEADER --- */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="aqua-glass relative">
          {/* Fixed Height to prevent collapse issues */}
          <div className="flex justify-between items-center px-4 h-[60px]">
            <Link to="/">
              <img src="/hillway-full-logo.png" alt="Hillway" className="h-8 w-auto object-contain rounded-md" />
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-full shadow-sm bg-white/10 border border-white/20 backdrop-blur-md active:scale-95 transition-transform"
            >
              <FaBars size={12} /> MENU
            </button>
          </div>

          {/* MOBILE PROGRESS BAR (Attached to bottom of header) */}
          {/* This ensures it moves WITH the header and is never hidden by browser chrome */}
          <div
            className="header-progress absolute bottom-0 left-0 w-full"
            style={{ transform: `scaleX(${scrollProgress / 100})` }}
          />
        </div>
      </motion.header>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-[2px] backdrop-lock"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-0 left-0 right-0 z-[9999] rounded-t-[2rem] overflow-hidden mobile-sheet flex flex-col max-h-[90vh]"
            >

              <div className="pt-4 pb-2 px-6 flex items-center justify-between border-b border-white/10">
                <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Navigation</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 bg-white/5 rounded-full text-white/80 hover:bg-white/20 active:scale-90 transition-transform"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              <div className="p-4 flex flex-col overflow-y-auto pb-10">
                {[...navLinks.slice(0, 3), ...communityLinks, ...navLinks.slice(3)].map((link, i) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <div key={link.path}>
                      <Link
                        to={link.path}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-r from-[#D9A441] to-[#eab308] text-[#022c22] font-bold shadow-lg'
                            : 'hover:bg-white/5 text-gray-200 font-medium'
                          }`}
                      >
                        <span className={`text-lg w-6 flex justify-center ${isActive ? 'text-[#022c22]' : 'text-emerald-400'}`}>
                          {link.icon}
                        </span>
                        <span className="text-sm tracking-wide">{link.label}</span>
                        {isActive && <FaChevronDown className="ml-auto -rotate-90 text-xs opacity-50" />}
                      </Link>
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent my-1" />
                    </div>
                  );
                })}

                <div className="mt-4 pt-2">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 py-3.5 rounded-xl font-bold text-white shadow-lg bg-[#25D366] active:scale-95 transition-transform"
                  >
                    <FaWhatsapp size={20} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP BUTTON (MOBILE) */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-40 md:hidden flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
      >
        <FaWhatsapp size={32} />
      </motion.a>
    </>
  );
}