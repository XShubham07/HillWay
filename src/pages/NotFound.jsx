import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center relative z-10 max-w-xl"
            >
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="mb-6"
                >
                    <span
                        className="text-[150px] md:text-[200px] font-black leading-none"
                        style={{
                            background: "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #fbbf24 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 0 60px rgba(251, 191, 36, 0.3)"
                        }}
                    >
                        404
                    </span>
                </motion.div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Oops! Page Not Found
                </h1>

                {/* Description */}
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    The page you're looking for seems to have wandered off the trail.
                    Let's get you back on track!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition shadow-lg shadow-yellow-500/20 active:scale-95"
                    >
                        🏠 Back to Home
                    </Link>
                    <Link
                        to="/tours"
                        className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition border border-white/10 active:scale-95"
                    >
                        🗺️ Explore Tours
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-white/10">
                    <p className="text-gray-500 text-sm mb-4">Looking for something specific?</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link to="/destinations" className="text-cyan-400 hover:text-cyan-300 transition">Destinations</Link>
                        <span className="text-gray-600">•</span>
                        <Link to="/about" className="text-cyan-400 hover:text-cyan-300 transition">About Us</Link>
                        <span className="text-gray-600">•</span>
                        <Link to="/contact" className="text-cyan-400 hover:text-cyan-300 transition">Contact</Link>
                        <span className="text-gray-600">•</span>
                        <Link to="/blog" className="text-cyan-400 hover:text-cyan-300 transition">Blog</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
