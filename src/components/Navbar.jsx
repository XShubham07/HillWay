// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ICONS
import {
  FaHome, FaMountain, FaBlog, FaPhone, FaWhatsapp,
  FaBars, FaTimes, FaSearch, FaStar, FaUsers, FaChevronDown, FaMapMarkedAlt, FaInfo
} from "react-icons/fa";

// ... (COLORS object remains the same)
const COLORS = {
  navy: "#102A43",       // Deep Navy
  alpine: "#2E6F95",     // Alpine Blue
  forest: "#1F4F3C",     // Forest Green
  gold: "#D9A441",       // Sunrise Gold
  white: "#FFFFFF",
  stone: "#D7DCE2",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const location = useLocation();

  // ... (Scroll lock effect remains the same)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // --- 🧭 NAVIGATION DATA (Updated) ---
  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/destinations", label: "Destinations", icon: <FaMapMarkedAlt /> }, // <--- NEW LINK
    { path: "/tours", label: "Tours", icon: <FaMountain /> },
    {
      id: "community",
      label: "Community",
      icon: <FaUsers />,
      children: [
        { path: "/blog", label: "Blog", icon: <FaBlog /> },
        { path: "/reviews", label: "Reviews", icon: <FaStar /> }
      ]
    },
    { path: "/status", label: "Status", icon: <FaSearch /> },
    { path: "/about", label: "About", icon: <FaInfo /> },
    { path: "/contact", label: "Contact", icon: <FaPhone style={{ transform: 'scaleX(-1)' }} /> },
  ];

  // ... (WhatsApp logic and rest of the component remains the same)
  const whatsappNumber = "917004165004";
  const whatsappMessage = "Hi! I'm interested in booking a tour with HillWay.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      {/* ... (Styles remain the same) ... */}
      <style>{`
        .aqua-glass {
          background: rgba(16, 42, 67, 0.65) !important;
          backdrop-filter: blur(25px) saturate(200%) !important;
          -webkit-backdrop-filter: blur(25px) saturate(200%) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.25) !important;
        }
        .glass-mobile {
          background: rgba(16, 42, 67, 0.75) !important;
          backdrop-filter: blur(35px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(35px) saturate(180%) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.4) !important;
        }
        .glass-dropdown {
          background: rgba(16, 42, 67, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
      `}</style>

      {/* =======================
          🖥️ DESKTOP NAVBAR (FIXED)
      ======================== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div className="aqua-glass transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex justify-between items-center">

              {/* Logo */}
              <Link
                to="/"
                className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                HillWay
              </Link>

              {/* Links Container */}
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {

                  // --- DROPDOWN LOGIC ---
                  if (link.children) {
                    const isAnyChildActive = link.children.some(child => location.pathname === child.path);
                    const isOpen = hoveredDropdown === link.id;

                    return (
                      <div
                        key={link.id}
                        className="relative z-20"
                        onMouseEnter={() => setHoveredDropdown(link.id)}
                        onMouseLeave={() => setHoveredDropdown(null)}
                      >
                        {/* Parent Button */}
                        <button
                          className="relative px-6 py-2.5 rounded-full text-sm transition-colors duration-300 z-10 flex items-center gap-2"
                          style={{
                            color: isAnyChildActive || isOpen ? COLORS.white : COLORS.stone,
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: isAnyChildActive ? 700 : 500,
                            background: isAnyChildActive ? "rgba(255,255,255,0.1)" : "transparent"
                          }}
                        >
                          {link.icon}
                          <span>{link.label}</span>
                          <FaChevronDown size={10} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="absolute top-full left-0 mt-2 w-48 rounded-2xl overflow-hidden glass-dropdown p-2"
                            >
                              {link.children.map((child) => {
                                const isChildActive = location.pathname === child.path;
                                return (
                                  <Link
                                    key={child.path}
                                    to={child.path}
                                    onClick={() => setHoveredDropdown(null)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                                    style={{
                                      color: isChildActive ? COLORS.gold : COLORS.white,
                                    }}
                                  >
                                    <span className={isChildActive ? "text-[#D9A441]" : "text-gray-400"}>{child.icon}</span>
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // --- STANDARD LINK LOGIC ---
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
                          transition={{ type: "spring", stiffness: 280, damping: 24 }}
                          style={{
                            background: COLORS.gold,
                            boxShadow: "0 0 15px rgba(217, 164, 65, 0.4)"
                          }}
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

                      <motion.span layout className="relative z-10">
                        {link.label}
                      </motion.span>
                    </Link>
                  );
                })}
              </div>

              {/* WhatsApp Button */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                style={{
                  background: COLORS.forest,
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <FaWhatsapp size={20} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* =======================
          📱 MOBILE HEADER (FIXED)
      ======================== */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <div className="aqua-glass">
          <div className="flex justify-between items-center px-5 py-3">
            <Link
              to="/"
              className="text-2xl font-extrabold text-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              HillWay
            </Link>

            <motion.button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-white text-sm font-bold rounded-full shadow-md"
              whileTap={{ scale: 0.95 }}
              style={{
                background: COLORS.alpine,
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <FaBars size={18} />
              Menu
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* =======================
          📱 MOBILE MENU (Glass)
      ======================== */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[60]"
              style={{
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(4px)",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-[2.5rem] overflow-hidden glass-mobile"
              style={{ maxHeight: "85vh", overflowY: "auto" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E6F95] opacity-30 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D9A441] opacity-20 blur-[80px] pointer-events-none" />

              <div className="p-8 relative z-10 flex flex-col items-center">
                <div className="w-12 h-1.5 rounded-full bg-white/20 mb-8" />

                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-6 right-6 p-2.5 bg-white/10 rounded-full text-white hover:bg-white/20 transition border border-white/10"
                >
                  <FaTimes size={16} />
                </button>

                <div className="w-full space-y-3">
                  {navLinks.map((link, i) => {

                    // Mobile: Flatten Dropdowns for simplicity
                    if (link.children) {
                      return (
                        <div key={link.id} className="space-y-3 p-4 bg-white/5 rounded-3xl border border-white/5">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">{link.label}</p>
                          {link.children.map((child) => {
                            const isActive = location.pathname === child.path;
                            return (
                              <Link
                                key={child.path}
                                to={child.path}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-4 px-6 py-4 rounded-full text-lg font-bold transition-all w-full relative overflow-hidden"
                                style={{
                                  background: isActive ? COLORS.gold : "rgba(255, 255, 255, 0.03)",
                                  color: isActive ? COLORS.navy : COLORS.white,
                                  border: isActive ? `1px solid ${COLORS.gold}` : "1px solid rgba(255, 255, 255, 0.05)",
                                  fontFamily: "'Inter', sans-serif"
                                }}
                              >
                                <span className="text-xl flex items-center justify-center mr-2">
                                  {child.icon}
                                </span>
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )
                    }

                    // Standard Mobile Link
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-4 px-6 py-4 rounded-full text-lg font-bold transition-all w-full relative overflow-hidden"
                          style={{
                            background: isActive ? COLORS.gold : "rgba(255, 255, 255, 0.03)",
                            color: isActive ? COLORS.navy : COLORS.white,
                            border: isActive ? `1px solid ${COLORS.gold}` : "1px solid rgba(255, 255, 255, 0.05)",
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          <AnimatePresence>
                            {isActive && (
                              <motion.span
                                initial={{ scale: 0, rotate: -45, width: 0 }}
                                animate={{ scale: 1.2, rotate: -5, width: "auto" }}
                                exit={{ scale: 0, width: 0 }}
                                className="text-xl flex items-center justify-center mr-2"
                              >
                                {link.icon}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.a
                  href={whatsappLink}
                  target="_blank"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-3 w-full mt-8 py-4 rounded-full font-bold text-lg text-white shadow-xl active:scale-95 transition-transform"
                  style={{
                    background: COLORS.forest,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  <FaWhatsapp size={24} />
                  Chat on WhatsApp
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}