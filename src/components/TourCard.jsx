import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function TourCard({tour}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Normalize images array: Ensure we have a valid array of images
  // If tour.images exists and has items, use it. Otherwise fallback to tour.img, then placeholder.
  const images = (tour.images && tour.images.length > 0) 
    ? tour.images 
    : (tour.img ? [tour.img] : ['/placeholder.jpg']);

  // 1. Reset index if the images array changes (e.g. new data loaded)
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  // 2. Auto-slide effect
  useEffect(() => {
    // If there's only 1 image (or 0), don't start the timer
    if (images.length <= 1) return;
    
    // Randomize start time slightly so all cards don't slide exactly at the same ms
    const delay = 3000 + Math.random() * 1000;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, delay);

    return () => clearInterval(interval);
  }, [images]); // Dependency on 'images' ensures closure has the correct array

  return (
    <motion.div 
      whileHover={{y:-6}} 
      transition={{type:'spring'}} 
      className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col relative group"
    >
      <div className="relative h-56 shrink-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img 
            key={`${tour.id}-${currentImageIndex}`} // Unique key forces re-render for animation
            src={images[currentImageIndex]} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            alt={tour.title}
          />
        </AnimatePresence>
        
        {/* Dark overlay for text legibility at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />

        <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-bold text-gray-800 z-10 shadow-sm">
            {tour.days || (tour.nights ? `${tour.nights}N / ${tour.nights + 1}D` : 'Custom')}
        </div>
        
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[var(--p1)] to-[var(--p2)] text-white px-2 py-1 rounded font-bold shadow-md z-10">
            {tour.price || `₹${tour.basePrice?.toLocaleString()}`}
        </div>

        {/* Image Indicators (Dots) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between bg-white z-20">
        <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{tour.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tour.subtitle || tour.summary}</p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-yellow-500 font-bold"><FaStar /> {tour.rating || 4.5}</div>
          <button className="px-4 py-2 bg-[var(--p1)] hover:bg-cyan-700 text-white rounded-lg font-semibold transition shadow-sm">View</button>
        </div>
      </div>
    </motion.div>
  );
}