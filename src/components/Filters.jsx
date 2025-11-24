import { useState } from "react";

export default function Filters({ onChange }) {
  const [price, setPrice] = useState(20000);
  const [duration, setDuration] = useState(5);

  function apply(){ onChange?.({ price, duration }); }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Filters</h3>
      <label className="text-sm">Max price: ₹{price}</label>
      <input type="range" min="2000" max="50000" value={price} onChange={e=>setPrice(e.target.value)} className="w-full"/>
      <label className="text-sm mt-3 block">Max duration: {duration} days</label>
      <input type="range" min="1" max="15" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full"/>
      <button onClick={apply} className="mt-3 w-full bg-[var(--p1)] text-white py-2 rounded">Apply</button>
    </div>
  );
}
