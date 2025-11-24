import { motion } from "framer-motion";

export default function PackageCard({ pkg, p, onCustomize, onView }) {
  // Support both formats (pkg OR p)
  const data = pkg || p;

  if (!data) return null; // Safety shield

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="relative">
        <img
          src={data.img}
          alt={data.title}
          className="w-full h-44 object-cover"
        />
        {data.subtitle && (
          <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded text-sm font-medium">
            {data.subtitle.split("•")[0]}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{data.title}</h3>

        {data.subtitle && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {data.subtitle}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div>
            {data.basePrice && (
              <>
                <div className="text-lg font-bold text-[var(--p1)]">
                  ₹{data.basePrice.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">starting price</div>
              </>
            )}
            {data.price && !data.basePrice && (
              <div className="text-lg font-bold text-[var(--p1)]">{data.price}</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {onCustomize && (
              <button
                onClick={onCustomize}
                className="px-4 py-2 bg-[var(--p1)] text-white rounded-lg shadow"
              >
                Customize
              </button>
            )}

            <button
              onClick={() => onView?.(data)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
