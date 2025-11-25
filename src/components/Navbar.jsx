// src/components/Navbar.jsx

import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ICONS
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineTravelExplore } from "react-icons/md";
import { TbArticle } from "react-icons/tb";
import { IoCallOutline } from "react-icons/io5";
import { FaBowOpen } from "react-icons/fa6";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home", icon: <AiOutlineHome /> },
    { path: "/tours", label: "Tours", icon: <MdOutlineTravelExplore /> },
    { path: "/packages", label: "Packages", icon: <FaBowOpen /> },
    { path: "/blog", label: "Blog", icon: <TbArticle /> },
    { path: "/contact", label: "Contact", icon: <IoCallOutline /> },
  ];

  return (
    <>
      {/* DESKTOP GLASSMORPHISM NAVBAR */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full fixed top-0 left-0 z-50 hidden md:block"
      >
        <div className="max-w-7xl mx-auto px-6 py-3">
          {/* Glassmorphism Container */}
          <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-2xl pointer-events-none" />
            
            <div className="relative flex justify-between items-center px-6 py-3">
              {/* LOGO */}
              <Link to="/" className="text-3xl font-black text-white drop-shadow-lg hover:text-cyan-300 transition-colors duration-300">
                HillWay
              </Link>

              {/* NAV LINKS */}
              <div className="flex items-center gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      location.pathname === link.path
                        ? "text-white"
                        : "text-gray-200 hover:text-white"
                    }`}
                  >
                    {/* Active indicator */}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* CTA BUTTONS */}
              <div className="flex items-center gap-3">
                <Link
                  to="/contact"
                  className="px-6 py-2.5 text-white font-semibold rounded-xl backdrop-blur-sm bg-white/10 hover:bg-white/20 border border-white/30 transition-all duration-300"
                >
                  Contact
                </Link>
                <Link
                  to="/tours"
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE - FLOATING BOTTOM NAVIGATION BUTTON */}
      <div className="md:hidden">
        {/* Floating Nav Button */}
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          onClick={() => setOpen(!open)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {open ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
          </motion.div>
        </motion.button>

        {/* Mobile Menu Popup */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 z-40 p-6 pb-8 backdrop-blur-2xl bg-gradient-to-t from-slate-900/95 to-slate-800/90 border-t border-white/20 rounded-t-3xl shadow-2xl"
              >
                <div className="max-w-md mx-auto">
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">Navigation</h3>

                  {/* Nav Links */}
                  <div className="space-y-3">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.path}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                            location.pathname === link.path
                              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                              : "bg-white/10 text-gray-200 hover:bg-white/20"
                          }`}
                        >
                          <span className="text-2xl">{link.icon}</span>
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <Link
                      to="/tours"
                      onClick={() => setOpen(false)}
                      className="block w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-center font-bold rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                    >
                      Book Your Tour Now
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
