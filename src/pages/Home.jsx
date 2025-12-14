// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import Features from "../components/Features";
import ReviewsCarousel from "../components/ReviewsCarousel";
import { FaArrowRight, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { DESTINATION_DATA } from "../data/destinationsData";

// Import top 3 destinations from destination data
const HIGHLIGHT_DESTINATIONS = DESTINATION_DATA.slice(0, 3).map((dest) => ({
  id: dest.id,
  name: dest.name,
  tag: dest.tagline,
  desc: dest.overview.slice(0, 60) + "...",
  img: dest.img,
  stats: {
    tours: dest.attractions.length,
    rating: 4.8,
  },
}));

/* ---------------------------
   Premium heading animation
   (spring reveal + underline wipe)
---------------------------- */
const headingWrap = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

const titlePop = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 160, damping: 20, delay: 0.02 },
  },
};

const subPop = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 22, delay: 0.07 },
  },
};

const underline = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.12 },
  },
};

// Animated Destination Heading Component with cycling dot color
function AnimatedDestinationHeading() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const destinations = DESTINATION_DATA.map(d => d.name);
  
  // Gradient colors that match the destination text animation
  const dotColors = [
    "from-emerald-400 via-yellow-400 to-emerald-500",
    "from-yellow-400 via-emerald-400 to-yellow-500",
    "from-emerald-500 via-yellow-300 to-emerald-400",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [destinations.length]);

  return (
    <motion.div
      variants={headingWrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="mb-6 md:mb-10"
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div variants={subPop} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider">Explore The Unseen</span>
      </motion.div>

      <motion.h2
        variants={titlePop}
        className="font-title text-4xl md:text-5xl font-black mb-2 leading-tight"
        style={{ willChange: "transform, opacity" }}
      >
        <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent">
          Show All{" "}
        </span>
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent font-black"
        >
          {destinations[currentIndex]}
        </motion.span>
        {" "}
        <motion.span
          key={`dot-${currentIndex}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`inline-block bg-gradient-to-r ${dotColors[currentIndex % dotColors.length]} bg-clip-text text-transparent font-black`}
        >
          •
        </motion.span>
      </motion.h2>

      <motion.div
        variants={underline}
        className="origin-left h-[3px] w-16 md:w-20 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 mb-3"
      />

      <motion.p variants={subPop} className="text-gray-300 text-base md:text-lg">
        Discover breathtaking landscapes and hidden gems
      </motion.p>
    </motion.div>
  );
}

function SectionHeading({
  badgeClass,
  dotClass,
  badgeText,
  title,
  titleGradientClass,
  subTitle,
}) {
  return (
    <motion.div
      variants={headingWrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="mb-6 md:mb-10"
      style={{ willChange: "transform, opacity" }}
    >
      <motion.div variants={subPop} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${badgeClass} mb-3`}>
        <div className={`w-1.5 h-1.5 rounded-full ${dotClass} animate-pulse`} />
        <span className="text-xs font-bold uppercase tracking-wider">{badgeText}</span>
      </motion.div>

      {/* 20% bigger title on mobile: text-4xl (vs text-3xl) */}
      <motion.h2
        variants={titlePop}
        className="font-title text-4xl md:text-5xl font-black mb-2 leading-tight"
        style={{ willChange: "transform, opacity" }}
      >
        <span className={`bg-gradient-to-r ${titleGradientClass} bg-clip-text text-transparent`}>
          {title}
        </span>
      </motion.h2>

      <motion.div
        variants={underline}
        className="origin-left h-[3px] w-16 md:w-20 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 mb-3"
      />

      <motion.p variants={subPop} className="text-gray-300 text-base md:text-lg">
        {subTitle}
      </motion.p>
    </motion.div>
  );
}

const ParallaxDestinationCard = ({ dest, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-110px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer"
      onClick={() => navigate("/destinations")}
    >
      <div className="relative h-[340px] sm:h-[400px] rounded-2xl overflow-hidden">
        <div className="relative h-full rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 shadow-lg">
          <img
            src={dest.img}
            alt={dest.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute top-4 right-4 flex gap-2">
            <div className="px-2 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-yellow-500/50 flex items-center gap-1.5">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-white text-xs font-bold">{dest.stats.rating}</span>
            </div>
            <div className="px-2 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-emerald-400/50 flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-emerald-400 text-xs" />
              <span className="text-white text-xs font-bold">{dest.stats.tours}</span>
            </div>
          </div>

          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-yellow-400 text-white text-xs font-bold">
            {dest.tag}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-title text-2xl sm:text-3xl font-black text-white mb-2">
              {dest.name}
            </h3>
            <p className="text-gray-200 text-sm mb-3">{dest.desc}</p>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform">
              Explore Now
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
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

  function onView(p) {
    navigate(`/tours/${p.id}`);
  }

  return (
    <>
      {/* Fixed Background Layer - Same as Tours.jsx */}
      <div className="fixed inset-0 z-[-1] w-full h-full bg-[#022c22] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 0%, rgba(217, 164, 65, 0.15) 0%, transparent 60%),
              radial-gradient(circle at 100% 30%, rgba(31, 79, 60, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 0% 60%, rgba(8, 145, 178, 0.1) 0%, transparent 50%)
            `
          }}
        />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-[#022c22]/20 to-transparent" />
      </div>

      <div className="min-h-screen relative">
        <Hero />

        <Features />

        {/* Destinations Section (reduced gaps) */}
        <section className="pt-10 pb-6 md:py-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <AnimatedDestinationHeading />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
              {HIGHLIGHT_DESTINATIONS.map((dest, index) => (
                <ParallaxDestinationCard key={dest.id} dest={dest} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 160, damping: 22 }}
            >
              <button
                onClick={() => navigate("/destinations")}
                className="px-8 py-3 md:px-10 md:py-5 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white font-bold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-500 inline-flex items-center gap-2 hover:scale-105"
              >
                View All Destinations
                <FaArrowRight className="text-xs" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Trending Packages Section (reduced gaps) */}
        <section className="pt-8 pb-10 md:py-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              badgeClass="bg-emerald-500/10 border border-emerald-500/20"
              dotClass="bg-emerald-400"
              badgeText="Curated Just For You"
              title="Trending Adventures"
              titleGradientClass="from-emerald-400 via-yellow-400 to-emerald-500"
              subTitle="Handpicked experiences for unforgettable memories"
            />

            {featuredTours.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 md:py-16">
                <div className="w-12 h-12 border-4 border-white/20 border-t-emerald-400 rounded-full animate-spin mb-3" />
                <p className="text-gray-400">Loading experiences...</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 140, damping: 20 }}
                >
                  <PackageGrid list={featuredTours} onView={onView} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.05 }}
                  className="mt-6 md:mt-10"
                >
                  <button
                    onClick={() => navigate("/tours")}
                    className="px-8 py-3 md:px-10 md:py-5 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-white font-bold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-500 inline-flex items-center gap-2 hover:scale-105"
                  >
                    Discover All Packages
                    <FaArrowRight />
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="pt-8 pb-10 md:py-16 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              badgeClass="bg-emerald-500/10 border border-emerald-500/20"
              dotClass="bg-emerald-400"
              badgeText="What Travelers Say"
              title="Guest Experiences"
              titleGradientClass="from-emerald-400 via-yellow-400 to-emerald-500"
              subTitle="Real stories from our amazing travelers"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
            >
              <ReviewsCarousel />
            </motion.div>
          </div>
        </section>

        {/* keep extra bottom space only on desktop */}
        <div className="hidden md:block h-20" />
      </div>
    </>
  );
}
