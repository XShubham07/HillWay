import React, { useState, useEffect, useRef, memo, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import FAQItem from "../components/FAQItem";
import NotFound from "./NotFound";

// -----------------------------------------
// REUSED BACKGROUND (Matched Tours.jsx)
// -----------------------------------------
const SunriseDepthBackground = memo(() => {
    return (
        <div className="fixed inset-0 z-[-1] w-full h-full bg-[#022c22] pointer-events-none transform-gpu">
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
    );
});
SunriseDepthBackground.displayName = "SunriseDepthBackground";

// -----------------------------------------
// SKELETON LOADER (Matched Tours.jsx)
// -----------------------------------------
const TourCardSkeleton = memo(({ style = {} }) => (
    <div
        className="tour-card-skeleton"
        style={{
            minWidth: "260px",
            width: style.width || "260px",
            height: "320px",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "26px",
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
            ...style,
        }}
    >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skeleton-shimmer" />
        <style>{`
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      .skeleton-shimmer { animation: shimmer 1.5s infinite linear; will-change: transform; }
    `}</style>
    </div>
));
TourCardSkeleton.displayName = "TourCardSkeleton";

// -----------------------------------------
// TOUR CARD (Matched Tours.jsx Style)
// -----------------------------------------
const TourCard = memo(({ tour, onView, style = {}, index = 0, isCarousel = false }) => {
    return (
        <motion.div
            transition={{ duration: 0.5, ease: "easeOut" }}
            initial={!isCarousel ? { opacity: 0, y: 30 } : {}}
            animate={!isCarousel ? {
                opacity: 1,
                y: 0,
                transition: {
                    opacity: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: isCarousel ? 0 : index * 0.15 },
                    y: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: isCarousel ? 0 : index * 0.15 },
                }
            } : {}}
            whileHover={!isCarousel ? {
                scale: 1.05,
                zIndex: 50,
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
            } : {}}
            role="button"
            tabIndex={0}
            className="tour-card-smooth group relative"
            onClick={() => onView(tour)}
            style={{
                minWidth: isCarousel ? "260px" : 0,
                width: isCarousel ? (style.width || "260px") : "100%",
                backgroundColor: "white",
                borderRadius: "26px",
                overflow: "hidden",
                cursor: "pointer",
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
                isolation: "isolate",
                ...style,
            }}
        >
            <div style={{ position: "relative", height: "320px", backgroundColor: "#f3f4f6" }}>

                <img
                    src={tour.img}
                    alt={tour.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
                    {tour.tags && tour.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wide">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full text-xs font-extrabold text-gray-900 shadow-sm z-10">
                    {tour.days}
                </div>

                <div className="absolute bottom-6 left-5 right-5 z-10">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9A441]"></span> {tour.location || 'Sikkim'}
                    </p>
                    <h3 className="text-2xl font-black text-white mb-1 leading-none drop-shadow-md">
                        {tour.title}
                    </h3>

                    <div className="flex justify-between items-end mt-2">
                        <p className="text-gray-200 text-xs font-medium line-clamp-2 max-w-[65%] leading-snug">
                            {tour.summary}
                        </p>
                        <div className="text-right shrink-0">
                            <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Starting</span>
                            <span className="block text-xl font-extrabold text-[#D9A441] drop-shadow-md">
                                {tour.price}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
TourCard.displayName = "TourCard";

// -----------------------------------------
// MOBILE CAROUSEL (Matched Tours.jsx)
// -----------------------------------------
const Mobile3DCarousel = ({ items, onView, isMobile }) => {
    const scrollRef = useRef(null);
    const rafRef = useRef(null);

    const updateCards = () => {
        const container = scrollRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const viewportCenter = containerRect.left + containerRect.width / 2;
        const maxDistance = containerRect.width / 1.35;
        const nodes = Array.from(container.querySelectorAll('.carousel-item'));

        nodes.forEach(child => {
            const rect = child.getBoundingClientRect();
            const childCenter = rect.left + rect.width / 2;
            const distance = Math.max(0, Math.abs(viewportCenter - childCenter) - 4);
            let progress = Math.min(1, distance / maxDistance);

            const scale = 1.12 - (progress * 0.26);
            const opacity = 1 - (progress * 0.3);

            if (isMobile) {
                child.style.transform = `translate3d(-36px, 0, 0) scale(${scale})`;
                child.style.zIndex = 20 - Math.round(progress * 10);
                child.style.opacity = opacity;
            } else {
                child.style.transform = '';
                child.style.zIndex = '';
                child.style.opacity = '';
            }
        });
    };

    const handleScroll = () => {
        if (rafRef.current) return;
        rafRef.current = requestAnimationFrame(() => {
            updateCards();
            rafRef.current = null;
        });
    };

    useLayoutEffect(() => { updateCards(); }, [isMobile]);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [isMobile]);

    return (
        <div
            ref={scrollRef}
            className="mobile-3d-scroll"
            style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x proximity',
                padding: '30px 0px',
                touchAction: 'pan-x',
                perspective: '1000px',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'auto',
                willChange: 'scroll-position'
            }}
        >
            <div style={{ minWidth: 'calc(50% - 94px)', flexShrink: 0 }} />
            {items.map((tour, idx) => (
                <div
                    key={tour.id}
                    className="carousel-item"
                    style={{
                        scrollSnapAlign: 'center',
                        flexShrink: 0,
                        willChange: isMobile ? 'transform, opacity' : 'auto',
                        transformStyle: isMobile ? 'preserve-3d' : 'flat',
                        contain: 'layout style paint'
                    }}
                >
                    <TourCard tour={tour} onView={onView} index={idx} isCarousel={true} />
                </div>
            ))}
            <div style={{ minWidth: 'calc(50% - 94px)', flexShrink: 0 }} />
        </div>
    );
};

