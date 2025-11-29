import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 w-full h-full overflow-hidden bg-navy pointer-events-none">
      {/* 1. Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy via-[#0d1f33] to-navy" />

      {/* 2. Static Noise Texture for Premium Feel */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{ 
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          filter: "contrast(150%) brightness(1000%)"
        }}
      />

      {/* 3. Floating Orb (Alpine Blue) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [-20, 20, -20],
          y: [-20, 20, -20],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-alpine blur-[150px] opacity-20"
      />

      {/* 4. Floating Orb (Forest Green) */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.3, 0.15],
          x: [20, -20, 20],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-forest blur-[150px] opacity-20"
      />

      {/* 5. Bottom Glow (Gold Accent) */}
      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-t from-gold/10 to-transparent blur-[100px]"
      />
    </div>
  );
}