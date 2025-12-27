// src/components/PackageGrid.jsx
import PackageCard from "./PackageCard";

export default function PackageGrid({ list = [], tours, onView }) {
  const items = (Array.isArray(list) && list.length) ? list : (Array.isArray(tours) ? tours : []);
  return (
    <div className="
      space-y-12 
      md:space-y-0 
      md:grid md:grid-cols-3 
      md:gap-16            // ← Gap bhi 20% zyada
      md:max-w-7xl md:mx-auto 
      px-6 md:px-0 
      py-20
    ">
      {items.map((pkg, i) => (
        <div key={pkg.id || i} className="w-full">
          <PackageCard p={pkg} onView={onView} index={i} />
        </div>
      ))}
    </div>
  );
}