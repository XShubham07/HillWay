'use client';
import { useState } from 'react';
import {
    FaPlus, FaEdit, FaTrash, FaCopy, FaImages, FaSpinner, FaCamera, FaList,
    FaBed, FaUtensils, FaCheck, FaQuestionCircle, FaGripVertical
} from 'react-icons/fa';

export default function TourManager({ tours, globalPrices, refreshData }) {
    const [view, setView] = useState('list');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);

    // Drag and Drop State
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);

    // Available Tags
    const AVAILABLE_TAGS = ["GROUP", "COUPLE", "HONEYMOON", "ADVENTURE", "ROMANTIC", "FAMILY", "SOLO"];

    const getInitialForm = () => ({
        title: '', subtitle: '', location: '', description: '',
        basePrice: 0, nights: 3, rating: 4.5, featured: false,
        images: [], img: '', mapEmbedUrl: '',
        pricing: { mealPerPerson: 0, teaPerPerson: 0, bonfire: 0, tourGuide: 0, comfortSeat: 0, room: { standard: 0, panoramic: 0 }, personalCab: { rate: 0, capacity: 4 }, tourManagerFee: 5000 },
        inclusions: [], itinerary: [], faqs: [], reviews: [], tags: []
    });
    const [form, setForm] = useState(getInitialForm());

    // --- ACTIONS ---
    const handleCreateNew = () => {
        const initial = getInitialForm();
        if (globalPrices) {
            initial.pricing = {
                mealPerPerson: globalPrices.mealPrice || 0,
                teaPerPerson: globalPrices.teaPrice || 0,
                bonfire: globalPrices.bonfirePrice || 0,
                tourGuide: globalPrices.tourGuidePrice || 0,
                comfortSeat: globalPrices.comfortSeatPrice || 0,
                room: { standard: globalPrices.standardRoomPrice || 0, panoramic: globalPrices.panoRoomPrice || 0 },
                personalCab: { rate: globalPrices.personalCabPrice || 0, capacity: 4 },
                tourManagerFee: 5000
            };
        }
        setForm(initial);
        setEditingId(null);
        setView('editor');
        setShowImagePreview(false);
    };

    const handleEdit = (tour) => {
        const defaults = getInitialForm();
        const images = (tour.images && tour.images.length > 0) ? tour.images : (tour.img ? [tour.img] : []);
        setForm({
            ...defaults,
            ...tour,
            images,
            img: tour.img || (images.length > 0 ? images[0] : ''),
            pricing: { ...defaults.pricing, ...(tour.pricing || {}) },
            tags: tour.tags || []
        });
        setEditingId(tour._id);
        setView('editor');
        setShowImagePreview(images.length > 0);
    };

    const handleCloneTour = async (tourToClone) => {
        if (!confirm(`Duplicate "${tourToClone.title}"?`)) return;
        setLoading(true);
        const { _id, ...rest } = tourToClone;
        const payload = { ...rest, title: `${rest.title} (Copy)` };
        try {
            const res = await fetch('/api/tours', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) { alert("Tour Cloned Successfully!"); refreshData(); }
            else alert("Failed to clone");
        } catch (err) { alert("Error cloning tour"); }
        setLoading(false);
    };

    const handleDeleteTour = async (id) => {
        if (confirm("Delete?")) { await fetch(`/api/tours/${id}`, { method: 'DELETE' }); refreshData(); }
    };

    const handleSaveTour = async (e) => {
        e.preventDefault(); setLoading(true);
        const payload = { ...form, img: form.images.length > 0 ? form.images[0] : form.img };
        const url = editingId ? `/api/tours/${editingId}` : '/api/tours';
        const method = editingId ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (res.ok) { alert("Saved!"); setView('list'); refreshData(); } else { const err = await res.json(); alert(`Failed: ${err.error}`); }
        } catch (err) { alert("Error saving"); }
        setLoading(false);
    };

    // --- FORM HELPERS ---
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setUploadingImg(true);
        try {
            const uploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                return fetch('/api/upload', { method: 'POST', body: formData }).then(res => res.json());
            });
            const results = await Promise.all(uploadPromises);
            const newUrls = results.filter(r => r.success).map(r => r.url);
            setForm(prev => ({ ...prev, images: [...(prev.images || []), ...newUrls], img: prev.img || newUrls[0] }));
            alert(`${newUrls.length} Images Uploaded!`);
        } catch (err) { alert("Upload Failed"); }
        setUploadingImg(false);
    };

    const removeImage = (index) => {
        setForm(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return { ...prev, images: newImages, img: (newImages.length > 0) ? newImages[0] : '' };
        });
    };

    const updateField = (f, v) => setForm(p => ({ ...p, [f]: v }));
    const updatePricing = (f, v) => setForm(p => ({ ...p, pricing: { ...p.pricing, [f]: v === '' ? '' : Number(v) } }));
    const updatePricingNested = (p, f, v) => setForm(prev => ({ ...prev, pricing: { ...prev.pricing, [p]: { ...prev.pricing[p], [f]: v === '' ? '' : Number(v) } } }));

    // --- ITINERARY LOGIC (DRAG AND DROP) ---
    const addItineraryDay = () => setForm(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', details: '', stay: '', meals: [] }] }));

    const updateItinerary = (idx, f, v) => {
        const newIt = [...form.itinerary];
        if (f === 'meals') newIt[idx][f] = v.split(',').map(s => s.trim());
        else newIt[idx][f] = v;
        setForm({ ...form, itinerary: newIt });
    };

    const removeItineraryDay = (index) => {
        if (window.confirm("Are you sure you want to remove this day? This cannot be undone.")) {
            setForm(p => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== index) }));
        }
    };

    const handleDragStart = (index) => {
        setDraggedItemIndex(index);
    };

    const handleDragEnter = (index) => {
        if (draggedItemIndex === null) return;
        if (draggedItemIndex === index) return;

        const newItinerary = [...form.itinerary];
        const draggedItem = newItinerary[draggedItemIndex];

        // Remove dragged item
        newItinerary.splice(draggedItemIndex, 1);
        // Insert at new index
        newItinerary.splice(index, 0, draggedItem);

        setForm(prev => ({ ...prev, itinerary: newItinerary }));
        setDraggedItemIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    // --- FAQs ---
    const addFaq = () => setForm(p => ({ ...p, faqs: [...(p.faqs || []), { q: '', a: '' }] }));
    const updateFaq = (idx, f, v) => { const newFaqs = [...form.faqs]; newFaqs[idx][f] = v; setForm({ ...form, faqs: newFaqs }); };

    return (
        <div>
            {view === 'list' && (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-white">All Tours ({tours.length})</h1>
                        <button onClick={handleCreateNew} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2"><FaPlus /> Create New Tour</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map(tour => (
                            <div key={tour._id} className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500 transition group">
                                <div className="h-48 relative">
                                    <img src={(tour.images && tour.images.length > 0) ? tour.images[0] : (tour.img || '/placeholder.jpg')} className="w-full h-full object-cover" alt={tour.title} />
                                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">₹{tour.basePrice}</div>
                                    {tour.images && tour.images.length > 1 && (
                                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1"><FaImages /> {tour.images.length}</div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition">{tour.title}</h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tour.tags?.map(tag => <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5">{tag}</span>)}
                                    </div>
                                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                                        <button onClick={() => handleEdit(tour)} className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center gap-1"><FaEdit /> Edit</button>
                                        <button onClick={() => handleCloneTour(tour)} className="text-yellow-400 hover:text-yellow-300 text-sm font-bold flex items-center gap-1"><FaCopy /> Clone</button>
                                        <button onClick={() => handleDeleteTour(tour._id)} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"><FaTrash /> Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {view === 'editor' && (
                <div className="max-w-5xl mx-auto bg-[#1e293b] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                    <div className="bg-gray-900 p-6 flex justify-between items-center border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white">{editingId ? `Editing: ${form.title}` : 'Create New Tour'}</h2>
                        <button onClick={() => setView('list')} className="text-gray-400 hover:text-white">Cancel</button>
                    </div>
                    <form onSubmit={handleSaveTour} className="p-8 space-y-8">
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium text-gray-300 mb-1">Tour Title</label><input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.title} onChange={e => updateField('title', e.target.value)} required /></div>
                                <div><label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label><input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.subtitle} onChange={e => updateField('subtitle', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium text-gray-300 mb-1">Location</label><input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.location} onChange={e => updateField('location', e.target.value)} required /></div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Gallery Images</label>
                                    <div className="flex gap-3">
                                        <label className="flex-1 flex items-center justify-center p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg cursor-pointer transition">
                                            {uploadingImg ? <FaSpinner className="animate-spin" /> : <><FaCamera className="mr-2" /> Upload Images</>}
                                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                                        </label>
                                        {form.images?.length > 0 && <button type="button" onClick={() => setShowImagePreview(!showImagePreview)} className="px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold">{showImagePreview ? "Hide" : "View"}</button>}
                                    </div>
                                    {showImagePreview && form.images?.length > 0 && (
                                        <div className="mt-4 grid grid-cols-4 gap-2 bg-black/20 p-2 rounded-lg border border-gray-700">
                                            {form.images.map((img, i) => (
                                                <div key={i} className="relative group aspect-square">
                                                    <img src={img} className="w-full h-full object-cover rounded border border-gray-600" />
                                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2"><label className="block text-sm font-medium text-gray-300 mb-1">Description</label><textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.description} onChange={e => updateField('description', e.target.value)} /></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-6 rounded-xl border border-gray-700">
                            <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Tour Tags</h3>
                            <div className="flex flex-wrap gap-3">
                                {AVAILABLE_TAGS.map(tag => {
                                    const isActive = form.tags?.includes(tag);
                                    return (
                                        <button key={tag} type="button"
                                            onClick={() => updateField('tags', isActive ? form.tags.filter(t => t !== tag) : [...(form.tags || []), tag])}
                                            className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${isActive ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg' : 'bg-transparent text-gray-400 border-gray-600 hover:text-gray-200'}`}>
                                            {tag} {isActive && '✓'}
                                        </button>
                                    )
                                })}
                            </div>
                        </section>

                        <section className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2"><FaEdit /> Specific Costs</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['mealPerPerson', 'bonfire', 'tourGuide', 'comfortSeat'].map(f => (
                                    <div key={f}><label className="block text-xs text-gray-400 mb-1 capitalize">{f.replace(/([A-Z])/g, ' $1').trim()}</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.[f] ?? ''} onChange={e => updatePricing(f, e.target.value)} /></div>
                                ))}
                                <div><label className="block text-xs text-gray-400 mb-1">Std Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.room?.standard ?? ''} onChange={e => updatePricingNested('room', 'standard', e.target.value)} /></div>
                                <div><label className="block text-xs text-gray-400 mb-1">Pano Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.room?.panoramic ?? ''} onChange={e => updatePricingNested('room', 'panoramic', e.target.value)} /></div>
                                <div><label className="block text-xs text-gray-400 mb-1">Cab</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.personalCab?.rate ?? ''} onChange={e => updatePricingNested('personalCab', 'rate', e.target.value)} /></div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
                                <div><label className="block text-sm font-medium text-gray-300">Base Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.basePrice} onChange={e => updateField('basePrice', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium text-gray-300">Nights</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.nights} onChange={e => updateField('nights', e.target.value)} /></div>
                                <div><label className="block text-sm font-medium text-gray-300">Rating</label><input type="number" step="0.1" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.rating} onChange={e => updateField('rating', e.target.value)} /></div>
                                <div className="flex items-center gap-3 pt-6"><input type="checkbox" className="w-5 h-5 accent-cyan-500" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} /><label className="font-bold text-white">Featured</label></div>
                            </div>
                        </section>

                        {/* ITINERARY SECTION (NATIVE DRAG AND DROP) */}
                        <section>
                            <div className="flex justify-between mb-4">
                                <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FaList /> Itinerary & Meals</h3>
                                <button type="button" onClick={addItineraryDay} className="text-sm bg-cyan-600 text-white px-3 py-1 rounded">+ Add Day</button>
                            </div>
                            <div className="space-y-4">
                                {form.itinerary.map((day, i) => (
                                    <div
                                        key={i}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragEnter={() => handleDragEnter(i)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                        className={`bg-black/20 p-4 rounded-lg border relative group transition cursor-move ${draggedItemIndex === i ? 'opacity-50 border-cyan-500 border-dashed' : 'border-gray-700 hover:border-gray-500'}`}
                                    >
                                        {/* Drag Handle Icon */}
                                        <div className="absolute top-3 left-3 text-gray-500 cursor-move"><FaGripVertical /></div>

                                        {/* Remove Button */}
                                        <div className="absolute top-2 right-2">
                                            <button type="button" onClick={() => removeItineraryDay(i)} className="px-3 py-1 bg-red-900/30 text-red-400 text-xs rounded hover:bg-red-900/50 hover:text-red-300 transition">Remove</button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2 mt-2 ml-6">
                                            <input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white font-bold" value={day.title} onChange={e => updateItinerary(i, 'title', e.target.value)} placeholder={`Day ${i + 1} Title`} />
                                            <textarea className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={day.details} onChange={e => updateItinerary(i, 'details', e.target.value)} placeholder="Day details..." />
                                            <div className="flex items-center gap-2 mt-2">
                                                <FaBed className="text-gray-400" />
                                                <input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white text-sm" value={day.stay || ''} onChange={e => updateItinerary(i, 'stay', e.target.value)} placeholder="Stay Details" />
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <FaUtensils className="text-gray-400" />
                                                <input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white text-sm" value={day.meals?.join(', ')} onChange={e => updateItinerary(i, 'meals', e.target.value)} placeholder="Meals (comma separated)" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div><h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><FaCheck /> Inclusions</h3><textarea rows={6} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.inclusions.join(', ')} onChange={e => updateField('inclusions', e.target.value.split(',').map(s => s.trim()))} /></div>
                            <div>
                                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FaQuestionCircle /> FAQs</h3><button type="button" onClick={addFaq} className="text-sm bg-gray-700 px-2 py-1 rounded">+ Add</button></div>
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scroll">
                                    {form.faqs?.map((f, i) => (
                                        <div key={i} className="bg-black/20 p-3 rounded border border-gray-700 relative group">
                                            <button type="button" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100" onClick={() => setForm(p => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }))}>✕</button>
                                            <input className="w-full bg-transparent border-b border-gray-600 mb-2 text-sm text-white outline-none" placeholder="Question" value={f.q} onChange={e => updateFaq(i, 'q', e.target.value)} />
                                            <textarea className="w-full bg-transparent text-xs text-gray-300 outline-none resize-none" rows={2} placeholder="Answer" value={f.a} onChange={e => updateFaq(i, 'a', e.target.value)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-700 sticky bottom-0 bg-[#1e293b] pb-2 z-10">
                            <button type="button" onClick={() => setView('list')} className="px-6 py-3 rounded-lg border border-gray-600 hover:bg-gray-700 text-white">Cancel</button>
                            <button type="submit" className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg">Save Tour</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}