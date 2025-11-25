// src/components/ElementalGrid.jsx
import { motion } from "framer-motion";
const elements = [
  {
    name: "Fire",
    color: "from-red-600 to-yellow-400",
    icon: "/fire3d.png" // Place a PNG or SVG in public/assets
  },
  {
    name: "Water",
    color: "from-blue-600 to-cyan-400",
    icon: "/water3d.png"
  },
  {
    name: "Earth",
    color: "from-amber-700 to-green-500",
    icon: "/earth3d.png"
  },
  {
    name: "Air",
    color: "from-slate-400 to-indigo-200",
    icon: "/air3d.png"
  },
];

export default function ElementalGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-20 mb-16">
      <h2 className="text-3xl font-bold text-center mb-8">Elemental Magic</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {elements.map((el, i) => (
          <motion.div
            key={el.name}
            className={`
              bg-gradient-to-br ${el.color} rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl relative cursor-pointer
              transition-transform duration-300 hover:scale-105 group
            `}
            initial={{ scale: 0.9, opacity: 0.5, filter: "blur(3px)" }}
            whileInView={{ scale: 1.08, opacity: 1, filter: "blur(0)" }}
            viewport={{ once: true, amount: 0.4 }}
            whileHover={{ scale: 1.13, rotateZ: 4 }}
          >
            <img src={el.icon} alt={el.name + " icon"} className="w-28 h-28 drop-shadow-2xl mb-4 z-10" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,.3)"}} />
            <span className="text-xl text-white font-semibold tracking-wide">{el.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
