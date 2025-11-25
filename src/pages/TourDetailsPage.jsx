// src/pages/TourDetailsPage.jsx

import { useParams } from "react-router-dom";
import { getTourById } from "../data/mockTours";
import { useState, useEffect } from "react";
import BookingSidebar from "../components/BookingSidebar";
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRupeeSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function TourDetailsPage() {
  const { id } = useParams();
  const tour = getTourById(id);
  const [activeTab, setActiveTab] = useState('itinerary');
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-red-500">404: Tour Not Found</h1>
        <p className="mt-4 text-gray-600">Sorry, the package you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,69,19,0.6) 0%, rgba(101,67,33,0.3) 50%, transparent 100%)",
            x: cursorXSpring,
            y: cursorYSpring,
          }}
        />
        
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-40 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(30,144,255,0.5) 0%, rgba(0,191,255,0.3) 50%, transparent 100%)",
            top: "20%",
            left: "10%",
          }}
        />

        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full opacity-35 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(255,69,0,0.6) 0%, rgba(255,140,0,0.4) 50%, transparent 100%)",
            bottom: "15%",
            right: "15%",
          }}
        />

        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
          animate={{
            x: [0, 120, 0],
            y: [0, 60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: "radial-gradient(circle, rgba(224,255,255,0.4) 0%, rgba(175,238,238,0.2) 50%, transparent 100%)",
            top: "50%",
            right: "20%",
          }}
        />

        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * 1920,
              y: Math.random() * 1080,
            }}
            animate={{
              x: Math.random() * 1920,
              y: Math.random() * 1080,
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(138,43,226,0.4) 0%, rgba(75,0,130,0.2) 40%, transparent 70%)",
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 mb-24 relative z-10"
      >
        <div className="flex flex-col lg:flex-row gap-8 mt-10">
          <div className="lg:w-2/3">
            <motion.img
              src={tour.img}
              alt={tour.title}
              className="w-full h-96 object-cover rounded-xl shadow-2xl border-2 border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <h1 className="text-4xl font-extrabold text-white mt-6 drop-shadow-lg">
              {tour.title}
            </h1>
            <p className="text-xl text-gray-200 mt-2 drop-shadow-md">{tour.subtitle}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-100">
              <span className="flex items-center gap-2 font-medium bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <FaStar className="text-yellow-400" /> {tour.rating} (120 Reviews)
              </span>
              <span className="flex items-center gap-2 font-medium bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <FaCalendarAlt className="text-cyan-400" /> {tour.title.match(/(\d+)\s*N\s*\/\s*(\d+)\s*D/)?.[0] || 'Custom Days'}
              </span>
              <span className="flex items-center gap-2 font-medium text-lg text-green-300 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                <FaRupeeSign /> {tour.basePrice.toLocaleString('en-IN')} <span className="text-sm text-gray-300">per person*</span>
              </span>
            </div>
          </div>
          
          <div className="lg:w-1/3 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl">
              <BookingSidebar tour={tour} />
            </div>
          </div>
        </div>

        <div className="mt-12 lg:w-2/3">
          <div className="border-b border-white/20 flex gap-4">
            <motion.button
              onClick={() => setActiveTab('itinerary')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`pb-3 px-4 font-semibold transition-all ${activeTab === 'itinerary' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              Detailed Itinerary
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('map')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`pb-3 px-4 font-semibold transition-all ${activeTab === 'map' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              Route Map
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('details')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`pb-3 px-4 font-semibold transition-all ${activeTab === 'details' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-300 hover:text-white'}`}
            >
              Inclusions
            </motion.button>
          </div>

          <motion.div 
            className="mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeTab}
          >
            
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                {tour.itinerary.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-lg">
                        {item.day}
                      </span>
                      {index < tour.itinerary.length - 1 && (
                        <div className="w-0.5 bg-gradient-to-b from-cyan-500 to-transparent h-full my-1" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-gray-200 mt-1">{item.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'map' && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-400" /> Tour Route Overview
                </h3>
                <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl border-2 border-white/20">
                  <iframe
                    title="Tour Map"
                    src={tour.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0"
                  />
                </div>
                <p className="text-sm text-gray-300 mt-3">
                  *The map shows the general area covered by this tour. Exact route may vary.
                </p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-green-400 mb-3">What is Included?</h3>
                  {tour.inclusions.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FaCheckCircle className="text-green-400 shrink-0" />
                      <span className="text-gray-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-red-400 mb-3">What is Not Included?</h3>
                  {["Airfare / Train Tickets", "Lunch on Travel Days", "Personal Expenses (Shopping, tips)", "Any extra activities or entry fees"].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <FaTimesCircle className="text-red-400 shrink-0" />
                      <span className="text-gray-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </div>
        
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-md shadow-2xl border-t border-white/20 z-50">
          <BookingSidebar tour={tour} isMobile />
        </div>
