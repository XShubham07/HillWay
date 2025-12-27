import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { IKImage } from "imagekitio-react";

// Helper to construct the blurred placeholder URL manually
// This mimics 'buildSrc' to ensure reliability without extra imports
const getPlaceholderUrl = (src) => {
  if (!src) return '/placeholder.jpg';
  // Check if it's already an ImageKit URL
  if (src.includes('ik.imagekit.io')) {
    // Append transformation for low quality (q-10) and high blur (bl-90)
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}tr=q-10,bl-90`;
  }
  return src; // Return original if not ImageKit (fallback)
};

export default function TourCard({ tour }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Normalize images array
  const images = (tour.images && tour.images.length > 0)
    ? tour.images
    : (tour.img ? [tour.img] : ['/placeholder.jpg']);

  // 1. Reset loading state and index when the tour changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImgLoaded(false);
  }, [tour.id]);

  // 2. Auto-slide effect
  useEffect(() => {
    if (images.length <= 1) return;

    const delay = 3500 + Math.random() * 1000; // Slight random delay for natural feel
    const interval = setInterval(() => {
      setImgLoaded(false); // Reset load state for the next image
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, delay);

    return () => clearInterval(interval);
  }, [images]);

  // Current image source
  const currentSrc = images[currentImageIndex];
  const placeholderSrc = getPlaceholderUrl(currentSrc);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col relative group border border-gray-100"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative h-64 shrink-0 overflow-hidden bg-gray-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${tour.id}-${currentImageIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Using IKImage for Lazy Loading with your Placeholder Pattern */}
            <IKImage
              src={currentSrc}
              alt={tour.title}
              width={400} // Optimization: Request reasonable size
              height={300}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{
                // Show blurred placeholder as background until loaded
                backgroundImage: !imgLoaded ? `url("${placeholderSrc}")` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                // Smooth fade-in
                transition: "opacity 0.5s ease-in-out, filter 0.5s ease-out",
                filter: imgLoaded ? "blur(0px)" : "blur(20px)", // Extra CSS blur for smoothness
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm z-10">
          {tour.days || (tour.nights ? `${tour.nights}N / ${tour.nights + 1}D` : 'Custom')}
        </div>

        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[var(--p1)] to-[var(--p2)] text-white px-3 py-1 rounded-lg font-bold shadow-lg z-10 text-sm">
          {tour.price || `₹${tour.basePrice?.toLocaleString()}`}
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* TEXT CONTENT */}
      <div className="p-5 flex flex-col flex-1 bg-white relative z-20">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-[var(--p1)] transition-colors">
            {tour.title}
          </h3>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {tour.subtitle || tour.summary || "Explore the unseen beauty of the mountains with our premium guided tours."}
          </p>
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-1 rounded-md">
            <FaStar /> <span>{tour.rating || 4.8}</span>
          </div>
          <button className="px-5 py-2 bg-gray-900 hover:bg-[var(--p1)] text-white rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95">
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}