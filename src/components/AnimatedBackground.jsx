import { motion, useScroll, useTransform } from "framer-motion";

export default function AnimatedBackground() {
  const { scrollY } = useScroll();
  
  // Parallax Zoom Effect: Scale background from 1x to 1.3x as the user scrolls
  const scale = useTransform(scrollY, [500, 2500], [1, 1.3]);
  
  // Subtle vertical movement for added depth
  const y = useTransform(scrollY, [500, 2500], [-100, 100]); 

  return (
    <motion.div
      // Apply the scale and vertical motion transforms
      style={{ scale, y }}
      className="
        fixed inset-0 
        z-0 
        opacity-40 
        pointer-events-none 
        transform-gpu
        
      "
      // Fades the background in subtly
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 0.8 }}
    >
      <div 
        className="w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/mountain.webp')" }}
      />
      {/* White/Mist Overlay to keep content readable */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
    </motion.div>
  );
}