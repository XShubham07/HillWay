// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// ICONS
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineTravelExplore } from "react-icons/md";
import { TbArticle } from "react-icons/tb";
import { IoCallOutline, IoLogoWhatsapp } from "react-icons/io5";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { BsBox } from "react-icons/bs";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";
  const isDarkBg = isHomePage && !scrolled;

  const navLinks = [
    { path: "/", label: "Home", icon: <AiOutlineHome /> },
    { path: "/tours", label: "Tours", icon: <MdOutlineTravelExplore /> },
    { path: "/packages", label: "Packages", icon: <BsBox /> },
    { path: "/blog", label: "Blog", icon: <TbArticle /> },
    { path: "/contact", label: "Contact", icon: <IoCallOutline /> },
  ];

  const whatsappNumber = "919800000000";
  const whatsappMessage = "Hi! I'm interested in booking a tour with HillWay.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="sticky top-0 w-full z-50 hidden md:block"
      >
        <div className={`navbar-glass ${isDarkBg ? 'navbar-glass-dark' : 'navbar-glass-light'}`}>
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link
                  to="/"
                  className={`text-3xl font-black transition-all duration-300 ${
                    isDarkBg ? 'text-white logo-glow' : 'text-gray-900 hover:text-cyan-600'
                  }`}
                >
                  HillWay
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center gap-1"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      to={link.path}
                      className={`relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'text-white'
                          : isDarkBg
                          ? 'text-gray-100 hover:text-white hover:bg-white/10'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
                      }`}
                    >
                      {location.pathname === link.path && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/40 -z-10"
                          transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(34,197,94,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300"
                >
                  <IoLogoWhatsapp size={19} />
                  WhatsApp
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE STICKY HEADER */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 w-full z-50 md:hidden"
      >
        <div className={`navbar-glass ${isDarkBg ? 'navbar-glass-dark' : 'navbar-glass-light'}`}>
          <div className="flex justify-between items-center px-4 py-2.5">
            <Link
              to="/"
              className={`text-xl font-black transition-all duration-300 ${
                isDarkBg ? 'text-white logo-glow-mobile' : 'text-gray-900'
              }`}
            >
              HillWay
            </Link>
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-xs rounded-lg shadow-md shadow-green-500/30"
            >
              <IoLogoWhatsapp size={15} />
              WhatsApp
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* MOBILE BOTTOM NAVIGATION BUTTON + AQUA GLASS MENU */}
      {isHomePage && (
        <div className="fixed bottom-0 left-0 w-full flex md:hidden justify-center items-end pointer-events-none z-50">
          {/* Glasmorphic Navigation Button */}
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
            onClick={() => setOpen(!open)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            className="pointer-events-auto mb-8 shadow-2xl rounded-full flex items-center gap-3 justify-center w-fit px-6 h-14 font-bold tracking-wider"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(100, 180, 255, 0.18), inset 0 2px 8px rgba(255, 255, 255, 0.2)',
              color: '#555',
            }}
          >
            <HiMenuAlt3 size={26} />
            <span className="text-sm uppercase">Navigation</span>
          </motion.button>

          <AnimatePresence>
            {open && (
              <>
                {/* Dark Blur Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pointer-events-auto"
                />

                {/* PREMIUM AQUA GLASS MENU PANEL */}
                <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
                  <motion.div
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 330, damping: 32 }}
                    className="rounded-t-3xl w-full max-w-md pointer-events-auto overflow-hidden relative"
                    style={{
                      marginLeft: "16px",
                      marginRight: "16px",
                      // 🔥 ULTIMATE AQUA GLASSMORPHISM 🔥
                      background: "rgba(255, 255, 255, 0.18)",
                      backdropFilter: "blur(28px) saturate(190%)",
                      WebkitBackdropFilter: "blur(28px) saturate(190%)",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      borderTop: "1px solid rgba(255, 255, 255, 0.6)",
                      boxShadow: `
                        0 8px 40px rgba(100, 150, 255, 0.2),
                        0 -4px 20px rgba(180, 220, 255, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.4)
                      `,
                      backgroundImage: "linear-gradient(135deg, rgba(180, 230, 255, 0.3) 0%, rgba(220, 250, 255, 0.15) 100%)",
                    }}
                  >
                    {/* Subtle Noise Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                      }}
                    />

                    <div className="p-6 pb-10 relative">
                      {/* Close Button */}
                      <div className="flex justify-center mb-4">
                        <motion.button
                          onClick={() => setOpen(false)}
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl shadow-lg flex items-center justify-center border border-white/50"
                        >
                          <HiX size={26} className="text-gray-700" />
                        </motion.button>
                      </div>

                      <h3 className="text-center text-2xl font-bold mb-6 text-gray-800 tracking-wide">
                        Navigation
                      </h3>

                      {/* Nav Links with Glass Cards */}
                      <div className="space-y-3">
                        {navLinks.map((link, i) => (
                          <motion.div
                            key={link.path}
                            initial={{ x: -40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                          >
                            <Link
                              to={link.path}
                              onClick={() => setOpen(false)}
                              className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-lg transition-all duration-300 border
                                ${location.pathname === link.path
                                  ? "bg-white/80 text-gray-900 shadow-2xl border-white/60"
                                  : "bg-white/25 text-gray-800 hover:bg-white/45 border-white/40"
                                }`}
                              style={{
                                backdropFilter: "blur(12px)",
                                boxShadow: location.pathname === link.path
                                  ? "0 10px 30px rgba(100, 180, 255, 0.25), inset 0 1px 0 rgba(255,255,255,0.6)"
                                  : "0 6px 20px rgba(100, 180, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.3)",
                              }}
                            >
                              <span className="text-2xl">{link.icon}</span>
                              {link.label}
                            </Link>
                          </motion.div>
                        ))}
                      </div>

                      {/* WhatsApp Button */}
                      <motion.a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center justify-center gap-3 w-full mt-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl border border-white/40"
                        style={{
                          boxShadow: "0 12px 40px rgba(34, 197, 94, 0.35), inset 0 2px 8px rgba(255,255,255,0.3)",
                        }}
                      >
                        <IoLogoWhatsapp size={28} />
                        Chat on WhatsApp
                      </motion.a>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}