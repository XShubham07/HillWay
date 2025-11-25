import { motion } from "framer-motion";

// --- INLINE ICONS (No Dependencies) ---
const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);
const IconHotel = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21V12a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9M10 9a2 2 0 1 1 4 0v0a2 2 0 1 1-4 0v0"/></svg>
);
const IconCar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>
);
const IconHeadset = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
);

const features = [
  { icon: <IconShield />, title: "100% Safe", desc: "Verified drivers & secure stays." },
  { icon: <IconHotel />, title: "Luxury Stays", desc: "Handpicked premium hotels." },
  { icon: <IconCar />, title: "Private Cabs", desc: "Clean & sanitized private fleet." },
  { icon: <IconHeadset />, title: "24/7 Support", desc: "On-ground support team." },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Slide one by one with 0.2s delay between each
      delayChildren: 0.1,
    }
  }
};

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

export default function Features() {
  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--dark)] tracking-tight">
            Why Choose HillWay?
          </h2>
          <p className="text-gray-600 mt-3 font-medium text-lg">Elevating your travel experience</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="
                relative overflow-hidden
                bg-white/30 backdrop-blur-lg border border-white/50
                p-8 rounded-3xl
                shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                hover:shadow-[0_15px_35px_rgb(0,0,0,0.1)]
                text-center group
                transition-all duration-300
              "
            >
              {/* Subtle White Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="
                  w-16 h-16 mb-6 rounded-2xl 
                  bg-gradient-to-br from-[var(--p1)] to-[var(--p2)]
                  flex items-center justify-center text-white
                  shadow-lg shadow-cyan-500/20
                  group-hover:scale-110 group-hover:rotate-3 
                  transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
                ">
                  {f.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}