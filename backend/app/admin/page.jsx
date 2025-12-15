'use client';
import { useState, useEffect } from 'react';
import {
  FaBook, FaMapMarkerAlt, FaUserSecret, FaTicketAlt, FaCommentDots,
  FaTag, FaSignOutAlt, FaBars, FaTimes, FaPaperPlane, FaTrash,
  FaPlus, FaChartPie, FaClock, FaUserTie, FaBed, FaMobileAlt, FaEnvelope, FaStar, FaQuestionCircle, FaBlog
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---
import BookingManager from './BookingManager';
import TourManager from './TourManager';
import EnquiryManager from './EnquiryManager';
import BlogManager from './BlogManager';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- GLOBAL STATE ---
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [agents, setAgents] = useState([]);
  const [globalPrices, setGlobalPrices] = useState(null);
  const [allReviews, setAllReviews] = useState([]);

  // Forms for "Other" Tabs
  const [agentForm, setAgentForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', usageLimit: 100, agentId: '' });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTours, resPrices, resBookings, resCoupons, resAgents, resReviews] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/pricing'),
        fetch('/api/bookings'),
        fetch('/api/coupons'),
        fetch('/api/agent'),
        fetch('/api/reviews')
      ]);

      const d1 = await resTours.json(); if (d1.success) setTours(d1.data);
      const d2 = await resPrices.json(); if (d2.success) setGlobalPrices(d2.data);
      const d3 = await resBookings.json(); if (d3.success) setBookings(d3.data);
      const d4 = await resCoupons.json(); if (d4.success) setCoupons(d4.data);
      const d5 = await resAgents.json(); if (d5.success) setAgents(d5.data);
      const d6 = await resReviews.json(); if (d6.success) setAllReviews(d6.data);
    } catch (err) { console.error("Fetch Error:", err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- HANDLERS FOR OTHER TABS ---
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...couponForm };
      if (!payload.agentId) delete payload.agentId;
      const res = await fetch('/api/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { alert("Created!"); setCouponForm({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', usageLimit: 100, agentId: '' }); fetchData(); }
      else alert(data.error);
    } catch (err) { alert("Failed"); }
  };

  const handleUpdateCouponAgent = async (couponId, agentId) => {
    try {
      const res = await fetch('/api/coupons', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: couponId, agentId }) });
      if (await res.json().then(d => d.success)) { alert("Agent Assigned!"); fetchData(); }
    } catch (err) { alert("Failed to assign agent"); }
  }

  const handleDeleteCoupon = async (id) => { if (confirm("Delete?")) { await fetch(`/api/coupons?id=${id}`, { method: 'DELETE' }); fetchData(); } };

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/agent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(agentForm) });
      const data = await res.json();
      if (data.success) { alert("Agent Created!"); setAgentForm({ name: '', email: '', password: '', phone: '' }); fetchData(); }
      else alert(data.error);
    } catch (e) { alert("Failed"); }
  };

  const handleDeleteAgent = async (id) => { if (confirm("Delete Agent?")) { await fetch(`/api/agent?id=${id}`, { method: 'DELETE' }); fetchData(); } };
  const handleResendCreds = (email) => { alert(`Credentials resent to ${email} (Simulation)`); };

  const handleSaveGlobalPricing = async () => {
    setLoading(true);
    await fetch('/api/pricing', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(globalPrices) });
    alert("Updated!"); setLoading(false);
  };

  const handleDeleteReview = async (reviewId, tourId) => {
    if (!confirm("Delete review?")) return;
    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}&tourId=${tourId}`, { method: 'DELETE' });
      if (await res.json().then(d => d.success)) { setAllReviews(prev => prev.filter(r => r._id !== reviewId)); alert("Deleted"); }
    } catch (e) { alert("Error deleting"); }
  };

  const handleLogout = () => { if (confirm("Logout?")) window.location.href = '/login'; };

  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-100 font-sans overflow-hidden relative">
      {/* SIDEBAR RESPONSIVE */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1e293b] p-4 z-40 flex justify-between items-center border-b border-gray-700 shadow-lg">
        <span className="font-bold text-white text-lg tracking-wide">HillWay Admin</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg"><FaBars size={24} /></button>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e293b] border-r border-gray-800 flex flex-col flex-shrink-0 transform transition-transform duration-300 shadow-2xl lg:translate-x-0 lg:static lg:inset-auto lg:w-64 lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 text-2xl font-bold text-cyan-400 tracking-wider flex justify-between items-center border-b border-gray-800 lg:border-none">
          <span>HillWay</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white"><FaTimes size={24} /></button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {[
            { id: 'bookings', label: 'Bookings', icon: <FaBook /> },
            { id: 'enquiries', label: 'Enquiries', icon: <FaQuestionCircle />, color: 'purple' },
            { id: 'tours', label: 'Manage Tours', icon: <FaMapMarkerAlt /> },
            { id: 'blogs', label: 'Blog Posts', icon: <FaBlog />, color: 'orange' },
            { id: 'agents', label: 'Agents', icon: <FaUserSecret />, color: 'purple' },
            { id: 'coupons', label: 'Coupons', icon: <FaTicketAlt /> },
            { id: 'reviews', label: 'Reviews', icon: <FaCommentDots /> },
            { id: 'pricing', label: 'Global Pricing', icon: <FaTag /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? `bg-${tab.color || 'cyan'}-600 text-white shadow-lg` : 'hover:bg-gray-700 text-gray-400'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-400 bg-red-900/10 hover:bg-red-900/30 font-bold transition border border-red-900/30"><FaSignOutAlt /> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto pt-20 lg:pt-8 bg-[#0f172a]">
        {loading && <div className="text-center text-cyan-400 font-bold mb-4 animate-pulse">Syncing Data...</div>}

        {/* 1. BOOKINGS COMPONENT */}
        {activeTab === 'bookings' && (
          <BookingManager bookings={bookings} tours={tours} globalPrices={globalPrices} refreshData={fetchData} />
        )}

        {/* 2. ENQUIRIES COMPONENT */}
        {activeTab === 'enquiries' && <EnquiryManager />}

        {/* 3. TOURS COMPONENT */}
        {activeTab === 'tours' && (
          <TourManager tours={tours} globalPrices={globalPrices} refreshData={fetchData} />
        )}

        {/* 4. BLOG MANAGER */}
        {activeTab === 'blogs' && <BlogManager />}

        {/* 5. OTHER TABS (INLINE) */}
        {activeTab === 'reviews' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">User Reviews</h1>
            <div className="grid gap-4">
              {allReviews.map((review, index) => (
                <div key={`${review._id}-${index}`} className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700 shadow-md hover:border-gray-500 transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                    <div className="flex items-center gap-2"><span className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-lg text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">{review.tourTitle}</span><span className="text-gray-500 text-xs flex items-center gap-1"><FaClock size={10} /> {review.date}</span></div>
                    <button onClick={() => handleDeleteReview(review._id, review.tourId)} className="px-4 py-2 bg-red-900/10 hover:bg-red-900/30 text-red-400 border border-red-900/20 rounded-lg text-xs font-bold transition flex items-center gap-2 whitespace-nowrap"><FaTrash size={12} /> Delete</button>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">{review.name.charAt(0).toUpperCase()}</div><div><h3 className="font-bold text-white text-sm leading-tight">{review.name}</h3><div className="flex text-yellow-500 text-xs gap-0.5 mt-0.5">{[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? "" : "text-gray-600"} />)}</div></div></div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 ml-auto">{review.mobile && <span className="flex items-center gap-1.5"><FaMobileAlt /> {review.mobile}</span>}{review.email && <span className="flex items-center gap-1.5"><FaEnvelope /> {review.email}</span>}</div>
                    </div>
                    <div>{review.title && <h4 className="text-white font-bold text-sm mb-1">{review.title}</h4>}<p className="text-gray-300 text-sm italic leading-relaxed">"{review.text}"</p></div>
                  </div>
                </div>
              ))}
              {allReviews.length === 0 && <div className="p-12 text-center text-gray-500">No reviews posted yet.</div>}
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Agents</h1>
            <form onSubmit={handleCreateAgent} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end shadow-lg">
              <div className="md:col-span-2"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Name</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" value={agentForm.name} onChange={e => setAgentForm({ ...agentForm, name: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Email</label><input required type="email" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={agentForm.email} onChange={e => setAgentForm({ ...agentForm, email: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Password</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={agentForm.password} onChange={e => setAgentForm({ ...agentForm, password: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Phone</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={agentForm.phone} onChange={e => setAgentForm({ ...agentForm, phone: e.target.value })} /></div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-lg font-bold h-[48px] w-full md:w-auto shadow-lg transition mt-4 md:mt-0">Add Agent</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map(agent => (
                <div key={agent._id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-purple-500/30 transition shadow-md">
                  <div className="flex justify-between items-start mb-4"><div><h3 className="text-xl font-bold text-white">{agent.name}</h3><p className="text-sm text-gray-400">{agent.email}</p></div><div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs font-bold border border-green-500/20">Earned: ₹{agent.totalCommission}</div></div>
                  <div className="flex gap-2 mb-4"><button onClick={() => handleResendCreds(agent.email)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><FaPaperPlane /> Resend Credentials</button></div>
                  <button onClick={() => handleDeleteAgent(agent._id)} className="w-full mt-2 text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-1 border border-red-500/20 py-2 rounded-lg transition"><FaTrash /> Delete Agent</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Coupons</h1>
            <form onSubmit={handleCreateCoupon} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-6 gap-4 items-end shadow-lg">
              <div className="col-span-1 md:col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Code</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white uppercase font-bold tracking-widest" placeholder="SUMMER25" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value })} /></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Discount</label><div className="flex gap-2"><input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="10" value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })} /><select className="bg-black/30 border border-gray-600 rounded-lg px-2 text-white text-xs" value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })}><option value="PERCENTAGE">%</option><option value="FLAT">₹</option></select></div></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Expiry</label><input required type="date" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} /></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Limit</label><input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="100" value={couponForm.usageLimit} onChange={e => setCouponForm({ ...couponForm, usageLimit: e.target.value })} /></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Assign Agent</label><select className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm" value={couponForm.agentId} onChange={e => setCouponForm({ ...couponForm, agentId: e.target.value })}><option value="">-- No Agent --</option>{agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}</select></div>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold h-[48px] flex items-center justify-center gap-2"><FaPlus size={12} /> Create</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map(coupon => {
                const assignedAgent = agents.find(a => a._id === coupon.agentId);
                return (
                  <div key={coupon._id} className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700 relative group hover:border-cyan-500/50 transition shadow-lg">
                    <div className="flex justify-between items-start mb-4"><div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg px-3 py-1.5"><h3 className="text-lg font-black text-cyan-400 tracking-widest">{coupon.code}</h3></div><div className="text-right"><p className="text-2xl font-bold text-white leading-none">{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</p><p className="text-[10px] text-gray-400 uppercase font-bold">OFF</p></div></div>
                    <div className="space-y-2 mb-4"><div className="flex items-center justify-between text-sm"><span className="text-gray-400 flex items-center gap-2"><FaChartPie size={12} /> Used</span><span className={`font-mono font-bold ${coupon.usedCount >= coupon.usageLimit ? 'text-red-400' : 'text-white'}`}>{coupon.usedCount} / {coupon.usageLimit}</span></div><div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"><div className={`h-full rounded-full ${coupon.usedCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }} /></div><div className="flex items-center justify-between text-sm pt-1"><span className="text-gray-400 flex items-center gap-2"><FaClock size={12} /> Expires</span><span className="text-white font-medium">{new Date(coupon.expiryDate).toLocaleDateString()}</span></div></div>
                    <div className="mb-4 bg-black/20 p-2 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2 text-xs text-gray-400"><FaUserTie /> {assignedAgent ? <span className="text-purple-300 font-bold">{assignedAgent.name}</span> : "Unassigned"}</div><select className="bg-transparent text-xs text-cyan-400 border-none outline-none text-right cursor-pointer" value={coupon.agentId || ""} onChange={(e) => handleUpdateCouponAgent(coupon._id, e.target.value)}><option value="">Re-assign</option><option value="">None</option>{agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}</select></div>
                    <button onClick={() => handleDeleteCoupon(coupon._id)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wide transition flex items-center justify-center gap-2"><FaTrash size={12} /> Delete Coupon</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'pricing' && globalPrices && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Universal Price List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaTag /> Add-ons</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Meal Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.mealPrice} onChange={e => setGlobalPrices({ ...globalPrices, mealPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Tea Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.teaPrice} onChange={e => setGlobalPrices({ ...globalPrices, teaPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Bonfire Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.bonfirePrice} onChange={e => setGlobalPrices({ ...globalPrices, bonfirePrice: e.target.value })} /></div>
                </div>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaBed /> Stay & Travel</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Standard Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.standardRoomPrice} onChange={e => setGlobalPrices({ ...globalPrices, standardRoomPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Panoramic Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.panoRoomPrice} onChange={e => setGlobalPrices({ ...globalPrices, panoRoomPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Cab Rate</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.personalCabPrice} onChange={e => setGlobalPrices({ ...globalPrices, personalCabPrice: e.target.value })} /></div>
                </div>
              </div>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mt-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaBook /> Global Policy Notes</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Stay Policy</label><textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.stayNote || ''} onChange={e => setGlobalPrices({ ...globalPrices, stayNote: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Food Policy</label><textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={globalPrices.foodNote || ''} onChange={e => setGlobalPrices({ ...globalPrices, foodNote: e.target.value })} /></div>
              </div>
            </div>
            <button onClick={handleSaveGlobalPricing} className="mt-8 w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold shadow-lg">Save Global Prices & Notes</button>
          </div>
        )}
      </main>
    </div>
  );
}