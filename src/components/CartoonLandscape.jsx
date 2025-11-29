/* CartoonLandscape.jsx
 * A single-file, scroll-aware, parallax + zoom background.
 * Works with framer-motion v10+.
 */
import React from 'react';
import { motion, useTransform, useScroll, useSpring } from 'framer-motion';

export default function CartoonLandscape({ style }) {
  /* ---------- 1.  read scroll progress (0..1) ---------- */
  const { scrollYProgress } = useScroll();

  /* ---------- 2.  smooth the value a little ---------- */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
  });

  /* ---------- 3.  derive parallax & zoom ---------- */
  // sky moves slowest (illusion of depth)
  const skyY = useTransform(smoothProgress, [0, 1], ['0%', '-40%']);
  // mid layer faster
  const midY = useTransform(smoothProgress, [0, 1], ['0%', '-60%']);
  // front layer fastest
  const frontY = useTransform(smoothProgress, [0, 1], ['0%', '-80%']);
  // whole scene scales a bit while scrolling (fake zoom)
  const scale = useTransform(smoothProgress, [0, 1], [1, 1.25]);

  /* ---------- 4.  colour theme (change here) ---------- */
  const palette = {
    skyTop: '#0b1d39',      // deep navy
    skyBottom: '#2a6f97',   // alpine blue
    sun: '#ffc86b',         // warm sunrise
    cloud: '#ffffff',       // snow
    backMountain: '#2a6f97',
    midMountain: '#1a4d3a',
    frontHill: '#0b1d39',
    snow: '#ffffff',
  };

  /* ---------- 5.  reusable cloud blob ---------- */
  const Cloud = ({ x, y, scale = 1, opacity = 0.9 }) => (
    <g opacity={opacity} transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path
        d="M25 30Q30 10 50 10Q70 10 75 30Q95 30 95 50Q95 70 75 70L25 70Q5 70 5 50Q5 30 25 30Z"
        fill={palette.cloud}
      />
    </g>
  );

  return (
    <motion.div
      style={{
        ...style,
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${palette.skyTop} 0%, ${palette.skyBottom} 100%)`,
      }}
    >
      {/* ---------- SVG scene ---------- */}
      <motion.svg
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1440 800"
        className="w-full h-full"
        style={{ scale }} // zoom whole scene
      >
        {/* ----- sun ----- */}
        <g className="sun">
          <motion.circle
            cx="1150"
            cy="120"
            r="70"
            fill={palette.sun}
            initial={{ scale: 1, rotate: 0 }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <circle cx="1150" cy="120" r="90" fill={palette.sun} opacity=".2" />
          <circle cx="1150" cy="120" r="110" fill={palette.sun} opacity=".1" />
        </g>

        {/* ----- clouds ----- */}
        <motion.g style={{ y: skyY }}>
          <Cloud x={150} y={180} scale={1.2} opacity={0.85} />
          <Cloud x={650} y={220} scale={0.9} opacity={0.7} />
          <Cloud x={1050} y={160} scale={1} opacity={0.8} />
        </motion.g>

        {/* ----- back mountains ----- */}
        <motion.g style={{ y: midY }}>
          <path
            d="M0 480L120 420L240 380L360 400L480 360L600 340L720 350L840 380L960 370L1080 340L1200 360L1320 400L1440 430V800H0z"
            fill={palette.backMountain}
          />
          {/* snow caps */}
          <path d="M720 350L680 330L760 335z" fill={palette.snow} opacity=".9" />
          <path d="M1080 340L1040 320L1120 325z" fill={palette.snow} opacity=".8" />
        </motion.g>

        {/* ----- mid mountains ----- */}
        <motion.g style={{ y: frontY }}>
          <path
            d="M0 560L180 480L360 440L540 460L720 420L900 440L1080 400L1260 460L1440 500V800H0z"
            fill={palette.midMountain}
          />
          <path d="M720 420L680 390L760 395z" fill={palette.snow} opacity=".9" />
          <path d="M1080 400L1040 370L1120 375z" fill={palette.snow} opacity=".8" />
        </motion.g>

        {/* ----- front silhouette hills ----- */}
        <path
          d="M0 640L200 580L400 600L600 560L800 580L1000 540L1200 580L1440 620V800H0z"
          fill={palette.frontHill}
        />
      </motion.svg>
    </motion.div>
  );
}