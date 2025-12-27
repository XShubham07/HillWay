import { motion } from "framer-motion";
import SEO from "../components/SEO";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkedAlt, FaAward, FaHeart, FaMountain, FaCar,
  FaHome, FaBook, FaStar, FaSearch, FaPhone, FaArrowRight
} from "react-icons/fa";

// --- ASSETS & DATA ---
const LOCATIONS = [
  { name: "Gangtok", img: "/g1.webp", desc: "The Capital Hub" },
  { name: "Lachung", img: "/g4.webp", desc: "Snow Valley" },
  { name: "Pelling", img: "/g3.webp", desc: "Kanchenjunga Views" },
  { name: "Darjeeling", img: "/g2.webp", desc: "Queen of Hills" },
];

const STATS = [
  { label: "Happy Travelers", value: "100+" },
  { label: "Destinations", value: "10+" },
  { label: "Years Experience", value: "1+" },
  { label: "5-Star Reviews", value: "90%" },
];

const VALUES = [
  {
    icon: FaMountain,
    title: "Local Expertise",
    desc: "We don't just guide; we live here. Experience hidden gems known only to locals."
  },
  {
    icon: FaCar,
    title: "Premium Fleet",
    desc: "Travel in comfort with our sanitized, luxury SUVs and professional hill-drivers."
  },
  {
    icon: FaHeart,
    title: "Personalized Care",
    desc: "From dietary needs to surprise celebrations, we handle every detail with love."
  }
];

// --- NAV LINKS FOR THE BOTTOM SECTION ---
const EXPLORE_LINKS = [
  { path: "/", label: "Home", icon: <FaHome />, color: "from-blue-500 to-cyan-400" },
  { path: "/destinations", label: "Destinations", icon: <FaMapMarkedAlt />, color: "from-emerald-500 to-teal-400" },
  { path: "/tours", label: "Tours", icon: <FaMountain />, color: "from-purple-500 to-pink-400" },
  { path: "/blogs", label: "Travel blog", icon: <FaBook />, color: "from-amber-500 to-orange-400" },
  { path: "/reviews", label: "Reviews", icon: <FaStar />, color: "from-yellow-400 to-yellow-600" },
  { path: "/status", label: "Check Status", icon: <FaSearch />, color: "from-sky-500 to-blue-600" },
  { path: "/contact", label: "Contact Us", icon: <FaPhone style={{ transform: 'scaleX(-1)' }} />, color: "from-red-500 to-rose-400" },
];

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-[#D9A441] font-bold tracking-[0.2em] text-xs uppercase mb-3 block"
    >
      {subtitle}
    </motion.span>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-black font-montserrat text-white"
    >
      {title}
    </motion.h2>
    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#D9A441] to-transparent mx-auto mt-6" />
  </div>
);

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-300 font-inter overflow-x-hidden selection:bg-[#D9A441] selection:text-black">

      {/* --- PAGE METADATA --- */}
      {/* --- PAGE METADATA --- */}
      <SEO title="About - HillWay | Your way to the Mountains" description="Discover the story behind HillWay. We craft soul-stirring journeys through the misty peaks of Sikkim and Northeast India." />

      {/* 1. HERO SECTION */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/g1.webp"
            alt="Himalayas"
            className="w-full h-full object-cover opacity-40 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/50 to-[#0f172a]" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 mt-16">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white font-montserrat mb-6 tracking-tight drop-shadow-2xl"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9A441] to-yellow-200">Hillway.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto"
          >
            Crafting soul-stirring journeys through the misty peaks of Sikkim and Northeast India.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">

        {/* 2. OUR STORY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-[#D9A441]/10 rounded-full text-[#D9A441] border border-[#D9A441]/20">
                <FaAward size={24} />
              </div>
              <span className="text-[#D9A441] font-bold tracking-widest uppercase text-sm">Our Story</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              More than just a <br /> Travel Agency.
            </h2>
            <div className="space-y-6 text-lg font-light text-gray-400 leading-relaxed">
              <p>
                Founded in the heart of Gangtok, we started with a simple belief:
                <strong className="text-white font-medium"> The Himalayas shouldn't just be seen; they should be felt.</strong>
              </p>
              <p>
                We noticed that most tours were rushed, generic, and disconnected from the local culture.
                We wanted to change that. We are a team of local enthusiasts, drivers, and guides dedicated
                to showing you the Northeast India that we call home.
              </p>
              <div className="pt-4 border-l-4 border-[#D9A441] pl-6 italic text-white/80">
                "Our mission is to turn every winding road and snowy peak into a memory you'll cherish forever."
              </div>
            </div>
          </motion.div>

          {/* Collage Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-[#D9A441] to-purple-600 rounded-[2rem] opacity-20 blur-2xl" />
            <img
              src="/g4.webp"
              alt="Team"
              className="relative w-full rounded-[2rem] shadow-2xl border border-white/10 z-10 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>

        {/* 3. STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-12 bg-white/5 rounded-3xl backdrop-blur-sm">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-4xl md:text-5xl font-black text-[#D9A441] mb-2">{stat.value}</h3>
              <p className="text-xs uppercase tracking-widest font-bold text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* 4. OUR FOOTPRINT */}
        <div>
          <SectionHeader title="Our Footprint" subtitle="Where We Operate" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOCATIONS.map((loc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer border border-white/10"
                onClick={() => navigate('/destinations')}
              >
                <div className="absolute inset-0">
                  <img
                    src={loc.img}
                    alt={loc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-[#D9A441] mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaMapMarkedAlt />
                    <span className="text-xs font-bold uppercase tracking-wider">Explore</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{loc.name}</h3>
                  <p className="text-sm text-gray-400">{loc.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 5. VALUES */}
        <div>
          <SectionHeader title="The Gold Standard" subtitle="Why Choose Us" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VALUES.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#1e293b] p-8 rounded-3xl border border-white/5 hover:border-[#D9A441]/30 hover:bg-[#D9A441]/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-[#D9A441] text-2xl mb-6 shadow-lg border border-white/5 group-hover:scale-110 transition-transform">
                  <val.icon />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{val.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 6. EXPLORE MORE / SITE MAP LINKS */}
        <div>
          <SectionHeader title="Explore More" subtitle="Quick Navigation" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {EXPLORE_LINKS.map((link, i) => (
              <Link to={link.path} key={i}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group overflow-hidden relative"
                >
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${link.color} opacity-10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2`} />

                  <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-gray-300 group-hover:text-white group-hover:bg-[#D9A441] transition-colors">
                    {link.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">{link.label}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider group-hover:text-[#D9A441]">Visit Page</p>
                  </div>
                  <FaArrowRight className="text-gray-600 group-hover:text-white -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" size={12} />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* 7. CTA */}
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-[#D9A441] to-amber-600 p-12 md:p-24 text-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-black mb-6">Ready to start your journey?</h2>
            <p className="text-black/70 text-lg mb-8 max-w-xl mx-auto font-medium">
              The mountains are calling. Let us handle the planning while you handle the memories.
            </p>
            <button
              onClick={() => navigate('/tours')}
              className="bg-black text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-2xl"
            >
              Book Your Trip
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}