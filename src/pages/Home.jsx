// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion"; // Added useSpring

// Components
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import ReviewsCarousel from "../components/ReviewsCarousel";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import CartoonLandscape from "../components/CartoonLandscape";
import { tourData } from "../data/mockTours";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

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

  // 1. Get Raw Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 2. THE FIX: Smooth out the scroll data
  // This removes the "jitter" from mobile scrolling before it hits the animation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3. Optimized Transforms
  // Reduced scale range (1.5 was too heavy, 1.2 is smoother)
  const backgroundScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen overflow-x-hidden"
      // Force the main container to create a stacking context
      style={{ isolation: 'isolate' }}
    >
      
      {/* --- OPTIMIZED BACKGROUND --- */}
      {/* We apply 'will-change' to tell the browser to keep this on its own GPU layer */}
      <div 
        style={{ 
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          willChange: 'transform', // CRITICAL FOR MOBILE PERFORMANCE
          pointerEvents: 'none'
        }}
      >
        <CartoonLandscape style={{ scale: backgroundScale, y: backgroundY }} />
      </div>

      {/* --- MAIN CONTENT --- */}
      {/* 'transform: translate3d' forces this content onto a separate layer from the background */}
      <div 
        className="relative z-10"
        style={{ transform: 'translate3d(0,0,0)' }} 
      >
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <Hero />
        </motion.div>

        {/* Features Section */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} // Decreased amount for earlier load
        >
          <Features />
        </motion.div>

        {/* Trending Packages */}
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

        {/* Reviews */}
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

        {/* FAQ */}
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