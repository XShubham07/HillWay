// src/components/ReviewsCarousel.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaStar, FaCheckCircle, FaQuoteLeft } from "react-icons/fa";

export default function ReviewsCarousel() {
  const reviews = [
    { name: "Nandani ⚰️", text: "Loved the journey—beautiful views and a relaxing ride!", img: "/g1.webp" },
    { name: "Anand 💐", text: "A smooth, safe, and unforgettable travel experience!", img: "/g2.webp" },
    { name: "Anshu 🤑", text: "Perfect arrangements and great hospitality.", img: "/g3.webp" },
    { name: "Shubham", text: "The itinerary was perfectly planned, and the guide was incredible.", img: "/g4.webp" },
    { name: "Smita 🦓", text: "A wonderful travel experience from beginning to end!", img: "/g2.webp" },
    { name: "Vishakha 🧸", text: "Perfect journey—comfortable, timely, and well-organized!", img: "/g3.webp" },
    { name: "Suhani", text: "Highly recommended for anyone visiting the mountains.", img: "/g4.webp" },
  ];

  const [index, setIndex] = useState(0);
  const [autoDisabled, setAutoDisabled] = useState(false);
  const timer = useRef(null);

  // Auto slide
  const startAuto = () => {
    if (autoDisabled) return;
    timer.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
  };

  const stopAuto = () => clearInterval(timer.current);

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, [autoDisabled]);

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16 px-4 flex justify-center items-center overflow-hidden h-[450px]">
      <div className="relative w-full max-w-md h-full flex items-center justify-center">

        {reviews.map((review, i) => {
          let offset = i - index;

          if (offset > reviews.length / 2) offset -= reviews.length;
          if (offset < -reviews.length / 2) offset += reviews.length;

          const isCenter = offset === 0;
          const isLeft = offset === -1;
          const isRight = offset === 1;
          const isVisible = Math.abs(offset) <= 1;

          // Base position transforms
          let baseX = "0%";
          let scale = 0.6;
          let opacity = 0;
          let zIndex = 0;
          let blur = "8px";

          if (isCenter) {
            baseX = "0%";
            scale = 1;
            opacity = 1;
            zIndex = 20;
            blur = "0px";
          } else if (isLeft) {
            baseX = "-110%";
            scale = 0.85;
            opacity = 0.6;
            zIndex = 10;
            blur = "3px";
          } else if (isRight) {
            baseX = "110%";
            scale = 0.85;
            opacity = 0.6;
            zIndex = 10;
            blur = "3px";
          }

          return (
            <motion.div
              key={i}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.22}
              dragMomentum={true}        // ⭐ MOMENTUM ENABLED
              onDragStart={() => {
                stopAuto();
                setAutoDisabled(true);
              }}
              onDragEnd={(e, info) => {
                const swipePower = Math.abs(info.offset.x) * info.velocity.x;

                // ⭐ MOMENTUM LOGIC — fast flick → slide
                if (swipePower > 1200 || info.offset.x > 70) {
                  setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
                } else if (swipePower < -1200 || info.offset.x < -70) {
                  setIndex((prev) => (prev + 1) % reviews.length);
                }
              }}
              initial={false}
              animate={{
                x: baseX,
                scale,
                opacity,
                zIndex,
                filter: `blur(${blur})`,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                mass: 0.9,
              }}
              className="absolute w-full bg-white p-8 rounded-[2rem] flex flex-col items-center text-center shadow-2xl border border-white/40"
              style={{
                maxWidth: "360px",
                display: isVisible ? "flex" : "none",
                pointerEvents: "auto",
              }}
            >
              {/* Top Avatar */}
              <div className="relative -mt-12 mb-5">
                <div className="p-1.5 bg-white rounded-full shadow-lg">
                  <img src={review.img} className="w-20 h-20 rounded-full" />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#0891b2] text-white p-1.5 rounded-full text-xs border-[3px] border-white shadow-sm">
                  <FaQuoteLeft />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{review.name}</h3>

              <div className="flex items-center gap-1.5 mb-4 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
                <FaCheckCircle className="text-emerald-500 text-sm" />
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  Verified Traveler
                </span>
              </div>

              <div className="flex gap-1.5 text-amber-400 text-sm mb-5 bg-amber-50/50 px-3 py-1.5 rounded-xl">
                {[...Array(5)].map((_, k) => (
                  <FaStar key={k} />
                ))}
              </div>

              <p className="text-gray-600 text-sm italic">
                "{review.text}"
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 flex gap-2">
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              stopAuto();
              setAutoDisabled(true);
              setIndex(i);
            }}
            className={`h-2 rounded-full transition-all ${i === index ? "bg-[#0891b2] w-8" : "bg-white/40 w-2"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
