import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCut, FaMountain, FaArrowRight } from "react-icons/fa";
import confetti from "canvas-confetti";

/* --- BALLOON COMPONENT --- */
const Balloon = ({ color, left, delay, speed }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 1 }}
    animate={{ y: "-100vh", opacity: 0 }}
    transition={{ duration: speed, delay: delay, ease: "easeOut" }}
    className="fixed bottom-0 z-[6000] pointer-events-none"
    style={{ left: `${left}%` }}
  >
    <div className="flex flex-col items-center">
      <div 
        className="w-16 h-20 rounded-[50%] opacity-90"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, white, ${color})`,
          boxShadow: `0 10px 20px ${color}60`
        }}
      />
      <div className="w-0.5 h-24 bg-white/30" />
    </div>
  </motion.div>
);

/* --- SPARKLE PARTICLES --- */
const SparkleParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: 0,
          opacity: 0
        }}
        animate={{ 
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeInOut"
        }}
        className="absolute w-1 h-1 bg-[#D9A441] rounded-full"
        style={{
          boxShadow: '0 0 10px 2px rgba(217,164,65,0.6)'
        }}
      />
    ))}
  </div>
);

/* --- ANIMATED TIMER DIGITS --- */
const TimerDigit = ({ value }) => (
  <motion.div
    key={value}
    initial={{ y: -20, opacity: 0, filter: "blur(5px)" }}
    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
    exit={{ y: 20, opacity: 0, filter: "blur(5px)" }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className="relative inline-block"
  >
    <div className="text-8xl md:text-9xl font-black tabular-nums bg-gradient-to-b from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
      {value}
    </div>
    <motion.div
      animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="absolute inset-0 bg-[#D9A441]/30 blur-xl rounded-lg"
    />
  </motion.div>
);

/* --- HELLO ANIMATION (Hindi & English Only) --- */
const HelloAnimation = ({ onComplete }) => {
  const hellos = [
    { text: "Hello", lang: "English" },
    { text: "नमस्ते", lang: "हिंदी" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= hellos.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 1200);
          return prev;
        }
        return prev + 1;
      });
    }, 1500); // Slower transition - 1.5 seconds per language
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <SparkleParticles />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)", y: 30 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, scale: 1.3, filter: "blur(20px)", y: -30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h1 
            className="text-8xl md:text-[12rem] font-light tracking-tight"
            style={{
              fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
              textShadow: '0 0 80px rgba(217,164,65,0.5)',
              background: 'linear-gradient(135deg, #ffffff 0%, #D9A441 50%, #10B981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {hellos[currentIndex].text}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.3 }}
            className="text-emerald-200/70 text-base md:text-lg mt-6 tracking-[0.4em] font-light"
          >
            {hellos[currentIndex].lang}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* --- SCISSORS CUTTING ANIMATION --- */
const ScissorsCutting = () => (
  <motion.div
    initial={{ x: "-60%", y: "-50%", rotate: 45, opacity: 0 }}
    animate={{ 
      x: "60%",
      y: "-50%",
      rotate: [45, 25, 45, 25, 45],
      opacity: [0, 1, 1, 1, 0]
    }}
    transition={{ 
      duration: 3.5,
      ease: "easeInOut",
      times: [0, 0.2, 0.4, 0.6, 1]
    }}
    className="absolute top-1/2 left-0 z-[6001] pointer-events-none"
  >
    <FaCut className="text-6xl md:text-8xl text-[#D9A441] drop-shadow-[0_0_20px_rgba(217,164,65,0.8)]" />
  </motion.div>
);

/* --- WELCOME MESSAGE --- */
const WelcomeMessage = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex flex-col items-center justify-center h-screen px-6"
    >
      <SparkleParticles />
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 80, 
          damping: 15,
          delay: 0.2
        }}
        className="mb-12 relative"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-[#D9A441] blur-3xl rounded-full"
        />
        <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <FaMountain className="text-7xl text-[#D9A441]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        <h1 
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #D9A441 50%, #10B981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Welcome to HillWay
        </h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-emerald-100 text-lg md:text-2xl mb-4 font-light leading-relaxed"
        >
          Your Gateway to the Mountains
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-emerald-200/70 text-sm md:text-base mb-12 max-w-lg mx-auto"
        >
          Experience breathtaking journeys, handpicked destinations, and unforgettable adventures in the heart of nature.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="group relative bg-gradient-to-r from-[#D9A441] to-amber-600 text-[#022c22] px-10 py-5 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(217,164,65,0.5)] flex items-center gap-3 mx-auto overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          <span className="relative z-10">Begin Your Journey</span>
          <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-emerald-300/40 text-xs tracking-wider"
      >
        Scroll down to explore destinations
      </motion.div>
    </motion.div>
  );
};

export default function LaunchScreen({ onComplete }) {
  const [timeLeft, setTimeLeft] = useState(10); // Set to 60 for production
  const [stage, setStage] = useState("countdown");
  const [showCelebration, setShowCelebration] = useState(false);

  // --- TIMER LOGIC ---
  useEffect(() => {
    if (stage !== "countdown") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => handleAutoCut(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stage]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  // --- AUTO RIBBON CUT WITH SLOW ANIMATION ---
  const handleAutoCut = () => {
    setStage("cutting");

    // Confetti during cutting (4 seconds - matching scissors animation)
    const duration = 4000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.5 },
        colors: ['#D9A441', '#EF4444', '#10B981', '#ffffff'],
        zIndex: 10002
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.5 },
        colors: ['#D9A441', '#EF4444', '#10B981', '#ffffff'],
        zIndex: 10002
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Balloons
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4000);

    // Transition to hello stage (after cutting animation completes)
    setTimeout(() => setStage("hello"), 3800);
  };

  const handleManualCut = () => {
    if (stage === "countdown") {
      setTimeLeft(0);
      setTimeout(() => handleAutoCut(), 300);
    }
  };

  const time = formatTime(timeLeft);

  return (
    <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#022c22] via-[#023d2d] to-[#022c22]">
      
      {/* Celebration Balloons */}
      {showCelebration && (
        <>
          {[...Array(25)].map((_, i) => (
            <Balloon 
              key={i} 
              color={['#EF4444', '#D9A441', '#10B981', '#3B82F6', '#A855F7'][i % 5]}
              left={Math.random() * 100}
              delay={Math.random() * 2}
              speed={4 + Math.random() * 2}
            />
          ))}
        </>
      )}

      <AnimatePresence mode="wait">
        {/* STAGE: COUNTDOWN */}
        {stage === "countdown" && (
          <motion.div
            key="countdown"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="relative z-30 w-full h-full flex items-center justify-center"
          >
            {/* Countdown Content */}
            <div className="flex flex-col items-center justify-center text-center relative z-30">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="mb-8 p-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative"
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-[#D9A441] blur-2xl rounded-full"
                />
                <FaMountain className="text-5xl text-[#D9A441] relative z-10" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-emerald-200 text-sm tracking-[0.4em] uppercase mb-8 font-light"
              >
                Grand Opening In
              </motion.h2>

              {/* Animated Timer with Individual Digits */}
              <div className="relative mb-10 flex items-center justify-center gap-3 md:gap-6">
                {/* Hours */}
                <div className="flex items-center">
                  <AnimatePresence mode="wait">
                    <TimerDigit value={time.h[0]} />
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <TimerDigit value={time.h[1]} />
                  </AnimatePresence>
                </div>
                
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl md:text-7xl font-black text-[#D9A441] mx-2"
                >
                  :
                </motion.span>

                {/* Minutes */}
                <div className="flex items-center">
                  <AnimatePresence mode="wait">
                    <TimerDigit value={time.m[0]} />
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <TimerDigit value={time.m[1]} />
                  </AnimatePresence>
                </div>

                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl md:text-7xl font-black text-[#D9A441] mx-2"
                >
                  :
                </motion.span>

                {/* Seconds */}
                <div className="flex items-center">
                  <AnimatePresence mode="wait">
                    <TimerDigit value={time.s[0]} />
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <TimerDigit value={time.s[1]} />
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                onClick={handleManualCut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-[#D9A441]/10 hover:bg-[#D9A441]/20 border border-[#D9A441]/30 text-[#D9A441] px-8 py-3 rounded-full font-semibold text-sm flex items-center gap-3 transition-all backdrop-blur-sm"
              >
                <FaCut className="group-hover:rotate-[-15deg] transition-transform" />
                Skip & Launch Now
              </motion.button>
            </div>

            {/* Ribbon Visual */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
              className="absolute z-25 w-full h-6 bg-gradient-to-r from-red-900 via-red-600 to-red-900 shadow-2xl flex items-center justify-center"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <div className="w-full border-t-2 border-dashed border-yellow-400/60 absolute top-2" />
              <div className="w-full border-b-2 border-dashed border-yellow-400/60 absolute bottom-2" />
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full absolute shadow-xl border-4 border-[#D9A441] flex items-center justify-center"
              >
                <FaCut className="text-white text-2xl" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* STAGE: CUTTING (SLOW CURTAINS + SCISSORS) */}
        {stage === "cutting" && (
          <motion.div
            key="cutting"
            className="relative w-full h-full"
          >
            {/* Animated Scissors Cutting Across */}
            <ScissorsCutting />

            {/* Left Curtain Opening SLOWLY */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "-100%" }}
              transition={{ duration: 3.5, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#022c22] z-20 border-r-2 border-[#D9A441]/30"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <motion.div
                animate={{ scaleY: [1, 1.02, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D9A441] to-transparent"
              />
            </motion.div>

            {/* Right Curtain Opening SLOWLY */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: "100%" }}
              transition={{ duration: 3.5, ease: [0.65, 0, 0.35, 1], delay: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#022c22] z-20 border-l-2 border-[#D9A441]/30"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <motion.div
                animate={{ scaleY: [1, 1.02, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#D9A441] to-transparent"
              />
            </motion.div>

            {/* Ribbon Splitting Effect (SLOW) */}
            <motion.div
              initial={{ scaleY: 1, opacity: 1 }}
              animate={{ 
                scaleY: [1, 0.8, 0.4, 0],
                opacity: [1, 0.8, 0.4, 0]
              }}
              transition={{ duration: 2.5, ease: "easeIn", delay: 0.8 }}
              className="absolute z-25 w-full h-6 bg-gradient-to-r from-red-900 via-red-600 to-red-900 shadow-2xl"
              style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
              <div className="w-full border-t-2 border-dashed border-yellow-400/60 absolute top-2" />
              <div className="w-full border-b-2 border-dashed border-yellow-400/60 absolute bottom-2" />
            </motion.div>

            {/* Ribbon Pieces Flying Apart */}
            <motion.div
              initial={{ x: 0, y: "-50%", rotate: 0 }}
              animate={{ 
                x: "-200%",
                y: ["-50%", "-60%", "-70%"],
                rotate: -45,
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
              className="absolute left-0 top-1/2 w-1/3 h-6 bg-gradient-to-r from-red-900 to-red-600 z-[6000]"
            />
            <motion.div
              initial={{ x: 0, y: "-50%", rotate: 0 }}
              animate={{ 
                x: "200%",
                y: ["-50%", "-60%", "-70%"],
                rotate: 45,
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
              className="absolute right-0 top-1/2 w-1/3 h-6 bg-gradient-to-l from-red-900 to-red-600 z-[6000]"
            />
          </motion.div>
        )}

        {/* STAGE: HELLO ANIMATION */}
        {stage === "hello" && (
          <HelloAnimation onComplete={() => setStage("welcome")} />
        )}

        {/* STAGE: WELCOME MESSAGE */}
        {stage === "welcome" && (
          <WelcomeMessage onComplete={onComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
        