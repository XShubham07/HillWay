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

// Beautiful Animated Background with Zoom Effect
function AnimatedBackground() {
  return (
    <>
      {/* Main gradient background */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50"></div>
        
        {/* Animated gradient orbs with zoom effect */}
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 100%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(45, 212, 191, 0.4) 0%, rgba(20, 184, 166, 0.2) 50%, transparent 100%)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%)'
          }}
          animate={{
            scale: [1, 1.4, 1],
            x: [-250, -200, -250],
            y: [-250, -300, -250],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating animated shapes */}
      <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        {/* Mountain peaks silhouette */}
        <motion.svg
          className="absolute bottom-0 left-0 w-full h-64 opacity-10"
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          <path
            d="M0,200 L0,120 L150,40 L300,100 L450,20 L600,80 L750,30 L900,90 L1050,50 L1200,110 L1200,200 Z"
            fill="url(#mountainGradient)"
          />
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Floating circles with zoom animation */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${80 + i * 30}px`,
              height: `${80 + i * 30}px`,
              background: `radial-gradient(circle, rgba(6, 182, 212, ${0.15 - i * 0.02}) 0%, transparent 70%)`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 15}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Animated wave patterns */}
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 opacity-10"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="url(#waveGradient)"
              d="M47.5,-57.8C59.9,-49.1,67.3,-33.1,70.4,-16.3C73.5,0.5,72.3,18,64.8,32.1C57.3,46.2,43.5,56.9,28.3,62.4C13.1,67.9,-3.5,68.2,-19.3,63.8C-35.1,59.4,-50.1,50.3,-59.3,37.2C-68.5,24.1,-71.9,7,-69.8,-9.3C-67.7,-25.6,-60.1,-41.1,-48.2,-49.9C-36.3,-58.7,-18.2,-60.8,-0.5,-60.2C17.1,-59.6,35.1,-66.5,47.5,-57.8Z"
              transform="translate(100 100)"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Particle dots with subtle movement */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-2 h-2 rounded-full bg-cyan-400"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Animated mesh gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(6, 182, 212, 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(45, 212, 191, 0.15) 0px, transparent 50%),
              radial-gradient(at 50% 50%, rgba(14, 165, 233, 0.1) 0px, transparent 50%)
            `
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Subtle grid pattern overlay */}
      <div 
        className="fixed inset-0 w-full h-full -z-10 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(8, 145, 178, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8, 145, 178, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </>
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
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Content */}
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