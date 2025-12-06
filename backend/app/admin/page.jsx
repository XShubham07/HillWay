'use client';
import { useState, useEffect } from 'react';
import {
  FaMapMarkerAlt, FaEdit, FaTrash, FaPlus,
  FaTag, FaBed, FaUserTie, FaClock,
  FaCheck, FaCamera, FaSpinner,
  FaBook, FaEye, FaTimes, FaPhone, FaUser, FaCalendarDay,
  FaSearch, FaCheckCircle, FaTicketAlt, FaImages, FaMoneyBillWave,
  FaChartPie, FaUserSecret, FaSignOutAlt, FaPaperPlane, FaBars, FaList, FaUtensils, FaQuestionCircle, FaInfoCircle,
  FaCommentDots, FaStar, FaEnvelope, FaMobileAlt, FaHashtag, FaCalendarAlt, FaHotel, FaExternalLinkAlt
} from 'react-icons/fa';

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('bookings');
  const [view, setView] = useState('list');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [coupons, setCoupons] = useState([]);
  const [agents, setAgents] = useState([]);
  const [globalPrices, setGlobalPrices] = useState(null);
  const [allReviews, setAllReviews] = useState([]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  // === CONFIRMATION/EDIT MODAL STATE ===
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({
    paymentType: 'Full',
    paidAmount: 0,
    adminNotes: '',
    // NEW: Hotel Details
    hotelName: '',
    hotelAddress: '',
    hotelPhone: '',
    hotelNotes: ''
  });

  // Forms
  const [agentForm, setAgentForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: 0, expiryDate: '', usageLimit: 100, agentId: '' });

  const getInitialForm = () => ({
    title: '', subtitle: '', location: '', description: '',
    basePrice: 0, nights: 3, rating: 4.5, featured: false,
    images: [], img: '', mapEmbedUrl: '',
    // Default structure
    pricing: { mealPerPerson: 0, teaPerPerson: 0, bonfire: 0, tourGuide: 0, comfortSeat: 0, room: { standard: 0, panoramic: 0 }, personalCab: { rate: 0, capacity: 4 }, tourManagerFee: 5000 },
    inclusions: [], itinerary: [], faqs: [], reviews: [],
    // NEW: Tags
    tags: []
  });
  const [form, setForm] = useState(getInitialForm());

  // Available Tags for Selection
  const AVAILABLE_TAGS = ["GROUP", "COUPLE", "HONEYMOON", "ADVENTURE", "ROMANTIC", "FAMILY", "SOLO"];

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
      const d3 = await resBookings.json(); if (d3.success) { setBookings(d3.data); setFilteredBookings(d3.data); }
      const d4 = await resCoupons.json(); if (d4.success) setCoupons(d4.data);
      const d5 = await resAgents.json(); if (d5.success) setAgents(d5.data);
      const d6 = await resReviews.json(); if (d6.success) setAllReviews(d6.data);

    } catch (err) { console.error("Fetch Error:", err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // --- SEARCH ---
  useEffect(() => {
    if (!searchQuery) {
      setFilteredBookings(bookings);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = bookings.filter(b =>
        (b._id && b._id.slice(-6).toLowerCase().includes(lower)) ||
        (b.name && b.name.toLowerCase().includes(lower)) ||
        (b.phone && b.phone.includes(searchQuery))
      );
      setFilteredBookings(filtered);
    }
  }, [searchQuery, bookings]);

  const getBookingID = (id) => `#HW-${id.slice(-6).toUpperCase()}`;

  // --- BOOKING ACTIONS ---
  const handleDeleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b._id !== id));
        if (selectedBooking?._id === id) setSelectedBooking(null);
        alert("Booking deleted.");
      } else {
        alert("Failed to delete booking.");
      }
    } catch (e) { alert("Error deleting booking"); }
  };

  const initiateConfirmation = () => {
    if (!selectedBooking) return;
    setConfirmData({
      paymentType: selectedBooking.paymentType || 'Full',
      paidAmount: selectedBooking.paidAmount || selectedBooking.totalPrice,
      adminNotes: selectedBooking.adminNotes || '',
      // Pre-fill Hotel Details if they exist
      hotelName: selectedBooking.hotelDetails?.name || '',
      hotelAddress: selectedBooking.hotelDetails?.address || '',
      hotelPhone: selectedBooking.hotelDetails?.phone || '',
      hotelNotes: selectedBooking.hotelDetails?.notes || ''
    });
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedBooking) return;
    setUpdatingStatus(true);
    try {
      const payload = {
        id: selectedBooking._id,
        status: 'Confirmed',
        paymentType: confirmData.paymentType,
        paidAmount: confirmData.paymentType === 'Full' ? selectedBooking.totalPrice : confirmData.paidAmount,
        adminNotes: confirmData.adminNotes,
        // Send Hotel Details
        hotelDetails: {
          name: confirmData.hotelName,
          address: confirmData.hotelAddress,
          phone: confirmData.hotelPhone,
          notes: confirmData.hotelNotes
        }
      };

      const res = await fetch('/api/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) {
        const updatedBooking = data.data;
        setBookings(prev => prev.map(b => b._id === updatedBooking._id ? updatedBooking : b));
        setSelectedBooking(updatedBooking);
        setShowConfirmModal(false);
        alert(`Booking Updated Successfully!`);
      } else {
        alert("Update failed: " + data.error);
      }
    } catch (e) { alert("Network error updating booking"); }
    setUpdatingStatus(false);
  };

  // --- HELPER: Find Tour ID for Linking ---
  const getTourLink = (tourTitle) => {
    const tour = tours.find(t => t.title === tourTitle);
    return tour ? `/tours/${tour._id}` : null;
  };

  // --- REVIEW ACTIONS ---
  const handleDeleteReview = async (reviewId, tourId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}&tourId=${tourId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAllReviews(prev => prev.filter(r => r._id !== reviewId));
        alert("Review deleted successfully");
      } else {
        alert("Failed to delete review: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      console.error(e);
      alert("Network error deleting review");
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = '/login';
    }
  };

  // --- HELPER: GET UNIT RATES ---
  const getUnitRates = (b) => {
    const tour = tours.find(t => t.title === b.tourTitle);
    const p = tour?.pricing || globalPrices || {}; 
    const rates = [];

    const isPanoramic = b.roomType?.toLowerCase() === 'panoramic';
    const roomRate = isPanoramic
      ? (p.room?.panoramic ?? globalPrices?.panoRoomPrice)
      : (p.room?.standard ?? globalPrices?.standardRoomPrice);

    rates.push({ label: `${b.roomType} Room`, value: `₹${roomRate} / night` });

    if (b.transport === 'personal') {
      const cabRate = p.personalCab?.rate ?? globalPrices?.personalCabPrice;
      rates.push({ label: 'Private Cab', value: `₹${cabRate}` });
    }

    if (b.addons?.meal) rates.push({ label: 'Meal Plan', value: `₹${p.mealPerPerson ?? globalPrices?.mealPrice} / pax/day` });

    if (b.addons?.tea && !b.addons?.meal) {
      rates.push({ label: 'Tea/Snacks', value: `₹${p.teaPerPerson ?? globalPrices?.teaPrice} / pax/day` });
    } else if (b.addons?.tea && b.addons?.meal) {
      rates.push({ label: 'Tea/Snacks', value: 'FREE (w/ Meal)' });
    }

    if (b.addons?.bonfire) rates.push({ label: 'Bonfire', value: `₹${p.bonfire ?? globalPrices?.bonfirePrice}` });
    if (b.addons?.tourGuide) rates.push({ label: 'Guide', value: `₹${p.tourGuide ?? globalPrices?.tourGuidePrice}` });

    if (b.addons?.comfortSeat) rates.push({ label: 'Comfort Seat', value: `₹${p.comfortSeat ?? globalPrices?.comfortSeatPrice} (Flat)` });

    return rates;
  };

  // --- HELPER: PRICE BREAKDOWN ---
  const getPriceBreakdown = (b) => {
    const tour = tours.find(t => t.title === b.tourTitle);

    const p = {
      basePrice: tour?.basePrice || 0,
      mealPrice: tour?.pricing?.mealPerPerson ?? globalPrices?.mealPrice,
      teaPrice: tour?.pricing?.teaPerPerson ?? globalPrices?.teaPrice,
      bonfirePrice: tour?.pricing?.bonfire ?? globalPrices?.bonfirePrice,
      tourGuidePrice: tour?.pricing?.tourGuide ?? globalPrices?.tourGuidePrice,
      comfortSeatPrice: tour?.pricing?.comfortSeat ?? globalPrices?.comfortSeatPrice,
      personalCabPrice: tour?.pricing?.personalCab?.rate ?? globalPrices?.personalCabPrice
    };

    const items = [];
    const totalPax = (b.adults || 0) + (b.children || 0);
    const nights = b.rooms > 0 ? (tour?.nights || 1) : 0;
    const days = nights + 1;

    items.push({
      name: `Base Tour Cost (₹${p.basePrice} x ${totalPax} pax)`,
      cost: `₹${(p.basePrice * totalPax).toLocaleString()}`,
      highlight: true
    });

    const isPanoramic = b.roomType?.toLowerCase() === 'panoramic';
    const roomRate = isPanoramic
      ? (tour?.pricing?.room?.panoramic || globalPrices?.panoRoomPrice)
      : (tour?.pricing?.room?.standard || globalPrices?.standardRoomPrice);

    const roomCost = roomRate * b.rooms * nights;
    items.push({ name: `${b.roomType} Room (${b.rooms} x ${nights}N)`, cost: `₹${roomCost.toLocaleString()}` });

    items.push({
      name: b.transport === 'personal' ? "Private Cab" : "Shared Transport",
      cost: b.transport === 'personal' ? `₹${p.personalCabPrice.toLocaleString()}` : 'Included'
    });

    if (b.addons?.meal) {
      items.push({ name: `Meal Plan (${totalPax} pax)`, cost: `₹${(p.mealPrice * totalPax * days).toLocaleString()}` });
      if (b.addons?.tea) items.push({ name: "Tea/Snacks", cost: <span className="text-green-400 text-xs font-bold">FREE</span> });
    } else {
      if (b.addons?.tea) items.push({ name: `Tea/Snacks (${totalPax} pax)`, cost: `₹${(p.teaPrice * totalPax * days).toLocaleString()}` });
    }

    if (b.addons?.bonfire) items.push({ name: "Bonfire", cost: `₹${p.bonfirePrice.toLocaleString()}` });
    if (b.addons?.tourGuide) items.push({ name: "Tour Guide", cost: `₹${p.tourGuidePrice.toLocaleString()}` });
    if (b.addons?.comfortSeat) items.push({ name: `Comfort Seat`, cost: `₹${p.comfortSeatPrice.toLocaleString()}` });

    return items;
  };

  // --- COUPON & AGENT HANDLERS ---
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
      const data = await res.json();
      if (data.success) { alert("Agent Assigned!"); fetchData(); }
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

  // --- TOUR HANDLERS ---
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

  const handleCreateNew = () => {
    const initial = getInitialForm();
    if (globalPrices) {
      initial.pricing = {
        mealPerPerson: globalPrices.mealPrice || 0,
        teaPerPerson: globalPrices.teaPrice || 0,
        bonfire: globalPrices.bonfirePrice || 0,
        tourGuide: globalPrices.tourGuidePrice || 0,
        comfortSeat: globalPrices.comfortSeatPrice || 0,
        room: {
          standard: globalPrices.standardRoomPrice || 0,
          panoramic: globalPrices.panoRoomPrice || 0
        },
        personalCab: {
          rate: globalPrices.personalCabPrice || 0,
          capacity: 4
        },
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
        tags: tour.tags || [] // Load existing tags
    });
    setEditingId(tour._id); setView('editor'); setShowImagePreview(images.length > 0);
  };
  
  const handleDeleteTour = async (id) => { if (confirm("Delete?")) { await fetch(`/api/tours/${id}`, { method: 'DELETE' }); fetchData(); } };
  
  const handleSaveTour = async (e) => {
    e.preventDefault(); setLoading(true);
    const payload = { ...form, img: form.images.length > 0 ? form.images[0] : form.img };
    const url = editingId ? `/api/tours/${editingId}` : '/api/tours';
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { alert("Saved!"); setView('list'); fetchData(); } else { const err = await res.json(); alert(`Failed: ${err.error}`); }
    } catch (err) { alert("Error saving"); }
    setLoading(false);
  };

  const handleSaveGlobalPricing = async () => {
    setLoading(true);
    await fetch('/api/pricing', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(globalPrices) });
    alert("Updated!"); setLoading(false);
  };

  const updateField = (f, v) => setForm(p => ({ ...p, [f]: v }));
  const updatePricing = (f, v) => setForm(p => ({ ...p, pricing: { ...p.pricing, [f]: v === '' ? '' : Number(v) } }));
  const updatePricingNested = (p, f, v) => setForm(prev => ({ ...prev, pricing: { ...prev.pricing, [p]: { ...prev.pricing[p], [f]: v === '' ? '' : Number(v) } } }));

  const addItineraryDay = () => setForm(p => ({ ...p, itinerary: [...p.itinerary, { day: p.itinerary.length + 1, title: '', details: '', stay: '', meals: [] }] }));
  const updateItinerary = (idx, f, v) => { const newIt = [...form.itinerary]; if (f === 'meals') newIt[idx][f] = v.split(',').map(s => s.trim()); else newIt[idx][f] = v; setForm({ ...form, itinerary: newIt }); };

  const addFaq = () => setForm(p => ({ ...p, faqs: [...(p.faqs || []), { q: '', a: '' }] }));
  const updateFaq = (idx, f, v) => { const newFaqs = [...form.faqs]; newFaqs[idx][f] = v; setForm({ ...form, faqs: newFaqs }); };

  // Toggle Tags Logic
  const toggleTag = (tag) => {
    setForm(prev => {
      const currentTags = prev.tags || [];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
  };


  return (
    <div className="flex h-screen bg-[#0f172a] text-gray-100 font-sans overflow-hidden relative">

      {/* === UPDATE/CONFIRM DIALOG (MODAL) === */}
      {showConfirmModal && selectedBooking && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scroll">
            <h3 className="text-xl font-bold text-white mb-4">Update Booking Status</h3>

            <div className="space-y-4">
              
              {/* Payment Section */}
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Payment Type</label>
                <div className="flex bg-black/30 rounded-lg p-1">
                  <button
                    onClick={() => setConfirmData({ ...confirmData, paymentType: 'Full', paidAmount: selectedBooking.totalPrice })}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition ${confirmData.paymentType === 'Full' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Full Payment
                  </button>
                  <button
                    onClick={() => setConfirmData({ ...confirmData, paymentType: 'Partial', paidAmount: selectedBooking.paidAmount || 0 })}
                    className={`flex-1 py-2 rounded-md text-sm font-bold transition ${confirmData.paymentType === 'Partial' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Partial
                  </button>
                </div>
                {confirmData.paymentType === 'Partial' && (
                    <div className="mt-2">
                    <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Amount Paid (₹)</label>
                    <input
                        type="number"
                        className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white focus:border-yellow-500 outline-none font-mono font-bold"
                        value={confirmData.paidAmount}
                        onChange={e => setConfirmData({ ...confirmData, paidAmount: e.target.value })}
                    />
                    <p className="text-xs text-red-400 mt-1 font-bold text-right">Due: ₹{(selectedBooking.totalPrice - confirmData.paidAmount).toLocaleString()}</p>
                    </div>
                )}
              </div>

              {/* HOTEL DETAILS SECTION (Shows always in Edit mode now) */}
              <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                <h4 className="text-blue-400 font-bold text-xs uppercase mb-3 flex items-center gap-2"><FaHotel/> Assign Hotel Details</h4>
                <div className="space-y-2">
                    <input 
                        className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" 
                        placeholder="Hotel Name (e.g. Hotel Tashi)" 
                        value={confirmData.hotelName} 
                        onChange={e => setConfirmData({...confirmData, hotelName: e.target.value})} 
                    />
                    <input 
                        className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" 
                        placeholder="Address (e.g. MG Marg)" 
                        value={confirmData.hotelAddress} 
                        onChange={e => setConfirmData({...confirmData, hotelAddress: e.target.value})} 
                    />
                    <input 
                        className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" 
                        placeholder="Hotel Phone Contact" 
                        value={confirmData.hotelPhone} 
                        onChange={e => setConfirmData({...confirmData, hotelPhone: e.target.value})} 
                    />
                    <textarea 
                        className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" 
                        rows={2} 
                        placeholder="Room details or notes..." 
                        value={confirmData.hotelNotes} 
                        onChange={e => setConfirmData({...confirmData, hotelNotes: e.target.value})} 
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Admin Note</label>
                <textarea
                  rows={2}
                  className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none text-sm placeholder-gray-600"
                  placeholder="Transaction ID, payment method, special remarks..."
                  value={confirmData.adminNotes}
                  onChange={e => setConfirmData({ ...confirmData, adminNotes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-bold transition">Cancel</button>
              <button
                onClick={handleConfirmBooking}
                disabled={updatingStatus}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
              >
                {updatingStatus ? <FaSpinner className="animate-spin" /> : "Save & Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === BIG BOOKING DETAILS MODAL === */}
      {selectedBooking && !showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] w-full max-w-7xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative">

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-black/20">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                  <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Booking Details</h2>
                  <span className={`inline-flex items-center justify-center text-sm px-4 py-1.5 rounded-full font-mono tracking-wider border w-max ${selectedBooking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    {selectedBooking.status}
                  </span>
                </div>
                <p className="text-gray-400 text-xs md:text-sm flex items-center gap-2">
                  <FaClock className="text-gray-500" /> Managing booking #{selectedBooking._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-gray-300 hover:text-white border border-white/5">
                <FaTimes size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scroll">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                {/* Left Column */}
                <div className="md:col-span-2 space-y-6 md:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition col-span-1 sm:col-span-2">
                      <h3 className="text-cyan-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaHashtag /> Booking Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Booking ID</span>
                          <span className="text-white font-mono text-lg">{getBookingID(selectedBooking._id)}</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Placed On</span>
<span className="text-white flex items-center gap-2">
  <FaClock size={12} />
  {new Date(selectedBooking.createdAt).toLocaleString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})}

</span>

                        </div>
                        <div>
                          <span className="block text-xs text-gray-500 uppercase font-bold mb-1">Journey Date</span>
                          {selectedBooking.travelDate ? (
                            <span className="text-yellow-400 font-bold text-base flex items-center gap-2"><FaCalendarAlt size={12} /> {new Date(selectedBooking.travelDate).toLocaleDateString('en-IN')}</span>
                          ) : (
                            <span className="text-gray-500 italic text-sm">Not Selected</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                      <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaUser /> Customer</h3>
                      <p className="text-2xl font-semibold text-white mb-1">{selectedBooking.name}</p>
                      <div className="space-y-2 text-gray-400 text-sm mt-4">
                        <p className="flex items-center gap-3"><FaPhone className="text-xs" /> {selectedBooking.phone}</p>
                        {selectedBooking.email && <p className="flex items-center gap-3">✉ {selectedBooking.email}</p>}
                      </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                      <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaMapMarkerAlt /> Tour Details</h3>
                      
                      {/* CLICKABLE TOUR TITLE */}
                      <p className="text-lg text-white leading-tight font-bold flex items-center gap-2 group">
                        {selectedBooking.tourTitle}
                        {getTourLink(selectedBooking.tourTitle) && (
                          <a 
                            href={getTourLink(selectedBooking.tourTitle)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-cyan-400 transition text-sm"
                            title="View Tour Page"
                          >
                            <FaExternalLinkAlt />
                          </a>
                        )}
                      </p>

                      <div className="mt-4 space-y-1 text-gray-400 text-sm">
                        <p>{selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
                        <p>Rooms: {selectedBooking.rooms} <span className="text-xs bg-white/10 px-2 py-0.5 rounded ml-1">{selectedBooking.roomType}</span></p>
                        <p>Transport: {selectedBooking.transport === 'personal' ? 'Private Cab' : 'Shared'}</p>
                      </div>
                    </div>
                  </div>

                  {/* NEW: DISPLAY HOTEL DETAILS IF AVAILABLE */}
                  {selectedBooking.hotelDetails && selectedBooking.hotelDetails.name && (
                    <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                         <div className="flex justify-between items-start mb-4">
                            <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><FaHotel /> Assigned Hotel</h3>
                            {/* Edit button allows updating hotel details along with status */}
                            <button onClick={initiateConfirmation} className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><FaEdit /> Edit</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Hotel Name</span><span className="text-white font-bold">{selectedBooking.hotelDetails.name}</span></div>
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Phone</span><span className="text-white">{selectedBooking.hotelDetails.phone || "-"}</span></div>
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5 col-span-1 sm:col-span-2"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Address</span><span className="text-white">{selectedBooking.hotelDetails.address || "-"}</span></div>
                            {selectedBooking.hotelDetails.notes && <div className="bg-black/20 p-3 rounded-lg border border-white/5 col-span-1 sm:col-span-2"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Notes</span><span className="text-yellow-400">{selectedBooking.hotelDetails.notes}</span></div>}
                        </div>
                    </div>
                  )}

                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                    <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaTag /> Applied Unit Rates</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getUnitRates(selectedBooking).map((rate, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
                          <span className="text-gray-400 text-xs font-bold uppercase">{rate.label}</span>
                          <span className="text-white font-mono text-sm">{rate.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(selectedBooking.status === 'Confirmed' || selectedBooking.adminNotes) && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative hover:border-white/10 transition">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><FaMoneyBillWave /> Payment & Notes</h3>
                        <button
                          onClick={initiateConfirmation}
                          className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <span className="text-gray-400 block text-xs uppercase font-bold mb-1">Payment Type</span>
                          <span className="text-white font-bold text-lg">{selectedBooking.paymentType || 'Full'}</span>
                        </div>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                          <span className="text-gray-400 block text-xs uppercase font-bold mb-1">Amount Paid</span>
                          <span className="text-green-400 font-bold text-lg">₹{(selectedBooking.paidAmount || selectedBooking.totalPrice).toLocaleString()}</span>
                          {selectedBooking.totalPrice > (selectedBooking.paidAmount || 0) && (
                            <div className="text-red-400 text-xs mt-1 font-bold bg-red-900/20 px-2 py-0.5 rounded inline-block">
                              Due: ₹{(selectedBooking.totalPrice - (selectedBooking.paidAmount || 0)).toLocaleString()}
                            </div>
                          )}
                        </div>
                        {selectedBooking.adminNotes && (
                          <div className="col-span-1 sm:col-span-2 pt-2 border-t border-white/10">
                            <span className="text-gray-400 block text-xs uppercase font-bold mb-2">Admin Note</span>
                            <p className="text-white italic bg-black/20 p-3 rounded-lg border border-white/5">"{selectedBooking.adminNotes}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Totals & Actions */}
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 sticky top-4">
                    <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Price Breakdown</h3>

                    <div className="space-y-3 mb-6 border-b border-white/10 pb-4">
                      {getPriceBreakdown(selectedBooking).map((item, idx) => (
                        <div key={idx} className={`flex justify-between text-sm ${item.highlight ? 'text-cyan-300 font-bold pb-2 border-b border-white/5' : 'text-gray-400'}`}>
                          <span>{item.name}</span>
                          <span className={item.highlight ? 'text-white' : 'text-gray-200'}>{item.cost}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {selectedBooking.couponCode && (selectedBooking.originalPrice > selectedBooking.totalPrice) && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Subtotal</span>
                          <span className="text-gray-500 line-through text-sm">₹{selectedBooking.originalPrice.toLocaleString()}</span>
                        </div>
                      )}

                      {selectedBooking.couponCode && (selectedBooking.originalPrice > selectedBooking.totalPrice) && (
                        <div className="flex justify-between items-center text-green-400">
                          <span className="flex items-center gap-2 text-sm"><FaTicketAlt /> Coupon ({selectedBooking.couponCode})</span>
                          <span className="font-bold text-sm">- ₹{(selectedBooking.originalPrice - selectedBooking.totalPrice).toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-end pt-4 border-t border-white/10">
                        <span className="text-gray-300 font-bold">Grand Total</span>
                        <span className="text-3xl font-black text-white tracking-tight">₹{selectedBooking.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mt-6">
                        <button
                          onClick={initiateConfirmation}
                          className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle /> Update / Confirm
                        </button>
                      <button onClick={() => handleDeleteBooking(selectedBooking._id)} className="w-full py-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-xl font-bold transition flex items-center justify-center gap-2">
                        <FaTrash /> Delete Booking
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* === SIDEBAR (RESPONSIVE) === */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1e293b] p-4 z-40 flex justify-between items-center border-b border-gray-700 shadow-lg">
        <span className="font-bold text-white text-lg tracking-wide">HillWay Admin</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg"><FaBars size={24} /></button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1e293b] border-r border-gray-800 flex flex-col flex-shrink-0 transform transition-transform duration-300 shadow-2xl lg:translate-x-0 lg:static lg:inset-auto lg:w-64 lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 text-2xl font-bold text-cyan-400 tracking-wider flex justify-between items-center border-b border-gray-800 lg:border-none">
          <span>HillWay</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-white"><FaTimes size={24} /></button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          <button onClick={() => { setActiveTab('bookings'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'bookings' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaBook /> Bookings</button>
          <button onClick={() => { setActiveTab('tours'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tours' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaMapMarkerAlt /> Manage Tours</button>
          <button onClick={() => { setActiveTab('agents'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'agents' ? 'bg-purple-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaUserSecret /> Agents</button>
          <button onClick={() => { setActiveTab('coupons'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'coupons' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaTicketAlt /> Coupons</button>
          <button onClick={() => { setActiveTab('reviews'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reviews' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaCommentDots /> Reviews</button>
          <button onClick={() => { setActiveTab('pricing'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'pricing' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-400'}`}><FaTag /> Global Pricing</button>
        </nav>

        <div className="p-4 border-t border-gray-800 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-400 bg-red-900/10 hover:bg-red-900/30 font-bold transition border border-red-900/30"><FaSignOutAlt /> Logout</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto pt-20 lg:pt-8 bg-[#0f172a]">

        {activeTab === 'bookings' && (
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-white">All Bookings</h1>
              <div className="relative w-full md:w-auto">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search ID, Name, Phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 text-white focus:border-cyan-500 outline-none w-full md:w-72 shadow-sm transition" />
              </div>
            </div>
            <div className="bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                  <thead className="bg-black/20 text-gray-200 uppercase font-bold border-b border-gray-700">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Tour</th>
                      <th className="p-4">Journey Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-white/5 transition group">
                        <td className="p-4 font-mono text-cyan-300">{getBookingID(b._id)}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{b.name}</div>
                          <div className="text-xs text-gray-500">{b.phone}</div>
                        </td>
                        <td className="p-4 text-gray-300 max-w-[180px] truncate">{b.tourTitle}</td>
                        <td className="p-4 text-yellow-500 font-medium">
  {b.travelDate 
    ? new Date(b.travelDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '-'}
</td>

                        <td className="p-4 font-bold text-green-400">₹{b.totalPrice?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold border ${b.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                            {b.status || 'Pending'}
                          </span>
                        </td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button onClick={() => setSelectedBooking(b)} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition shadow-md"><FaEye /></button>
                          <button onClick={() => handleDeleteBooking(b._id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg transition"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredBookings.length === 0 && <div className="p-12 text-center text-gray-500">No bookings found matching your search.</div>}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">User Reviews</h1>
            <div className="grid gap-4">
              {allReviews.map(review => (
                <div key={review._id} className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700 shadow-md hover:border-gray-500 transition">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-cyan-900/30 text-cyan-400 px-3 py-1 rounded-lg text-xs font-bold border border-cyan-500/30 uppercase tracking-wider">{review.tourTitle}</span>
                      <span className="text-gray-500 text-xs flex items-center gap-1"><FaClock size={10} /> {review.date}</span>
                    </div>
                    <button onClick={() => handleDeleteReview(review._id, review.tourId)} className="px-4 py-2 bg-red-900/10 hover:bg-red-900/30 text-red-400 border border-red-900/20 rounded-lg text-xs font-bold transition flex items-center gap-2 whitespace-nowrap">
                      <FaTrash size={12} /> Delete Review
                    </button>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-3 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">{review.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <h3 className="font-bold text-white text-sm leading-tight">{review.name}</h3>
                          <div className="flex text-yellow-500 text-xs gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? "" : "text-gray-600"} />)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400 ml-auto">
                        {review.mobile && <span className="flex items-center gap-1.5"><FaMobileAlt className="text-gray-500" /> {review.mobile}</span>}
                        {review.email && <span className="flex items-center gap-1.5"><FaEnvelope className="text-gray-500" /> {review.email}</span>}
                      </div>
                    </div>
                    <div>
                      {review.title && <h4 className="text-white font-bold text-sm mb-1">{review.title}</h4>}
                      <p className="text-gray-300 text-sm italic leading-relaxed">"{review.text}"</p>
                    </div>
                  </div>
                </div>
              ))}
              {allReviews.length === 0 && (
                <div className="p-12 text-center text-gray-500 bg-[#1e293b] rounded-xl border border-dashed border-gray-700 flex flex-col items-center gap-2">
                  <FaCommentDots size={30} className="opacity-20" />
                  <p>No reviews posted yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Manage Agents</h1>
            <form onSubmit={handleCreateAgent} className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end shadow-lg">
              <div className="md:col-span-2"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Name</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" value={agentForm.name} onChange={e => setAgentForm({ ...agentForm, name: e.target.value })} /></div>
              <div className="md:col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Email</label><input required type="email" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" value={agentForm.email} onChange={e => setAgentForm({ ...agentForm, email: e.target.value })} /></div>
              <div className="md:col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Password</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" value={agentForm.password} onChange={e => setAgentForm({ ...agentForm, password: e.target.value })} /></div>
              <div className="md:col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Phone</label><input required className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-purple-500 outline-none" value={agentForm.phone} onChange={e => setAgentForm({ ...agentForm, phone: e.target.value })} /></div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-lg font-bold h-[48px] w-full md:w-auto shadow-lg transition mt-4 md:mt-0">Add Agent</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map(agent => (
                <div key={agent._id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-purple-500/30 transition shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div><h3 className="text-xl font-bold text-white">{agent.name}</h3><p className="text-sm text-gray-400">{agent.email}</p></div>
                    <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs font-bold border border-green-500/20">Earned: ₹{agent.totalCommission}</div>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => handleResendCreds(agent.email)} className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition">
                      <FaPaperPlane /> Resend Credentials
                    </button>
                  </div>
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
              <div className="col-span-1">
                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Discount</label>
                <div className="flex gap-2">
                  <input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="10" value={couponForm.discountValue} onChange={e => setCouponForm({ ...couponForm, discountValue: e.target.value })} />
                  <select className="bg-black/30 border border-gray-600 rounded-lg px-2 text-white text-xs" value={couponForm.discountType} onChange={e => setCouponForm({ ...couponForm, discountType: e.target.value })}><option value="PERCENTAGE">%</option><option value="FLAT">₹</option></select>
                </div>
              </div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Expiry</label><input required type="date" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm" value={couponForm.expiryDate} onChange={e => setCouponForm({ ...couponForm, expiryDate: e.target.value })} /></div>
              <div className="col-span-1"><label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Limit</label><input required type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="100" value={couponForm.usageLimit} onChange={e => setCouponForm({ ...couponForm, usageLimit: e.target.value })} /></div>
              <div className="col-span-1">
                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Assign Agent</label>
                <select className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white text-sm" value={couponForm.agentId} onChange={e => setCouponForm({ ...couponForm, agentId: e.target.value })}>
                  <option value="">-- No Agent --</option>
                  {agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}
                </select>
              </div>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold h-[48px] flex items-center justify-center gap-2"><FaPlus size={12} /> Create</button>
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
                      <div className="flex items-center justify-between text-sm"><span className="text-gray-400 flex items-center gap-2"><FaChartPie size={12} /> Used</span><span className={`font-mono font-bold ${coupon.usedCount >= coupon.usageLimit ? 'text-red-400' : 'text-white'}`}>{coupon.usedCount} / {coupon.usageLimit}</span></div>
                      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden"><div className={`h-full rounded-full ${coupon.usedCount >= coupon.usageLimit ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }} /></div>
                      <div className="flex items-center justify-between text-sm pt-1"><span className="text-gray-400 flex items-center gap-2"><FaClock size={12} /> Expires</span><span className="text-white font-medium">{new Date(coupon.expiryDate).toLocaleDateString()}</span></div>
                    </div>
                    <div className="mb-4 bg-black/20 p-2 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400"><FaUserTie /> {assignedAgent ? <span className="text-purple-300 font-bold">{assignedAgent.name}</span> : "Unassigned"}</div>
                      <select className="bg-transparent text-xs text-cyan-400 border-none outline-none text-right cursor-pointer" value={coupon.agentId || ""} onChange={(e) => handleUpdateCouponAgent(coupon._id, e.target.value)}>
                        <option value="">Re-assign</option>
                        <option value="">None</option>
                        {agents.map(ag => <option key={ag._id} value={ag._id}>{ag.name}</option>)}
                      </select>
                    </div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Stay Policy / Note</label>
                  <textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="e.g. Check-in 12:00 PM, Extra Mattress available..." value={globalPrices.stayNote || ''} onChange={e => setGlobalPrices({ ...globalPrices, stayNote: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Food Policy / Note</label>
                  <textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" placeholder="e.g. Vegetarian only, Buffet timing..." value={globalPrices.foodNote || ''} onChange={e => setGlobalPrices({ ...globalPrices, foodNote: e.target.value })} />
                </div>
              </div>
            </div>
            <button onClick={handleSaveGlobalPricing} className="mt-8 w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold shadow-lg">Save Global Prices & Notes</button>
          </div>
        )}

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
                    <img src={(tour.images && tour.images.length > 0) ? tour.images[0] : (tour.img || '/placeholder.jpg')} className="w-full h-full object-cover" alt={tour.title} />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">₹{tour.basePrice}</div>
                    {tour.images && tour.images.length > 1 && (
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <FaImages /> {tour.images.length}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition">{tour.title}</h3>
                    
                    {/* DISPLAY TAGS */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tour.tags?.map(tag => (
                            <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5">{tag}</span>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
                      <button onClick={() => handleEdit(tour)} className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center gap-1"><FaEdit /> Edit</button>
                      <button onClick={() => handleDeleteTour(tour._id)} className="text-red-400 hover:text-red-300 text-sm font-bold flex items-center gap-1"><FaTrash /> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Gallery Images</label>
                    <div className="flex gap-3">
                      <label className="flex-1 flex items-center justify-center p-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg cursor-pointer transition">
                        {uploadingImg ? <FaSpinner className="animate-spin" /> : <><FaCamera className="mr-2" /> Upload Images</>}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImg} />
                      </label>
                      {form.images?.length > 0 && (
                        <button type="button" onClick={() => setShowImagePreview(!showImagePreview)} className="px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold">
                          {showImagePreview ? "Hide" : "View"}
                        </button>
                      )}
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

              {/* NEW: TOUR TAGS SELECTOR */}
              <section className="bg-black/20 p-6 rounded-xl border border-gray-700">
                <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">Tour Tags</h3>
                <div className="flex flex-wrap gap-3">
                    {AVAILABLE_TAGS.map(tag => {
                        const isActive = form.tags?.includes(tag);
                        return (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                    const newTags = isActive 
                                        ? form.tags.filter(t => t !== tag) 
                                        : [...(form.tags || []), tag];
                                    updateField('tags', newTags);
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                    isActive 
                                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-900/50' 
                                        : 'bg-transparent text-gray-400 border-gray-600 hover:border-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {tag} {isActive && '✓'}
                            </button>
                        )
                    })}
                </div>
              </section>

              <section className="bg-black/20 p-6 rounded-xl border border-gray-700">
                <div className="grid grid-cols-4 gap-4">
                  <div><label className="block text-sm font-medium text-gray-300">Price</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.basePrice} onChange={e => updateField('basePrice', e.target.value)} /></div>
                  <div><label className="block text-sm font-medium text-gray-300">Nights</label><input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.nights} onChange={e => updateField('nights', e.target.value)} /></div>
                  <div><label className="block text-sm font-medium text-gray-300">Rating</label><input type="number" step="0.1" className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white" value={form.rating} onChange={e => updateField('rating', e.target.value)} /></div>
                  <div className="flex items-center gap-3 pt-6"><input type="checkbox" className="w-5 h-5 accent-cyan-500" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} /><label className="font-bold text-white">Featured</label></div>
                </div>
              </section>

              <section className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30">
                <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2"><FaEdit /> Specific Costs</h3>
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
                <div className="flex justify-between mb-4"><h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FaList /> Itinerary & Meals</h3><button type="button" onClick={addItineraryDay} className="text-sm bg-cyan-600 text-white px-3 py-1 rounded">+ Add</button></div>
                <div className="space-y-4">{form.itinerary.map((day, i) => (
                  <div key={i} className="bg-black/20 p-4 rounded-lg border border-gray-700 relative">
                    <button type="button" onClick={() => setForm(p => ({ ...p, itinerary: p.itinerary.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 text-red-400 text-xs">Remove</button>
                    <div className="grid grid-cols-1 gap-2">
                      <input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={day.title} onChange={e => updateItinerary(i, 'title', e.target.value)} placeholder="Title" />
                      <textarea className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white" value={day.details} onChange={e => updateItinerary(i, 'details', e.target.value)} placeholder="Details" />

                      <div className="flex items-center gap-2 mt-2">
                        <FaBed className="text-gray-400" />
                        <input className="w-full bg-black/30 border border-gray-600 rounded p-2 text-white text-sm" value={day.stay || ''} onChange={e => updateItinerary(i, 'stay', e.target.value)} placeholder="Stay Details (e.g. Hotel Tashi, Gangtok)" />
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
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2"><FaCheck /> Inclusions</h3>
                  <textarea rows={6} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white"
                    value={form.inclusions.join(', ')}
                    onChange={e => updateField('inclusions', e.target.value.split(',').map(s => s.trim()))}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2"><FaQuestionCircle /> FAQs</h3>
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