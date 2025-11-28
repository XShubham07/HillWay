import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import ReviewsCarousel from "../components/ReviewsCarousel";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import CartoonLandscape from "../components/CartoonLandscape";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [featuredTours, setFeaturedTours] = useState([]);

  useEffect(() => {
    fetch('/api/tours') 
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const featured = data.data.filter(t => t.featured).slice(0, 3).map(tour => ({
            id: tour._id,
            title: tour.title,
            subtitle: tour.subtitle,
            basePrice: tour.basePrice,
            img: tour.img,
            images: tour.images || [], // Include images array
            rating: tour.rating,
            nights: tour.nights
          }));
          setFeaturedTours(featured);
        }
      })
      .catch(err => console.error("Error fetching tours:", err));
  }, []);

  function onView(p) {
    navigate(`/tours/${p.id}`);
  }

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const backgroundScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden" style={{ isolation: 'isolate' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, willChange: 'transform', pointerEvents: 'none' }}>
        <CartoonLandscape style={{ scale: backgroundScale, y: backgroundY }} />
      </div>

      <div className="relative z-10" style={{ transform: 'translate3d(0,0,0)' }}>
        <motion.div variants={fadeInUp} initial="hidden" animate="visible"><Hero /></motion.div>
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <Features />
        </motion.div>

        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="max-w-7xl mx-auto px-6 mt-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: "var(--dark)" }}>Trending Packages</h2>
              <p className="text-gray-600 mt-1">Most loved trips by our travelers</p>
            </div>
            <button onClick={() => navigate('/tours')} className="hidden md:block font-semibold btn-ripple" style={{ color: "var(--p1)" }}>View All Tours →</button>
          </div>
          
          {featuredTours.length === 0 ? (
            <div className="text-center py-10">Loading amazing tours...</div>
          ) : (
            <PackageGrid list={featuredTours} onView={onView} />
          )}
        </motion.section>

        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="max-w-7xl mx-auto px-6 mt-20">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--dark)" }}>Traveler Stories</h2>
          <ReviewsCarousel />
        </motion.section>
        <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="max-w-7xl mx-auto px-6 mt-20 mb-24">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "var(--dark)" }}>Common Questions</h2>
          <FAQ />
        </motion.section>
      </div>
    </div>
  );
}