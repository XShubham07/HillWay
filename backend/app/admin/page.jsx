'use client';
import { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, 
  FaTag, FaBed, FaUserTie, FaChair, FaInfoCircle, 
  FaList, FaQuestionCircle, FaCheck
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tours');
  const [view, setView] = useState('list');
  
  const [tours, setTours] = useState([]);
  const [globalPrices, setGlobalPrices] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTours, resPrices] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/pricing')
      ]);
      
      const dataTours = await resTours.json();
      const dataPrices = await resPrices.json();

      if (dataTours.success) setTours(dataTours.data);
      if (dataPrices.success) setGlobalPrices(dataPrices.data);

    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- FORM INITIALIZATION ---
  const getInitialForm = () => ({
    title: '', subtitle: '', location: '', description: '',
    basePrice: 0, nights: 3, rating: 4.5, featured: false,
    img: '', mapEmbedUrl: '',
    
    pricing: {
      mealPerPerson: globalPrices?.mealPrice || 450,
      teaPerPerson: globalPrices?.teaPrice || 60,
      bonfire: globalPrices?.bonfirePrice || 500,
      tourGuide: 1000, 
      comfortSeat: 800,
      
      room: { 
        standard: globalPrices?.standardRoomPrice || 1500, 
        panoramic: globalPrices?.panoRoomPrice || 2500 
      },
      personalCab: { 
        rate: globalPrices?.personalCabPrice || 3200, 
        capacity: 4 
      },
      tourManagerFee: 5000
    },
    inclusions: [],
    itinerary: [],
    faqs: [],
    reviews: []
  });

  const [form, setForm] = useState(getInitialForm());

  const handleCreateNew = () => {
    setForm(getInitialForm()); 
    setEditingId(null);
    setView('editor');
  };

  const handleEdit = (tour) => {
    const defaults = getInitialForm();
    const mergedForm = {
      ...defaults,
      ...tour,
      pricing: {
        ...defaults.pricing, 
        ...(tour.pricing || {}) 
      }
    };
    setForm(mergedForm);
    setEditingId(tour._id);
    setView('editor');
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to delete this tour?")) return;
    await fetch(`/api/tours/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleSaveTour = async (e) => {
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
      alert("Tour Saved Successfully!");
      setView('list');
      fetchData();
    } else {
      alert("Error saving tour");
    }
    setLoading(false);
  };

  const handleSaveGlobalPricing = async () => {
    setLoading(true);
    await fetch('/api/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(globalPrices),
    });
    alert("Global Prices Updated!");
    setLoading(false);
  };

  const seedData = async () => { 
    if(confirm("Reset Data?")) { 
        await fetch('/api/seed', { method: 'POST' }); 
        fetchData(); 
    } 
  };

  // --- FIXED HELPERS ---
  const updateField = (field, val) => setForm(p => ({ ...p, [field]: val }));
  
  // FIXED: Allow empty string for typing
  const updatePricing = (field, val) => {
    setForm(p => ({ 
      ...p, 
      pricing: { 
        ...p.pricing, 
        [field]: val === '' ? '' : Number(val) 
      } 
    }));
  };
  
  // FIXED: Allow empty string for typing
  const updatePricingNested = (parent, field, val) => {
    setForm(p => ({ 
      ...p, 
      pricing: { 
        ...p.pricing, 
        [parent]: { 
          ...p.pricing[parent], 
          [field]: val === '' ? '' : Number(val) 
        } 
      } 
    }));
  };

  const addItineraryDay = () => setForm(p => ({ 
    ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', details: '', meals: [] }] 
  }));
  
  const updateItinerary = (idx, field, val) => {
    const newIt = [...form.itinerary];
    if(field === 'meals') newIt[idx][field] = val.split(',').map(s=>s.trim());
    else newIt[idx][field] = val;
    setForm({ ...form, itinerary: newIt });
  };

  const addFaq = () => setForm(p => ({ ...p, faqs: [...(p.faqs || []), { q: '', a: '' }] }));
  const updateFaq = (idx, field, val) => {
    const newFaqs = [...form.faqs];
    newFaqs[idx][field] = val;
    setForm({ ...form, faqs: newFaqs });
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-100 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-6 text-2xl font-bold text-cyan-400 tracking-wider">HillWay Admin</div>
        <nav className="flex-1 px-4 space-y-3 mt-4">
          <button onClick={() => setActiveTab('tours')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tours' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}>
            <FaMapMarkerAlt /> Manage Tours
          </button>
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pricing' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}>
            <FaTag /> Global Pricing
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* ==================== GLOBAL PRICING TAB ==================== */}
        {activeTab === 'pricing' && globalPrices && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Universal Price List</h1>
            <p className="text-gray-400 mb-8">Update default rates for all tours.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaTag/> Add-ons</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Meal Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.mealPrice} onChange={e => setGlobalPrices({...globalPrices, mealPrice: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Tea Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.teaPrice} onChange={e => setGlobalPrices({...globalPrices, teaPrice: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Bonfire Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.bonfirePrice} onChange={e => setGlobalPrices({...globalPrices, bonfirePrice: e.target.value})} /></div>
                </div>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaBed/> Stay & Travel</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Standard Room Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.standardRoomPrice} onChange={e => setGlobalPrices({...globalPrices, standardRoomPrice: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Panoramic Room Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.panoRoomPrice} onChange={e => setGlobalPrices({...globalPrices, panoRoomPrice: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Personal Cab Rate</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.personalCabPrice} onChange={e => setGlobalPrices({...globalPrices, personalCabPrice: e.target.value})} /></div>
                </div>
              </div>
            </div>
            <button onClick={handleSaveGlobalPricing} className="mt-8 w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold text-lg shadow-lg">Save Global Prices</button>
          </div>
        )}

        {/* ==================== TOURS TAB ==================== */}
        
        {activeTab === 'tours' && view === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">All Tours ({tours.length})</h1>
              <div className="space-x-4">
                <button onClick={seedData} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">Reset Data</button>
                <button onClick={handleCreateNew} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2">
                  <FaPlus /> Create New Tour
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(tour => (
                <div key={tour._id} className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500 transition group">
                  <div className="h-48 relative">
                    <img src={tour.img} className="w-full h-full object-cover" alt={tour.title} />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">₹{tour.basePrice}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition">{tour.title}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1"><FaMapMarkerAlt /> {tour.location}</p>
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                      <button onClick={() => handleEdit(tour)} className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center gap-1"><FaEdit/> Edit</button>
                      <button onClick={() => handleDelete(tour._id)} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"><FaTrash/> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDITOR VIEW */}
        {activeTab === 'tours' && view === 'editor' && (
          <div className="max-w-5xl mx-auto bg-[#1e293b] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
            <div className="bg-gray-900 p-6 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">{editingId ? `Editing: ${form.title}` : 'Create New Tour'}</h2>
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-white">Cancel</button>
            </div>
            
            <form onSubmit={handleSaveTour} className="p-8 space-y-8">
              
              <section>
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><FaInfoCircle/> Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Tour Title</label><input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.title} onChange={e => updateField('title', e.target.value)} required /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label><input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.subtitle} onChange={e => updateField('subtitle', e.target.value)} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Location</label><input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.location} onChange={e => updateField('location', e.target.value)} required /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label><input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.img} onChange={e => updateField('img', e.target.value)} required /></div>
                  <div className="col-span-2"><label className="block text-sm font-medium text-gray-300 mb-1">Description</label><textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.description} onChange={e => updateField('description', e.target.value)} /></div>
                </div>
              </section>

              <section className="bg-black/20 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><FaTag/> Stats & Base Price</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.basePrice} onChange={e => updateField('basePrice', e.target.value)} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Nights</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.nights} onChange={e => updateField('nights', e.target.value)} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Rating</label><input type="number" step="0.1" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.rating} onChange={e => updateField('rating', e.target.value)} /></div>
                  <div className="flex items-center gap-3 pt-6"><input type="checkbox" className="w-5 h-5 accent-cyan-500" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} /><label className="font-bold text-white">Mark Featured</label></div>
                </div>
              </section>

              {/* FIXED PRICING SECTION - Tea Removed, Safe Inputs */}
              <section className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-2 flex items-center gap-2"><FaEdit/> Tour Specific Costs</h3>
                <p className="text-sm text-gray-400 mb-6">Modify these ONLY if different from Global Rates.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {/* Meal */}
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Meal Cost</label>
                     <input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" 
                        value={form.pricing?.mealPerPerson ?? ''} 
                        onChange={e => updatePricing('mealPerPerson', e.target.value)} />
                   </div>
                   
                   {/* Bonfire - FIXED */}
                   <div>
                     <label className="block text-xs text-gray-400 mb-1">Bonfire</label>
                     <input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" 
                        value={form.pricing?.bonfire ?? ''} 
                        onChange={e => updatePricing('bonfire', e.target.value)} />
                   </div>
                   
                   {/* Guide - FIXED */}
                   <div>
                     <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><FaUserTie/> Guide (Flat)</label>
                     <input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" 
                        value={form.pricing?.tourGuide ?? ''} 
                        onChange={e => updatePricing('tourGuide', e.target.value)} />
                   </div>
                   
                   {/* Seat - FIXED */}
                   <div>
                     <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><FaChair/> Seat (Flat)</label>
                     <input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" 
                        value={form.pricing?.comfortSeat ?? ''} 
                        onChange={e => updatePricing('comfortSeat', e.target.value)} />
                   </div>
                   
                   {/* Nested Fields */}
                   <div><label className="block text-xs text-gray-400 mb-1">Std Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.room?.standard ?? ''} onChange={e => updatePricingNested('room', 'standard', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Pano Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.room?.panoramic ?? ''} onChange={e => updatePricingNested('room', 'panoramic', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Cab Rate</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.personalCab?.rate ?? ''} onChange={e => updatePricingNested('personalCab', 'rate', e.target.value)} /></div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FaList/> Itinerary & Meals</h3>
                   <button type="button" onClick={addItineraryDay} className="text-sm bg-cyan-600 text-white px-3 py-1.5 rounded hover:bg-cyan-700">+ Add Day</button>
                </div>
                <div className="space-y-4">
                  {form.itinerary.map((day, i) => (
                    <div key={i} className="bg-black/20 p-4 rounded-lg border border-gray-700 relative">
                      <button type="button" onClick={() => {
                           const newIt = form.itinerary.filter((_, idx) => idx !== i).map((item, idx) => ({...item, day: idx + 1}));
                           setForm({...form, itinerary: newIt});
                         }} className="absolute top-2 right-2 text-red-400 text-xs hover:text-red-300">Remove</button>
                      <span className="font-bold text-cyan-500 block mb-2">Day {day.day}</span>
                      <div className="grid grid-cols-1 gap-3">
                        <div><label className="block text-xs text-gray-400">Title</label><input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={day.title} onChange={e => updateItinerary(i, 'title', e.target.value)} /></div>
                        <div><label className="block text-xs text-gray-400">Details</label><textarea rows={2} className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={day.details} onChange={e => updateItinerary(i, 'details', e.target.value)} /></div>
                        <div><label className="block text-xs text-gray-400">Meals</label><input className="w-full bg-yellow-900/20 border border-yellow-700/50 rounded p-2 text-yellow-200" value={day.meals?.join(', ')} onChange={e => updateItinerary(i, 'meals', e.target.value)} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><FaCheck/> Inclusions</h3>
                    <textarea rows={6} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" 
                      value={form.inclusions.join(', ')} 
                      onChange={e => updateField('inclusions', e.target.value.split(',').map(s=>s.trim()))} 
                    />
                 </div>
                 <div>
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FaQuestionCircle/> FAQs</h3>
                       <button type="button" onClick={addFaq} className="text-sm bg-gray-700 px-2 py-1 rounded">+ Add</button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                       {form.faqs?.map((f, i) => (
                          <div key={i} className="bg-black/20 p-3 rounded border border-gray-700 relative group">
                             <button type="button" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100" 
                               onClick={() => setForm(p => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }))}>✕</button>
                             <input className="w-full bg-transparent border-b border-gray-600 mb-2 text-sm text-white outline-none" placeholder="Question" value={f.q} onChange={e => updateFaq(i, 'q', e.target.value)} />
                             <textarea className="w-full bg-transparent text-xs text-gray-300 outline-none resize-none" rows={2} placeholder="Answer" value={f.a} onChange={e => updateFaq(i, 'a', e.target.value)} />
                          </div>
                       ))}
                    </div>
                 </div>
              </section>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-700 sticky bottom-0 bg-[#1e293b] pb-2">
                 <button type="button" onClick={() => setView('list')} className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-700 text-white">Cancel</button>
                 <button type="submit" className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg">Save Tour</button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}