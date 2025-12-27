// src/components/PackageCard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function PackageCard({ p, onView, index = 0 }) {
  const data = p;
  if (!data) return null;

  const ref = useRef(null);

  // Center based detection (Lenis compatible)
  const isCenterInView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  
  // NEW: Global pricing state
  const [globalPricing, setGlobalPricing] = useState({ standardRoomPrice: 1500 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) setActive(isCenterInView);
  }, [isMobile, isCenterInView]);

  // NEW: Fetch global pricing
  useEffect(() => {
    fetch('https://admin.hillway.in/api/pricing')
      .then((res) => res.json())
      .then((pricingData) => {
        if (pricingData.success && pricingData.data) {
          setGlobalPricing({
            standardRoomPrice: pricingData.data.standardRoomPrice || 1500
          });
        }
      })
      .catch((err) => console.error('Failed to load pricing', err));
  }, []);

  // NEW: Calculate display price (basePrice + standardRoomPrice × nights)
  const displayPrice = React.useMemo(() => {
    const roomPrice = data.pricing?.room?.standard || globalPricing.standardRoomPrice;
    const nights = data.nights || 1;
    return data.basePrice + (roomPrice * nights/3);
  }, [data, globalPricing]);

  return (
    <motion.div
      ref={ref}

      /*BULLET ANIMATION */
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.10
      }}

      /* CHANGED: aspect-[3/4] -> aspect-[4/5] (Shorter, more balanced) */
      className="
        relative w-full aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer
        shadow-2xl group isolate bg-gray-900 transform-gpu
        will-change-transform
      "
      style={{
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}

      onClick={() => onView?.(data)}
      onMouseEnter={() => !isMobile && setActive(true)}
      onMouseLeave={() => !isMobile && setActive(false)}
    >

      {/* Blur Placeholder */}
      <div className={`absolute inset-0 z-0 bg-gray-800 transition-opacity duration-500 ${imgLoaded ? "opacity-0" : "opacity-100"}`} />

      {/* Progressive Loaded Image */}
      <img
        src={data.img}
        alt={data.title}
        loading={index < 2 ? "eager" : "lazy"}
        fetchPriority={index === 0 ? "high" : "auto"}
        decoding="async"
        onLoad={() => setImgLoaded(true)}
        className={`
          absolute inset-0 w-full h-full object-cover duration-700 ease-out will-change-transform
          ${imgLoaded ? "blur-0 scale-100 grayscale-0" : "blur-xl scale-110 grayscale"}
          group-hover:scale-110
        `}
      />

      {/* Gradient Shadow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 z-10" />

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-20">

        {/* Sliding Glass Background */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: active ? "0%" : "100%" }}
          transition={{ type: "spring", damping: 24, stiffness: 140 }}
          className="absolute inset-0 bg-white/10 backdrop-blur-xl border-t border-white/30 rounded-t-3xl will-change-transform"
        />

        {/* Text Content - Adjusted padding for shorter card */}
        <div className="relative p-5 flex flex-row items-end justify-between gap-3">

          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            {/* FIXED: Removed 'truncate', added 'line-clamp-2' for multi-line support */}
            <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight line-clamp-2 drop-shadow-xl">
              {data.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-200 opacity-95 line-clamp-2 leading-snug">
              {data.subtitle || "Premium guided tour"}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold block mb-0.5">
              Starting
            </span>
            <span className="text-lg md:text-xl font-bold text-[#D9A441] drop-shadow-xl block">
              ₹{displayPrice.toLocaleString()}
            </span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
