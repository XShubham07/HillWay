import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = memo(({ question, answer, variant = 'default' }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Variant-based styling
    const isHome = variant === 'home';
    const isDynamic = variant === 'dynamic';

    // Dynamic variant uses sunrise gold glassmorphism
    const containerStyle = isDynamic ? {
        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(249, 115, 22, 0.1) 100%)",
    } : {};

    const containerClass = isDynamic
        ? "relative overflow-hidden rounded-xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300"
        : isHome
            ? "border border-white/10 rounded-xl bg-white/5 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/30"
            : "border border-white/10 rounded-xl bg-white/5 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/30";

    // Question color: sunrise gold for home/dynamic, white for default
    const questionClass = (isHome || isDynamic)
        ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
        : "text-white";

    // Answer color: emerald for home/dynamic, gray for default
    const answerClass = (isHome || isDynamic) ? "text-emerald-300" : "text-gray-300";

    // Icon color
    const iconClass = (isHome || isDynamic) ? "text-yellow-400" : "text-cyan-400";

    return (
        <div className={containerClass} style={containerStyle}>
            {/* Glassmorphism layer for dynamic variant */}
            {isDynamic && <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl" />}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-10 w-full flex justify-between items-center p-5 text-left focus:outline-none"
            >
                <span
                    className={`text-lg font-bold pr-4 ${questionClass}`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                    {question}
                </span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${iconClass}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                    >
                        <div className={`p-5 pt-0 leading-relaxed border-t border-white/5 ${answerClass}`}>
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

FAQItem.displayName = "FAQItem";
export default FAQItem;
