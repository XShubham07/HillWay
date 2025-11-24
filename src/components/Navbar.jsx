import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// ICONS
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineTravelExplore } from "react-icons/md";
import { TbArticle } from "react-icons/tb";
import { IoCallOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa6"; // NEW ICON FOR PACKAGES

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-extrabold text-[var(--p1)]">HillWay</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {[
            { to: "/", label: "Home" },
            { to: "/tours", label: "Tours" },
            { to: "/packages", label: "Packages" },  // NEW
            { to: "/blog", label: "Blog" },
            { to: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative px-2 py-1 text-gray-800 font-medium border-b-2 border-transparent hover:border-[var(--p1)] transition-all"
            >
              {item.label}

              {location.pathname === item.to && (
                <span className="absolute left-0 bottom-0 h-[3px] bg-[var(--p1)] w-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 border rounded"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background dim */}
            <motion.div
              className="
                fixed inset-0 
                bg-black/40 
                backdrop-blur-sm
                z-40
              "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* SLIDE-IN DRAWER */}
            <motion.div
              className="
                fixed left-0 top-[1cm] 
                h-[calc(100vh-2in-1cm)] w-72
                bg-white/95 backdrop-blur-[3px]
                rounded-r-2xl shadow-2xl
                z-50 p-6 border-r border-gray-200
                flex flex-col relative
              "
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            >

              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-2xl text-gray-700"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>

              {/* Big Welcome */}
              <div className="mt-6 mb-10">
                <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide">
                  Welcome
                </h1>
              </div>

              {/* Stagger Animation */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 }
                  }
                }}
                className="flex flex-col gap-6 text-lg font-medium"
              >

                {/* HOME */}
                <motion.div variants={{ hidden:{opacity:0,x:-20}, show:{opacity:1,x:0} }} className="flex items-center gap-3">
                  <AiOutlineHome className="text-2xl text-gray-700" />
                  <Link onClick={() => setOpen(false)} to="/" className="text-gray-800">Home</Link>
                </motion.div>

                {/* TOURS */}
                <motion.div variants={{ hidden:{opacity:0,x:-20}, show:{opacity:1,x:0} }} className="flex items-center gap-3">
                  <MdOutlineTravelExplore className="text-2xl text-gray-700" />
                  <Link onClick={() => setOpen(false)} to="/tours" className="text-gray-800">Tours</Link>
                </motion.div>

                {/* PACKAGES — NEW */}
                <motion.div variants={{ hidden:{opacity:0,x:-20}, show:{opacity:1,x:0} }} className="flex items-center gap-3">
                  <FaBoxOpen className="text-2xl text-gray-700" />
                  <Link onClick={() => setOpen(false)} to="/packages" className="text-gray-800">Packages</Link>
                </motion.div>

                {/* BLOG */}
                <motion.div variants={{ hidden:{opacity:0,x:-20}, show:{opacity:1,x:0} }} className="flex items-center gap-3">
                  <TbArticle className="text-2xl text-gray-700" />
                  <Link onClick={() => setOpen(false)} to="/blog" className="text-gray-800">Blog</Link>
                </motion.div>

                {/* CONTACT */}
                <motion.div variants={{ hidden:{opacity:0,x:-20}, show:{opacity:1,x:0} }} className="flex items-center gap-3">
                  <IoCallOutline className="text-2xl text-gray-700" />
                  <Link onClick={() => setOpen(false)} to="/contact" className="text-gray-800">Contact</Link>
                </motion.div>

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
