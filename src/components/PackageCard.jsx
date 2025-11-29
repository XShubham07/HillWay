// src/components/PackageCard.jsx
import React from "react";
import { motion, useInView } from "framer-motion";

export default function PackageCard({ p, onView, index = 0 }) {
  const data = p;
  if (!data) return null;

  const ref = React.useRef(null);
  const isInCenter = useInView(ref, { margin: "-40% 0px -40% 0px" });

  const handleClick = () => onView?.(data);

  return (
    <motion.div
      ref={ref}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-3xl cursor-pointer 
                 aspect-[4/3] w-full shadow-2xl 
                 md:hover:scale-[1.08] md:hover:z-50 
                 transition-all duration-700"
      whileTap={{ scale: 0.96 }}
    >
      <img
        src={data.img}
        alt={data.title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-1400 
                   group-hover:scale-115"
      />

      {/* Default Title — 20% BADA */}
      <div className="absolute inset-x-0 bottom-0 p-10 text-white pointer-events-none z-10">
        <h3 className="text-4xl md:text-5xl font-extrabold drop-shadow-2xl line-clamp-2 leading-tight">
          {data.title}
        </h3>
      </div>

      {/* GLASS PANEL — 20% ZYADA HEIGHT */}
      <motion.div
        initial={{ height: 0 }}
        animate={{
          height: 
            (window.innerWidth >= 768 && ref.current?.matches(":hover")) || 
            (window.innerWidth < 768 && isInCenter) 
              ? "68%" : "0%"   // ← 20% zyada height
        }}
        transition={{ duration: 0.95, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 bg-white/16 backdrop-blur-3xl 
                   border-t-4 border-white/40 rounded-t-3xl overflow-hidden"
      >
        <motion.div
          initial={{ y: 160, opacity: 0 }}
          animate={{
            y: (window.innerWidth >= 768 && ref.current?.matches(":hover")) || 
               (window.innerWidth < 768 && isInCenter) ? 0 : 160,
            opacity: (window.innerWidth >= 768 && ref.current?.matches(":hover")) || 
                     (window.innerWidth < 768 && isInCenter) ? 1 : 0
          }}
          transition={{ duration: 0.95, delay: 0.18 }}
          className="p-10 md:p-12 text-white h-full flex flex-col justify-end"
        >
          <h3 className="text-5xl md:text-6xl font-extrabold drop-shadow-2xl leading-tight">
            {data.title}
          </h3>
          <p className="text-xl md:text-2xl mt-5 opacity-95 leading-relaxed line-clamp-3">
            {data.subtitle}
          </p>

          <div className="mt-12 flex justify-between items-end">
            <div>
              <div className="text-6xl md:text-7xl font-extrabold text-cyan-400 drop-shadow-2xl">
                ₹{data.basePrice?.toLocaleString()}
              </div>
              <div className="text-lg opacity-80 mt-2">per person</div>
            </div>
            <div className="bg-white/40 backdrop-blur-2xl px-10 py-5 rounded-3xl font-bold text-2xl shadow-2xl">
              View Deal →
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}