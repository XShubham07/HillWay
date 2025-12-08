import { useState, useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaArrowRight, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// --- DATA ---
const DESTINATIONS_DATA = [
    {
        id: 1,
        name: 'Gangtok',
        description: 'The vibrant capital of Sikkim, famous for its monasteries, views of Kanchenjunga, and bustling MG Marg.',
        highlights: ['Tsomgo Lake', 'Nathula Pass', 'Rumtek Monastery', 'MG Marg'],
        img: '/g1.webp',
        color: 'from-blue-600 to-cyan-400',
        hex: '#22d3ee'
    },
    {
        id: 2,
        name: 'Lachung',
        description: 'A picturesque mountain village, home to the breathtaking Yumthang Valley and snow-capped peaks.',
        highlights: ['Yumthang Valley', 'Zero Point', 'Lachung Monastery', 'Mt. Katao'],
        img: '/g4.webp',
        color: 'from-purple-600 to-pink-400',
        hex: '#e879f9'
    },
    {
        id: 3,
        name: 'Pelling',
        description: 'Known for the closest views of Mt. Kanchenjunga and the historic glass skywalk.',
        highlights: ['Pelling Skywalk', 'Pemayangtse Monastery', 'Khecheopalri Lake', 'Rabdentse Ruins'],
        img: '/g3.webp',
        color: 'from-emerald-600 to-teal-400',
        hex: '#34d399'
    },
    {
        id: 4,
        name: 'Darjeeling',
        description: 'The Queen of Hills, famous for lush tea gardens and the heritage Himalayan toy train.',
        highlights: ['Tiger Hill', 'Batasia Loop', 'Tea Gardens', 'Peace Pagoda'],
        img: '/g2.webp',
        color: 'from-amber-600 to-orange-400',
        hex: '#fbbf24'
    }
];

// --- STYLES ---
const styles = `
  .shimmer-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-30px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  
  .animate-float { 
    animation: float 8s ease-in-out infinite; 
    will-change: transform;
  }
  
  /* Ensure hardware acceleration to prevent jank */
  .gpu-accelerate {
      transform: translateZ(0);
      backface-visibility: hidden;
      will-change: transform;
  }

  /* Optimize Blurs for Mobile */
  @media (max-width: 768px) {
    .heavy-blur { filter: blur(30px) !important; opacity: 0.12 !important; }
  }
`;

// --- COMPONENTS ---

const ProgressiveImage = memo(({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden w-full h-full bg-[#0f172a]`}>
            <div
                className={`absolute inset-0 bg-white/10 animate-pulse transition-opacity duration-500 z-10 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            />
            <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                // Added gpu-accelerate here to ensure the image layer is promoted
                className={`${className} gpu-accelerate transition-opacity duration-700 ease-in-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
});
ProgressiveImage.displayName = "ProgressiveImage";

const DestinationSkeleton = () => (
    <div className="space-y-32 lg:space-y-48 pt-20 w-full overflow-hidden">
        {[1, 2].map((i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center w-full gap-10`}>
                {/* Added rounding to skeleton on mobile too */}
                <div className={`w-full lg:w-[55vw] h-[50vh] lg:h-[65vh] bg-white/5 relative overflow-hidden border-y border-white/5 shadow-2xl rounded-[2.5rem] ${i % 2 === 0 ? 'lg:rounded-r-[15rem] lg:rounded-l-none border-r' : 'lg:rounded-l-[15rem] lg:rounded-r-none border-l'}`}>
                    <div className="shimmer-overlay" />
                </div>
            </div>
        ))}
    </div>
);

const ConnectingPath = ({ targetRef }) => {
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
    const strokeWidth = useTransform(scrollYProgress, [0, 1], [3, 12]);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-90">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="30%" stopColor="#22d3ee" />
                        <stop offset="60%" stopColor="#facc15" />
                        <stop offset="90%" stopColor="#e879f9" />
                        <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                </defs>
                <path d="M 50 0 Q 85 10, 85 25 T 50 50 T 15 75 T 50 100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                <motion.path
                    d="M 50 0 Q 85 10, 85 25 T 50 50 T 15 75 T 50 100"
                    fill="none"
                    stroke="url(#neonGradient)"
                    style={{ pathLength, strokeWidth }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                />
            </svg>
        </div>
    );
};

const BackgroundOrbs = memo(() => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden gpu-accelerate"
    >
        <div className="absolute top-[-5%] left-[-10%] w-[900px] h-[900px] bg-blue-600/10 rounded-full blur-[80px] lg:blur-[150px] heavy-blur animate-float" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[80px] lg:blur-[150px] heavy-blur animate-float" />
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[100px] lg:blur-[180px] heavy-blur animate-float" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
    </motion.div>
));
BackgroundOrbs.displayName = "BackgroundOrbs";

const DestinationItem = memo(({ dest, index, tourCount, navigate }) => {
    const isEven = index % 2 === 0;
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

    return (
        <div ref={ref} className={`relative z-10 flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center w-full gap-0 mb-24 lg:mb-0`}>
            {/* IMAGE SECTION */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                className={`w-full lg:w-[55vw] h-[50vh] lg:h-[85vh] relative group flex-shrink-0 ${isEven ? 'mr-auto' : 'ml-auto'}`}
            >
                {/* ROUNDED CORNER FIX ON MOBILE:
                    1. Added rounded-[2.5rem] for default mobile view.
                    2. Added lg:rounded-l-none (or r-none) to ensure the flat side on desktop isn't rounded.
                    3. Added gpu-accelerate class.
                */}
                <div className={`relative w-full h-full overflow-hidden bg-[#1e293b] shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-20 border-y border-white/10 gpu-accelerate rounded-[2.5rem] ${isEven ? 'lg:rounded-r-[40vh] lg:rounded-l-none lg:border-r' : 'lg:rounded-l-[40vh] lg:rounded-r-none lg:border-l'}`}>
                    <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 w-full h-full gpu-accelerate">
                        <ProgressiveImage
                            src={dest.img}
                            alt={dest.name}
                            className="w-full h-full object-cover transition-filter duration-700 group-hover:brightness-110"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />

                    <div className={`absolute bottom-6 lg:bottom-12 flex items-center gap-4 lg:gap-5 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 lg:px-8 lg:py-5 rounded-2xl lg:rounded-3xl shadow-2xl z-30 ${isEven ? 'left-6 lg:left-16' : 'right-6 lg:right-16 flex-row-reverse'}`}>
                        <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-black/40 flex items-center justify-center text-[#D9A441] border border-white/5 shadow-inner text-lg lg:text-xl"><FaMapMarkerAlt /></div>
                        <div className={`${isEven ? 'text-left' : 'text-right'}`}>
                            <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold mb-1">Location</p>
                            <p className="text-white font-extrabold text-xl lg:text-2xl leading-none">{dest.name}</p>
                        </div>
                    </div>
                </div>
                <div className={`absolute top-[10%] bottom-[10%] w-full bg-gradient-to-r ${dest.color} blur-[80px] lg:blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000 -z-10 ${isEven ? 'left-[-30%]' : 'right-[-30%]'}`} />
            </motion.div>

            {/* TEXT CONTENT */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`w-full lg:w-[45vw] px-6 lg:px-24 relative z-30 mt-12 lg:mt-0 ${isEven ? 'lg:pl-24' : 'lg:pr-24 lg:text-right'}`}
            >
                <div className={`flex items-center gap-3 mb-4 lg:mb-8 ${!isEven && 'flex-row-reverse'}`}>
                    <div className={`h-[2px] w-12 lg:w-20 bg-gradient-to-r ${dest.color}`} />
                    <span className="text-[#D9A441] font-bold uppercase tracking-[0.2em] text-[10px] lg:text-xs">Discover</span>
                </div>

                <h2 className="text-5xl lg:text-8xl font-black font-montserrat text-white mb-6 lg:mb-8 tracking-tighter drop-shadow-2xl leading-[0.9]">{dest.name}<span style={{ color: dest.hex }}>.</span></h2>

                <p className={`text-base lg:text-xl text-gray-400 font-light leading-relaxed mb-8 lg:mb-12 border-white/10 ${isEven ? 'border-l-2 pl-6 lg:pl-8' : 'border-r-2 pr-6 lg:pr-8'}`}>{dest.description}</p>

                <div className={`flex flex-wrap gap-2 lg:gap-3 mb-8 lg:mb-12 ${!isEven && 'justify-end'}`}>
                    {dest.highlights.map((h, i) => (
                        <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs lg:text-sm text-gray-300 font-medium">{h}</span>
                    ))}
                </div>

                <div className={`flex flex-wrap gap-6 items-center ${!isEven && 'justify-end'}`}>
                    <button onClick={() => navigate('/tours')} className="group relative inline-flex items-center gap-4 px-8 py-4 lg:px-10 lg:py-5 bg-white text-black rounded-full font-bold text-sm lg:text-base hover:bg-[#D9A441] transition-all duration-300 shadow-lg active:scale-95"><span>Explore Packages</span><FaArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
                    {tourCount > 0 && (<div className="flex items-center gap-2 text-cyan-400 font-mono text-xs lg:text-sm font-bold opacity-80"><FaStar /> {tourCount} TOURS</div>)}
                </div>
            </motion.div>
        </div>
    );
});
DestinationItem.displayName = "DestinationItem";

export default function Destinations() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    // New state to defer heavy background rendering
    const [showBackground, setShowBackground] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        // Defer background rendering by 500ms to allow initial paint
        const timer = setTimeout(() => setShowBackground(true), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise(r => setTimeout(r, 300));
                const res = await fetch('/api/tours');
                const data = await res.json();
                if (data.success) setTours(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getTourCount = (destName) => {
        return tours.filter(t => t.location && t.location.toLowerCase().includes(destName.toLowerCase())).length;
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-inter selection:bg-[#D9A441] selection:text-black relative overflow-x-hidden">
            <style>{styles}</style>

            {/* DEFERRED BACKGROUND RENDERING to stop initial lag */}
            <AnimatePresence>
                {showBackground && <BackgroundOrbs />}
            </AnimatePresence>

            <div className="relative z-10 pt-28 pb-20 lg:pt-36 lg:pb-32">
                <div className="text-center mb-24 lg:mb-32 px-4 lg:px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                        <span className="inline-block py-1.5 px-4 lg:px-5 rounded-full bg-white/5 border border-white/10 text-[#D9A441] text-[10px] lg:text-xs font-bold uppercase tracking-[0.25em] mb-6 lg:mb-8 backdrop-blur-md shadow-lg">Explore The Unseen</span>
                        <h1 className="text-4xl md:text-7xl lg:text-9xl font-black font-montserrat text-transparent bg-clip-text bg-gradient-to-b from-[#D9A441] via-white to-gray-500 mb-6 lg:mb-8 drop-shadow-2xl">DESTINATIONS</h1>
                    </motion.div>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-base lg:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed px-4">A curated selection of the most breathtaking locations across the Himalayas.</motion.p>
                </div>

                <div ref={listRef} className="relative w-full">
                    {!loading && <ConnectingPath targetRef={listRef} />}
                    {loading ? <DestinationSkeleton /> : (
                        <div className="relative z-10 space-y-24 lg:space-y-48">
                            {DESTINATIONS_DATA.map((dest, i) => (
                                <DestinationItem key={dest.id} index={i} dest={dest} tourCount={getTourCount(dest.name)} navigate={navigate} />
                            ))}
                        </div>
                    )}
                </div>

                {!loading && (
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mt-24 lg:mt-48 px-4">
                        <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent">
                            <div className="bg-[#0f172a] rounded-full px-6 py-3 lg:px-8 lg:py-3 text-gray-500 text-xs lg:text-sm font-medium tracking-wide">More destinations arriving next season...</div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}