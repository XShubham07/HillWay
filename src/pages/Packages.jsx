import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import
import { motion } from "framer-motion";
import PackageCard from "../components/PackageCard";
import PackageCustomizer from "../components/PackageCustomizer";
import PriceSummary from "../components/PriceSummary"; // Typo fix: imported correctly

// ... (SAMPLE_PACKAGES constant remains same) ...
const SAMPLE_PACKAGES = [
  {
    id: "p1",
    title: "Gangtok Classic 3N/4D",
    subtitle: "Scenic drives • Local guide • Comfortable hotels",
    basePrice: 12500,
    img: "/g1.webp",
  },
  {
    id: "p2",
    title: "Lachung & Yumthang 4N/5D",
    subtitle: "Valleys, blooms & sunrise views",
    basePrice: 17000,
    img: "/g2.webp",
  },
  {
    id: "p3",
    title: "Pelling Escape 2N/3D",
    subtitle: "Waterfalls • Monasteries • Viewpoints",
    basePrice: 9999,
    img: "/g3.webp",
  },
];

export default function Packages() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [lastQuote, setLastQuote] = useState(null);

  function openCustomizer(pkg) {
    setSelected(pkg);
    setShowCustomizer(true);
  }

  function onQuote(quote) {
    setLastQuote(quote);
    setShowCustomizer(false);
  }

  // NEW: Navigation handler
  function onView(pkg) {
    navigate(`/tours/${pkg.id}`);
  }

  return (
    <div className="min-h-screen">

      {/* HERO SECTION */}
      <section
        className="relative h-[42vh] flex items-center justify-center text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(8,145,178,0.6), rgba(246, 16, 146, 0.6)), url('/mountain.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-white drop-shadow-xl"
        >
          Custom Tour Packages
        </motion.h1>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-10 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* SIDEBAR (Same as before) */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-xl shadow-xlpK border border-white/30">
              <h3 className="font-bold text-lg">Quick Filters</h3>
              <p className="text-sm text-gray-700 mt-2">
                Adjust packages by budget, duration & categories.
              </p>
              {/* ... Filters content ... */}
            </div>
            
            {/* Why HillWay Card */}
            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-xl shadow-xl border border-white/30">
              <h3 className="font-bold text-lg">Why HillWay?</h3>
              <ul className="mt-3 text-sm text-gray-700 space-y-2">
                <li>• Local experts & verified partners</li>
                <li>• Transparent pricing & instant quotes</li>
                <li>• Fully customizable packages</li>
              </ul>
            </div>

            {lastQuote && (
              <PriceSummary quote={lastQuote} compact />
            )}
          </aside>

          {/* RIGHT SIDE — PACKAGE GRID */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Popular Packages</h2>
              <span className="text-sm text-gray-600">Top picks for you</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SAMPLE_PACKAGES.map((p) => (
                <PackageCard
                  key={p.id}
                  pkg={p}
                  onCustomize={() => openCustomizer(p)}
                  onView={() => onView(p)} // <-- Added onView prop here
                />
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* CUSTOMIZER MODAL */}
      <PackageCustomizer
        open={showCustomizer}
        pkg={selected}
        onClose={() => setShowCustomizer(false)}
        onQuote={onQuote}
      />

    </div>
  );
}