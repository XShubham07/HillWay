'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  // ... (Keep existing state and fetch functions) ...
  const [view, setView] = useState('list');
  const [tours, setTours] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  
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

  const seedData = async () => {
    if(!confirm("Reset data?")) return;
    setLoading(true);
    await fetch('/api/seed', { method: 'POST' });
    await fetchTours();
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `/api/tours/${editingId}` : '/api/tours';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if(res.ok) { alert("Saved!"); setView('list'); fetchTours(); }
    setLoading(false);
  };

  const handleEdit = (tour) => { setForm(tour); setEditingId(tour._id); setView('editor'); };
  const handleDelete = async (id) => { if(confirm("Delete?")) { await fetch(`/api/tours/${id}`, { method: 'DELETE' }); fetchTours(); } };

  // Helpers
  const updatePricing = (field, val) => setForm(p => ({ ...p, pricing: { ...p.pricing, [field]: val } }));
  const updateRoomPrice = (type, val) => setForm(p => ({ ...p, pricing: { ...p.pricing, room: { ...p.pricing.room, [type]: val } } }));
  
  const addDay = () => setForm(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', details: '', meals: [] }] }));
  
  const updateDay = (idx, field, val) => {
    const newItinerary = [...form.itinerary];
    // For meals, split comma string into array
    if(field === 'meals') newItinerary[idx][field] = val.split(',').map(s => s.trim());
    else newItinerary[idx][field] = val;
    setForm({ ...form, itinerary: newItinerary });
  };

  const removeDay = (idx) => {
    const newItinerary = form.itinerary.filter((_, i) => i !== idx).map((item, i) => ({ ...item, day: i + 1 }));
    setForm({ ...form, itinerary: newItinerary });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
       {/* SIDEBAR */}
       <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 text-2xl font-bold text-cyan-400">HillWay Admin</div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setView('list')} className="w-full text-left px-4 py-3 rounded bg-slate-800">📦 Manage Tours</button>
        </nav>
      </aside>

      <main className="flex-1 ml-64 p-8">
        {view === 'list' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold">All Tours</h1>
                  <div className="space-x-4">
                    <button onClick={seedData} className="px-4 py-2 bg-orange-500 text-white rounded">Reset Data</button>
                    <button onClick={() => { setForm(initialForm); setEditingId(null); setView('editor'); }} className="px-4 py-2 bg-blue-600 text-white rounded">+ Add Tour</button>
                  </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                  {tours.map(t => (
                      <div key={t._id} className="bg-white p-4 rounded shadow">
                          <h3 className="font-bold">{t.title}</h3>
                          <div className="flex gap-2 mt-2">
                              <button onClick={() => handleEdit(t)} className="text-blue-600 text-sm">Edit</button>
                              <button onClick={() => handleDelete(t._id)} className="text-red-600 text-sm">Delete</button>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
        )}

        {view === 'editor' && (
            <div className="bg-white p-8 rounded shadow max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit' : 'New'} Tour</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                        <input className="border p-2 rounded" placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
                        <input className="border p-2 rounded" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                        <input className="border p-2 rounded" placeholder="Image URL" value={form.img} onChange={e => setForm({...form, img: e.target.value})} />
                        <input className="border p-2 rounded" type="number" placeholder="Price" value={form.basePrice} onChange={e => setForm({...form, basePrice: e.target.value})} />
                        <input className="border p-2 rounded" type="number" placeholder="Nights" value={form.nights} onChange={e => setForm({...form, nights: e.target.value})} />
                    </div>
                    
                    {/* Pricing */}
                    <div className="bg-blue-50 p-4 rounded">
                        <h3 className="font-bold mb-2">Pricing</h3>
                        <div className="grid grid-cols-4 gap-2">
                            <input type="number" placeholder="Meal" className="border p-2" value={form.pricing?.mealPerPerson} onChange={e => updatePricing('mealPerPerson', e.target.value)} />
                            <input type="number" placeholder="Tea" className="border p-2" value={form.pricing?.teaPerPerson} onChange={e => updatePricing('teaPerPerson', e.target.value)} />
                            <input type="number" placeholder="Std Room" className="border p-2" value={form.pricing?.room?.standard} onChange={e => updateRoomPrice('standard', e.target.value)} />
                            <input type="number" placeholder="Pano Room" className="border p-2" value={form.pricing?.room?.panoramic} onChange={e => updateRoomPrice('panoramic', e.target.value)} />
                        </div>
                    </div>

                    {/* Itinerary */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                           <h3 className="font-bold">Itinerary (With Meals)</h3>
                           <button type="button" onClick={addDay} className="text-sm bg-gray-200 px-2 py-1 rounded">+ Add Day</button>
                        </div>
                        {form.itinerary.map((day, i) => (
                           <div key={i} className="flex flex-col gap-2 mb-4 bg-gray-50 p-3 rounded border">
                              <div className="flex justify-between">
                                 <span className="font-bold text-gray-500">Day {day.day}</span>
                                 <button type="button" onClick={() => removeDay(i)} className="text-red-500 text-xs">Remove</button>
                              </div>
                              <input className="border p-2 rounded" placeholder="Title" value={day.title} onChange={e => updateDay(i, 'title', e.target.value)} />
                              <textarea className="border p-2 rounded" rows={2} placeholder="Details" value={day.details} onChange={e => updateDay(i, 'details', e.target.value)} />
                              <input 
                                className="border p-2 rounded bg-yellow-50" 
                                placeholder="Meals (e.g. Breakfast, Dinner)" 
                                value={day.meals?.join(', ')} 
                                onChange={e => updateDay(i, 'meals', e.target.value)} 
                              />
                           </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setView('list')} className="px-4 py-2 border rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded font-bold">Save</button>
                    </div>
                </form>
            </div>
        )}
      </main>
    </div>
  );
}