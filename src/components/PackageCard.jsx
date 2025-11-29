import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PackageCard({ pkg, p, onCustomize, onView }) {
  const data = pkg || p;
  if (!data) return null;

  const ref = useRef(null);
  
  // --- SCROLL ZOOM LOGIC ---
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // 0.9 (Edge) -> 1.2 (Center) -> 0.9 (Edge)
  const scale = useTransform(scrollYProgress, [0, 0.5, 1.4], [0.9, 0.99, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  return (
    <motion.div 
      ref={ref}
      style={{ scale, opacity }} // Apply Scroll Animation
      className="bg-white rounded-xl shadow-lg overflow-hidden transform-gpu transition-all duration-300"
    >
      <div className="relative overflow-hidden group">
        <img
          src={data.img}
          alt={data.title}
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* SUBTITLE REMOVED FROM IMAGE */}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{data.title}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{data.subtitle}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-[var(--p1)]">
              ₹{data.basePrice?.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">per person</div>
          </div>

          <div className="flex gap-2">
            {onCustomize && (
              <button onClick={onCustomize} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200">
                Customize
              </button>
            )}
            <button onClick={() => onView?.(data)} className="px-4 py-1.5 bg-[var(--p1)] text-white text-sm font-bold rounded hover:bg-cyan-700 shadow-md">
              View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}