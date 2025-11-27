'use client';
import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaBed, FaEdit, FaTrash, FaPlus, FaSync } from 'react-icons/fa';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tours'); // tours, bookings, enquiries
  const [tours, setTours] = useState([]);
  const [view, setView] = useState('list'); // list, editor
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- INITIAL FORM STATE ---
  const initialForm = {
    title: '', subtitle: '', location: '', basePrice: 0, nights: 3, rating: 4.5,
    img: '', mapEmbedUrl: '', description: '', featured: false,
    pricing: {
      mealPerPerson: 450, teaPerPerson: 60,
      room: { standard: 1500, panoramic: 2500 },
      personalCab: { rate: 3200, capacity: 4 },
      tourManagerFee: 5000
    },
    inclusions: [],
    itinerary: []
  };
  const [form, setForm] = useState(initialForm);

  // --- FETCH DATA ---
  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tours');
      const data = await res.json();
      if (data.success) setTours(data.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchTours(); }, []);

  // --- SEED DATA (ONE TIME USE) ---
  // Ye function wahi 9 tours generate karega jo tumhare frontend pe the
  const seedDatabase = async () => {
    if(!confirm("Warning: This will DELETE existing tours and replace them with the default 9 tours. Continue?")) return;
    setLoading(true);

    // 3 Real Tours (Mock Data)
    const realTours = [
      {
        title: "Gangtok Classic", subtitle: "The vibrant capital", basePrice: 12499, img: "/g1.webp", rating: 4.8, nights: 3, location: "Gangtok, Sikkim",
        pricing: { mealPerPerson: 450, teaPerPerson: 60, room: { standard: 1800, panoramic: 2600 }, personalCab: { rate: 3200, capacity: 4 }, tourManagerFee: 6000 },
        itinerary: [{ day: 1, title: "Arrival", details: "Check-in and rest." }]
      },
      {
        title: "Lachung & Yumthang", subtitle: "Himalayan wonderland", basePrice: 17000, img: "/g4.webp", rating: 4.9, nights: 4, location: "Lachung",
        pricing: { mealPerPerson: 450, teaPerPerson: 60, room: { standard: 1600, panoramic: 2400 }, personalCab: { rate: 3500, capacity: 4 }, tourManagerFee: 7000 },
        itinerary: [{ day: 1, title: "Transfer", details: "Drive to Lachung." }]
      },
      {
        title: "Pelling Scenic Escape", subtitle: "Kanchenjunga views", basePrice: 9999, img: "/g3.webp", rating: 4.7, nights: 2, location: "Pelling",
        pricing: { mealPerPerson: 400, teaPerPerson: 50, room: { standard: 1500, panoramic: 2200 }, personalCab: { rate: 3000, capacity: 4 }, tourManagerFee: 5000 },
        itinerary: [{ day: 1, title: "Arrival", details: "Welcome to Pelling." }]
      }
    ];

    // 6 Generated Tours (Like your frontend)
    const genericTours = Array.from({length: 6}).map((_, i) => ({
      title: `Adventure Trek ${i + 4}`, subtitle: "A thrilling high-altitude trek", 
      basePrice: 15000 + i * 1500, img: i % 2 === 0 ? '/g3.webp' : '/g69.webp',
      rating: 4.5, nights: 4 + (i % 3), location: "Himachal Pradesh",
      pricing: { mealPerPerson: 500, teaPerPerson: 50, room: { standard: 2000, panoramic: 3000 }, personalCab: { rate: 4000, capacity: 4 }, tourManagerFee: 5000 },
      itinerary: [{ day: 1, title: "Start", details: "Begin the trek." }]
    }));

    const allTours = [...realTours, ...genericTours];

    await fetch('/api/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allTours)
    });
    
    alert("Database Seeded!");
    fetchTours();
  };

  // --- HANDLERS ---
  const handleEdit = (tour) => {
    setForm(tour);
    setEditingId(tour._id);
    setView('editor');
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this tour?")) return;
    await fetch(`/api/tours/${id}`, { method: 'DELETE' });
    fetchTours();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `/api/tours/${editingId}` : '/api/tours';
    const method = editingId ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if(res.ok) {
      alert("Saved Successfully!");
      setView('list');
      fetchTours();
    }
  };

  // --- NESTED FORM HANDLERS ---
  const updatePricing = (key, val) => setForm(p => ({ ...p, pricing: { ...p.pricing, [key]: val } }));
  const updatePricingRoom = (key, val) => setForm(p => ({ ...p, pricing: { ...p.pricing, room: { ...p.pricing.room, [key]: val } } }));
  
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* SIDE NAVIGATION */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-800">HillWay Admin</div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('tours')} className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'tours' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>🌍 Tours</button>
          <button onClick={() => setActiveTab('bookings')} className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'bookings' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>📅 Bookings</button>
          <button onClick={() => setActiveTab('enquiries')} className={`w-full text-left px-4 py-3 rounded-lg transition ${activeTab === 'enquiries' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>📩 Enquiries</button>
        </nav>
        <div className="p-4 text-xs text-gray-500 text-center">v1.0.0</div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {activeTab === 'tours' && view === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">All Tours ({tours.length})</h1>
              <div className="flex gap-3">
                <button onClick={seedDatabase} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2">
                  <FaSync /> Reset/Seed Data
                </button>
                <button onClick={() => { setForm(initialForm); setEditingId(null); setView('editor'); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <FaPlus /> Add New Tour
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(tour => (
                <div key={tour._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gray-200 relative">
                     <img src={tour.img} className="w-full h-full object-cover" />
                     <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded">₹{tour.basePrice}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 truncate">{tour.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><FaMapMarkerAlt /> {tour.location}</p>
                    <div className="flex justify-between mt-4 pt-4 border-t">
                      <button onClick={() => handleEdit(tour)} className="text-blue-600 text-sm font-bold flex items-center gap-1"><FaEdit /> Edit</button>
                      <button onClick={() => handleDelete(tour._id)} className="text-red-500 text-sm font-bold flex items-center gap-1"><FaTrash /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDITOR VIEW */}
        {activeTab === 'tours' && view === 'editor' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-800 text-white p-6 flex justify-between">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Tour' : 'Create Tour'}</h2>
              <button onClick={() => setView('list')} className="text-gray-300 hover:text-white">Cancel</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              {/* Section 1: Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <input className="border p-3 rounded" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                <input className="border p-3 rounded" placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
                <input className="border p-3 rounded" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                <input className="border p-3 rounded" placeholder="Image URL" value={form.img} onChange={e => setForm({...form, img: e.target.value})} />
                <div className="flex gap-4">
                  <input type="number" className="border p-3 rounded w-1/2" placeholder="Price" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} />
                  <input type="number" className="border p-3 rounded w-1/2" placeholder="Nights" value={form.nights} onChange={e => setForm({...form, nights: e.target.value})} />
                </div>
              </div>

              {/* Section 2: Detailed Pricing */}
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-blue-800 mb-4">Detailed Pricing Logic</h3>
                <div className="grid grid-cols-3 gap-4">
                   <input type="number" placeholder="Meal Cost/Person" className="border p-2 rounded" value={form.pricing?.mealPerPerson} onChange={e => updatePricing('mealPerPerson', e.target.value)} />
                   <input type="number" placeholder="Tea Cost/Person" className="border p-2 rounded" value={form.pricing?.teaPerPerson} onChange={e => updatePricing('teaPerPerson', e.target.value)} />
                   <input type="number" placeholder="Standard Room" className="border p-2 rounded" value={form.pricing?.room?.standard} onChange={e => updatePricingRoom('standard', e.target.value)} />
                   <input type="number" placeholder="Panoramic Room" className="border p-2 rounded" value={form.pricing?.room?.panoramic} onChange={e => updatePricingRoom('panoramic', e.target.value)} />
                </div>
              </div>

              {/* Section 3: Itinerary & Save */}
              <div>
                <h3 className="font-bold mb-2">Itinerary</h3>
                <textarea className="w-full border p-3 rounded" rows={4} placeholder="Simple JSON for now..." disabled value="Itinerary editing coming in next update" />
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg">Save Tour</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'bookings' && <div className="text-center py-20 text-gray-500">No Bookings Yet</div>}
        {activeTab === 'enquiries' && <div className="text-center py-20 text-gray-500">No Enquiries Yet</div>}

      </main>
    </div>
  );
}