// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import ReviewsCarousel from "../components/ReviewsCarousel";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import { tourData } from "../data/mockTours";
import { motion } from "framer-motion";

// Enhanced NatureOverlay with MORE VISIBLE blobs
function NatureOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 w-full h-full z-0 overflow-hidden">
      {/* Large top left blob - MORE VISIBLE */}
      <svg
        className="absolute -top-24 -left-24 w-[520px] h-[420px] opacity-50"
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M200,40 Q260,0 400,60 Q500,100 480,230 Q460,370 280,400 Q100,420 60,290 Q20,150 140,90 Q180,70 200,40 Z"
          fill="url(#gradient1)"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Bottom right teal blob - MORE VISIBLE */}
      <svg
        className="absolute -bottom-32 -right-32 w-[440px] h-[350px] opacity-40"
        viewBox="0 0 440 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M140,30 Q220,0 360,80 Q440,120 420,220 Q400,320 240,340 Q80,350 40,260 Q0,170 90,90 Q120,60 140,30 Z"
          fill="url(#gradient2)"
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Small floating blob center - MORE VISIBLE */}
      <svg
        className="absolute top-1/2 left-1/2 w-36 h-36 opacity-35 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 144 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M45,28 Q72,5 112,32 Q139,49 124,82 Q109,115 71,127 Q33,139 16,101 Q-1,63 29,40 Q41,31 45,28 Z"
          fill="url(#gradient3)"
        />
        <defs>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Home() {
  const navigate = useNavigate();

  const featured = tourData.slice(0, 3).map(tour => ({
    id: tour.id,
    title: tour.title.split(' - ')[0],
    subtitle: tour.subtitle,
    basePrice: tour.basePrice,
    img: tour.img,
  }));

  function onView(p) {
    navigate(`/tours/${p.id}`);
  }

  return (
    <div 
      className="relative min-h-screen overflow-x-hidden"
    >
      <div className="relative z-10">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Hero />
        </motion.div>

        <motion.div 
          variants={fadeInUp} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.3 }}
        >
          <Features />
        </motion.div>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6 mt-12"
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "var(--dark)" }}>
                Trending Packages
              </h2>
              <p className="text-gray-600 mt-1">Most loved trips by our travelers</p>
            </div>
            <button
              onClick={() => navigate('/tours')}
              className="hidden md:block font-semibold btn-ripple"
              style={{ color: "var(--p1)" }}
            >
              View All Tours →
            </button>
          </div>
          <PackageGrid list={featured} onView={onView} />
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6 mt-20"
        >
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--dark)" }}>
            Traveler Stories
          </h2>
          <ReviewsCarousel />
        </motion.section>

        <motion.section
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6 mt-20 mb-24"
        >
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--dark)" }}>
            Common Questions
          </h2>
          <FAQ />
        </motion.section>
      </div>
    </div>
  );
}
