'use client';
import { useState, useEffect } from 'react';
import {
  FaBook, FaMapMarkerAlt, FaUserSecret, FaTicketAlt, FaCommentDots,
  FaTag, FaSignOutAlt, FaBars, FaTimes, FaPaperPlane, FaTrash,
  FaPlus, FaChartPie, FaClock, FaUserTie, FaBed, FaMobileAlt,
  FaEnvelope, FaStar, FaQuestionCircle, FaPhone,
  FaMoneyBillWave, FaClipboardList, FaCalendarAlt, FaCheckCircle, FaWalking, FaFlagCheckered, FaBan, FaHourglassHalf,
  FaSearch, FaPenNib, FaRocket
} from 'react-icons/fa';

// --- SUB-COMPONENTS ---
import BookingManager from './BookingManager';
import TourManager from './TourManager';
import EnquiryManager from './EnquiryManager';
import BlogManager from './BlogManager';
import SeoManager from './SeoManager';
import PageManager from './PageManager';
import HomeFaqManager from './HomeFaqManager';
import SitemapGenerator from './SitemapGenerator';

export default function AdminDashboard({ onLogout }) {
  // Set 'dashboard' as the default active tab
  const [activeTab, setActiveTab] = useState('dashboard');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- GLOBAL STATE ---
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [agents, setAgents] = useState([]);
  const [globalPrices, setGlobalPrices] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  // Forms for "Other" Tabs
  const [agentForm, setAgentForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', usageLimit: 100, agentId: '' });
  const [reviewForm, setReviewForm] = useState({ tourId: '', name: '', title: '', email: '', mobile: '', rating: 5, text: '', date: '' });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTours, resPrices, resBookings, resCoupons, resAgents, resReviews, resEnquiries] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/pricing'),
        fetch('/api/bookings'),
        fetch('/api/coupons'),
        fetch('/api/agent'),
        fetch('/api/reviews'),
        fetch('/api/enquiries')
      ]);

      if (resTours.ok) { const d1 = await resTours.json(); if (d1.success) setTours(d1.data); }
      if (resPrices.ok) { const d2 = await resPrices.json(); if (d2.success) setGlobalPrices(d2.data); }
      if (resBookings.ok) { const d3 = await resBookings.json(); if (d3.success) setBookings(d3.data); }
      if (resCoupons.ok) { const d4 = await resCoupons.json(); if (d4.success) setCoupons(d4.data); }
      if (resAgents.ok) { const d5 = await resAgents.json(); if (d5.success) setAgents(d5.data); }
      if (resReviews.ok) { const d6 = await resReviews.json(); if (d6.success) setAllReviews(d6.data); }
      if (resEnquiries.ok) { const d7 = await resEnquiries.json(); if (d7.success) setEnquiries(d7.data); }
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

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reviewForm) });
      const data = await res.json();
      if (data.success) {
        alert("Review Added Successfully!");
        setReviewForm({ tourId: '', name: '', title: '', email: '', mobile: '', rating: 5, text: '', date: '' });
        fetchData();
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (e) { alert("Error creating review"); }
    setLoading(false);
  };

  const handleDeleteReview = async (reviewId, tourId) => {
    if (!confirm("Delete review?")) return;
    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}&tourId=${tourId}`, { method: 'DELETE' });
      if (await res.json().then(d => d.success)) { setAllReviews(prev => prev.filter(r => r._id !== reviewId)); alert("Deleted"); }
    } catch (e) { alert("Error deleting"); }
  };

  const handleLogout = () => { if (confirm("Logout?")) window.location.href = '/login'; };

  // --- DASHBOARD CALCULATIONS ---
  const getDashboardStats = () => {
    const now = new Date();

    let stats = {
      revenue: 0,
      collected: 0,
      pending: 0,
      cancelled: 0,
      confirmed: 0,
      ongoing: 0,
      completed: 0,
      upcoming: 0,
      newEnquiries: enquiries.filter(e => e.status === 'New').length
    };

    bookings.forEach(b => {
      // Financials
      stats.collected += (b.paidAmount || 0);

      if (b.status === 'Cancelled') {
        stats.cancelled++;
      } else if (b.status === 'Pending') {
        stats.pending++;
      } else if (b.status === 'Confirmed') {
        stats.confirmed++;
        stats.revenue += (b.totalPrice || 0);

        // Time-based status logic
        if (b.travelDate) {
          const tour = tours.find(t => t.title === b.tourTitle);
          const nights = tour?.nights || 1;

          const start = new Date(b.travelDate);
          const end = new Date(start);
          end.setDate(start.getDate() + nights);

          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          if (now < start) {
            stats.upcoming++;
          } else if (now >= start && now <= end) {
            stats.ongoing++;
          } else {
            stats.completed++;
          }
        } else {
          stats.upcoming++;
        }
      }
    });

    return stats;
  };

  const stats = getDashboardStats();

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartPie /> },
    { id: 'bookings', label: 'Bookings', icon: <FaBook /> },
    { id: 'enquiries', label: 'Enquiries', icon: <FaQuestionCircle /> },
    { id: 'tours', label: 'Manage Tours', icon: <FaMapMarkerAlt /> },
    { id: 'blogs', label: 'Blog Posts', icon: <FaBook /> },
    { id: 'agents', label: 'Agents', icon: <FaUserSecret /> },
    { id: 'coupons', label: 'Coupons', icon: <FaTicketAlt /> },
    { id: 'reviews', label: 'Reviews', icon: <FaCommentDots /> },
    { id: 'pages', label: 'Pages (SEO)' },
    { id: 'home-faq', label: 'Home FAQs', icon: <FaQuestionCircle /> },
    { id: 'seo', label: 'SEO Manager', icon: <FaSearch /> },
    { id: 'sitemap', label: 'Sitemap', icon: <FaRocket /> },
    { id: 'pricing', label: 'Global Pricing & Settings', icon: <FaTag /> },
  ];

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
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}>
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

        {/* 0. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <FaChartPie className="text-cyan-500" /> Dashboard Overview
            </h1>

            {/* --- ROW 1: FINANCIALS & ACTIONS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110">
                  <FaMoneyBillWave size={80} className="text-green-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                  <h2 className="text-3xl font-black text-white">?{stats.revenue.toLocaleString()}</h2>
                  <div className="mt-2 text-xs text-green-400 font-bold flex items-center gap-1">
                    <FaCheckCircle size={10} /> {stats.confirmed} Confirmed Sales
                  </div>
                </div>
              </div>

              {/* Collected Card */}
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110">
                  <FaTag size={80} className="text-purple-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Payment Collected</p>
                  <h2 className="text-3xl font-black text-white">?{stats.collected.toLocaleString()}</h2>
                  <div className="mt-2 text-xs text-purple-400 font-bold">
                    Actual Received
                  </div>
                </div>
              </div>

              {/* Enquiries Card */}
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110">
                  <FaQuestionCircle size={80} className="text-orange-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">New Enquiries</p>
                  <h2 className="text-3xl font-black text-white">{stats.newEnquiries}</h2>
                  <div className="mt-2 text-xs font-bold">
                    {stats.newEnquiries > 0 ? (
                      <span className="text-orange-400 flex items-center gap-1"><FaClock /> Waiting for reply</span>
                    ) : (
                      <span className="text-green-400">All Caught Up</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pending Approvals Card */}
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110">
                  <FaHourglassHalf size={80} className="text-yellow-500" />
                </div>
                <div className="relative z-10">
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Pending Approvals</p>
                  <h2 className="text-3xl font-black text-white">{stats.pending}</h2>
                  <div className="mt-2 text-xs text-yellow-400 font-bold">
                    Bookings to Review
                  </div>
                </div>
              </div>
            </div>

            {/* --- ROW 2: TOUR STATUS METRICS --- */}
            <h2 className="text-xl font-bold text-white mt-8 mb-4 flex items-center gap-2">
              <FaClipboardList className="text-cyan-500" /> Tour Status Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* 1. ONGOING */}
              <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 p-5 rounded-2xl border border-green-500/30 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><FaWalking className="animate-pulse" /> Ongoing Tours</p>
                  <h3 className="text-3xl font-black text-white">{stats.ongoing}</h3>
                  <p className="text-xs text-gray-400 mt-1">Happening Right Now</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-xl"><FaWalking size={24} className="text-green-400" /></div>
              </div>

              {/* 2. UPCOMING */}
              <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-800/10 p-5 rounded-2xl border border-cyan-500/30 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><FaClock /> Upcoming</p>
                  <h3 className="text-3xl font-black text-white">{stats.upcoming}</h3>
                  <p className="text-xs text-gray-400 mt-1">Confirmed Future Trips</p>
                </div>
                <div className="bg-cyan-500/20 p-3 rounded-xl"><FaCalendarAlt size={24} className="text-cyan-400" /></div>
              </div>

              {/* 3. COMPLETED */}
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-5 rounded-2xl border border-blue-500/30 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><FaFlagCheckered /> Completed</p>
                  <h3 className="text-3xl font-black text-white">{stats.completed}</h3>
                  <p className="text-xs text-gray-400 mt-1">Successfully Finished</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-xl"><FaFlagCheckered size={24} className="text-blue-400" /></div>
              </div>

              {/* 4. CANCELLED */}
              <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 p-5 rounded-2xl border border-red-500/30 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2"><FaBan /> Cancelled</p>
                  <h3 className="text-3xl font-black text-white">{stats.cancelled}</h3>
                  <p className="text-xs text-gray-400 mt-1">Rejected / Cancelled</p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-xl"><FaTimes size={24} className="text-red-400" /></div>
              </div>
            </div>

            {/* --- ROW 3: Secondary Info (Existing) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FaMapMarkerAlt className="text-cyan-500" /> Inventory Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-4 rounded-xl">
                    <span className="text-gray-400 text-xs uppercase font-bold">Active Tours</span>
                    <p className="text-2xl font-bold text-cyan-400">{tours.length}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl">
                    <span className="text-gray-400 text-xs uppercase font-bold">Active Agents</span>
                    <p className="text-2xl font-bold text-purple-400">{agents.length}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl">
                    <span className="text-gray-400 text-xs uppercase font-bold">Active Coupons</span>
                    <p className="text-2xl font-bold text-green-400">{coupons.length}</p>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl">
                    <span className="text-gray-400 text-xs uppercase font-bold">Total Reviews</span>
                    <p className="text-2xl font-bold text-yellow-400">{allReviews.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FaClock className="text-yellow-500" /> Recent Pending Actions</h3>
                <div className="space-y-3 overflow-y-auto max-h-[180px] pr-2 custom-scrollbar">
                  {bookings.filter(b => b.status === 'Pending').slice(0, 3).map(b => (
                    <div key={b._id} className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
                      <div>
                        <p className="text-sm font-bold text-white">{b.name}</p>
                        <p className="text-xs text-yellow-500">Pending Booking - {b.tourTitle}</p>
                      </div>
                      <button onClick={() => setActiveTab('bookings')} className="text-xs bg-yellow-500 text-black px-2 py-1 rounded font-bold hover:bg-yellow-400">View</button>
                    </div>
                  ))}
                  {enquiries.filter(e => e.status === 'New').slice(0, 3).map(e => (
                    <div key={e._id} className="flex justify-between items-center bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg">
                      <div>
                        <p className="text-sm font-bold text-white">{e.name}</p>
                        <p className="text-xs text-orange-500">New Enquiry - {e.destination || 'General'}</p>
                      </div>
                      <button onClick={() => setActiveTab('enquiries')} className="text-xs bg-orange-500 text-black px-2 py-1 rounded font-bold hover:bg-orange-400">Reply</button>
                    </div>
                  ))}
                  {bookings.filter(b => b.status === 'Pending').length === 0 && enquiries.filter(e => e.status === 'New').length === 0 && (
                    <div className="text-center text-gray-500 py-8 italic">No pending actions. Great job!</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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

        {/* 4. blog MANAGER */}
        {activeTab === 'blogs' && <BlogManager />}

        {/* 5. OTHER TABS (INLINE) */}
        {activeTab === 'reviews' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Reviews</h1>

            {/* ADD REVIEW FORM - RESTORED */}
            <form onSubmit={handleCreateReview} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 shadow-lg">
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2"><FaPenNib /> Add Manual Review</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Select Tour</label>
                  <select required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={reviewForm.tourId} onChange={e => setReviewForm({ ...reviewForm, tourId: e.target.value })}>
                    <option value="">-- Choose Tour --</option>
                    {tours.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Date</label>
                  <input type="date" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={reviewForm.date} onChange={e => setReviewForm({ ...reviewForm, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Rating</label>
                  <div className="flex gap-2 bg-black/30 p-3 rounded-lg border border-gray-600">
                    {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className={`cursor-pointer text-lg ${s <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`} onClick={() => setReviewForm({ ...reviewForm, rating: s })} />)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Customer Name</label>
                  <input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Review Title</label>
                  <input className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={reviewForm.title} onChange={e => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="e.g. Amazing Trip" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Email (Optional)</label>
                  <input type="email" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={reviewForm.email} onChange={e => setReviewForm({ ...reviewForm, email: e.target.value })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Review Text</label>
                <textarea required rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition">Publish Review</button>
              </div>
            </form>

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

        {/* 8. SEO MANAGER */}
        {activeTab === 'seo' && <SeoManager />}

        {/* 9. PAGE MANAGER */}
        {activeTab === 'pages' && <PageManager />}

        {/* HOME FAQ MANAGER */}
        {activeTab === 'home-faq' && <HomeFaqManager />}

        {/* SITEMAP GENERATOR */}
        {activeTab === 'sitemap' && <SitemapGenerator />}

        {/* 10. AGENTS */}
        {activeTab === 'agents' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Agents</h1>
            <form onSubmit={handleCreateAgent} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end shadow-lg">
              <div className="md:col-span-2"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Name</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={agentForm.name} onChange={e => setAgentForm({ ...agentForm, name: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Email</label><input required type="email" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={agentForm.email} onChange={e => setAgentForm({ ...agentForm, email: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Password</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={agentForm.password} onChange={e => setAgentForm({ ...agentForm, password: e.target.value })} /></div>
              <div><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Phone</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={agentForm.phone} onChange={e => setAgentForm({ ...agentForm, phone: e.target.value })} /></div>
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-3 rounded-lg font-bold h-[48px] w-full md:w-auto shadow-lg transition mt-4 md:mt-0">Add Agent</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map(agent => (
                <div key={agent._id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-cyan-500/30 transition shadow-md">
                  <div className="flex justify-between items-start mb-4"><div><h3 className="text-xl font-bold text-white">{agent.name}</h3><p className="text-sm text-gray-400">{agent.email}</p></div><div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs font-bold border border-green-500/20">Earned: ?{agent.totalCommission}</div></div>
                  <div className="flex gap-2 mb-4"><button onClick={() => handleResendCreds(agent.email)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><FaPaperPlane /> Resend Credentials</button></div>
                  <button onClick={() => handleDeleteAgent(agent._id)} className="w-full mt-2 text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-1 border border-red-500/20 py-2 rounded-lg transition"><FaTrash /> Delete Agent</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. COUPONS */}
        {activeTab === 'coupons' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Coupons</h1>
            <form onSubmit={handleCreateCoupon} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-6 gap-4 items-end shadow-lg">
              <div className="col-span-1 md:col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Code</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white uppercase font-bold tracking-widest focus:border-cyan-500 outline-none" placeholder="SUMMER25" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value })} /></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Discount</label><div className="flex gap-2"><input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="10" value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })} /><select className="bg-black/30 border border-gray-600 rounded-lg px-2 text-white text-xs outline-none" value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })}><option value="PERCENTAGE">%</option><option value="FLAT">?</option></select></div></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Expiry</label><input required type="date" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm focus:border-cyan-500 outline-none" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} /></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Limit</label><input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="100" value={couponForm.usageLimit} onChange={e => setCouponForm({ ...couponForm, usageLimit: e.target.value })} /></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Assign Agent</label><select className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm focus:border-cyan-500 outline-none" value={couponForm.agentId} onChange={e => setCouponForm({ ...couponForm, agentId: e.target.value })}><option value="">-- No Agent --</option>{agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}</select></div>
              <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-bold h-[48px] flex items-center justify-center gap-2 transition"><FaPlus size={12} /> Create</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map(coupon => {
                const assignedAgent = agents.find(a => a._id === coupon.agentId);
                return (
                  <div key={coupon._id} className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700 relative group hover:border-cyan-500/50 transition shadow-lg">
                    <div className="flex justify-between items-start mb-4"><div className="bg-cyan-900/30 border border-cyan-500/30 rounded-lg px-3 py-1.5"><h3 className="text-lg font-black text-cyan-400 tracking-widest">{coupon.code}</h3></div><div className="text-right"><p className="text-2xl font-bold text-white leading-none">{coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `?${coupon.discountValue}`}</p><p className="text-[10px] text-gray-400 uppercase font-bold">OFF</p></div></div>
                    <div className="space-y-2 mb-4"><div className="flex items-center justify-between text-sm"><span className="text-gray-400 flex items-center gap-2"><FaChartPie size={12} /> Used</span><span className={`font-mono font-bold ${coupon.usedCount >= coupon.usageLimit ? 'text-red-400' : 'text-white'}`}>{coupon.usedCount} / {coupon.usageLimit}</span></div><div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"><div className={`h-full rounded-full ${coupon.usedCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }} /></div><div className="flex items-center justify-between text-sm pt-1"><span className="text-gray-400 flex items-center gap-2"><FaClock size={12} /> Expires</span><span className="text-white font-medium">{new Date(coupon.expiryDate).toLocaleDateString()}</span></div></div>
                    <div className="mb-4 bg-black/20 p-2 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2 text-xs text-gray-400"><FaUserTie /> {assignedAgent ? <span className="text-purple-300 font-bold">{assignedAgent.name}</span> : "Unassigned"}</div><select className="bg-transparent text-xs text-cyan-400 border-none outline-none text-right cursor-pointer" value={coupon.agentId || ""} onChange={(e) => handleUpdateCouponAgent(coupon._id, e.target.value)}><option value="">Re-assign</option><option value="">None</option>{agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}</select></div>
                    <button onClick={() => handleDeleteCoupon(coupon._id)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wide transition flex items-center justify-center gap-2"><FaTrash size={12} /> Delete Coupon</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 11. PRICING & SETTINGS */}
        {activeTab === 'pricing' && globalPrices && (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Global Settings & Pricing</h1>

            {/* --- CONTACT SETTINGS --- */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mt-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><FaPhone size={80} className="text-cyan-500" /></div>
              <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2 relative z-10"><FaPhone /> Contact Settings</h3>
              <p className="text-xs text-gray-500 mb-4 relative z-10">These values are used across the entire website - Footer, Contact page, WhatsApp buttons, etc.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 1234567890"
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    value={globalPrices.contactPhone || ""}
                    onChange={e => setGlobalPrices({ ...globalPrices, contactPhone: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Displayed in Footer & Contact page</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="911234567890"
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    value={globalPrices.whatsappNumber || ""}
                    onChange={e => setGlobalPrices({ ...globalPrices, whatsappNumber: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Without + (e.g. 917004165004)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
                  <input
                    type="text"
                    placeholder="https://instagram.com/..."
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    value={globalPrices.instagramUrl || ""}
                    onChange={e => setGlobalPrices({ ...globalPrices, instagramUrl: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Full Instagram profile URL</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Facebook URL</label>
                  <input
                    type="text"
                    placeholder="https://facebook.com/..."
                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                    value={globalPrices.facebookUrl || ""}
                    onChange={e => setGlobalPrices({ ...globalPrices, facebookUrl: e.target.value })}
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Leave empty to hide in footer</p>
                </div>
              </div>
            </div>

            {/* --- DISCOUNT APPLICABLE ITEMS --- */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mt-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><FaTicketAlt size={80} className="text-green-500" /></div>
              <h3 className="text-xl font-bold text-green-400 mb-2 flex items-center gap-2 relative z-10"><FaTicketAlt /> Discount Applicable Items</h3>
              <p className="text-xs text-gray-500 mb-4 relative z-10">Control which items are included when calculating coupon/discount amounts. When enabled, the item's cost will be part of the discountable total.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                {[
                  { key: 'basePrice', label: 'Base Price', desc: 'Per person cost' },
                  { key: 'roomCharges', label: 'Room Charges', desc: 'Stay pricing' },
                  { key: 'transport', label: 'Transport', desc: 'Cab/travel costs' },
                  { key: 'meal', label: 'Meals', desc: 'Food package' },
                  { key: 'tea', label: 'Tea', desc: 'Tea service' },
                  { key: 'bonfire', label: 'Bonfire', desc: 'Night bonfire' },
                  { key: 'tourGuide', label: 'Tour Guide', desc: 'Guide service' },
                  { key: 'comfortSeat', label: 'Comfort Seat', desc: 'Premium seating' }
                ].map(item => {
                  const discountItems = globalPrices.discountApplicableItems || {};
                  const isEnabled = discountItems[item.key] !== false; // Default true if undefined
                  return (
                    <div
                      key={item.key}
                      onClick={() => setGlobalPrices({
                        ...globalPrices,
                        discountApplicableItems: {
                          ...discountItems,
                          [item.key]: !isEnabled
                        }
                      })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${isEnabled
                        ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20'
                        : 'bg-black/20 border-gray-700 hover:border-gray-600'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold text-sm ${isEnabled ? 'text-green-400' : 'text-gray-400'}`}>{item.label}</span>
                        <div className={`w-10 h-5 rounded-full p-0.5 transition-all ${isEnabled ? 'bg-green-500' : 'bg-gray-600'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --- STARTING POINTS --- */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mt-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><FaMapMarkerAlt size={80} className="text-cyan-500" /></div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2 relative z-10"><FaMapMarkerAlt /> Starting Points</h3>
              <p className="text-xs text-gray-500 mb-4 relative z-10">Manage tour starting points. Points marked "Requires Contact" will redirect users to contact page.</p>

              {/* Add New Starting Point */}
              <div className="flex gap-2 mb-4 relative z-10">
                <input
                  type="text"
                  placeholder="New starting point name..."
                  id="newStartingPoint"
                  className="flex-1 bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('newStartingPoint');
                    const name = input.value.trim();
                    if (!name) return alert("Please enter a name");
                    const points = globalPrices.startingPoints || [];
                    if (points.find(p => p.name.toLowerCase() === name.toLowerCase())) {
                      return alert("Starting point already exists");
                    }
                    setGlobalPrices({
                      ...globalPrices,
                      startingPoints: [...points, { name, isDefault: false, requiresContact: false }]
                    });
                    input.value = '';
                  }}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition flex items-center gap-2"
                >
                  <FaPlus size={12} /> Add
                </button>
              </div>

              {/* Starting Points List */}
              <div className="space-y-2 relative z-10">
                {(globalPrices.startingPoints || []).map((point, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${point.isDefault ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-black/20 border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📍</span>
                      <div>
                        <span className={`font-bold ${point.isDefault ? 'text-cyan-400' : 'text-white'}`}>{point.name}</span>
                        {point.isDefault && <span className="ml-2 text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-bold">DEFAULT</span>}
                        {point.requiresContact && <span className="ml-2 text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold">CONTACT REQUIRED</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Set Default Button */}
                      {!point.isDefault && (
                        <button
                          onClick={() => {
                            const updated = (globalPrices.startingPoints || []).map((p, i) => ({
                              ...p,
                              isDefault: i === index
                            }));
                            setGlobalPrices({ ...globalPrices, startingPoints: updated });
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg transition"
                        >
                          Set Default
                        </button>
                      )}
                      {/* Toggle Requires Contact */}
                      <button
                        onClick={() => {
                          const updated = (globalPrices.startingPoints || []).map((p, i) =>
                            i === index ? { ...p, requiresContact: !p.requiresContact } : p
                          );
                          setGlobalPrices({ ...globalPrices, startingPoints: updated });
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition border ${point.requiresContact ? 'text-orange-400 border-orange-500/30 hover:border-orange-500/50' : 'text-gray-400 border-gray-600 hover:border-gray-500'}`}
                      >
                        {point.requiresContact ? '📞 Contact ON' : '📞 Contact OFF'}
                      </button>
                      {/* Delete Button */}
                      {!point.isDefault && (
                        <button
                          onClick={() => {
                            const updated = (globalPrices.startingPoints || []).filter((_, i) => i !== index);
                            setGlobalPrices({ ...globalPrices, startingPoints: updated });
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg transition"
                        >
                          <FaTrash size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {(!globalPrices.startingPoints || globalPrices.startingPoints.length === 0) && (
                  <p className="text-center text-gray-500 py-4 italic">No starting points configured</p>
                )}
              </div>
            </div>

            {/* --- POPUP PROMO COUPON --- */}
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mt-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><FaTag size={80} className="text-yellow-500" /></div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center gap-2 relative z-10"><FaTag /> Popup Promo Coupon</h3>
              <p className="text-xs text-gray-500 mb-4 relative z-10">Customize the promotional popup shown to website visitors.</p>

              {/* Enable Toggle */}
              <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-gray-700 mb-6 relative z-10">
                <div>
                  <span className="font-bold text-white">Enable Popup</span>
                  <p className="text-xs text-gray-500">Show promo popup to visitors</p>
                </div>
                <div
                  onClick={() => setGlobalPrices({
                    ...globalPrices,
                    popupCoupon: { ...(globalPrices.popupCoupon || {}), enabled: !(globalPrices.popupCoupon?.enabled !== false) }
                  })}
                  className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all ${globalPrices.popupCoupon?.enabled !== false ? 'bg-yellow-500' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${globalPrices.popupCoupon?.enabled !== false ? 'translate-x-7' : 'translate-x-0'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Badge Text</label>
                  <input type="text" placeholder="New Year 2025" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={globalPrices.popupCoupon?.badge || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), badge: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input type="text" placeholder="Start 2025 with Adventure!" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={globalPrices.popupCoupon?.title || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), title: e.target.value } })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle</label>
                  <input type="text" placeholder="Exclusive discount on all tours" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={globalPrices.popupCoupon?.subtitle || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), subtitle: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Discount Text</label>
                  <input type="text" placeholder="25% OFF" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none text-xl font-bold" value={globalPrices.popupCoupon?.discountText || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), discountText: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Discount Subtext</label>
                  <input type="text" placeholder="All Premium Tours" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={globalPrices.popupCoupon?.discountSubtext || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), discountSubtext: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Coupon Code</label>
                  <input type="text" placeholder="NEWYEAR25" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-yellow-400 focus:border-yellow-500 outline-none font-mono text-lg font-bold tracking-wider uppercase" value={globalPrices.popupCoupon?.code || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), code: e.target.value.toUpperCase() } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Button Text</label>
                  <input type="text" placeholder="CLAIM MY DISCOUNT" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={globalPrices.popupCoupon?.buttonText || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), buttonText: e.target.value } })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Valid Until Text</label>
                  <input type="text" placeholder="January 31, 2025" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-500 outline-none" value={globalPrices.popupCoupon?.validUntil || ""} onChange={e => setGlobalPrices({ ...globalPrices, popupCoupon: { ...(globalPrices.popupCoupon || {}), validUntil: e.target.value } })} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaTag /> Add-ons Pricing</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Meal Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.mealPrice} onChange={e => setGlobalPrices({ ...globalPrices, mealPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Tea Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.teaPrice} onChange={e => setGlobalPrices({ ...globalPrices, teaPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Bonfire Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.bonfirePrice} onChange={e => setGlobalPrices({ ...globalPrices, bonfirePrice: e.target.value })} /></div>
                </div>
              </div>
              <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaBed /> Stay & Travel Pricing</h3>
                <div className="space-y-4">
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Standard Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.standardRoomPrice} onChange={e => setGlobalPrices({ ...globalPrices, standardRoomPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Panoramic Room</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.panoRoomPrice} onChange={e => setGlobalPrices({ ...globalPrices, panoRoomPrice: e.target.value })} /></div>
                  <div><label className="block text-sm font-medium text-gray-300 mb-1">Cab Rate</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.personalCabPrice} onChange={e => setGlobalPrices({ ...globalPrices, personalCabPrice: e.target.value })} /></div>
                </div>
              </div>
            </div>
            <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mt-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2"><FaBook /> Global Policy Notes</h3>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Stay Policy</label><textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.stayNote || ''} onChange={e => setGlobalPrices({ ...globalPrices, stayNote: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Food Policy</label><textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.foodNote || ''} onChange={e => setGlobalPrices({ ...globalPrices, foodNote: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Transport Policy</label><textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" value={globalPrices.transportNote || ''} onChange={e => setGlobalPrices({ ...globalPrices, transportNote: e.target.value })} placeholder="Enter transport policy details here..." /></div>
              </div>
            </div>
            <button onClick={handleSaveGlobalPricing} className="mt-8 w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold shadow-lg transition">Save All Settings</button>
          </div>
        )}
      </main>
    </div>
  );
}
