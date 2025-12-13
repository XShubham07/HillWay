import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center">
      {/* Simple Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/mountain.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Left Side Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16">
        <div className="max-w-2xl space-y-6">
          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-7xl font-bold text-white"
          >
            HillWay
          </motion.h1>

          {/* Tagline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-3xl md:text-4xl text-[#D9A441] font-light"
          >
            Your Way to the Mountains
          </motion.h2>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-200 leading-relaxed"
          >
            Discover the pristine beauty of the Himalayas with curated travel
            experiences. From serene valleys to majestic peaks, embark on a
            journey that awakens your spirit of adventure.
          </motion.p>

          {/* Explore Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button
              onClick={() => navigate("/tours")}
              className="flex items-center gap-3 px-8 py-4 bg-[#D9A441] text-black font-semibold text-lg rounded-lg hover:bg-[#FFD700] transition-colors"
            >
              Explore
              <FaArrowRight />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
