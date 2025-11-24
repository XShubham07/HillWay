import { motion } from "framer-motion";
import { FaShieldAlt, FaHotel, FaCarSide, FaHeadset } from "react-icons/fa";

const features = [
  { icon: <FaShieldAlt />, title: "100% Safe", desc: "Verified drivers & secure stays." },
  { icon: <FaHotel />, title: "Luxury Stays", desc: "Handpicked premium hotels." },
  { icon: <FaCarSide />, title: "Private Cabs", desc: "Clean & sanitized private fleet." },
  { icon: <FaHeadset />, title: "24/7 Support", desc: "On-ground support team." },
];

export default function Features() {
  return (
    <section className="py-20 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)]">
            Why Choose HillWay?
          </h2>
          <p className="text-gray-600 mt-2">Elevating your travel experience</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="
                bg-white/40 backdrop-blur-lg border border-white/50
                p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:bg-white/60
                transition-all duration-300 text-center group
              "
            >
              <div className="
                w-16 h-16 mx-auto mb-4 rounded-full 
                bg-gradient-to-tr from-[var(--p1)] to-[var(--p2)]
                flex items-center justify-center text-white text-2xl
                shadow-md group-hover:scale-110 transition-transform
              ">
                {f.icon}
              </div>
              <h3 className="font-bold text-xl text-[var(--dark)]">{f.title}</h3>
              <p className="text-sm text-gray-700 mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}