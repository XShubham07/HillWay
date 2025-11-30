import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaTicketAlt, FaPhone, FaMapMarkerAlt, FaCalendarAlt, 
  FaUserFriends, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaClock 
} from "react-icons/fa";

export default function BookingStatus() {
  const [phone, setPhone] = useState("");
  const [refId, setRefId] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBooking(null);

    try {
      const res = await fetch(`/api/bookings/status?phone=${encodeURIComponent(phone)}&refId=${encodeURIComponent(refId)}`);
      const data = await res.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to connect. Please try again.");
    }
    setLoading(false);
  };

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
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0891b2] opacity-10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D9A441] opacity-10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-montserrat tracking-tight mb-3">
            Track Your <span className="text-[#D9A441]">Journey</span>
          </h1>
          <p className="text-gray-400 text-sm">Enter your booking details to view current status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Booking Reference ID</label>
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

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
              <div className="relative group">
                <FaPhone className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#D9A441] transition-colors" />
                <input 
                  type="tel" 
                  placeholder="Registered Mobile Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D9A441]/50 focus:ring-1 focus:ring-[#D9A441]/50 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#0891b2] to-[#0284c7] hover:from-[#0284c7] hover:to-[#0891b2] text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-900/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <><FaSearch /> Check Status</>}
            </button>
          </form>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {booking && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Card Header */}
              <div className="bg-white/5 p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{booking.tourTitle}</h2>
                  <p className="text-xs text-gray-400 font-mono">ID: #HW-{booking._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold shadow-lg ${getStatusColor(booking.status)}`}>
                  {getStatusIcon(booking.status)}
                  {booking.status || 'Pending'}
                </div>
              </div>

              {/* Card Body */}
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

                {/* Total Price */}
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

                {/* Admin Note (Optional) */}
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