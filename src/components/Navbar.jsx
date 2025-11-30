// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ICONS
import { FaHome, FaMountain, FaBlog, FaPhone, FaWhatsapp, FaBars, FaTimes } from "react-icons/fa";

// --- 🎨 COLOR PALETTE ---
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
  const location = useLocation();

  // --- 🔒 LOCK BODY SCROLL ---
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

  const navLinks = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/tours", label: "Tours", icon: <FaMountain /> },
    { path: "/blog", label: "Blog", icon: <FaBlog /> },
    { path: "/contact", label: "Contact", icon: <FaPhone style={{ transform: 'scaleX(-1)' }} /> },
  ];

  const whatsappNumber = "917004165004";
  const whatsappMessage = "Hi! I'm interested in booking a tour with HillWay.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      {/* CSS OVERRIDE FOR MOBILE GLASS */}
      <style>{`
        .glass-mobile {
          background: rgba(16, 42, 67, 0.35) !important; /* Lower opacity for blur visibility */
          backdrop-filter: blur(30px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(30px) saturate(180%) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.3) !important;
        }
      `}</style>

      {/* =======================
          🖥️ DESKTOP NAVBAR
      ======================== */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 w-full z-50 hidden md:block"
      >
        <div
          style={{
            background: `rgba(16, 42, 67, 0.85)`,
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link
                to="/"
                className="text-3xl font-extrabold text-white tracking-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                HillWay
              </Link>

              {/* Links Container (Background Removed as requested) */}
              <div className="flex items-center gap-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="relative px-6 py-2.5 rounded-full text-sm transition-all duration-300 z-10 flex items-center gap-2 overflow-hidden"
                      style={{
                        color: isActive ? COLORS.navy : COLORS.stone,
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: isActive ? 800 : 500,
                      }}
                    >
                      {/* Active Background: Solid Accent + Round Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="active-bg"
                          className="absolute inset-0 rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          style={{
                            background: COLORS.gold,
                          }}
                        />
                      )}

                      {/* Icon Animation: Visible ONLY when active */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0, rotate: -45, width: 0, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, width: "auto", opacity: 1 }}
                            exit={{ scale: 0, width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative z-10 flex items-center justify-center"
                          >
                            {link.icon}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* WhatsApp Button */}
              <a
                href={whatsappLink}
                target="_blank"
                className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300"
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
          📱 MOBILE HEADER
      ======================== */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 w-full z-50 md:hidden"
      >
        <div
          style={{
            background: `rgba(16, 42, 67, 0.8)`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
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
                border: "1px solid rgba(255, 255, 255, 0.1)",
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
            {/* Dark Backdrop */}
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

            {/* Menu Drawer */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-[2.5rem] overflow-hidden glass-mobile"
              style={{ maxHeight: "85vh" }}
            >
              {/* Internal Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E6F95] opacity-30 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D9A441] opacity-20 blur-[80px] pointer-events-none" />

              <div className="p-8 relative z-10 flex flex-col items-center">
                
                {/* Handle */}
                <div className="w-12 h-1.5 rounded-full bg-white/20 mb-8" />

                {/* Close */}
                <button 
                  onClick={() => setOpen(false)}
                  className="absolute top-6 right-6 p-2.5 bg-white/10 rounded-full text-white hover:bg-white/20 transition border border-white/10"
                >
                  <FaTimes size={16} />
                </button>

                {/* Links */}
                <div className="w-full space-y-3">
                  {navLinks.map((link, i) => {
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
                            background: isActive ? COLORS.gold : "rgba(0, 0, 0, 0.2)",
                            color: isActive ? COLORS.navy : COLORS.white,
                            border: isActive ? `1px solid ${COLORS.gold}` : "1px solid rgba(255, 255, 255, 0.05)",
                            fontFamily: "'Inter', sans-serif"
                          }}
                        >
                          {/* Icon Animation on Mobile too */}
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

                {/* WhatsApp */}
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