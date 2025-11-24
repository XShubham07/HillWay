// src/pages/Tours.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import SearchBar from "../components/SearchBar";
import PackageGrid from "../components/PackageGrid";
import Filters from "../components/Filters";
import { tourData } from "../data/mockTours"; // <-- Import real data

export default function Tours(){
  const navigate = useNavigate();

  // 1. First 3 tours from real data
  const realTours = tourData.map(tour => ({
    id: tour.id, 
    title: tour.title.split(' - ')[0], 
    days: tour.title.match(/(\d+)\s*N\s*\/\s*(\d+)\s*D/)?.[0] || 'Custom Days',
    price: '₹' + tour.basePrice.toLocaleString('en-IN'),
    img: tour.img,
    summary: tour.subtitle,
  }));

  // 2. Generate generic mock data for the rest (Tours 4-9)
  const genericTours = Array.from({length: 6}).map((_, i) => ({
    // Using unique string IDs that won't clash
    id: `generic-${i + 4}`, 
    title: `Adventure Trek ${i + 4}`,
    days: (4 + (i % 3)) + 'N/' + (5 + (i % 3)) + 'D',
    img: i % 2 === 0 ? '/g3.webp' : '/g2.webp', 
    price: '₹' + (15000 + i * 1500).toLocaleString('en-IN'),
    summary: 'A thrilling high-altitude trek for seasoned adventurers.',
  }));

  const all = [...realTours, ...genericTours]; // Total 9 tours
  const [list,setList]=useState(all);

  function applyFilters(f){ 
    // Simplified filter mock
    setList(all.slice(0, 6)); 
  }

  function onView(p){ 
    navigate(`/tours/${p.id}`); 
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-6 mb-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Filters onChange={applyFilters} />
        </aside>

        <div className="lg:col-span-3">
          <SearchBar onSearch={(q)=>console.log('search',q)} />
          <div className="mt-6">
            <PackageGrid list={list} onView={onView} />
          </div>
        </div>
      </div>
    </div>
  );
}