import { useState, useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FaMapMarkerAlt, FaArrowRight, FaCamera, FaStar } from "react-icons/fa";
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
  .animate-float { animation: float 8s ease-in-out infinite; }
  
  /* Optimize Blurs for Mobile */
  @media (max-width: 768px) {
    .heavy-blur { filter: blur(40px) !important; }
  }
`;

// --- COMPONENTS ---

const DestinationSkeleton = () => (
    <div className="space-y-48 pt-20 w-full overflow-hidden">
        {[1, 2, 3].map((i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center w-full gap-10`}>
                <div className={`w-full lg:w-[55vw] h-[65vh] bg-white/5 relative overflow-hidden border-y border-white/5 shadow-2xl ${i % 2 === 0 ? 'rounded-r-[15rem] border-r' : 'rounded-l-[15rem] border-l'}`}>
                    <div className="shimmer-overlay" />
                </div>
                <div className="w-full lg:w-[45vw] space-y-8 px-8 lg:px-24 mt-10 lg:mt-0">
                    <div className="h-24 w-3/4 bg-white/5 rounded-3xl relative overflow-hidden"><div className="shimmer-overlay" /></div>
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-white/5 rounded-full relative overflow-hidden"><div className="shimmer-overlay" /></div>
                        <div className="h-4 w-2/3 bg-white/5 rounded-full relative overflow-hidden"><div className="shimmer-overlay" /></div>
                    </div>
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
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
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
                    filter="url(#glow)"
                />
            </svg>
        </div>
    );
};

const BackgroundOrbs = memo(() => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transform-gpu will-change-transform">
        <div className="absolute top-[-5%] left-[-10%] w-[900px] h-[900px] bg-blue-600/10 rounded-full blur-[150px] heavy-blur animate-float" />
        <div className="absolute top-[40%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px] heavy-blur animate-float" />
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[180px] heavy-blur animate-float" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
    </div>
));
BackgroundOrbs.displayName = "BackgroundOrbs";

const DestinationItem = memo(({ dest, index, tourCount, navigate }) => {
    const isEven = index % 2 === 0;
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const imgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

    return (
        <div ref={ref} className={`relative z-10 flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center w-full gap-0 mb-32 lg:mb-0`}>
            {/* IMAGE SECTION */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? -80 : 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, type: "spring", bounce: 0.2 }}
                className={`w-full lg:w-[55vw] h-[60vh] lg:h-[85vh] relative group flex-shrink-0 ${isEven ? 'mr-auto' : 'ml-auto'}`}
            >
                <div className={`relative w-full h-full overflow-hidden bg-[#1e293b] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-20 border-y border-white/10 transform-gpu ${isEven ? 'rounded-r-[40vh] border-r' : 'rounded-l-[40vh] border-l'}`}>
                    <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0 w-full h-full will-change-transform">
                        <img src={dest.img} alt={dest.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-filter duration-700 group-hover:brightness-110" />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />
                    <div className={`absolute bottom-12 flex items-center gap-5 bg-white/10 backdrop-blur-2xl border border-white/20 px-8 py-5 rounded-3xl shadow-2xl z-30 ${isEven ? 'left-8 lg:left-16' : 'right-8 lg:right-16 flex-row-reverse'}`}>
                        <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center text-[#D9A441] border border-white/5 shadow-inner text-xl"><FaMapMarkerAlt /></div>
                        <div className={`${isEven ? 'text-left' : 'text-right'}`}><p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold mb-1">Location</p><p className="text-white font-extrabold text-2xl leading-none">{dest.name}</p></div>
                    </div>
                </div>
                <div className={`absolute top-[10%] bottom-[10%] w-full bg-gradient-to-r ${dest.color} blur-[100px] heavy-blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000 -z-10 ${isEven ? 'left-[-30%]' : 'right-[-30%]'}`} />
            </motion.div>

            {/* TEXT CONTENT */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className={`w-full lg:w-[45vw] px-8 lg:px-24 relative z-30 mt-10 lg:mt-0 ${isEven ? 'lg:pl-24' : 'lg:pr-24 lg:text-right'}`}
            >
                <div className={`flex items-center gap-3 mb-8 ${!isEven && 'flex-row-reverse'}`}>
                    <div className={`h-[2px] w-20 bg-gradient-to-r ${dest.color}`} />
                    <span className="text-[#D9A441] font-bold uppercase tracking-[0.3em] text-xs">Discover</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-black font-montserrat text-white mb-8 tracking-tighter drop-shadow-2xl leading-[0.9]">{dest.name}<span style={{ color: dest.hex }}>.</span></h2>
                <p className={`text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-12 border-white/10 ${isEven ? 'border-l-2 pl-8' : 'border-r-2 pr-8'}`}>{dest.description}</p>
                <div className={`flex flex-wrap gap-3 mb-12 ${!isEven && 'justify-end'}`}>
                    {dest.highlights.map((h, i) => (
                        <span key={i} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 font-medium hover:bg-white/10 hover:text-white transition-colors">{h}</span>
                    ))}
                </div>
                <div className={`flex flex-wrap gap-6 items-center ${!isEven && 'justify-end'}`}>
                    <button onClick={() => navigate('/tours')} className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold text-base hover:bg-[#D9A441] transition-all duration-300 shadow-lg active:scale-95"><span>Explore Packages</span><FaArrowRight className="group-hover:translate-x-1 transition-transform" /></button>
                    {tourCount > 0 && (<div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-bold opacity-80"><FaStar /> {tourCount} TOURS</div>)}
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
    const listRef = useRef(null);

    // SCROLL TO TOP ON MOUNT
    useEffect(() => {
        // IMPORTANT: With Global SmoothScroll, we use window.scrollTo
        window.scrollTo(0, 0);
        // We DO NOT Initialize Lenis here anymore to prevent conflicts
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise(r => setTimeout(r, 600));
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
            <BackgroundOrbs />

            <div className="relative z-10 pt-32 pb-32">
                <div className="text-center mb-32 px-6 max-w-5xl mx-auto">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }}>
                        <span className="inline-block py-1.5 px-5 rounded-full bg-white/5 border border-white/10 text-[#D9A441] text-xs font-bold uppercase tracking-[0.25em] mb-8 backdrop-blur-md shadow-lg">Explore The Unseen</span>
                        <h1 className="text-6xl md:text-9xl font-black font-montserrat text-transparent bg-clip-text bg-gradient-to-b from-[#D9A441] via-white to-gray-500 mb-8 drop-shadow-2xl">DESTINATIONS</h1>
                    </motion.div>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">A curated selection of the most breathtaking locations across the Himalayas.</motion.p>
                </div>

                <div ref={listRef} className="relative w-full">
                    {!loading && <ConnectingPath targetRef={listRef} />}
                    {loading ? <DestinationSkeleton /> : (
                        <div className="relative z-10 space-y-32 lg:space-y-48">
                            {DESTINATIONS_DATA.map((dest, i) => (
                                <DestinationItem key={dest.id} index={i} dest={dest} tourCount={getTourCount(dest.name)} navigate={navigate} />
                            ))}
                        </div>
                    )}
                </div>

                {!loading && (
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mt-48">
                        <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent">
                            <div className="bg-[#0f172a] rounded-full px-8 py-3 text-gray-500 text-sm font-medium tracking-wide">More destinations arriving next season...</div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}