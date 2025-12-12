/* CartoonLandscape.jsx — Ultra Smooth Lenis + GPU Optimized Version */

import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function CartoonLandscape({ style }) {
  /* ------------------------------------
      1. Lenis-controlled scroll value
  ------------------------------------ */
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const lenis = window.lenis;
    if (!lenis) {
      console.warn("Lenis instance missing: window.lenis not found.");
      return;
    }

    const updateScroll = ({ progress }) => {
      scrollY.set(progress); // smooth 0 → 1
    };

    lenis.on("scroll", updateScroll);
    return () => lenis.off("scroll", updateScroll);
  }, []);

  /* ------------------------------------
      2. GPU-Optimized Parallax Values
  ------------------------------------ */
  const skyY = useTransform(scrollY, [0, 1], ["0%", "-40%"]);
  const midY = useTransform(scrollY, [0, 1], ["0%", "-60%"]);
  const frontY = useTransform(scrollY, [0, 1], ["0%", "-80%"]);

  const scale = useTransform(scrollY, [0, 1], [
    1,
    window.innerWidth < 768 ? 1.12 : 1.25,
  ]);

  /* ------------------------------------
      3. Colors
  ------------------------------------ */
  const palette = {
    skyTop: "#0b1d39",
    skyBottom: "#2a6f97",
    sun: "#ffc86b",
    cloud: "#ffffff",
    backMountain: "#2a6f97",
    midMountain: "#1a4d3a",
    frontHill: "#0b1d39",
    snow: "#ffffff",
  };

  /* ------------------------------------
      4. Clouds
  ------------------------------------ */
  const Cloud = ({ x, y, scale = 1, opacity = 0.9 }) => (
    <g opacity={opacity} transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path
        d="M25 30Q30 10 50 10Q70 10 75 30Q95 30 95 50Q95 70 75 70L25 70Q5 70 5 50Q5 30 25 30Z"
        fill={palette.cloud}
      />
    </g>
  );

  /* ------------------------------------
      5. Render Scene
  ------------------------------------ */
  return (
    <motion.div
      style={{
        ...style,
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${palette.skyTop} 0%, ${palette.skyBottom} 100%)`,
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <motion.svg
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1440 800"
        className="w-full h-full"
        style={{
          scale,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        {/* ----- SUN ----- */}
        <g className="sun" style={{ transform: "translateZ(0)" }}>
          <motion.circle
            cx="1150"
            cy="120"
            r="70"
            fill={palette.sun}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [-8, 8, -8],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <circle cx="1150" cy="120" r="90" fill={palette.sun} opacity=".2" />
          <circle cx="1150" cy="120" r="110" fill={palette.sun} opacity=".1" />
        </g>

        {/* ----- CLOUDS (GPU Layer) ----- */}
        <motion.g
          style={{
            y: skyY,
            transform: "translateZ(0)",
          }}
          transition={{ type: "tween", ease: "linear" }}
        >
          <Cloud x={150} y={180} scale={1.2} opacity={0.85} />
          <Cloud x={650} y={220} scale={0.9} opacity={0.7} />
          <Cloud x={1050} y={160} scale={1} opacity={0.8} />
        </motion.g>

        {/* ----- BACK MOUNTAINS ----- */}
        <motion.g
          style={{
            y: midY,
            transform: "translateZ(0)",
          }}
          transition={{ type: "tween", ease: "linear" }}
        >
          <path
            d="M0 480L120 420L240 380L360 400L480 360L600 340L720 350L840 380L960 370L1080 340L1200 360L1320 400L1440 430V800H0z"
            fill={palette.backMountain}
          />
          <path d="M720 350L680 330L760 335z" fill={palette.snow} opacity=".9" />
          <path d="M1080 340L1040 320L1120 325z" fill={palette.snow} opacity=".8" />
        </motion.g>

        {/* ----- MID MOUNTAINS ----- */}
        <motion.g
          style={{
            y: frontY,
            transform: "translateZ(0)",
          }}
          transition={{ type: "tween", ease: "linear" }}
        >
          <path
            d="M0 560L180 480L360 440L540 460L720 420L900 440L1080 400L1260 460L1440 500V800H0z"
            fill={palette.midMountain}
          />
          <path d="M720 420L680 390L760 395z" fill={palette.snow} opacity=".9" />
          <path d="M1080 400L1040 370L1120 375z" fill={palette.snow} opacity=".8" />
        </motion.g>

        {/* ----- FRONT HILLS (Static GPU Layer) ----- */}
        <path
          d="M0 640L200 580L400 600L600 560L800 580L1000 540L1200 580L1440 620V800H0z"
          fill={palette.frontHill}
          style={{ transform: "translateZ(0)" }}
        />
      </motion.svg>
    </motion.div>
  );
}
