// src/components/NewYearPopup.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCopy, FaMountain, FaGift, FaCalendarAlt } from "react-icons/fa";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

// --- CUSTOM STYLES ---
const customStyles = `
  .text-shimmer {
    background: linear-gradient(90deg, #fef3c7 0%, #f59e0b 25%, #fbbf24 50%, #fef3c7 75%, #f59e0b 100%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shine 3s linear infinite;
  }
  @keyframes shine { to { background-position: 200% center; } }

  .glow-border {
    position: absolute;
    inset: -2px;
    border-radius: 20px;
    background: linear-gradient(45deg, #fbbf24, #10b981, #f59e0b, #34d399, #fbbf24);
    background-size: 400% 400%;
    filter: blur(6px);
    z-index: -1;
    animation: glow-rotate 3s ease infinite;
  }
  @keyframes glow-rotate {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .sparkle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
    animation: sparkle-float 2s ease-in-out infinite;
  }
  @keyframes sparkle-float {
    0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
    50% { opacity: 1; transform: translateY(-15px) scale(1); }
  }
`;

const Sparkles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="sparkle"
        style={{
          left: `${15 + i * 15}%`,
          top: `${20 + (i % 3) * 25}%`,
          animationDelay: `${i * 0.3}s`,
        }}
      />
    ))}
  </div>
);

export default function ChristmasPopup({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  const [popupData, setPopupData] = useState({
    badge: "New Year 2025",
    title: "Start 2025 with Adventure!",
    subtitle: "Exclusive New Year discount on all tours",
    discountText: "25% OFF",
    discountSubtext: "All Premium Tours",
    code: "NEWYEAR25",
    buttonText: "CLAIM MY DISCOUNT",
    validUntil: "January 31, 2025"
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsReady(false);

      // Fetch data in background, then show popup
      fetch("https://admin.hillway.in/api/pricing")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data && data.data.popupCoupon) {
            const p = data.data.popupCoupon;
            setPopupData({
              badge: p.badge || "New Year 2025",
              title: p.title || "Start 2025 with Adventure!",
              subtitle: p.subtitle || "Exclusive New Year discount on all tours",
              discountText: p.discountText || "25% OFF",
              discountSubtext: p.discountSubtext || "All Premium Tours",
              code: p.code || "NEWYEAR25",
              buttonText: p.buttonText || "CLAIM MY DISCOUNT",
              validUntil: p.validUntil || "January 31, 2025"
            });
          }
        })
        .catch(() => { })
        .finally(() => {
          setIsReady(true);
          setTimeout(() => {
            confetti({
              particleCount: 60,
              spread: 50,
              origin: { y: 0.6 },
              colors: ['#FCD34D', '#10B981', '#F59E0B'],
              zIndex: 10002,
              gravity: 1.2
            });
          }, 100);
        });

      return () => { document.body.style.overflow = 'unset'; };
    } else {
      document.body.style.overflow = 'unset';
      setIsReady(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(popupData.code);
    setCopied(true);
    confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 }, colors: ['#FCD34D', '#10B981'], zIndex: 10002 });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimDiscount = () => {
    onClose();
    navigate('/');
  };

  // Only render when isOpen AND data is ready (no visible loading)
  const shouldShow = isOpen && isReady;

  return (
    <AnimatePresence>
      <style>{customStyles}</style>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[5000] flex items-center justify-center p-3 md:p-4"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-[5001]"
            onClick={onClose}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-5 md:right-5 z-[5010] text-white/70 bg-white/10 hover:bg-white/20 p-2 md:p-2.5 rounded-full transition-all border border-white/20"
          >
            <FaTimes size={14} />
          </button>

          {/* Card with fetched data */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-[5005] w-full max-w-[380px] md:max-w-md pointer-events-auto"
          >
            <div className="glow-border" />
            <div className="relative bg-gradient-to-b from-[#0f3d2f] to-[#022c22] rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30">
              <Sparkles />

              {/* Badge */}
              <div className="relative z-10 pt-4 md:pt-5 pb-2 md:pb-3 text-center">
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 px-3 py-1.5 rounded-full border border-yellow-500/30">
                  <FaCalendarAlt className="text-yellow-400 text-xs" />
                  <span className="text-yellow-300 text-[10px] md:text-xs font-bold tracking-widest uppercase">
                    {popupData.badge}
                  </span>
                </div>
              </div>

              {/* Main Content */}
              <div className="relative z-10 px-4 md:px-6 pb-5 md:pb-6">
                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg rotate-3">
                      <FaMountain className="text-white text-2xl md:text-3xl" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h2
                  className="text-xl md:text-2xl font-black text-center text-shimmer leading-tight mb-1"
                  dangerouslySetInnerHTML={{ __html: popupData.title.replace(/\n/g, '<br />') }}
                />
                <p className="text-emerald-200/60 text-center text-xs md:text-sm mb-4">
                  {popupData.subtitle}
                </p>

                {/* Discount Box */}
                <div className="relative bg-gradient-to-r from-emerald-900/70 to-emerald-800/70 rounded-xl p-4 md:p-5 mb-4 border border-yellow-400/30">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-500 px-3 py-0.5 rounded-full text-[9px] text-black font-black tracking-widest uppercase shadow">
                    Limited Time
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-amber-500">
                    {popupData.discountText}
                  </h3>
                  <p className="text-emerald-100/70 uppercase tracking-widest text-[10px] md:text-xs text-center mt-1 font-bold">
                    {popupData.discountSubtext}
                  </p>
                </div>

                {/* Coupon Code */}
                <div
                  onClick={handleCopy}
                  className="bg-black/30 p-3 rounded-lg border border-yellow-500/20 mb-4 cursor-pointer group"
                >
                  <p className="text-yellow-500/60 text-[9px] uppercase font-bold mb-1.5 tracking-widest text-center">
                    Your Coupon Code
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <code className="font-mono text-xl md:text-2xl text-yellow-300 font-black tracking-[0.15em] group-hover:text-yellow-200 transition-colors">
                      {popupData.code}
                    </code>
                    <div className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 rounded-lg text-yellow-400 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                      {copied ? <FaGift size={14} /> : <FaCopy size={14} />}
                    </div>
                  </div>
                  <div className="h-4 flex items-center justify-center">
                    <AnimatePresence>
                      {copied && (
                        <motion.span
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-emerald-400 text-[10px] font-bold"
                        >
                          ✓ Copied!
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleClaimDiscount}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-black py-3 md:py-3.5 rounded-xl shadow-lg transition-all text-sm md:text-base tracking-wide flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <FaGift /> {popupData.buttonText}
                </button>

                <p className="text-center text-emerald-300/40 text-[9px] md:text-[10px] mt-3 tracking-wider">
                  Valid until {popupData.validUntil}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}