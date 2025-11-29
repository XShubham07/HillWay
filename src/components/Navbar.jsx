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

  const navLinks = [
    { path: "/", label: "Home", icon: <AiOutlineHome /> },
    { path: "/tours", label: "Tours", icon: <MdOutlineTravelExplore /> },
    { path: "/packages", label: "Packages", icon: <BsBox /> },
    { path: "/blog", label: "Blog", icon: <TbArticle /> },
    { path: "/contact", label: "Contact", icon: <IoCallOutline /> },
  ];

  const whatsappNumber = "917004165004";
  const whatsappMessage = "Hi! I'm interested in booking a tour with HillWay.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

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
          className="navbar-aquamorphic"
          style={{
            background: "linear-gradient(135deg, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.75), rgba(55, 65, 81, 0.65))",
            backdropFilter: "blur(50px) saturate(250%)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3.5">
            <div className="flex justify-between items-center">
              <Link
                to="/"
                className="text-3xl font-black text-white drop-shadow-lg"
                style={{
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)",
                }}
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
                        : "text-gray-100 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-colors duration-300"
                style={{
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <IoLogoWhatsapp size={19} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE HEADER WITH MENU BUTTON */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 w-full z-50 md:hidden"
      >
        <div
          style={{
            background: "linear-gradient(135deg, rgba(17, 24, 39, 0.85), rgba(31, 41, 55, 0.75), rgba(55, 65, 81, 0.65))",
            backdropFilter: "blur(50px) saturate(250%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          }}
        >
          <div className="flex justify-between items-center px-4 py-2.5">
            <Link
              to="/"
              className="text-xl font-black text-white drop-shadow-lg"
              style={{
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)",
              }}
            >
              HillWay
            </Link>

            {/* MENU BUTTON NOW IN HEADER */}
            <motion.button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-600 text-white text-sm rounded-xl shadow-md hover:bg-cyan-700 transition-colors duration-300"
              whileTap={{ scale: 0.9 }}
              style={{
                backdropFilter: "blur(100px) saturate(00%)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              <HiMenuAlt3 size={20} />
              Menu
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU POPUP */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: "spring", stiffness: 300, damping: 25, duration: 0.4 }}
                className="w-full max-w-sm mx-6 pointer-events-auto relative"
              >
                {/* Glass Container */}
                <div
                  className="rounded-3xl overflow-hidden relative"
                  style={{
                    background: "linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(31, 41, 55, 0.8), rgba(55, 65, 81, 0.7))",
                    backdropFilter: "blur(50px) saturate(250%)",
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
                    {/* FIXED CENTERED CLOSE BUTTON */}
                    <div className="flex justify-center items-center mb-5">
                      <motion.button
                        onClick={() => setOpen(false)}
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-xl border border-white/40 shadow-lg"
                      >
                        <HiX size={26} className="text-gray-700" />
                      </motion.button>
                    </div>

                    <h3 className="text-center text-xl font-bold mb-6 text-white drop-shadow-lg">
                      Navigation
                    </h3>

                    <div className="space-y-4">
                      {navLinks.map((link, i) => (
                        <motion.div
                          key={link.path}
                          initial={{ x: -40, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: "easeOut" }}
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
                      className="flex items-center justify-center gap-4 w-full mt-8 py-5 rounded-2xl font-bold text-lg text-white bg-green-600 hover:bg-green-700 transition-colors duration-300"
                      style={{
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                      }}
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