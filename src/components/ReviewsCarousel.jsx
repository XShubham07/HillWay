// src/components/ReviewsCarousel.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaCheckCircle, FaQuoteLeft } from "react-icons/fa";

export default function ReviewsCarousel() {
  const reviews = [
    {
      name: 'Nandani ⚰️',
      text: 'Loved the journey—beautiful views and a relaxing ride!',
      img: '/g1.webp'
    },
    {
      name: 'Anand 💐',
      text: 'A smooth, safe, and unforgettable travel experience!',
      img: '/g2.webp'
    },
    {
      name: 'Anshu 🤑',
      text: 'Perfect arrangements and great hospitality.',
      img: '/g3.webp'
    },
    {
      name: 'Shubham',
      text: 'The itinerary was perfectly planned, and the guide was incredible.',
      img: '/g4.webp'
    },
    {
      name: 'Smita 🦓',
      text: 'A wonderful travel experience from beginning to end!',
      img: '/g2.webp'
    },
    {
      name: 'Vishakha 🧸',
      text: 'Perfect journey—comfortable, timely, and well-organized!',
      img: '/g3.webp'
    },
    {
      name: 'Suhani',
      text: 'Highly recommended for anyone visiting the mountains.',
      img: '/g4.webp'
    }
  ];

  const [index, setIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16 px-4 flex justify-center items-center overflow-hidden h-[450px]">
      
      {/* 3D Card Stack Container */}
      <div className="relative w-full max-w-md h-full flex items-center justify-center perspective-1000">
        {reviews.map((review, i) => {
          // Calculate distance from current index with wrap-around
          let offset = i - index;
          if (offset > reviews.length / 2) offset -= reviews.length;
          if (offset < -reviews.length / 2) offset += reviews.length;

          // Determine visibility and position states
          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;
          const isVisible = isCenter || isLeft || isRight;

          // Compute Animation Values based on offset
          let x = "0%";
          let scale = 0.6;
          let opacity = 0;
          let zIndex = 0;
          let blur = "8px";

          if (isCenter) {
            x = "0%";
            scale = 1;
            opacity = 1;
            zIndex = 20;
            blur = "0px";
          } else if (isLeft) {
            x = "-110%";
            scale = 0.85;
            opacity = 0.6;
            zIndex = 10;
            blur = "3px";
          } else if (isRight) {
            x = "110%";
            scale = 0.85;
            opacity = 0.6;
            zIndex = 10;
            blur = "3px";
          } else if (offset < -1) {
            // Stack up far left (hidden but ready to slide in)
            x = "-220%";
          } else if (offset > 1) {
            // Stack up far right
            x = "220%";
          }

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ x, scale, opacity, zIndex, filter: `blur(${blur})` }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                mass: 1,
              }}
              className="absolute w-full bg-white p-8 rounded-[2rem] flex flex-col items-center text-center cursor-pointer will-change-transform shadow-2xl border border-white/40"
              style={{
                maxWidth: "360px",
                pointerEvents: isCenter ? 'auto' : 'none',
                // Only show shadow on the center card for performance & depth
                boxShadow: isCenter 
                  ? "0 25px 60px -15px rgba(0, 0, 0, 0.3)" 
                  : "none",
                // Hide far-off items to save GPU, but keep immediate neighbors for smooth transition
                display: isVisible || Math.abs(offset) <= 2 ? 'flex' : 'none' 
              }}
              onClick={() => setIndex(i)}
            >
              {/* Profile Image Badge */}
              <div className="relative -mt-12 mb-5">
                <div className="p-1.5 bg-white rounded-full shadow-lg">
                  <img 
                    src={review.img} 
                    alt={review.name} 
                    className="w-20 h-20 rounded-full object-cover border border-gray-100" 
                  />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#0891b2] text-white p-1.5 rounded-full text-xs border-[3px] border-white shadow-sm">
                  <FaQuoteLeft />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{review.name}</h3>
              
              {/* Verified Badge */}
              <div className="flex items-center gap-1.5 mb-4 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
                <FaCheckCircle className="text-emerald-500 text-sm" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Verified Traveler</span>
              </div>

              {/* Stars */}
              <div className="flex gap-1.5 text-amber-400 text-sm mb-5 bg-amber-50/50 px-3 py-1.5 rounded-xl">
                {[...Array(5)].map((_, k) => (
                  <FaStar key={k} className="drop-shadow-sm" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-sm leading-relaxed italic font-medium">
                "{review.text}"
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 flex gap-2 z-30">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 shadow-sm ${i === index ? 'bg-[#0891b2] w-8' : 'bg-white/40 w-2 hover:bg-white/80'}`}
          />
        ))}
      </div>
    </div>
  );
}