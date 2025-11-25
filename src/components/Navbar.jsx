// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="sticky top-0 w-full z-50 hidden md:block">
        <div className={`navbar-glass ${isDarkBg ? 'navbar-glass-dark' : 'navbar-glass-light'}`}>
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex justify-between items-center">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
                <Link to="/" className={`text-3xl font-black transition-all duration-300 ${isDarkBg ? 'text-white logo-glow' : 'text-gray-900 hover:text-cyan-600'}`}>HillWay</Link>
              </motion.div>
              <motion.div className="flex items-center gap-1" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
                {navLinks.map((link, i) => (
                  <motion.div key={link.path} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}>
                    <Link to={link.path} className={`relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${location.pathname === link.path ? 'text-white' : isDarkBg ? 'text-gray-100 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'}`}>
                      {location.pathname === link.path && <motion.div layoutId="activeTab" className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/40 -z-10" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
                <motion.a href={whatsappLink} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm rounded-xl shadow-lg">
                  <IoLogoWhatsapp size={19} />WhatsApp
                </motion.a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      <motion.header initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }} className="sticky top-0 w-full z-50 md:hidden">
        <div className={`navbar-glass ${isDarkBg ? 'navbar-glass-dark' : 'navbar-glass-light'}`}>
          <div className="flex justify-between items-center px-4 py-2.5">
            <Link to="/" className={`text-xl font-black transition-all duration-300 ${isDarkBg ? 'text-white' : 'text-gray-900'}`}>HillWay</Link>
            <motion.a href={whatsappLink} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-xs rounded-lg">
              <IoLogoWhatsapp size={15} />WhatsApp
            </motion.a>
          </div>
        </div>
      </motion.header>

      <div className="fixed bottom-0 left-0 w-full flex md:hidden justify-center items-end pointer-events-none z-50">
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }} onClick={() => setOpen(!open)} className="pointer-events-auto mb-8 rounded-full flex items-center gap-3 px-6 h-14 font-bold" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(100,180,255,0.18)', color: '#555' }}>
          <HiMenuAlt3 size={26} /><span className="text-sm uppercase">Navigation</span>
        </motion.button>

        <AnimatePresence>
          {open && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pointer-events-auto" />
              <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
                <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", stiffness: 330 }} className="rounded-t-3xl w-full max-w-md pointer-events-auto overflow-hidden mx-4" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.3)", boxShadow: "0 8px 40px rgba(100,150,255,0.2)" }}>
                  <div className="p-6 pb-10">
                    <div className="flex justify-center mb-4">
                      <button onClick={() => setOpen(false)} className="w-12 h-12 rounded-full bg-white/40 backdrop-blur-xl shadow-lg flex items-center justify-center">
                        <HiX size={26} className="text-gray-700" />
                      </button>
                    </div>
                    <h3 className="text-center text-2xl font-bold mb-6 text-gray-800">Navigation</h3>
                    <div className="space-y-3">
                      {navLinks.map((link) => (
                        <Link key={link.path} to={link.path} onClick={() => setOpen(false)} className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-lg border ${location.pathname === link.path ? "bg-white/80 text-gray-900" : "bg-white/25 text-gray-800"}`} style={{ backdropFilter: "blur(12px)" }}>
                          <span className="text-2xl">{link.icon}</span>{link.label}
                        </Link>
                      ))}
                    </div>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="flex items-center justify-center gap-3 w-full mt-8 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl">
                      <IoLogoWhatsapp size={28} />Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
