// src/pages/Home.jsx - Complete Redesign
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import Features from "../components/Features";
import ReviewsCarousel from "../components/ReviewsCarousel";
import { FaArrowRight, FaStar, FaMapMarkerAlt, FaTag, FaCalendar, FaPlay } from "react-icons/fa";
import { DESTINATION_DATA } from "../data/destinationsData";

// Import top 3 destinations
const HIGHLIGHT_DESTINATIONS = DESTINATION_DATA.slice(0, 3).map((dest) => ({
  id: dest.id,
  name: dest.name,
  tag: dest.tagline,
  desc: dest.overview.slice(0, 90) + "...",
  img: dest.img,
  stats: {
    tours: dest.attractions.length,
    rating: 4.8,
  },
}));

/* ---------------------------
   SPLIT-SCREEN DESTINATION SHOWCASE
   Interactive left panel with image preview on right
---------------------------- */
function DestinationShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section ref={sectionRef} className="relative py-0 overflow-hidden">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-0 min-h-[85vh]">
          
          {/* LEFT: Interactive List */}
          <div className="relative bg-gradient-to-br from-[#022c22] to-[#01231d] p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Top Picks</span>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
                <span className="text-white">Explore</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent">
                  Iconic Places
                </span>
              </h2>

              <p className="text-gray-300 text-lg mb-10 max-w-md">
                Handpicked destinations where every moment becomes a memory
              </p>
            </motion.div>

            {/* Destination Cards */}
            <div className="space-y-4">
              {HIGHLIGHT_DESTINATIONS.map((dest, index) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigate("/destinations")}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-500 group ${
                    activeIndex === index
                      ? "bg-white/10 border-emerald-400/60 shadow-xl shadow-emerald-500/20"
                      : "bg-white/5 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-2xl md:text-3xl font-black transition-colors ${
                          activeIndex === index ? "text-emerald-400" : "text-white"
                        }`}>
                          {dest.name}
                        </h3>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span className="text-white text-xs font-bold">{dest.stats.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{dest.tag}</p>
                      <p className={`text-gray-300 text-sm leading-relaxed transition-all duration-500 ${
                        activeIndex === index ? "opacity-100 max-h-20" : "opacity-60 max-h-0 overflow-hidden"
                      }`}>
                        {dest.desc}
                      </p>
                    </div>
                    <FaArrowRight className={`text-xl transition-all duration-500 ${
                      activeIndex === index ? "text-emerald-400 translate-x-2" : "text-white/40"
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={() => navigate("/destinations")}
              className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white font-bold shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 w-fit"
            >
              View All Destinations
              <FaArrowRight />
            </motion.button>
          </div>

          {/* RIGHT: Image Preview with Parallax */}
          <div className="relative overflow-hidden bg-[#011f1a] lg:sticky lg:top-0 lg:h-screen flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                style={{ y: imageY }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${HIGHLIGHT_DESTINATIONS[activeIndex].img})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#011f1a] via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#022c22] via-transparent to-transparent opacity-60" />
              </motion.div>
            </AnimatePresence>

            {/* Floating Info Card */}
            <motion.div
              key={`info-${activeIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-8 right-8 bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-xs z-10"
            >
              <h4 className="text-2xl font-black text-white mb-2">
                {HIGHLIGHT_DESTINATIONS[activeIndex].name}
              </h4>
              <p className="text-emerald-300 text-sm mb-4">
                {HIGHLIGHT_DESTINATIONS[activeIndex].tag}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-emerald-400" />
                  <span className="text-white text-sm font-bold">{HIGHLIGHT_DESTINATIONS[activeIndex].stats.tours} Tours</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="text-white text-sm font-bold">{HIGHLIGHT_DESTINATIONS[activeIndex].stats.rating}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------
   TRENDING PACKAGES - COMPACT GRID
---------------------------- */
function TrendingPackages() {
  const navigate = useNavigate();
  const [featuredTours, setFeaturedTours] = useState([]);

  useEffect(() => {
    fetch("https://admin.hillway.in/api/tours")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const featured = data.data
            .filter((t) => t.featured)
            .slice(0, 3)
            .map((tour) => ({
              id: tour._id,
              title: tour.title,
              subtitle: tour.subtitle,
              basePrice: tour.basePrice,
              img: tour.img,
              images: tour.images || [],
              rating: tour.rating,
              nights: tour.nights,
            }));
          setFeaturedTours(featured);
        }
      })
      .catch((err) => console.error("Error fetching tours:", err));
  }, []);

  if (featuredTours.length === 0) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">Hot Deals</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent">
              Trending Adventures
            </span>
          </h2>
          <p className="text-gray-300 text-lg">Curated packages for unforgettable journeys</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/tours/${tour.id}`)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={tour.img}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center gap-1">
                  <FaStar /> {tour.rating}
                </div>

                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold">
                  {tour.nights}N/{tour.nights + 1}D
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {tour.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{tour.subtitle}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Starting from</p>
                    <p className="text-2xl font-black text-emerald-400">₹{tour.basePrice.toLocaleString()}</p>
                  </div>
                  <button className="p-3 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white hover:scale-110 transition-transform">
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <button
            onClick={() => navigate("/tours")}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/40 transition-all duration-500 inline-flex items-center gap-2 hover:scale-105"
          >
            Explore All Packages
            <FaArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------
   REVIEWS SECTION - COMPACT
---------------------------- */
function ReviewsSection() {
  return (
    <section className="relative py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Testimonials</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent">
              Traveler Stories
            </span>
          </h2>
          <p className="text-gray-300 text-lg">Hear from adventurers who discovered magic with us</p>
        </motion.div>

        <ReviewsCarousel />
      </div>
    </section>
  );
}

/* ---------------------------
   MAIN HOME COMPONENT
---------------------------- */
export default function Home() {
  return (
    <>
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-[-1] w-full h-full bg-[#022c22] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 0%, rgba(217, 164, 65, 0.12) 0%, transparent 60%),
              radial-gradient(circle at 100% 30%, rgba(31, 79, 60, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 0% 60%, rgba(8, 145, 178, 0.08) 0%, transparent 50%)
            `
          }}
        />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
      </div>

      <div className="min-h-screen relative">
        <Hero />
        
        <DestinationShowcase />
        
        <Features />
        
        <TrendingPackages />
        
        <ReviewsSection />

        {/* Minimal bottom spacing */}
        <div className="h-12" />
      </div>
    </>
  );
}
