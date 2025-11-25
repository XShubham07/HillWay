// src/components/NatureOverlay.jsx

export default function NatureOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full z-0 overflow-hidden">
      {/* Large top left blob */}
      <svg
        className="absolute -top-24 -left-24 w-[520px] h-[420px] opacity-30"
        viewBox="0 0 520 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M200,40 Q260,0 400,60 Q500,100 480,230 Q460,370 280,400 Q100,420 60,290 Q20,150 140,90 Q180,70 200,40 Z"
          fill="#38bdf8"
        />
      </svg>
      {/* Bottom right accent blob */}
      <svg
        className="absolute -bottom-32 -right-32 w-[440px] h-[350px] opacity-20"
        viewBox="0 0 440 350"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M140,30 Q220,0 360,80 Q440,120 420,220 Q400,320 240,340 Q80,350 40,260 Q0,170 90,90 Q120,60 140,30 Z"
          fill="#2dd4bf"
        />
      </svg>
      {/* Small floating blob center */}
      <svg
        className="absolute top-1/2 left-1/2 w-36 h-36 opacity-20 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 144 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M45,28 Q72,5 112,32 Q139,49 124,82 Q109,115 71,127 Q33,139 16,101 Q-1,63 29,40 Q41,31 45,28 Z"
          fill="#0ea5e9"
        />
      </svg>
    </div>
  );
}
