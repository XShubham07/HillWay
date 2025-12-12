import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SearchBar({ onSearch }) {
  const [dest,setDest]=useState("");
  const [start,setStart]=useState(null);
  const [end,setEnd]=useState(null);
  const [pax,setPax]=useState(2);

  function submit(e){
    e?.preventDefault();
    onSearch?.({dest,start,end,pax});
  }

  return (
    <form onSubmit={submit} className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input value={dest} onChange={e=>setDest(e.target.value)} placeholder="Destination e.g. Gangtok"
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[var(--p1)] focus:ring-2 focus:ring-[var(--p1)]/30 will-change-transform" />
        <DatePicker selected={start} onChange={d=>setStart(d)} placeholderText="Start" className="border p-3 rounded" />
        <DatePicker selected={end} onChange={d=>setEnd(d)} placeholderText="End" className="border p-3 rounded" />
        <div className="flex gap-2">
          <input type="number" min="1" value={pax} onChange={e=>setPax(e.target.value)} className="border p-3 rounded w-full" />
          <button className="bg-[var(--p1)] text-white px-4 rounded-lg">Search</button>
        </div>
      </div>
    </form>
  );
}
