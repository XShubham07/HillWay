'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [tours, setTours] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Initial Form State ---
  const initialForm = {
    title: '', subtitle: '', location: '', basePrice: 0, nights: 1, rating: 4.5,
    img: '', mapEmbedUrl: '', description: '', featured: false,
    pricing: {
      mealPerPerson: 450, teaPerPerson: 60,
      room: { standard: 1500, panoramic: 2500 },
      personalCab: { rate: 3200, capacity: 4 },
      tourManagerFee: 5000
    },
    inclusions: [], // Will handle as comma separated string in UI
    itinerary: []
  };

  const [form, setForm] = useState(initialForm);

  // --- Fetch Tours ---
  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tours');
      const data = await res.json();
      if (data.success) setTours(data.data);
    } catch (error) { console.error(error); }
    setLoading(false);
  };

  useEffect(() => { fetchTours(); }, []);

  // --- Actions ---
  const handleEdit = (tour) => {
    setForm(tour);
    setEditingId(tour._id);
    setView('editor');
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this tour?")) return;
    await fetch(`/api/tours/${id}`, { method: 'DELETE' });
    fetchTours();
  };

  const handleCreateNew = () => {
    setForm(initialForm);
    setEditingId(null);
    setView('editor');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/tours/${editingId}` : '/api/tours';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert(editingId ? 'Tour Updated!' : 'Tour Created!');
        setView('list');
        fetchTours();
      }
    } catch (err) { alert('Error saving tour'); }
    setLoading(false);
  };

  // --- Helper for Nested Updates ---
  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const updatePricing = (key, value) => setForm(prev => ({ 
    ...prev, pricing: { ...prev.pricing, [key]: value } 
  }));
  const updatePricingNested = (parent, key, value) => setForm(prev => ({ 
    ...prev, pricing: { ...prev.pricing, [parent]: { ...prev.pricing[parent], [key]: value } } 
  }));

  // --- ITINERARY HELPERS ---
  const addItineraryItem = () => {
    setForm(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', details: '' }]
    }));
  };

  const updateItinerary = (index, field, value) => {
    const newItinerary = [...form.itinerary];
    newItinerary[index][field] = value;
    setForm(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const removeItineraryItem = (index) => {
    const newItinerary = form.itinerary.filter((_, i) => i !== index);
    // Re-index days
    const reIndexed = newItinerary.map((item, i) => ({ ...item, day: i + 1 }));
    setForm(prev => ({ ...prev, itinerary: reIndexed }));
  };

  // --- RENDER: LIST VIEW ---
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gray-50 p-8 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Tour Manager</h1>
            <button 
              onClick={handleCreateNew}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition"
            >
              + Create New Tour
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div key={tour._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <img src={tour.img} className="h-48 w-full object-cover" alt={tour.title} />
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{tour.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">₹{tour.basePrice}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{tour.subtitle}</p>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-between">
                   <button 
                     onClick={() => handleEdit(tour)}
                     className="text-blue-600 font-medium text-sm hover:underline"
                   >
                     Edit Details
                   </button>
                   <button 
                     onClick={() => handleDelete(tour._id)}
                     className="text-red-600 font-medium text-sm hover:underline"
                   >
                     Delete
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: EDITOR VIEW ---
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
           <h2 className="text-2xl font-bold">{editingId ? 'Edit Tour' : 'New Tour'}</h2>
           <button onClick={() => setView('list')} className="text-gray-300 hover:text-white">Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* SECTION 1: BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input className="w-full border p-3 rounded-lg" value={form.title} onChange={e => updateForm('title', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
              <input className="w-full border p-3 rounded-lg" value={form.subtitle} onChange={e => updateForm('subtitle', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
              <input className="w-full border p-3 rounded-lg" value={form.location} onChange={e => updateForm('location', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Image URL</label>
              <input className="w-full border p-3 rounded-lg" value={form.img} onChange={e => updateForm('img', e.target.value)} required />
            </div>
          </div>

          {/* SECTION 2: NUMBERS */}
          <div className="grid grid-cols-3 gap-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Base Price (₹)</label>
              <input type="number" className="w-full border p-3 rounded-lg" value={form.basePrice} onChange={e => updateForm('basePrice', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nights</label>
              <input type="number" className="w-full border p-3 rounded-lg" value={form.nights} onChange={e => updateForm('nights', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
              <input type="number" step="0.1" className="w-full border p-3 rounded-lg" value={form.rating} onChange={e => updateForm('rating', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
               <input type="checkbox" id="feat" className="w-5 h-5" checked={form.featured} onChange={e => updateForm('featured', e.target.checked)} />
               <label htmlFor="feat" className="font-bold text-gray-700">Mark as Featured?</label>
            </div>
          </div>

          {/* SECTION 3: DETAILED PRICING (For Booking Calculator) */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-800">Pricing Logic</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input type="number" placeholder="Meal Cost/Pax" className="border p-3 rounded" value={form.pricing?.mealPerPerson} onChange={e => updatePricing('mealPerPerson', e.target.value)} />
              <input type="number" placeholder="Tea Cost/Pax" className="border p-3 rounded" value={form.pricing?.teaPerPerson} onChange={e => updatePricing('teaPerPerson', e.target.value)} />
              <input type="number" placeholder="Std Room Cost" className="border p-3 rounded" value={form.pricing?.room?.standard} onChange={e => updatePricingNested('room', 'standard', e.target.value)} />
              <input type="number" placeholder="Pano Room Cost" className="border p-3 rounded" value={form.pricing?.room?.panoramic} onChange={e => updatePricingNested('room', 'panoramic', e.target.value)} />
            </div>
          </div>

          {/* SECTION 4: ITINERARY BUILDER */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Itinerary</h3>
              <button type="button" onClick={addItineraryItem} className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">+ Add Day</button>
            </div>
            
            {form.itinerary.map((day, index) => (
              <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border">
                <span className="font-bold text-gray-500 mt-3">Day {day.day}</span>
                <div className="flex-1 space-y-2">
                  <input 
                    placeholder="Day Title (e.g. Arrival)" 
                    className="w-full border p-2 rounded"
                    value={day.title}
                    onChange={e => updateItinerary(index, 'title', e.target.value)}
                  />
                  <textarea 
                    placeholder="Details..." 
                    className="w-full border p-2 rounded"
                    rows={2}
                    value={day.details}
                    onChange={e => updateItinerary(index, 'details', e.target.value)}
                  />
                </div>
                <button type="button" onClick={() => removeItineraryItem(index)} className="text-red-500 hover:bg-red-50 p-2 rounded">✕</button>
              </div>
            ))}
          </div>

          {/* SECTION 5: INCLUSIONS */}
          <div className="space-y-2 border-t pt-6">
            <label className="block text-sm font-bold text-gray-700">Inclusions (Comma separated)</label>
            <textarea 
              className="w-full border p-3 rounded-lg" 
              rows={3}
              placeholder="Hotel Stay, Breakfast, Dinner, Cab Transfer..."
              value={form.inclusions.join(', ')}
              onChange={e => updateForm('inclusions', e.target.value.split(',').map(s => s.trim()))}
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="sticky bottom-0 bg-white pt-4 border-t mt-8 flex justify-end gap-4 pb-4">
            <button type="button" onClick={() => setView('list')} className="px-6 py-3 rounded-lg border hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-lg">
              {loading ? 'Saving...' : 'Save Tour'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}