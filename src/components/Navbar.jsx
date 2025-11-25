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
      {/* DESKTOP ULTRA PREMIUM NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1
        }}
        className="sticky top-0 w-full z-50 hidden md:block"
      >
        <div className={`navbar-glass ${isDarkBg ? 'navbar-glass-dark' : 'navbar-glass-light'}`}>
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex justify-between items-center">
              {/* LOGO */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Link 
                  to="/" 
                  className={`text-3xl font-black transition-all duration-300 ${
                    isDarkBg 
                      ? 'text-white logo-glow' 
                      : 'text-gray-900 hover:text-cyan-600'
                  }`}
                >
                  HillWay
                </Link>
              </motion.div>

              {/* NAV LINKS */}
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

              {/* WHATSAPP BUTTON */}
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

      {/* MOBILE FLOATING BUTTON */}
      <div className="md:hidden">
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-2xl shadow-cyan-500/50"
        >
          <motion.div 
            animate={{ rotate: open ? 90 : 0 }} 
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {open ? <HiX size={26} /> : <HiMenuAlt3 size={26} />}
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
              />

              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-40 mobile-menu-glass rounded-t-3xl"
              >
                <div className="max-w-md mx-auto p-6 pb-8">
                  <h3 className="text-2xl font-bold text-white mb-5 text-center">Navigation</h3>

                  <div className="space-y-2.5">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.path}
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-5 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                            location.pathname === link.path
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50"
                              : "bg-white/10 text-gray-200 hover:bg-white/20 backdrop-blur-sm"
                          }`}
                        >
                          <span className="text-xl">{link.icon}</span>
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  <motion.a
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 mt-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-xl shadow-green-500/50"
                  >
                    <IoLogoWhatsapp size={22} />
                    Chat on WhatsApp
                  </motion.a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
