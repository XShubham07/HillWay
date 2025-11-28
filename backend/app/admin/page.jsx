'use client';
import { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaEdit, FaTrash, FaPlus, 
  FaTag, FaBed, FaUserTie, FaChair, FaInfoCircle, 
  FaList, FaCheck, FaCamera, FaSpinner,
  FaBook, FaEye, FaTimes, FaPhone, FaUser, FaCalendarDay,
  FaUtensils, FaTicketAlt, FaClock, FaChartPie, FaCheckCircle, FaSearch, FaQuestionCircle,
  FaUserSecret, FaSignOutAlt, FaMoneyBillWave, FaPaperPlane, FaLink, FaImages
} from 'react-icons/fa';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [view, setView] = useState('list');
  
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]); 
  const [filteredBookings, setFilteredBookings] = useState([]); 
  const [searchQuery, setSearchQuery] = useState("");

  const [coupons, setCoupons] = useState([]);
  const [agents, setAgents] = useState([]);
  const [globalPrices, setGlobalPrices] = useState(null);
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // Forms
  const [agentForm, setAgentForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', usageLimit: 100, agentId: '' });
  
  const getInitialForm = () => ({ 
    title: '', subtitle: '', location: '', description: '', 
    basePrice: 0, nights: 3, rating: 4.5, featured: false, 
    images: [], 
    img: '', // fallback cover
    mapEmbedUrl: '', 
    pricing: { mealPerPerson: 450, teaPerPerson: 60, bonfire: 500, tourGuide: 1000, comfortSeat: 800, room: { standard: 1500, panoramic: 2500 }, personalCab: { rate: 3200, capacity: 4 }, tourManagerFee: 5000 }, 
    inclusions: [], itinerary: [], faqs: [], reviews: [] 
  });
  const [form, setForm] = useState(getInitialForm());

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTours, resPrices, resBookings, resCoupons, resAgents] = await Promise.all([
        fetch('/api/tours'), fetch('/api/pricing'), fetch('/api/bookings'), fetch('/api/coupons'), fetch('/api/agent')
      ]);
      const d1 = await resTours.json(); if(d1.success) setTours(d1.data);
      const d2 = await resPrices.json(); if(d2.success) setGlobalPrices(d2.data);
      const d3 = await resBookings.json(); if(d3.success) { setBookings(d3.data); setFilteredBookings(d3.data); }
      const d4 = await resCoupons.json(); if(d4.success) setCoupons(d4.data);
      const d5 = await resAgents.json(); if(d5.success) setAgents(d5.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- SEARCH ---
  useEffect(() => {
    if(!searchQuery) {
      setFilteredBookings(bookings);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = bookings.filter(b => 
        (b._id && b._id.slice(-4).toLowerCase().includes(lower)) ||
        (b.name && b.name.toLowerCase().includes(lower)) ||
        (b.phone && b.phone.includes(searchQuery))
      );
      setFilteredBookings(filtered);
    }
  }, [searchQuery, bookings]);

  const getBookingID = (id) => `#HW-${id.slice(-4).toUpperCase()}`;

  // --- HANDLERS ---
  const handleDeleteBooking = async (id) => {
    if(!confirm("Delete booking?")) return;
    try { await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' }); setBookings(prev => prev.filter(b => b._id !== id)); if(selectedBooking?._id === id) setSelectedBooking(null); } catch(e) { alert("Failed"); }
  };

  const handleUpdateStatus = async (id, status) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch('/api/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
      const data = await res.json();
      if(data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        if(selectedBooking) setSelectedBooking({ ...selectedBooking, status });
        alert(`Booking ${status}!`);
      }
    } catch(e) { alert("Failed"); }
    setUpdatingStatus(false);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...couponForm };
      if (!payload.agentId) delete payload.agentId;
      const res = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if(data.success) { alert("Created!"); setCouponForm({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', usageLimit: 100, agentId: '' }); fetchData(); }
      else alert(data.error);
    } catch (err) { alert("Failed"); }
  };

  const handleUpdateCouponAgent = async (couponId, agentId) => {
    try {
      const res = await fetch('/api/coupons', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: couponId, agentId }) });
      const data = await res.json();
      if(data.success) { alert("Agent Assigned!"); fetchData(); }
    } catch (err) { alert("Failed to assign agent"); }
  }

  const handleDeleteCoupon = async (id) => { if(confirm("Delete?")) { await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' }); fetchData(); }};

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/agent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agentForm) });
        const data = await res.json();
        if(data.success) { alert("Agent Created!"); setAgentForm({ name: '', email: '', password: '', phone: '' }); fetchData(); }
        else alert(data.error);
    } catch (e) { alert("Failed"); }
  };
  
  const handleDeleteAgent = async (id) => { if(confirm("Delete Agent?")) { await fetch(`/api/agent?id=${id}`, { method: 'DELETE' }); fetchData(); }};
  const handleResendCreds = (email) => { alert(`Credentials resent to ${email} (Simulation)`); };

  // Tour Handlers
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setUploadingImg(true);
    
    try {
      // Upload all files
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return fetch('/api/upload', { method: 'POST', body: formData }).then(res => res.json());
      });

      const results = await Promise.all(uploadPromises);
      const newUrls = results.filter(r => r.success).map(r => r.url);
      
      setForm(prev => ({ 
        ...prev, 
        // Concatenate new images to existing images array
        images: [...(prev.images || []), ...newUrls],
        // If there was no cover image before, use the first of the new batch
        img: prev.img || newUrls[0]
      }));
      
      alert(`${newUrls.length} Images Uploaded Successfully!`);
    } catch (err) { 
      console.error(err); 
      alert("Upload Failed");
    }
    setUploadingImg(false);
  };

  const removeImage = (index) => {
    setForm(prev => {
        const newImages = prev.images.filter((_, i) => i !== index);
        return {
            ...prev,
            images: newImages,
            // Update cover image if the deleted one was the cover
            img: (newImages.length > 0) ? newImages[0] : ''
        };
    });
  };

  const handleCreateNew = () => { setForm(getInitialForm()); setEditingId(null); setView('editor'); setShowImagePreview(false); };
  
  const handleEdit = (tour) => {
    const defaults = getInitialForm();
    // Critical Logic: Use tour.images if valid, otherwise fallback to wrapping single img
    const images = (tour.images && tour.images.length > 0) ? tour.images : (tour.img ? [tour.img] : []);
    
    setForm({ 
        ...defaults, 
        ...tour, 
        images, // Set the array
        img: tour.img || (images.length > 0 ? images[0] : ''), // Ensure cover img is set
        pricing: { ...defaults.pricing, ...(tour.pricing || {}) } 
    });
    setEditingId(tour._id);
    setView('editor');
    // Auto-show preview if there are images so user knows they exist
    setShowImagePreview(images.length > 0); 
  };
  
  const handleDeleteTour = async (id) => { if(confirm("Delete?")) { await fetch(`/api/tours/${id}`, { method: 'DELETE' }); fetchData(); }};
  
  const handleSaveTour = async (e) => {
    e.preventDefault(); 
    setLoading(true);
    
    // Prepare payload
    const payload = {
        ...form,
        // Explicitly set img to the first image in the array if array exists
        // This ensures sync between 'img' and 'images[0]'
        img: form.images.length > 0 ? form.images[0] : form.img
    };

    const url = editingId ? `/api/tours/${editingId}` : '/api/tours';
    const method = editingId ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload)
      });
      
      if(res.ok) { 
        alert("Tour Saved Successfully!"); 
        setView('list'); 
        fetchData(); 
      } else {
        const err = await res.json();
        alert(`Save failed: ${err.error}`);
      }
    } catch(err) {
      alert("Network error while saving");
    }
    setLoading(false);
  };

  const handleSaveGlobalPricing = async () => {
    setLoading(true);
    await fetch('/api/pricing', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(globalPrices)});
    alert("Updated!"); setLoading(false);
  };

  // Form Helpers
  const updateField = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const updatePricing = (f, v) => setForm(p => ({ ...p, pricing: { ...p.pricing, [f]: v === '' ? '' : Number(v) } }));
  const updatePricingNested = (p, f, v) => setForm(prev => ({ ...prev, pricing: { ...prev.pricing, [p]: { ...prev.pricing[p], [f]: v === '' ? '' : Number(v) } } }));
  const addItineraryDay = () => setForm(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', details: '', meals: [] }] }));
  const updateItinerary = (idx, f, v) => {
    const newIt = [...form.itinerary];
    if(f === 'meals') newIt[idx][f] = v.split(',').map(s=>s.trim()); else newIt[idx][f] = v;
    setForm({ ...form, itinerary: newIt });
  };
  const addFaq = () => setForm(p => ({ ...p, faqs: [...(p.faqs || []), { q: '', a: '' }] }));
  const updateFaq = (idx, f, v) => { const newFaqs = [...form.faqs]; newFaqs[idx][f] = v; setForm({ ...form, faqs: newFaqs }); };

  // Price Helper
  const getPriceBreakdown = (b) => {
    const tour = tours.find(t => t.title === b.tourTitle);
    const p = {
        mealPrice: tour?.pricing?.mealPerPerson ?? globalPrices?.mealPrice,
        teaPrice: tour?.pricing?.teaPerPerson ?? globalPrices?.teaPrice,
        bonfirePrice: tour?.pricing?.bonfire ?? globalPrices?.bonfirePrice,
        tourGuidePrice: tour?.pricing?.tourGuide ?? globalPrices?.tourGuidePrice,
        comfortSeatPrice: tour?.pricing?.comfortSeat ?? globalPrices?.comfortSeatPrice,
        personalCabPrice: tour?.pricing?.personalCab?.rate ?? globalPrices?.personalCabPrice
    };
    const items = [];
    if(b.addons?.meal) items.push({ name: "Meal Plan", cost: `₹${p.mealPrice}/pax` });
    if(b.addons?.bonfire) items.push({ name: "Bonfire", cost: `₹${p.bonfirePrice}` });
    if(b.addons?.tourGuide) items.push({ name: "Tour Guide", cost: `₹${p.tourGuidePrice}` });
    if(b.addons?.comfortSeat) items.push({ name: "Comfort Seat", cost: `₹${p.comfortSeatPrice}` });
    if(b.addons?.tea) items.push({ name: "Tea/Snacks", cost: `₹${p.teaPrice}/pax` });
    items.push({ name: "Transport", cost: b.transport === 'personal' ? `₹${p.personalCabPrice}` : 'Shared' });
    items.push({ name: "Room", cost: `${b.roomType} (x${b.rooms})` });
    if (b.couponCode && b.originalPrice > b.totalPrice) items.push({ name: `Coupon (${b.couponCode})`, cost: `- ₹${(b.originalPrice - b.totalPrice).toLocaleString()}` });
    return items;
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-100 font-sans overflow-hidden relative">
      
      {/* === PREMIUM BOOKING DETAILS MODAL === */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] w-full max-w-5xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative animate-fade-in">
            <div className="p-8 pb-6 border-b border-white/5 flex justify-between items-start bg-black/20">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-4xl font-bold text-white tracking-tight">Booking Details</h2>
                  <span className="bg-cyan-500/10 text-cyan-300 text-sm px-4 py-1.5 rounded-full font-mono tracking-wider border border-cyan-500/20">
                    {getBookingID(selectedBooking._id)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <FaClock className="text-gray-500"/> Placed on {new Date(selectedBooking.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-gray-300 hover:text-white border border-white/5">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto custom-scroll space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Info */}
                <div className="lg:col-span-2 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                         <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaUser/> Customer Info</h3>
                         <p className="text-2xl font-semibold text-white mb-1">{selectedBooking.name}</p>
                         <div className="space-y-1 text-gray-400 text-sm">
                            <p className="flex items-center gap-2"><FaPhone className="text-xs"/> {selectedBooking.phone}</p>
                            {selectedBooking.email && <p className="flex items-center gap-2">✉ {selectedBooking.email}</p>}
                         </div>
                      </div>
                      
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                         <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaCalendarDay/> Tour Info</h3>
                         <p className="text-lg text-white leading-tight">{selectedBooking.tourTitle}</p>
                         <p className="text-gray-400 text-sm mt-2">
                            {selectedBooking.adults} Adults, {selectedBooking.children} Children
                         </p>
                      </div>
                   </div>

                   {/* CONFIGURATION PRICING BREAKDOWN */}
                   <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                      <h3 className="text-gray-500 font-bold mb-4 text-xs uppercase tracking-widest">Configuration & Pricing Estimates</h3>
                      <div className="grid grid-cols-2 gap-4">
                         {getPriceBreakdown(selectedBooking).map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                              <span className="text-gray-300 text-sm">{item.name}</span>
                              <span className="text-cyan-400 text-sm font-mono font-bold">{item.cost}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Right: Totals */}
                <div className="space-y-6">
                   <div className="bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10"><FaTag size={80}/></div>
                      <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Payment Summary</h3>
                      
                      <div className="space-y-3 mb-6">
                         {selectedBooking.originalPrice > selectedBooking.totalPrice && (
                           <div className="flex justify-between text-sm text-gray-400">
                              <span>Original Price</span>
                              <span className="line-through">₹{selectedBooking.originalPrice.toLocaleString()}</span>
                           </div>
                         )}
                         
                         {selectedBooking.couponCode && (
                           <div className="flex justify-between text-sm text-green-400 bg-green-900/20 p-2 rounded-lg border border-green-500/20">
                              <span className="flex items-center gap-2"><FaTicketAlt/> {selectedBooking.couponCode}</span>
                              <span className="font-bold">- ₹{(selectedBooking.originalPrice - selectedBooking.totalPrice).toLocaleString()}</span>
                           </div>
                         )}

                         <div className="flex justify-between items-end pt-4 border-t border-white/10">
                            <span className="text-gray-300 font-medium">Final Total</span>
                            <span className="text-4xl font-black text-white tracking-tight">₹{selectedBooking.totalPrice.toLocaleString()}</span>
                         </div>
                      </div>

                      <div className={`py-3 rounded-xl text-center font-bold text-sm border ${selectedBooking.status === 'Confirmed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                         Status: {selectedBooking.status || 'Pending'}
                      </div>
                   </div>

                   <div className="space-y-3">
                      {selectedBooking.status !== 'Confirmed' && (
                        <button 
                          onClick={() => handleUpdateStatus(selectedBooking._id, 'Confirmed')}
                          disabled={updatingStatus}
                          className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2"
                        >
                           {updatingStatus ? <FaSpinner className="animate-spin"/> : <FaCheckCircle/>} Confirm Booking
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleDeleteBooking(selectedBooking._id)}
                        className="w-full py-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-xl font-bold transition flex items-center justify-center gap-2"
                      >
                         <FaTrash/> Delete Booking
                      </button>
                   </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col flex-shrink-0">
        <div className="p-6 text-2xl font-bold text-cyan-400 tracking-wider">HillWay Admin</div>
        <nav className="flex-1 px-4 space-y-3 mt-4">
          <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'bookings' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaBook /> Bookings</button>
          <button onClick={() => setActiveTab('tours')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tours' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaMapMarkerAlt /> Manage Tours</button>
          <button onClick={() => setActiveTab('agents')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'agents' ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaUserSecret /> Agents</button>
          <button onClick={() => setActiveTab('coupons')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'coupons' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaTicketAlt /> Coupons</button>
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pricing' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaTag /> Global Pricing</button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* ... (BOOKINGS TAB CONTENT) ... */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-white">All Bookings</h1>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search ID, Name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-full bg-[#1e293b] border border-gray-600 text-white focus:border-cyan-500 outline-none w-64" />
              </div>
            </div>
            <div className="bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/20 text-gray-200 uppercase font-bold border-b border-gray-700">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Tour</th>
                    <th className="p-4">Pax</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5 transition group">
                      <td className="p-4 font-mono text-cyan-300">{getBookingID(b._id)}</td>
                      <td className="p-4"><div className="font-bold text-white">{b.name}</div><div className="text-xs text-gray-500">{b.phone}</div></td>
                      <td className="p-4 text-gray-300">{b.tourTitle}</td>
                      <td className="p-4">{b.adults + b.children}</td>
                      <td className="p-4 font-bold text-green-400">₹{b.totalPrice?.toLocaleString()}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'Confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{b.status || 'Pending'}</span></td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button onClick={() => setSelectedBooking(b)} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"><FaEye/></button>
                        <button onClick={() => handleDeleteBooking(b._id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition"><FaTrash/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredBookings.length === 0 && <div className="p-12 text-center text-gray-500">No bookings found.</div>}
            </div>
          </div>
        )}

        {/* ... (AGENTS TAB) ... */}
        {activeTab === 'agents' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Agents</h1>
            <form onSubmit={handleCreateAgent} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
               <div className="col-span-2"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Name</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={agentForm.name} onChange={e=>setAgentForm({...agentForm, name: e.target.value})} /></div>
               <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Email</label><input required type="email" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={agentForm.email} onChange={e=>setAgentForm({...agentForm, email: e.target.value})} /></div>
               <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Password</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={agentForm.password} onChange={e=>setAgentForm({...agentForm, password: e.target.value})} /></div>
               <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Phone</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={agentForm.phone} onChange={e=>setAgentForm({...agentForm, phone: e.target.value})} /></div>
               <button type="submit" className="bg-purple-600 text-white px-4 py-3 rounded-lg font-bold h-[48px]">Add Agent</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map(agent => (
                <div key={agent._id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                     <div><h3 className="text-xl font-bold text-white">{agent.name}</h3><p className="text-sm text-gray-400">{agent.email}</p></div>
                     <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs font-bold border border-green-500/20">Earned: ₹{agent.totalCommission}</div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => handleResendCreds(agent.email)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                      <FaPaperPlane /> Resend Credentials
                    </button>
                  </div>
                  <button onClick={() => handleDeleteAgent(agent._id)} className="w-full mt-2 text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-1 border border-red-500/20 py-2 rounded-lg"><FaTrash/> Delete Agent</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ... (COUPONS TAB) ... */}
        {activeTab === 'coupons' && (
          <div className="max-w-6xl mx-auto">
             <h1 className="text-3xl font-bold text-white mb-6">Manage Coupons</h1>
             <form onSubmit={handleCreateCoupon} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-6 gap-4 items-end shadow-lg">
                <div className="col-span-1 md:col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Code</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white uppercase font-bold tracking-widest" placeholder="SUMMER25" value={couponForm.code} onChange={e=>setCouponForm({...couponForm, code: e.target.value})} /></div>
                <div className="col-span-1">
                   <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Discount</label>
                   <div className="flex gap-2">
                     <input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="10" value={couponForm.discountValue} onChange={e=>setCouponForm({...couponForm, discountValue: e.target.value})} />
                     <select className="bg-black/30 border border-gray-600 rounded-lg px-2 text-white text-xs" value={couponForm.discountType} onChange={e=>setCouponForm({...couponForm, discountType: e.target.value})}><option value="PERCENTAGE">%</option><option value="FLAT">₹</option></select>
                   </div>
                </div>
                <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Expiry</label><input required type="date" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm" value={couponForm.expiryDate} onChange={e=>setCouponForm({...couponForm, expiryDate: e.target.value})} /></div>
                <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Limit</label><input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="100" value={couponForm.usageLimit} onChange={e=>setCouponForm({...couponForm, usageLimit: e.target.value})} /></div>
                <div className="col-span-1">
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Assign Agent</label>
                  <select className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm" value={couponForm.agentId} onChange={e=>setCouponForm({...couponForm, agentId: e.target.value})}>
                    <option value="">-- No Agent --</option>
                    {agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold h-[48px] flex items-center justify-center gap-2"><FaPlus size={12}/> Create</button>
             </form>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map(coupon => {
                   const assignedAgent = agents.find(a => a._id === coupon.agentId);
                   return (
                     <div key={coupon._id} className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700 relative group hover:border-cyan-500/50 transition shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                           <div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg px-3 py-1.5"><h3 className="text-lg font-black text-cyan-400 tracking-widest">{coupon.code}</h3></div>
                           <div className="text-right"><p className="text-2xl font-bold text-white leading-none">{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</p><p className="text-[10px] text-gray-400 uppercase font-bold">OFF</p></div>
                        </div>
                        <div className="space-y-2 mb-4">
                           <div className="flex items-center justify-between text-sm"><span className="text-gray-400 flex items-center gap-2"><FaChartPie size={12}/> Used</span><span className={`font-mono font-bold ${coupon.usedCount >= coupon.usageLimit ? 'text-red-400' : 'text-white'}`}>{coupon.usedCount} / {coupon.usageLimit}</span></div>
                           <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"><div className={`h-full rounded-full ${coupon.usedCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}/></div>
                           <div className="flex items-center justify-between text-sm pt-1"><span className="text-gray-400 flex items-center gap-2"><FaClock size={12}/> Expires</span><span className="text-white font-medium">{new Date(coupon.expiryDate).toLocaleDateString()}</span></div>
                        </div>
                        <div className="mb-4 bg-black/20 p-2 rounded-lg flex items-center justify-between">
                           <div className="flex items-center gap-2 text-xs text-gray-400"><FaUserTie/> {assignedAgent ? <span className="text-purple-300 font-bold">{assignedAgent.name}</span> : "Unassigned"}</div>
                           <select className="bg-transparent text-xs text-cyan-400 border-none outline-none text-right cursor-pointer" value={coupon.agentId || ""} onChange={(e) => handleUpdateCouponAgent(coupon._id, e.target.value)}>
                              <option value="">Re-assign</option>
                              <option value="">None</option>
                              {agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}
                           </select>
                        </div>
                        <button onClick={() => handleDeleteCoupon(coupon._id)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wide transition flex items-center justify-center gap-2"><FaTrash size={12}/> Delete Coupon</button>
                     </div>
                   );
                })}
             </div>
          </div>
        )}

        {/* === PRICING TAB === */}
        {activeTab === 'pricing' && globalPrices && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Universal Price List</h1>
            {/* ... pricing inputs (same as before) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Standard Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.standardRoomPrice} onChange={e => setGlobalPrices({...globalPrices, standardRoomPrice: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Panoramic Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.panoRoomPrice} onChange={e => setGlobalPrices({...globalPrices, panoRoomPrice: e.target.value})} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Cab Rate</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.personalCabPrice} onChange={e => setGlobalPrices({...globalPrices, personalCabPrice: e.target.value})} /></div>
                </div>
              </div>
            </div>
            <button onClick={handleSaveGlobalPricing} className="mt-8 w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold shadow-lg">Save Global Prices</button>
          </div>
        )}

        {/* === TOURS TAB (LIST) === */}
        {activeTab === 'tours' && view === 'list' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">All Tours ({tours.length})</h1>
              <button onClick={handleCreateNew} className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg flex items-center gap-2"><FaPlus /> Create New Tour</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map(tour => (
                <div key={tour._id} className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500 transition group">
                  <div className="h-48 relative">
                    {/* Display first image as cover */}
                    <img src={(tour.images && tour.images.length > 0) ? tour.images[0] : (tour.img || '/placeholder.jpg')} className="w-full h-full object-cover" alt={tour.title} />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">₹{tour.basePrice}</div>
                    {/* Badge for multiple images */}
                    {tour.images && tour.images.length > 1 && (
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <FaImages /> {tour.images.length}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition">{tour.title}</h3>
                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                      <button onClick={() => handleEdit(tour)} className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center gap-1"><FaEdit/> Edit</button>
                      <button onClick={() => handleDeleteTour(tour._id)} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"><FaTrash/> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === TOURS TAB (EDITOR) === */}
        {activeTab === 'tours' && view === 'editor' && (
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
                  
                  {/* MULTIPLE IMAGE UPLOAD */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Gallery Images ({form.images?.length || 0})</label>
                    <div className="flex gap-3">
                        <label className="flex-1 flex items-center justify-center p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg cursor-pointer transition">
                            {uploadingImg ? <FaSpinner className="animate-spin" /> : <><FaCamera className="mr-2"/> Upload Images</>}
                            <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                        </label>
                        {form.images?.length > 0 && (
                            <button type="button" onClick={() => setShowImagePreview(!showImagePreview)} className="px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold">
                                {showImagePreview ? "Hide" : "View"}
                            </button>
                        )}
                    </div>
                    {/* IMAGE PREVIEW TOGGLE */}
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

              {/* ... (Other sections like Pricing, Itinerary etc) ... */}
              <section className="bg-black/20 p-6 rounded-xl border border-gray-700">
                <div className="grid grid-cols-4 gap-4">
                  <div><label className="block text-sm font-medium text-gray-300">Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.basePrice} onChange={e => updateField('basePrice', e.target.value)} /></div>
                  <div><label className="block text-sm font-medium text-gray-300">Nights</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.nights} onChange={e => updateField('nights', e.target.value)} /></div>
                  <div><label className="block text-sm font-medium text-gray-300">Rating</label><input type="number" step="0.1" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.rating} onChange={e => updateField('rating', e.target.value)} /></div>
                  <div className="flex items-center gap-3 pt-6"><input type="checkbox" className="w-5 h-5 accent-cyan-500" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} /><label className="font-bold text-white">Featured</label></div>
                </div>
              </section>

              <section className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2"><FaEdit/> Specific Costs</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div><label className="block text-xs text-gray-400 mb-1">Meal</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.mealPerPerson ?? ''} onChange={e => updatePricing('mealPerPerson', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Bonfire</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.bonfire ?? ''} onChange={e => updatePricing('bonfire', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Guide</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.tourGuide ?? ''} onChange={e => updatePricing('tourGuide', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Seat</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.comfortSeat ?? ''} onChange={e => updatePricing('comfortSeat', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Std Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.room?.standard ?? ''} onChange={e => updatePricingNested('room', 'standard', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Pano Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.room?.panoramic ?? ''} onChange={e => updatePricingNested('room', 'panoramic', e.target.value)} /></div>
                   <div><label className="block text-xs text-gray-400 mb-1">Cab</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={form.pricing?.personalCab?.rate ?? ''} onChange={e => updatePricingNested('personalCab', 'rate', e.target.value)} /></div>
                </div>
              </section>

              <section>
                <div className="flex justify-between mb-4"><h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FaList/> Itinerary & Meals</h3><button type="button" onClick={addItineraryDay} className="text-sm bg-cyan-600 text-white px-3 py-1 rounded">+ Add</button></div>
                <div className="space-y-4">{form.itinerary.map((day, i) => (
                    <div key={i} className="bg-black/20 p-4 rounded-lg border border-gray-700 relative">
                      <button type="button" onClick={() => setForm(p => ({...p, itinerary: p.itinerary.filter((_, idx) => idx !== i)}))} className="absolute top-2 right-2 text-red-400 text-xs">Remove</button>
                      <div className="grid grid-cols-1 gap-2">
                        <input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={day.title} onChange={e => updateItinerary(i, 'title', e.target.value)} placeholder="Title" />
                        <textarea className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={day.details} onChange={e => updateItinerary(i, 'details', e.target.value)} placeholder="Details" />
                        <div className="flex items-center gap-2 mt-2">
                           <FaUtensils className="text-gray-400"/>
                           <input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white text-sm" value={day.meals?.join(', ')} onChange={e => updateItinerary(i, 'meals', e.target.value)} placeholder="Meals (comma separated)" />
                        </div>
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
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scroll">
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