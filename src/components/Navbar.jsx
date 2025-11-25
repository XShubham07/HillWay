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
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const aquamorphicStyles = {
    background: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(25px) saturate(200%)",
    WebkitBackdropFilter: "blur(25px) saturate(200%)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
  };

  const darkAquamorphicStyles = {
    background: "rgba(15, 23, 42, 0.15)",
    backdropFilter: "blur(25px) saturate(180%)",
    WebkitBackdropFilter: "blur(25px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="sticky top-0 w-full z-50 hidden md:block"
      >
        <div
          className={`navbar-aquamorphic ${
            isDarkBg ? "dark-aquamorphic" : "light-aquamorphic"
          }`}
          style={
            isDarkBg
              ? darkAquamorphicStyles
              : {
                  background: "rgba(255, 255, 255, 0.65)",
                  backdropFilter: "blur(25px)",
                }
          }
        >
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className={`text-3xl font-black ${
                  isDarkBg ? "text-white" : "text-gray-900"
                }`}
              >
                HillWay
              </Link>

              <div className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      location.pathname === link.path
                        ? "text-white bg-gradient-to-r from-cyan-500 to-blue-600"
                        : isDarkBg
                        ? "text-gray-100 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl shadow-lg"
              >
                <IoLogoWhatsapp size={19} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE STICKY HEADER */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 w-full z-50 md:hidden"
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(25px)",
          }}
          className="border-b border-white/50"
        >
          <div className="flex justify-between items-center px-4 py-2.5">
            <Link to="/" className="text-xl font-black text-gray-900">
              HillWay
            </Link>

            <a
              href={whatsappLink}
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs rounded-lg shadow-md"
            >
              <IoLogoWhatsapp size={15} />
              WhatsApp
            </a>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU BUTTON */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          onClick={() => setOpen(!open)}
          className="shadow-2xl rounded-full px-6 h-14 flex items-center gap-3 font-bold border-white/50"
          style={{
            background: "linear-gradient(135deg,#06b6d4,#0284c7)",
            color: "white",
          }}
        >
          <motion.div animate={{ rotate: open ? 180 : 0 }}>
            <HiMenuAlt3 size={26} />
          </motion.div>
          <span>Menu</span>
        </motion.button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />

            {/* MOBILE POPUP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.75, opacity: 0, y: 60 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="w-full max-w-sm mx-6 pointer-events-auto relative"
              >
                {/* GLASS CONTAINER */}
                <div
                  className="rounded-3xl overflow-hidden relative"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(40px) saturate(240%)",
                    border: "1px solid rgba(255,255,255,0.35)",
                    boxShadow:
                      "0 25px 70px rgba(100,180,255,0.28), inset 0 2px 1px rgba(255,255,255,0.5)",
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(255,255,255,0.4),transparent 40%,rgba(255,255,255,0.25))",
                      mixBlendMode: "overlay",
                    }}
                  />

                  <div className="p-7 relative z-10">
                    <div className="flex justify-center mb-5">
                      <motion.button
                        onClick={() => setOpen(false)}
                        whileHover={{ rotate: 90 }}
                        className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg"
                      >
                        <HiX size={26} className="text-gray-700" />
                      </motion.button>
                    </div>

                    <h3 className="text-center text-xl font-bold mb-6 text-gray-900">
                      Navigation
                    </h3>

                    <div className="space-y-4">
                      {navLinks.map((link, i) => (
                        <motion.div
                          key={link.path}
                          initial={{ x: -40, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + i * 0.1 }}
                        >
                          <Link
                            to={link.path}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-5 px-7 py-4 rounded-2xl text-lg font-bold ${
                              location.pathname === link.path
                                ? "text-white bg-cyan-600"
                                : "text-gray-800 bg-white/40"
                            } backdrop-blur-xl border border-white/50 shadow-lg`}
                          >
                            <span className="text-2xl">{link.icon}</span>
                            {link.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <motion.a
                      href={whatsappLink}
                      target="_blank"
                      className="flex items-center justify-center gap-4 w-full mt-8 py-5 rounded-2xl font-bold text-lg text-white bg-green-600"
                    >
                      <IoLogoWhatsapp size={30} />
                      Chat on WhatsApp
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
