import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

export default function TourCard({data, index}) {
  return (
    <motion.div whileHover={{y:-6}} transition={{type:'spring'}} className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-56">
        <img src={data.img} className="w-full h-full object-cover"/>
        <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm">{data.duration}</div>
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] text-white px-2 py-1 rounded">{data.price}</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{data.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{data.excerpt}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-yellow-500"><FaStar /> {data.rating}</div>
          <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Book</button>
        </div>
      </div>
    </motion.div>
  );
}