export default function DynamicPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Responsive State
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 150);
        };
        window.addEventListener('resize', handleResize, { passive: true });
        return () => { window.removeEventListener('resize', handleResize); clearTimeout(timeoutId); }
    }, []);

    const isMobile = windowWidth < 1024;

    // FETCH PAGE DATA
    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/pages?slug=${slug}`);
                const data = await res.json();

                if (data.success) {
                    setPageData(data.data);
                } else {
                    setError("Page not found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load page");
            }
            setLoading(false);
        };

        if (slug) fetchPage();
    }, [slug]);

    const onView = (tour) => navigate(`/tours/${tour.slug || tour._id || tour.id}`);

    const formattedTours = pageData?.selectedTours?.map(t => {
        return {
            id: t._id,
            slug: t.slug,
            title: t.title,
            days: t.nights ? `${t.nights}N / ${t.nights + 1}D` : 'Custom',
            price: t.basePrice ? `₹${t.basePrice.toLocaleString('en-IN')}` : 'Contact for Price',
            img: t.img || t.images?.[0] || '/placeholder.jpg',
            summary: t.subtitle,
            tags: t.tags || [],
            location: t.location,
            rating: t.rating
        };
    }) || [];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#022c22] flex items-center justify-center text-white">
                <div className="animate-pulse">Loading Page...</div>
            </div>
        );
    }

    if (error || !pageData) {
        return <NotFound />;
    }

    return (
        <div className="relative min-h-screen" style={{ isolation: 'isolate' }}>
            <SEO
                title={pageData.metaTitle || pageData.title}
                description={pageData.metaDescription}
                keywords={pageData.metaKeywords}
            />

            <SunriseDepthBackground />

            <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    {/* UPDATED TITLE: Montserrat + Sunrise Gold Gradient */}
                    <h1 className="text-4xl md:text-6xl font-black drop-shadow-lg tracking-tight mb-4 font-montserrat"
                        style={{
                            fontFamily: "'Montserrat', sans-serif",
                            background: "linear-gradient(to right, #fbbf24, #f97316)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}
                    >
                        {pageData.title}
                    </h1>
                    {pageData.description && (
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
                            {pageData.description}
                        </p>
                    )}
                    <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full mt-8" />
                </motion.div>

                {/* TOURS GRID */}
                {pageData.toursTitle && (
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10 drop-shadow-lg font-montserrat" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {pageData.toursTitle}
                    </h2>
                )}

                {formattedTours.length > 0 ? (
                    <>
                        {isMobile ? (
                            /* MOBILE CAROUSEL */
                            <div style={{ margin: '0 -16px' }}>
                                <Mobile3DCarousel items={formattedTours} onView={onView} isMobile={isMobile} />
                            </div>
                        ) : (
                            /* DESKTOP GRID */
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                <AnimatePresence mode="popLayout">
                                    {formattedTours.map((tour, idx) => (
                                        <TourCard
                                            key={tour.id}
                                            tour={tour}
                                            onView={onView}
                                            index={idx}
                                            style={{ width: '100%' }}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-400 py-12 border border-white/10 rounded-2xl bg-white/5">
                        <p>No tours linked to this page yet.</p>
                    </div>
                )}

                {/* TOURS NOTE - Moved above info boxes */}
                {pageData.toursNote && (
                    <div className="mt-12 inline-block">
                        <p className="text-yellow-400 text-sm md:text-base italic font-medium">
                            {pageData.toursNote}
                        </p>
                    </div>
                )}

                {/* INFO BOXES GRID */}
                {pageData.infoBoxes && pageData.infoBoxes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                        {pageData.infoBoxes.slice(0, 2).map((box, idx) => (
                            <div
                                key={idx}
                                className="relative overflow-hidden rounded-2xl p-8 border border-yellow-500/20 hover:border-yellow-400/40 transition duration-300"
                                style={{
                                    background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)",
                                }}
                            >
                                {/* Glassmorphism Inner Layer */}
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl" />

                                <div className="relative z-10">
                                    <h3
                                        className="text-2xl font-bold mb-2"
                                        style={{
                                            fontFamily: "'Montserrat', sans-serif",
                                            background: "linear-gradient(to right, #fbbf24, #f97316)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent"
                                        }}
                                    >
                                        {box.title}
                                    </h3>
                                    {box.subTitle && <h4 className="text-emerald-400 font-semibold mb-4 text-sm uppercase tracking-wide">{box.subTitle}</h4>}

                                    <div className="space-y-2 text-gray-200 leading-relaxed">
                                        {box.content.split('\n').map((line, i) => {
                                            const trimmed = line.trim();
                                            if (!trimmed) return null;
                                            const isSubPoint = line.startsWith('  -') || line.startsWith('\t-');
                                            const text = trimmed.replace(/^-\s*/, '');

                                            return (
                                                <div key={i} className={`flex items-start gap-3 ${isSubPoint ? 'pl-6 text-sm text-gray-400' : ''}`}>
                                                    <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSubPoint ? 'bg-gray-500' : 'bg-yellow-400'}`} />
                                                    <span>{text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ SECTION */}
                {pageData.faqs && pageData.faqs.length > 0 && (
                    <div className="mt-24">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 font-montserrat" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            <span style={{ background: "linear-gradient(to right, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                Frequently Asked Questions
                            </span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pageData.faqs.map((faq, idx) => (
                                <FAQItem key={idx} question={faq.question} answer={faq.answer} variant="dynamic" />
                            ))}
                        </div>

                        {/* JSON-LD SCHEMA FOR FAQ */}
                        <script type="application/ld+json">
                            {JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "FAQPage",
                                "mainEntity": pageData.faqs.map(faq => ({
                                    "@type": "Question",
                                    "name": faq.question,
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": faq.answer
                                    }
                                }))
                            })}
                        </script>
                    </div>
                )}
            </div>
            <style>{`
                  .mobile-3d-scroll::-webkit-scrollbar { display: none; }
                  .mobile-3d-scroll { 
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                    scroll-snap-type: x proximity;
                  }
                  .tour-card-smooth { -webkit-tap-highlight-color: transparent; }
                  .carousel-item { contain: layout style paint; }
                  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
             `}</style>
        </div>
    );
}

// FAQItem component is now imported from ../components/FAQItem.jsx
