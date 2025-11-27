'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [tours, setTours] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- INITIAL FORM ---
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

  // --- FETCH TOURS ---
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

  // --- SEED BUTTON FUNCTION ---
  const seedData = async () => {
    if(!confirm("Ye purane tours delete karke default mock tours wapas le aayega. Pakka karein?")) return;
    setLoading(true);
    await fetch('/api/seed', { method: 'POST' });
    await fetchTours();
    alert("✅ Tours Restored from Mock Data!");
    setLoading(false);
  };

  // --- FORM HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } else {
      alert("Error saving tour");
    }
    setLoading(false);
  };

  const handleEdit = (tour) => {
    setForm(tour);
    setEditingId(tour._id);
    setView('editor');
  };

  const handleDelete = async (id) => {
    if(confirm("Delete this tour?")) {
      await fetch(`/api/tours/${id}`, { method: 'DELETE' });
      fetchTours();
    }
  };

  // --- NESTED UPDATE HELPERS ---
  const updatePricing = (field, val) => setForm(p => ({ ...p, pricing: { ...p.pricing, [field]: val } }));
  const updateRoomPrice = (type, val) => setForm(p => ({ ...p, pricing: { ...p.pricing, room: { ...p.pricing.room, [type]: val } } }));
  
  // Itinerary Helper
  const addDay = () => setForm(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', details: '' }] }));
  const updateDay = (idx, field, val) => {
    const newItinerary = [...form.itinerary];
    newItinerary[idx][field] = val;
    setForm({ ...form, itinerary: newItinerary });
  };

  // Inclusions Helper
  const handleInclusions = (val) => setForm({ ...form, inclusions: val.split(',').map(s => s.trim()) });

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-bold text-cyan-400">HillWay Admin</div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setView('list')} className="w-full text-left px-4 py-3 rounded bg-slate-800 hover:bg-slate-700">📦 Manage Tours</button>
          <button className="w-full text-left px-4 py-3 rounded hover:bg-slate-800 text-gray-400 cursor-not-allowed">📅 Bookings (Coming Soon)</button>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 ml-64 p-8">
        
        {/* LIST VIEW */}
        {view === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800">All Tours</h1>
              <div className="space-x-4">
                <button onClick={seedData} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 shadow">
                  ↻ Reset/Load Mock Data
                </button>
                <button onClick={() => { setForm(initialForm); setEditingId(null); setView('editor'); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow">
                  + Add New Tour
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(tour => (
                <div key={tour._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <img src={tour.img} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{tour.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{tour.subtitle}</p>
                    <div className="mt-4 flex justify-end gap-2">
                      <button onClick={() => handleEdit(tour)} className="text-blue-600 text-sm font-bold px-3 py-1 bg-blue-50 rounded">Edit</button>
                      <button onClick={() => handleDelete(tour._id)} className="text-red-600 text-sm font-bold px-3 py-1 bg-red-50 rounded">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDITOR VIEW */}
        {view === 'editor' && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">{editingId ? 'Edit Tour' : 'New Tour'}</h2>
              <button onClick={() => setView('list')} className="text-gray-500">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-3 rounded" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                <input className="border p-3 rounded" placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
                <input className="border p-3 rounded" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                <input className="border p-3 rounded" placeholder="Image URL" value={form.img} onChange={e => setForm({...form, img: e.target.value})} />
                <div className="flex gap-4">
                  <input type="number" className="border p-3 rounded w-1/2" placeholder="Price" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} />
                  <input type="number" className="border p-3 rounded w-1/2" placeholder="Nights" value={form.nights} onChange={e => setForm({...form, nights: e.target.value})} />
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold mb-3 text-blue-800">Pricing Configuration</h3>
                <div className="grid grid-cols-4 gap-3">
                  <input type="number" placeholder="Meal" className="border p-2 rounded" value={form.pricing?.mealPerPerson} onChange={e => updatePricing('mealPerPerson', e.target.value)} />
                  <input type="number" placeholder="Tea" className="border p-2 rounded" value={form.pricing?.teaPerPerson} onChange={e => updatePricing('teaPerPerson', e.target.value)} />
                  <input type="number" placeholder="Std Room" className="border p-2 rounded" value={form.pricing?.room?.standard} onChange={e => updateRoomPrice('standard', e.target.value)} />
                  <input type="number" placeholder="Pano Room" className="border p-2 rounded" value={form.pricing?.room?.panoramic} onChange={e => updateRoomPrice('panoramic', e.target.value)} />
                </div>
              </div>

              {/* Itinerary */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-bold">Itinerary</h3>
                  <button type="button" onClick={addDay} className="text-sm bg-gray-200 px-2 py-1 rounded">+ Add Day</button>
                </div>
                {form.itinerary.map((day, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <span className="w-16 pt-2 font-bold text-gray-400">Day {day.day}</span>
                    <input className="border p-2 rounded flex-1" placeholder="Title" value={day.title} onChange={e => updateDay(i, 'title', e.target.value)} />
                    <input className="border p-2 rounded flex-[2]" placeholder="Details" value={day.details} onChange={e => updateDay(i, 'details', e.target.value)} />
                  </div>
                ))}
              </div>

              {/* Inclusions */}
              <div>
                 <label className="block font-bold text-sm mb-1">Inclusions (comma separated)</label>
                 <textarea className="w-full border p-3 rounded" rows={3} value={form.inclusions.join(', ')} onChange={e => handleInclusions(e.target.value)} />
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700">
                {loading ? 'Saving...' : 'Save Tour'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}