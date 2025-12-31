import { useState, useEffect, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useIsMobile } from "../hooks/useIsMobile";
import SEO from "../components/SEO";
import Hero from "../components/Hero";
import PackageGrid from "../components/PackageGrid";
import Features from "../components/Features";
import ReviewsCarousel from "../components/ReviewsCarousel";
import { FaArrowRight, FaCompass } from "react-icons/fa";
import { DESTINATION_DATA } from "../data/destinationsData";
import FAQItem from "../components/FAQItem";
import { Helmet } from "react-helmet-async";

// --- 1. DATA PREP (MEMOIZED) ---
const HIGHLIGHT_IDS = ["gangtok", "zuluk", "ravangla"];

const HIGHLIGHT_DESTINATIONS = DESTINATION_DATA
  .filter(dest => HIGHLIGHT_IDS.includes(dest.id))
  .map(dest => ({
    id: dest.id,
    name: dest.name,
    tag: dest.tagline,
    desc: dest.overview.slice(0, 80) + "...",
    img: dest.img,
    rating: 4.9,
  }));

const LOOPING_NAMES = ["Gangtok", "Zuluk", "Ravangla", "Lachung", "Pelling"];

// --- 2. MICRO-COMPONENTS ---
const LoopingHeroTitle = memo(() => {
  const [index, setIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOOPING_NAMES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const longestName = useMemo(() =>
    LOOPING_NAMES.reduce((a, b) => (a.length > b.length ? a : b)),
    []
  );

  return (
    <div className="mb-10 px-6 md:px-0">
      <div className="flex flex-col items-start">
        <span className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase mb-2 pl-1 border-l-2 border-yellow-500">
          Discover The Unseen
        </span>

        <h2 className="font-black text-5xl md:text-8xl text-white tracking-tighter leading-tight uppercase py-4">
          Explore <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 pr-2">
            {/* Invisible spacer to prevent layout shift */}
            <span className="opacity-0 font-black tracking-tighter">
              {longestName}
            </span>

            <AnimatePresence mode="wait">
              <motion.span
                key={LOOPING_NAMES[index]}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent font-black tracking-tighter py-2 pr-2"
              >
                {LOOPING_NAMES[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h2>

        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-yellow-500 mt-2 rounded-full" />
      </div>
    </div>
  );
});
LoopingHeroTitle.displayName = "LoopingHeroTitle";

const DestinationCard = memo(({ dest, index, isMobile }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={() => navigate("/destinations", { state: { id: dest.id } })}
      className="group relative flex-shrink-0 w-[88vw] md:w-full h-[420px] md:h-[500px] rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer snap-center border border-white/10 bg-gray-900"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={dest.img}
          alt={dest.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover opacity-80 transition-transform duration-700 md:group-hover:scale-105"
          style={{ transform: 'translateZ(0)' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent opacity-90" />

      <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
        <FaCompass className="text-yellow-400 text-xs" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">{dest.tag}</span>
      </div>

      <div className="absolute bottom-0 w-full p-6 md:p-8">
        <div>
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-none tracking-tight mb-2">
            {dest.name}
          </h3>

          <p className="text-gray-300 text-sm line-clamp-2 max-w-sm mb-4 opacity-80">
            {dest.desc}
          </p>

          <div className="inline-flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-widest border-b border-yellow-400/30 pb-1">
            View Details
            <FaArrowRight className="text-[10px]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});
DestinationCard.displayName = "DestinationCard";

const AnimatedButton = memo(({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`${className} active:scale-95 transition-transform duration-100`}
    >
      {children}
    </button>
  );
});
AnimatedButton.displayName = "AnimatedButton";

// OPTIMIZED SECTION HEADER
const SectionHeader = memo(({ tag, title, highlightedText }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
    >
      <div className="flex-1">
        <span className="text-emerald-400 font-bold tracking-[0.2em] text-xs uppercase mb-2 block pl-1 border-l-2 border-yellow-500">
          {tag}
        </span>
        <h2 className="font-black text-4xl md:text-7xl text-white tracking-tighter uppercase leading-tight py-4">
          {title}<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-yellow-400 pr-2">{highlightedText}</span>
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-yellow-500 mt-2 rounded-full" />
      </div>
    </motion.div>
  );
});
SectionHeader.displayName = "SectionHeader";

// --- 3. MAIN COMPONENT ---
export default function Home() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // Fetch Home Page FAQs from dedicated endpoint
    fetch("/api/home-faq")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFaqs(data.data);
        }
      })
      .catch((err) => console.error("Failed to load home FAQs", err));
  }, []);



  useEffect(() => {
    fetch("https://admin.hillway.in/api/tours")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const featured = data.data.filter((t) => t.featured).slice(0, 3);
          setFeaturedTours(featured);
        }
      })
      .catch(() => { });
  }, []);

  return (
    <>
      <SEO pageId="home" />

      {/* PERFORMANCE FIX: 
        1. Removed 'blur-[100px]' and 'blur-[80px]' which kill mobile GPU.
        2. Replaced with radial-gradients which are instant.
        3. Removed 'grainy' noise on mobile.
      */}
      <div className="fixed inset-0 z-[-1] bg-[#022c22] pointer-events-none overflow-hidden">
        {/* Top-Right Green Glow */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(2,44,34,0) 70%)' }}
        />

        {/* Bottom-Left Yellow Glow */}
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.3) 0%, rgba(2,44,34,0) 70%)' }}
        />

        {/* Noise - Desktop Only */}
        <div className="hidden md:block absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
      </div>

      <div className="min-h-screen">
        <Hero />
        {/* --- SECTION 3: CURATED PACKAGES --- */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <SectionHeader
                tag="Trending Packages"
                title="Curated"
                highlightedText=" Tours"
              />

              <AnimatedButton
                onClick={() => navigate("/tours")}
                className="hidden md:flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-sm shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 uppercase tracking-wide whitespace-nowrap"
              >
                Explore All Packages
                <FaArrowRight className="text-sm" />
              </AnimatedButton>
            </div>

            {featuredTours.length > 0 ? (
              <PackageGrid list={featuredTours} onView={(p) => navigate(`/tours/${p.slug || p._id}`)} />
            ) : (
              <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-3xl">
                <p className="text-emerald-400/50 uppercase tracking-widest animate-pulse text-sm">Loading Collection...</p>
              </div>
            )}

            <div className="mt-10 md:hidden">
              <AnimatedButton
                onClick={() => navigate("/tours")}
                className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-xs uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
              >
                View All Packages
                <FaArrowRight className="text-xs" />
              </AnimatedButton>
            </div>
          </div>
        </section>
        {/* --- SECTION 1: DESTINATIONS --- */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <LoopingHeroTitle />

            <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:gap-6 md:px-6 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0">
              {/* Spacer */}
              <div className="flex-shrink-0 w-2 md:hidden" />

              <div className="flex gap-4 md:contents">
                {HIGHLIGHT_DESTINATIONS.map((dest, i) => (
                  <DestinationCard key={dest.id} dest={dest} index={i} isMobile={isMobile} />
                ))}
              </div>

              {/* Spacer */}
              <div className="flex-shrink-0 w-2 md:hidden" />
            </div>

            <div className="mt-8 px-6 md:px-6 flex justify-end">
              <AnimatedButton
                onClick={() => navigate("/destinations")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-xs md:text-sm rounded-full shadow-lg inline-flex items-center gap-2 uppercase tracking-wide"
              >
                View Full Map
                <FaArrowRight className="text-xs" />
              </AnimatedButton>
            </div>
          </div>
        </section>

        <Features />



        {/* --- SECTION 4: REVIEWS --- */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <SectionHeader
                tag="Stories & Reviews"
                title="Traveler "
                highlightedText="Diaries"
              />

              <AnimatedButton
                onClick={() => navigate("/reviews")}
                className="hidden md:flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-sm shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 uppercase tracking-wide whitespace-nowrap"
              >
                All Reviews
                <FaArrowRight className="text-sm" />
              </AnimatedButton>
            </div>

            <ReviewsCarousel />

            <div className="mt-10 md:hidden">
              <AnimatedButton
                onClick={() => navigate("/reviews")}
                className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-500 to-yellow-500 text-black font-black text-xs uppercase tracking-wide shadow-lg flex items-center justify-center gap-2"
              >
                All Reviews
                <FaArrowRight className="text-xs" />
              </AnimatedButton>
            </div>
          </div>
        </section>

        {/* --- SECTION 5: FAQ --- */}
        {faqs.length > 0 && (
          <section className="py-10 md:py-16 px-4 md:px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <SectionHeader
                tag="Common Queries"
                title="Frequently Asked"
                highlightedText=" Questions"
              />

              <div className="space-y-4 mt-6 max-w-4xl">
                {faqs.map((faq, idx) => (
                  <FAQItem key={idx} question={faq.question} answer={faq.answer} variant="home" />
                ))}
              </div>

              {/* JSON-LD SCHEMA FOR FAQ */}
              <Helmet>
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map(faq => ({
                      "@type": "Question",
                      "name": faq.question,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                      }
                    }))
                  })}
                </script>
              </Helmet>
            </div>
          </section>
        )}

        {/* --- SECTION 6: FINAL CTA --- */}
        <section className="py-16 px-4 relative">
          <div className="max-w-5xl mx-auto relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-emerald-900 to-[#022c22] border border-white/10 p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('/mountain.webp')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight py-4">
                Ready to <br /> <span className="text-yellow-400">Ascend?</span>
              </h2>
              <p className="text-gray-300 max-w-lg mx-auto text-base md:text-lg">
                Your customized itinerary is just one click away. Experience the mountains like never before.
              </p>
              <AnimatedButton
                onClick={() => navigate("/contact")}
                className="px-8 py-4 bg-white text-emerald-950 font-black text-sm md:text-base rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-shadow uppercase tracking-wide"
              >
                Start Planning Now
              </AnimatedButton>
            </div>
          </div>
        </section>

        <div className="h-10" />
      </div>
    </>
  );
}