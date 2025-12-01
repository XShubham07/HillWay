import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, 
  FaUserFriends, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, 
  FaClock, FaShareAlt, FaLink, FaCopy, FaPaste
} from "react-icons/fa";

export default function BookingStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tabs: 'details' or 'link'
  const [activeTab, setActiveTab] = useState("details");

  // Inputs
  const [refId, setRefId] = useState(searchParams.get("refId") || "");
  const [linkInput, setLinkInput] = useState("");
  
  // Data State
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // --- CORE FETCH LOGIC ---
  const fetchBookingStatus = async (refVal, phoneVal = null) => {
    if (!refVal) {
      setError("Please provide a Reference ID.");
      return;
    }

    setLoading(true);
    setError("");
    setBooking(null);

    try {
      // Build query params
      let url = `/api/bookings/status?refId=${encodeURIComponent(refVal)}`;
      if (phoneVal) url += `&phone=${encodeURIComponent(phoneVal)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setBooking(data.data);
        const shortId = data.data._id.slice(-6).toUpperCase();
        
        // Update URL to reflect the found booking
        setSearchParams({ refId: shortId }, { replace: true });
        
        // Sync input
        setRefId(shortId);
      } else {
        setError(data.error || "Booking not found.");
      }
    } catch (err) {
      setError("Failed to connect. Please check your internet.");
    }
    setLoading(false);
  };

  // 1. Auto-fetch on Load
  useEffect(() => {
    const urlRef = searchParams.get("refId");
    const urlPhone = searchParams.get("phone"); // Still support phone from link if present
    if (urlRef) {
      fetchBookingStatus(urlRef, urlPhone);
    }
  }, []);

  // 2. Manual Search (Details Tab - ID ONLY)
  const handleDetailsSearch = (e) => {
    e.preventDefault();
    fetchBookingStatus(refId);
  };

  // 3. Manual Search (Link Tab)
  const handleLinkSearch = (e) => {
    e.preventDefault();
    try {
      const urlObj = new URL(linkInput);
      const r = urlObj.searchParams.get("refId");
      const p = urlObj.searchParams.get("phone"); // Optional now
      
      if (r) {
        fetchBookingStatus(r, p);
      } else {
        setError("Invalid link. Reference ID missing.");
      }
    } catch (err) {
      setError("Please enter a valid URL.");
    }
  };

  // 4. Copy Result Link
  const handleCopyLink = () => {
    if (!booking) return;
    const shortId = booking._id.slice(-6).toUpperCase();
    // Generate link with just refId for simplicity, or include phone if you want stricter sharing
    const link = `${window.location.origin}/status?refId=${shortId}`;
    
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // --- HELPERS ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <FaCheckCircle />;
      case 'Cancelled': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 bg-[#0f172a] text-white font-inter selection:bg-[#D9A441] selection:text-black">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0891b2] opacity-10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D9A441] opacity-10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat tracking-tight mb-3">
            Track Your <span className="text-[#D9A441]">Journey</span>
          </h1>
          <p className="text-gray-400 text-sm">Check status via ID or Link</p>
        </div>

        {/* --- TRACKING CARD --- */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-3xl shadow-2xl mb-8">
          
          {/* Tabs */}
          <div className="flex p-1 bg-black/20 rounded-[22px] mb-2">
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'details' ? 'bg-[#1e293b] text-white shadow-lg border border-white/10' : 'text-gray-400 hover:text-white'}`}
            >
              <FaTicketAlt /> Booking ID
            </button>
            <button 
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'link' ? 'bg-[#1e293b] text-white shadow-lg border border-white/10' : 'text-gray-400 hover:text-white'}`}
            >
              <FaLink /> Via Link
            </button>
          </div>

          <div className="p-5">
            {/* OPTION 1: DETAILS FORM (ID ONLY) */}
            {activeTab === 'details' && (
              <form onSubmit={handleDetailsSearch} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Reference ID</label>
                  <div className="relative group">
                    <FaTicketAlt className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#D9A441] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="e.g. HW-A1B2C3" 
                      value={refId}
                      onChange={(e) => setRefId(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A441]/50 focus:ring-1 focus:ring-[#D9A441]/50 transition-all font-mono tracking-wide"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#0891b2] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0891b2] text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <><FaSearch /> Check Status</>}
                </button>
              </form>
            )}

            {/* OPTION 2: LINK FORM */}
            {activeTab === 'link' && (
              <form onSubmit={handleLinkSearch} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Paste Tracking Link</label>
                  <div className="relative group">
                    <FaPaste className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#D9A441] transition-colors" />
                    <input 
                      type="url" 
                      placeholder="https://hillway.in/status?refId=..." 
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A441]/50 focus:ring-1 focus:ring-[#D9A441]/50 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#D9A441] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#D9A441] text-black font-bold py-4 rounded-xl shadow-lg shadow-yellow-900/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span> : <><FaSearch /> Track Via Link</>}
                </button>
              </form>
            )}
          </div>

          {error && (
            <div className="px-6 pb-6 animate-in fade-in zoom-in duration-300">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-bold">
                {error}
              </div>
            </div>
          )}
        </div>

        {/* --- RESULT CARD --- */}
        <AnimatePresence mode="wait">
          {booking && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={handleCopyLink}
                className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white/80 hover:text-white px-3 py-1.5 rounded-full text-xs font-bold transition-all border border-white/10 backdrop-blur-md"
              >
                {linkCopied ? (
                  <>
                    <FaCheckCircle className="text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <FaShareAlt />
                    <span>Share Status</span>
                  </>
                )}
              </button>

              <div className="bg-white/5 p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1 pr-24">{booking.tourTitle}</h2>
                  <p className="text-xs text-gray-400 font-mono">ID: #HW-{booking._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold shadow-lg ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status || 'Pending'}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Travel Date</p>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <FaCalendarAlt className="text-[#D9A441]" />
                      {new Date(booking.travelDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Travelers</p>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <FaUserFriends className="text-[#D9A441]" />
                      {booking.adults} Adults, {booking.children} Kids
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition">
                    <span className="text-gray-400 text-sm">Customer Name</span>
                    <span className="font-medium">{booking.name}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition">
                    <span className="text-gray-400 text-sm">Transport Mode</span>
                    <span className="font-medium capitalize">{booking.transport === 'personal' ? 'Private Cab' : 'Shared'}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition">
                    <span className="text-gray-400 text-sm">Payment Status</span>
                    <span className="font-medium">
                        {booking.paymentType === 'Partial' && booking.paidAmount < booking.totalPrice 
                            ? <span className="text-yellow-400">Partial (Due: ₹{(booking.totalPrice - booking.paidAmount).toLocaleString()})</span> 
                            : <span className="text-green-400">Full Paid</span>
                        }
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-6 border-t border-dashed border-white/10 flex justify-between items-end">
                  <span className="text-gray-400 text-sm font-medium">Total Booking Value</span>
                  <div className="text-right">
                    {booking.originalPrice > booking.totalPrice && (
                      <span className="block text-xs text-gray-500 line-through mb-0.5">₹{booking.originalPrice.toLocaleString()}</span>
                    )}
                    <span className="text-3xl font-black text-[#D9A441] tracking-tight flex items-center gap-1">
                      <FaMoneyBillWave className="text-xl" /> ₹{booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {booking.adminNotes && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                    <p className="text-xs text-blue-300 font-bold uppercase mb-1">Note from Admin</p>
                    <p className="text-sm text-blue-100 italic">"{booking.adminNotes}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}