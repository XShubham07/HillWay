// src/pages/TourDetailsPage.jsx

import { useParams } from "react-router-dom";
import { getTourById } from "../data/mockTours";
import { useState } from "react";
import BookingSidebar from "../components/BookingSidebar";
import { FaMapMarkerAlt, FaCalendarAlt, FaStar, FaRupeeSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from "framer-motion";

export default function TourDetailsPage() {
  const { id } = useParams();            // <-- FIXED: get 'id' param, not 'tourId'
  const tour = getTourById(id);          // Pass correct id for lookup
  const [activeTab, setActiveTab] = useState('itinerary');

  if (!tour) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold text-red-500">404: Tour Not Found</h1>
        <p className="mt-4 text-gray-600">Sorry, the package you are looking for does not exist.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 mb-24"
    >
      {/* --------------------- HERO & HEADER --------------------- */}
      <div className="flex flex-col lg:flex-row gap-8 mt-10">
        <div className="lg:w-2/3">
          <img
            src={tour.img}
            alt={tour.title}
            className="w-full h-96 object-cover rounded-xl shadow-2xl"
          />
          <h1 className="text-4xl font-extrabold text-[var(--dark)] mt-6">
            {tour.title}
          </h1>
          <p className="text-xl text-gray-600 mt-2">{tour.subtitle}</p>

          <div className="flex items-center gap-6 mt-4 text-gray-700">
            <span className="flex items-center gap-2 font-medium">
              <FaStar className="text-yellow-500" /> {tour.rating} (120 Reviews)
            </span>
            <span className="flex items-center gap-2 font-medium">
              <FaCalendarAlt className="text-[var(--p1)]" /> {tour.title.match(/(\d+)\s*N\s*\/\s*(\d+)\s*D/)?.[0] || 'Custom Days'}
            </span>
            <span className="flex items-center gap-2 font-medium text-lg text-[var(--p2)]">
                <FaRupeeSign /> {tour.basePrice.toLocaleString('en-IN')}{" "}
                <span className="text-sm text-gray-500">per person*</span>
            </span>
          </div>
        </div>
        
        {/* Booking Sidebar on right for desktop */}
        <div className="lg:w-1/3 hidden lg:block">
          <BookingSidebar tour={tour} />
        </div>
      </div>

      {/* --------------------- TABS (ITINERARY & MAP) --------------------- */}
      <div className="mt-12 lg:w-2/3">
        {/* Tab Buttons */}
        <div className="border-b border-gray-200 flex gap-4">
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`
              pb-3 px-4 font-semibold transition-colors 
              ${activeTab === 'itinerary' ? 'text-[var(--p1)] border-b-2 border-[var(--p1)]' : 'text-gray-500 hover:text-[var(--dark)]'}
            `}
          >
            Detailed Itinerary
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`
              pb-3 px-4 font-semibold transition-colors 
              ${activeTab === 'map' ? 'text-[var(--p1)] border-b-2 border-[var(--p1)]' : 'text-gray-500 hover:text-[var(--dark)]'}
            `}
          >
            Route Map
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`
              pb-3 px-4 font-semibold transition-colors 
              ${activeTab === 'details' ? 'text-[var(--p1)] border-b-2 border-[var(--p1)]' : 'text-gray-500 hover:text-[var(--dark)]'}
            `}
          >
            Inclusions
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg border border-white/50">
          
          {/* ITINERARY CONTENT */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {tour.itinerary.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="
                      w-8 h-8 rounded-full 
                      bg-[var(--p2)] text-white font-bold 
                      flex items-center justify-center 
                      shrink-0 shadow-md
                    ">
                      {item.day}
                    </span>
                    {index < tour.itinerary.length - 1 && (
                      <div className="w-0.5 bg-gray-300 h-full my-1" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--dark)]">{item.title}</h3>
                    <p className="text-gray-700 mt-1">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MAP CONTENT */}
          {activeTab === 'map' && (
            <div>
              <h3 className="text-2xl font-bold mb-4 text-[var(--dark)] flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" /> Tour Route Overview
              </h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl border-2 border-gray-200">
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
              <p className="text-sm text-gray-500 mt-3">
                *The map shows the general area covered by this tour. Exact route may vary.
              </p>
            </div>
          )}

          {/* INCLUSIONS CONTENT */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[var(--p1)] mb-3">What's Included?</h3>
                {tour.inclusions.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-500 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-red-500 mb-3">What's Not Included?</h3>
                {/* Mock Exclusions Data */}
                {[
                  "Airfare / Train Tickets",
                  "Lunch on Travel Days",
                  "Personal Expenses (Shopping, tips)",
                  "Any extra activities or entry fees",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaTimesCircle className="text-red-400 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Booking Sidebar for Mobile (Optional: if you want it sticky) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-2xl border-t z-50">
        <BookingSidebar tour={tour} isMobile />
      </div>
      
    </motion.div>
  );
}
