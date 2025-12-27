import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaQuoteRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useIsMobile } from "../hooks/useIsMobile";

const reviews = [
  { name: "Nandani", text: "Loved the journey—beautiful views and a relaxing ride!", loc: "Gangtok" },
  { name: "Anand", text: "A smooth, safe, and unforgettable travel experience!", loc: "Pelling" },
  { name: "Anshu", text: "Perfect arrangements and great hospitality.", loc: "Darjeeling" },
  { name: "Shubham", text: "The itinerary was perfectly planned, and the guide was incredible.", loc: "Sikkim" },
  { name: "Smita", text: "A wonderful travel experience from beginning to end!", loc: "Lachung" },
  { name: "Vishakha", text: "Perfect journey—comfortable, timely, and well-organized!", loc: "Gangtok" },
  { name: "Suhani", text: "Highly recommended for anyone visiting the mountains.", loc: "Zuluk" },
];

export default function ReviewsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useIsMobile();
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
    setPaused(true);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setPaused(true);
  };

  const handleTouchStart = (e) => {
    setPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div 
      className="relative w-full max-w-7xl mx-auto px-2 md:px-4 py-8 md:py-16 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }} 
    >
      <div className="relative h-[320px] md:h-[400px] flex items-center justify-center perspective-1000">
        {reviews.map((review, i) => {
          let offset = (i - index);
          if (offset < -Math.floor(reviews.length / 2)) offset += reviews.length;
          if (offset > Math.floor(reviews.length / 2)) offset -= reviews.length;

          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2; 

          if (!isVisible) return null; 

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                x: offset === 0 ? "0%" : offset === -1 ? "-65%" : offset === 1 ? "65%" : offset * 100 + "%",
                scale: isActive ? 1 : 0.85,
                opacity: isActive ? 1 : 0.3,
                zIndex: isActive ? 20 : 10,
                rotateY: isMobile ? 0 : (isActive ? 0 : offset < 0 ? 15 : -15),
              }}
              transition={{ 
                type: "spring", 
                stiffness: 150,
                damping: 20, 
                mass: 0.8 
              }}
              className="absolute w-[95%] md:w-[60%] max-w-[700px] cursor-grab active:cursor-grabbing will-change-transform"
              style={{ 
                perspective: "1000px",
                backfaceVisibility: "hidden"
              }}
            >
              {/* --- CARD CONTENT --- */}
              <div className={`
                relative h-full overflow-hidden
                
                /* MOBILE: Solid Sunrise Gold White (100% Opacity) - NO BLUR to ensure crisp text */
                bg-[#FFF8E7]

                /* DESKTOP: Transparent Glass Effect */
                md:bg-gradient-to-br md:from-[#FFF8E7]/90 md:via-[#FFECB3]/60 md:to-[#FFE082]/40
                md:backdrop-blur-md 
                
                border border-[#FFD700]/30
                rounded-[2rem] md:rounded-[2.5rem] 
                p-6 md:p-12 
                flex flex-col md:flex-row items-center gap-4 md:gap-8
                transition-shadow duration-500
                ${isActive ? "shadow-lg md:shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border-[#FFD700]/60" : "shadow-none"}
              `}>

                {/* Golden Frosted Glow (Desktop Only) */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/3 opacity-60 pointer-events-none" />

                {/* Simplified Icon */}
                <FaQuoteRight className="absolute top-6 right-6 text-[#FFD54A]/40 text-4xl md:text-6xl pointer-events-none" />

                {/* Avatar Section */}
                <div className="flex flex-col items-center shrink-0 gap-2 md:gap-4 mt-2 md:mt-0 relative z-10">
                  <div className="
                    w-16 h-16 md:w-28 md:h-28 rounded-full 
                    bg-gradient-to-br from-[#FFD89B] via-[#FFD05A] to-[#F7B500]
                    shadow-md
                    border-2 border-[#FFD700]/70
                    flex items-center justify-center relative overflow-hidden
                  ">
                    <span className="text-2xl md:text-5xl font-black text-[#022c22] font-montserrat relative z-10">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-center">
                    <h4 className="text-[#021F18] font-montserrat font-bold text-base md:text-lg tracking-wide">
                      {review.name}
                    </h4>
                  </div>
                </div>

                {/* Text Section */}
                <div className="flex-1 text-center md:text-left z-10 flex flex-col justify-center h-full pb-4 md:pb-0">
                  
                  {/* Rating + Location Row */}
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3 md:mb-5">
                    <div className="flex gap-1 text-[#FFD54A] text-xs md:text-sm">
                      {[...Array(5)].map((_, k) => <FaStar key={k} />)}
                    </div>
                    {/* Dot Separator */}
                    <span className="w-1 h-1 rounded-full bg-[#b48606]/40" />
                    <span className="text-[#b48606] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      {review.loc}
                    </span>
                  </div>

                  <p className="text-[#06231b] text-base md:text-2xl font-medium font-inter italic leading-relaxed line-clamp-4 md:line-clamp-none">
                    "{review.text}"
                  </p>
                  
                  {isActive && (
                    <div className="mt-4 md:mt-6 inline-flex self-center md:self-start px-3 py-1 rounded-full bg-green-50/50 border border-green-400/30 text-[#064e3b] text-[10px] font-bold uppercase tracking-wider">
                      Verified Traveler
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center justify-center gap-6 md:gap-8 mt-4 relative z-30">
        <button 
          onClick={handlePrev} 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white border border-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:text-[#022c22] transition-colors duration-300"
          aria-label="Previous Review"
        >
          <FaChevronLeft className="text-sm md:text-lg" />
        </button>
        
        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <button 
              key={i} 
              onClick={() => { setIndex(i); setPaused(true); }} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={handleNext} 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 hover:bg-white border border-white/30 backdrop-blur-sm flex items-center justify-center text-white hover:text-[#022c22] transition-colors duration-300"
          aria-label="Next Review"
        >
          <FaChevronRight className="text-sm md:text-lg" />
        </button>
      </div>
    </div>
  );
}