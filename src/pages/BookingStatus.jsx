import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch, FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt,
  FaUserFriends, FaMoneyBillWave, FaCheckCircle, FaTimesCircle,
  FaClock, FaShareAlt, FaLink, FaCopy, FaArrowRight, FaEye, FaHotel, FaMapPin, FaPhone
} from "react-icons/fa";

export default function BookingStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [refId, setRefId] = useState(searchParams.get("refId") || "");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // UPDATED: Fetch from Live Backend
  const fetchBookingStatus = async (refVal) => {
    if (!refVal) {
      setError("Please provide a Reference ID.");
      return;
    }
    setLoading(true);
    setError("");
    setBooking(null);

    try {
      let url = `https://admin.hillway.in/api/bookings/status?refId=${encodeURIComponent(refVal)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setBooking(data.data);
        const shortId = data.data._id.slice(-6).toUpperCase();
        setSearchParams({ refId: shortId }, { replace: true });
        setRefId(shortId);
      } else {
        setError(data.error || "Booking not found.");
      }
    } catch (err) {
      setError("Failed to connect. Please check your internet.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const urlRef = searchParams.get("refId");
    if (urlRef) fetchBookingStatus(urlRef);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookingStatus(refId);
  };

  const handleInputChange = (e) => {
    let val = e.target.value.toUpperCase();
    if (val && !val.startsWith("#HW-")) {
      if (val.startsWith("HW-")) val = "#" + val;
      else if (val.startsWith("#HW")) val = val;
      else val = "#HW-" + val.replace(/^(#HW-|HW-|#)/, "");
    }
    setRefId(val);
  };

  const handleCopyLink = () => {
    if (!booking) return;
    const shortId = booking._id.slice(-6).toUpperCase();
    const link = `${window.location.origin}/status?refId=${shortId}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]';
      case 'Cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_15px_rgba(248,113,113,0.1)]';
      default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <FaCheckCircle />;
      case 'Cancelled': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const handleTourClick = () => {
      if (booking?.tourId) {
          navigate(`/tours/${booking.tourId}`);
      } else {
          alert("Tour link not available for this booking.");
      }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 text-white font-inter selection:bg-[#D9A441] selection:text-black overflow-hidden relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-900/20 blur-[120px] rounded-full animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-amber-600/10 blur-[120px] rounded-full animate-pulse duration-[8s]" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black font-montserrat tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 drop-shadow-sm">Track Your Journey</h1>
          <p className="text-gray-400 text-base md:text-lg font-light">Enter your Booking ID to see real-time updates.</p>
        </motion.div>

        {/* Search Input */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }} className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500" />
            <div className="relative flex items-center bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl transition-all focus-within:border-cyan-500/50 focus-within:bg-[#1e293b]">
              <div className="pl-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors"><FaTicketAlt size={18} /></div>
              <input type="text" placeholder="#HW-A1B2C3" value={refId} onChange={handleInputChange} onFocus={() => !refId && setRefId("#HW-")} className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 outline-none font-mono tracking-wider text-lg uppercase" />
              <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white p-3 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <FaClock className="animate-spin" /> : <FaArrowRight />}
              </button>
            </div>
          </form>
          {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center flex items-center justify-center gap-2"><FaTimesCircle /> {error}</motion.div>}
        </motion.div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {booking && (
            <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 150, damping: 20 }} className="bg-[#1e293b]/60 backdrop-blur-md border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="relative p-8 border-b border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex-1">
                    <h2 onClick={handleTourClick} className="text-3xl font-black text-white mb-2 tracking-tight cursor-pointer hover:text-cyan-400 transition-colors duration-300 decoration-cyan-500/30 underline-offset-4 hover:underline">{booking.tourTitle}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-mono text-gray-400 tracking-widest">#HW-{booking._id.slice(-6).toUpperCase()}</span>
                      <span className="text-gray-500 text-xs">• Booked on {new Date(booking.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button onClick={handleTourClick} className="mt-4 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1.5 rounded-lg hover:bg-cyan-500/20 transition flex items-center gap-2 w-fit"><FaEye /> View Tour Details</button>
                  </div>
                  <div className={`px-5 py-2 rounded-full border flex items-center gap-2.5 text-sm font-bold uppercase tracking-wide shadow-xl backdrop-blur-sm shrink-0 ${getStatusColor(booking.status)}`}>{getStatusIcon(booking.status)}{booking.status || 'Pending'}</div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors"><div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 text-lg"><FaCalendarAlt /></div><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Travel Date</p><p className="text-white font-bold text-lg">{new Date(booking.travelDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors"><div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 text-lg"><FaUserFriends /></div><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Passengers</p><p className="text-white font-bold text-lg">{booking.adults} Adults, {booking.children} Kids</p></div>
                  <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors"><div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 text-lg"><FaMapMarkerAlt /></div><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Transport</p><p className="text-white font-bold text-lg capitalize">{booking.transport === 'personal' ? 'Private Cab' : 'Shared'}</p></div>
                </div>

                {/* HOTEL DETAILS */}
                {booking.status === 'Confirmed' && booking.hotelDetails && booking.hotelDetails.name && (
                    <div className="bg-blue-900/10 border border-blue-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10 text-blue-400 text-6xl"><FaHotel /></div>
                        <h3 className="text-blue-400 font-bold mb-6 flex items-center gap-2 relative z-10"><FaHotel /> Assigned Hotel</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            <div><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Hotel Name</p><p className="text-white font-bold text-lg">{booking.hotelDetails.name}</p></div>
                            <div><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Contact Phone</p><p className="text-white font-medium flex items-center gap-2"><FaPhone className="text-xs"/> {booking.hotelDetails.phone || "N/A"}</p></div>
                            <div className="md:col-span-2"><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Address</p><p className="text-gray-300 text-sm flex items-start gap-2"><FaMapPin className="text-blue-400 mt-1 shrink-0"/> {booking.hotelDetails.address || "N/A"}</p></div>
                            {booking.hotelDetails.notes && (<div className="md:col-span-2 bg-black/20 p-4 rounded-xl border border-white/5"><p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Stay Note</p><p className="text-yellow-400 text-sm italic">"{booking.hotelDetails.notes}"</p></div>)}
                        </div>
                    </div>
                )}

                <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5">
                  <h3 className="text-gray-300 font-bold mb-6 flex items-center gap-2"><FaCheckCircle className="text-cyan-500" /> Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3"><span className="text-gray-400 text-sm">Primary Guest</span><span className="text-white font-medium">{booking.name}</span></div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-3"><span className="text-gray-400 text-sm">Room Plan</span><span className="text-white font-medium capitalize">{booking.rooms}x {booking.roomType} Room</span></div>
                    
                    {/* UPDATED: Payment Status Logic */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">Payment Status</span>
                      <span className={`font-bold ${
                        booking.paymentType === 'Unpaid' ? 'text-red-400' : 
                        (booking.paymentType === 'Partial' && booking.paidAmount < booking.totalPrice) ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {(() => {
                          if (booking.paymentType === 'Unpaid') return `Unpaid (Due: ₹${booking.totalPrice.toLocaleString()})`;
                          if (booking.paymentType === 'Partial' && booking.paidAmount < booking.totalPrice) return `Partial (Due: ₹${(booking.totalPrice - booking.paidAmount).toLocaleString()})`;
                          return 'Fully Paid';
                        })()}
                      </span>
                    </div>

                  </div>
                  <div className="mt-6 pt-6 border-t border-dashed border-white/10 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <span className="text-gray-400 text-sm font-medium">Total Trip Value</span>
                    <div className="text-right">
                      {booking.originalPrice > booking.totalPrice && (<span className="block text-xs text-gray-500 line-through mb-1">₹{booking.originalPrice.toLocaleString()}</span>)}
                      <span className="text-4xl font-black text-white tracking-tighter flex items-center gap-1"><span className="text-2xl text-gray-500 font-medium">₹</span> {booking.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {booking.adminNotes && (<div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex items-start gap-4"><div className="mt-1 text-blue-400 text-xl"><FaLink /></div><div><p className="text-xs text-blue-300 font-bold uppercase mb-1">Update from Team</p><p className="text-sm text-blue-100 leading-relaxed">"{booking.adminNotes}"</p></div></div>)}

                <button onClick={handleCopyLink} className="w-full py-4 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-2xl transition flex items-center justify-center gap-2 border border-white/10 active:scale-95">{linkCopied ? <FaCheckCircle className="text-green-400" /> : <FaShareAlt />}{linkCopied ? "Link Copied!" : "Share Booking Status"}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}