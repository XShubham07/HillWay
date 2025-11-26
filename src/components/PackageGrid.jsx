import { useState } from "react";
import PackageCard from "./PackageCard";

export default function PackageGrid({ list, onView }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map((p, i) => {
        const isHovered = hoverIndex === i;
        return (
          <div
            key={i}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
            className="transition-all duration-300"
            style={{
              transform: isHovered ? "scale(1.08)" : "scale(.99)",
              opacity: hoverIndex !== null && !isHovered ? 0.6: 1,
              filter:
                hoverIndex !== null && !isHovered
                  ? "blur(0.2px)"
                  : "blur(0px)",
            }}
          >
            <PackageCard p={p} onView={onView} />
          </div>
        );
      })}
    </div>
  );
}
