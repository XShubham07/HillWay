import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "../components/SEO";
import {
  FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaShareAlt, FaEye,
  FaPrint, FaUser, FaCalendarAlt, FaWallet, FaRegSun, FaStickyNote,
  FaUtensils, FaRoute, FaMountain, FaHotel, FaMapPin, FaPhone,
  FaUserFriends, FaCar, FaChevronDown, FaChevronUp, FaBed, FaCheck, FaTimes,
  FaTicketAlt, FaMapMarkerAlt, FaUsers, FaChild
} from "react-icons/fa";

function getDatesInRange(startDate, endDate) {
  const dates = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

export default function BookingStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [tourDetails, setTourDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);

  // UPDATED: Now accepts tourTitle to handle "Old ID" cases
  const fetchTourDetails = async (tourId, tourTitle) => {
    try {
      let fetchedTour = null;

      // 1. Try fetching by ID first
      if (tourId) {
        try {
          const res = await fetch(`https://admin.hillway.in/api/tours/${tourId}`);
          const data = await res.json();
          if (data.success && data.data) {
            fetchedTour = data.data;
          }
        } catch (e) {
          console.warn("Tour ID fetch failed, trying fallback...");
        }
      }

      // 2. Fallback: If ID fetch failed or returned nothing, find by Title (Fresh Package)
      if (!fetchedTour && tourTitle) {
        const res = await fetch(`https://admin.hillway.in/api/tours`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          fetchedTour = data.data.find(t => t.title === tourTitle);
        }
      }

      if (fetchedTour) setTourDetails(fetchedTour);

    } catch (err) {
      console.error('Failed to fetch tour details:', err);
    }
  };

  const fetchBookingStatus = async (refVal) => {
    if (!refVal || refVal === "#HW-") {
      setError("Please enter your Booking ID.");
      return;
    }
    setLoading(true);
    setError("");
    setBooking(null);
    setTourDetails(null);

    try {
      const cleanId = refVal.replace(/^(#HW-|HW-|#)/, '');
      const res = await fetch(`https://admin.hillway.in/api/bookings/status?refId=${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (data.success && data.data) {
        setBooking(data.data);
        const shortId = data.data._id.slice(-6).toUpperCase();
        setSearchParams({ refId: shortId }, { replace: true });

        // UPDATED: Pass both ID and Title
        await fetchTourDetails(data.data.tourId, data.data.tourTitle);
      } else {
        setError(data.error || "Booking not found. Please check your Booking ID.");
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Failed to connect. Please check your internet connection.");
    }
    setLoading(false);
  };

  useEffect(() => {
    const urlRef = searchParams.get("refId");
    if (urlRef) {
      setBookingId("#HW-" + urlRef);
      fetchBookingStatus(urlRef);
    } else {
      setBookingId("#HW-");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookingStatus(bookingId);
  };

  const handleInputChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith("#HW-")) val = "#HW-";
    setBookingId(val.toUpperCase());
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
      case 'Confirmed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Cancelled': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Confirmed': return <FaCheckCircle />;
      case 'Cancelled': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const toggleDay = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const getMealsToDisplay = (day) => {
    if (!day) return [];

    const hasMealAddon = booking?.addons?.meal === true;
    const meals = [];

    if (day.breakfast?.text && day.breakfast.text.trim()) {
      if (day.breakfast.override === true || hasMealAddon) {
        meals.push(day.breakfast.text.trim());
      }
    }

    if (day.lunch?.text && day.lunch.text.trim()) {
      if (day.lunch.override === true || hasMealAddon) {
        meals.push(day.lunch.text.trim());
      }
    }

    if (day.dinner?.text && day.dinner.text.trim()) {
      if (day.dinner.override === true || hasMealAddon) {
        meals.push(day.dinner.text.trim());
      }
    }

    return meals;
  };

  const renderItinerary = () => {
    if (!booking || !tourDetails?.itinerary) {
      if (booking?.remarks) return renderBasicItinerary();
      return <p className="text-sm text-gray-400 text-center py-4">No itinerary available.</p>;
    }

    const startDate = new Date(booking.roomBookingFrom || booking.travelDate);
    const dates = getDatesInRange(startDate, new Date(startDate.getTime() + (tourDetails.itinerary.length - 1) * 24 * 60 * 60 * 1000));

    return (
      <div className="space-y-3">
        {tourDetails.itinerary.map((day, index) => {
          const date = dates[index];
          const dateStr = date?.toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short'
          }) || '';
          const isExpanded = expandedDay === index;
          const mealsToShow = getMealsToDisplay(day);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-[#D9A441]/30 transition-all">

                <button
                  onClick={() => toggleDay(index)}
                  className="w-full p-3 md:p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#D9A441] to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-sm md:text-base">{day.day}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-bold text-sm md:text-base truncate">{day.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] md:text-xs bg-[#D9A441]/10 text-[#D9A441] px-2 py-0.5 rounded-md border border-[#D9A441]/20 font-semibold">
                        {dateStr}
                      </span>
                      {mealsToShow.length > 0 && (
                        <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md border border-green-500/20 font-semibold flex items-center gap-1">
                          <FaUtensils className="text-[8px]" /> {mealsToShow.length} Meal{mealsToShow.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {(day.accommodation || day.stay) && (
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md border border-purple-500/20 font-semibold flex items-center gap-1">
                          <FaBed className="text-[8px]" /> Stay
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <FaChevronDown className="text-sm" />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 md:px-4 pb-4 space-y-3 border-t border-white/10 pt-3">

                        {/* Description with Bullet Points */}
                        {day.details && (
                          <ul className="space-y-2">
                            {day.details.split('\n').filter(l => l.trim()).map((line, idx) => (
                              <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-gray-300 leading-relaxed">
                                <span className="text-[#D9A441] mt-1.5 text-[6px] shrink-0 opacity-70">●</span>
                                <span>{line.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Places Grid */}
                        {day.places && day.places.length > 0 && (
                          <div className="bg-cyan-500/5 rounded-lg p-3 border border-cyan-500/20">
                            <p className="text-[10px] md:text-xs text-cyan-400 font-bold mb-2 flex items-center gap-1.5">
                              <FaRoute className="text-[10px]" /> Places to Visit
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {day.places.map((place, i) => (
                                <span key={i} className="text-[10px] bg-cyan-500/10 text-cyan-300 px-2 py-1 rounded-md border border-cyan-500/20 font-medium">
                                  {place}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Stay Info */}
                        {(day.accommodation || day.stay) && (
                          <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
                            <p className="text-[10px] md:text-xs text-purple-400 font-bold mb-1.5 flex items-center gap-1.5">
                              <FaBed className="text-[10px]" /> Accommodation
                            </p>
                            <p className="text-purple-300 text-xs">{day.accommodation || day.stay}</p>
                          </div>
                        )}

                        {/* Meals Info */}
                        {mealsToShow.length > 0 && (
                          <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/20">
                            <p className="text-[10px] md:text-xs text-green-400 font-bold mb-2 flex items-center gap-1.5">
                              <FaUtensils className="text-[10px]" /> Meals Included
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {mealsToShow.map((meal, i) => (
                                <span key={i} className="text-[10px] bg-green-500/10 text-green-300 px-2 py-1 rounded-md border border-green-500/20 font-medium capitalize">
                                  {meal}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderBasicItinerary = () => {
    if (!booking?.remarks) return null;
    const startDate = new Date(booking.roomBookingFrom || booking.travelDate);
    const itineraryLines = booking.remarks.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const dates = getDatesInRange(startDate, new Date(startDate.getTime() + (itineraryLines.length - 1) * 24 * 60 * 60 * 1000));

    return (
      <div className="space-y-3">
        {itineraryLines.map((line, index) => {
          const date = dates[index];
          const dateStr = date?.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) || '';
          const cleanedLine = line.replace(/^\d{1,2}\.\d{1,2}\.\d{2,4}:\s*/, '');
          const isExpanded = expandedDay === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl overflow-hidden hover:border-[#D9A441]/30 transition-all">
                <button
                  onClick={() => toggleDay(index)}
                  className="w-full p-3 md:p-4 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#D9A441] to-amber-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-sm md:text-base">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-sm md:text-base">Day {index + 1}</span>
                    </div>
                    <span className="text-[10px] md:text-xs bg-[#D9A441]/10 text-[#D9A441] px-2 py-0.5 rounded-md border border-[#D9A441]/20 font-semibold inline-block">
                      {dateStr}
                    </span>
                  </div>
                  <div className={`text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <FaChevronDown className="text-sm" />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 md:px-4 pb-4 border-t border-white/10 pt-3">
                        <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{cleanedLine}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #booking-slip, #booking-slip * { visibility: visible; }
          #booking-slip { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-screen pt-32 pb-20 px-4 text-white font-inter relative overflow-hidden no-print">
        <SEO title="Booking Status - HillWay" description="Check your HillWay booking status." />
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-900/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-amber-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black font-montserrat tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Track Your Journey
            </h1>
            <p className="text-gray-400 text-sm">Enter your Booking ID to view complete details</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }} className="mb-10">
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative">
                <input type="text" value={bookingId} onChange={handleInputChange} placeholder="#HW-A1B2C3" className="w-full bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-2xl pl-6 pr-32 py-4 text-white placeholder-gray-500 outline-none font-mono tracking-wider text-lg focus:border-cyan-500/50 transition-all shadow-xl" />
                <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 flex items-center gap-2">
                  {loading ? <FaClock className="animate-spin" /> : <FaSearch />}
                  <span className="hidden sm:inline">{loading ? 'Searching' : 'Track'}</span>
                </button>
              </div>
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">{error}</motion.div>}
            </form>
          </motion.div>

          <AnimatePresence mode="wait">
            {booking && (
              <motion.div key="booking" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ type: "spring", stiffness: 150, damping: 20 }} className="bg-gradient-to-br from-[#0e3b30] to-[#1a4f42] border border-green-700/50 rounded-3xl shadow-2xl overflow-hidden">

                {/* Header Section */}
                <div className="relative p-6 md:p-8 border-b border-white/10 bg-gradient-to-r from-[#1F4F3C]/50 to-[#0e3b30]/50">
                  <div className="absolute top-6 right-6 flex items-center gap-2">
                    {/* UPDATED BUTTON: Uses Slug URL logic */}
                    {(tourDetails?._id || booking.tourId) && (
                      <button
                        onClick={() => navigate(`/tours/${tourDetails?.slug || tourDetails?._id || booking.tourId}`)}
                        className="w-9 h-9 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 flex items-center justify-center transition-all hover:scale-110"
                        title="View Tour"
                      >
                        <FaEye className="text-sm" />
                      </button>
                    )}
                    <button onClick={handleCopyLink} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center justify-center transition-all hover:scale-110" title="Share">{linkCopied ? <FaCheckCircle className="text-sm text-green-400" /> : <FaShareAlt className="text-sm" />}</button>
                    <button onClick={() => window.print()} className="w-9 h-9 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 flex items-center justify-center transition-all hover:scale-110" title="Print"><FaPrint className="text-sm" /></button>
                  </div>
                  <div className="mb-6 pr-32"><h1 className="text-2xl md:text-3xl font-black text-white font-montserrat mb-1">HillWay<span className="text-[#D9A441]">.in</span></h1><p className="text-xs text-gray-400">Your Way to the Mountains</p></div>
                  <div className="flex items-center justify-between mb-4"><div><p className="text-xs text-gray-400 mb-1">Booking ID</p><p className="text-lg font-bold text-white font-mono">#HW-{booking._id.slice(-6).toUpperCase()}</p><p className="text-xs text-gray-500 mt-1">{new Date(booking.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p></div><div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold uppercase ${getStatusColor(booking.status)}`}>{getStatusIcon(booking.status)}{booking.status || 'Confirmed'}</div></div>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">{booking.tourTitle}</h2>
                  {/* Starting Point - Always show */}
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <FaMapMarkerAlt className="text-[#D9A441]" />
                    <span className="text-gray-400">Starting from:</span>
                    <span className="text-white font-semibold">{booking.startingPoint || 'Siliguri'}</span>
                  </div>
                </div>

                {/* Hotel Details */}
                {booking.status === 'Confirmed' && booking.hotelDetails?.name && (
                  <div className="p-6 md:p-8 border-b border-white/10"><div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5"><div className="flex items-center gap-2 mb-4"><FaHotel className="text-blue-400" /><h3 className="text-blue-400 font-bold">Assigned Hotel</h3></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><p className="text-xs text-gray-400 mb-1">Hotel Name</p><p className="text-white font-semibold">{booking.hotelDetails.name}</p></div><div><p className="text-xs text-gray-400 mb-1">Contact</p><p className="text-white font-semibold flex items-center gap-2"><FaPhone className="text-xs" />{booking.hotelDetails.phone || "N/A"}</p></div>{booking.hotelDetails.address && <div className="md:col-span-2"><p className="text-xs text-gray-400 mb-1">Address</p><p className="text-gray-300 text-sm flex items-start gap-2"><FaMapPin className="text-blue-400 mt-1 text-xs" />{booking.hotelDetails.address}</p></div>}</div></div></div>
                )}

                {/* Main Content Grid */}
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6">

                  {/* Left Column - Guest, Booking Info & Policies */}
                  <div className="lg:col-span-2 space-y-5">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10"><div className="flex items-center gap-2 mb-4"><FaUser className="text-[#D9A441]" /><h3 className="font-bold text-white">Guest Information</h3></div><div className="space-y-3"><div><p className="text-xs text-gray-400 mb-1">Name</p><p className="text-white font-semibold">{booking.name}</p></div>{booking.phone && <div><p className="text-xs text-gray-400 mb-1">Phone</p><p className="text-white font-semibold">{booking.phone}</p></div>}{booking.email && <div><p className="text-xs text-gray-400 mb-1">Email</p><p className="text-white font-semibold text-sm break-all">{booking.email}</p></div>}</div></div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <FaCalendarAlt className="text-[#D9A441]" />
                        <h3 className="font-bold text-white">Booking Details</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-amber-400 text-sm" />
                            <span className="text-gray-400 text-sm">Travel Date</span>
                          </div>
                          <span className="text-white font-semibold text-sm">
                            {new Date(booking.travelDate || booking.roomBookingFrom).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaUserFriends className="text-cyan-400 text-sm" />
                            <span className="text-gray-400 text-sm">Passengers</span>
                          </div>
                          <span className="text-white font-semibold text-sm">{booking.adults} Adults, {booking.children} Kids</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaCar className="text-purple-400 text-sm" />
                            <span className="text-gray-400 text-sm">Transport</span>
                          </div>
                          <span className="text-white font-semibold text-sm capitalize">
                            {booking.transport === 'personal' ? 'Private' : booking.transport === 'self' ? 'Self / Own' : 'Shared'}
                          </span>
                        </div>
                        {/* Adults & Kids Pricing */}

                        <div className="pt-3 border-t border-white/10 space-y-2">
                          <span className="text-gray-400 text-sm">Price Breakdown </span>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaUsers className="text-green-400 text-sm" />
                              <span className="text-white text-sm">Total Price </span>
                            </div>
                            <span className="text-green-400 font-bold text-sm">
                              ₹{(booking.priceBreakdown?.adultsTotal || booking.priceBreakdown?.basePrice || Math.round((booking.originalPrice || booking.totalPrice || 0) - ((tourDetails?.kidsPrice || 0) * booking.children))).toLocaleString()}
                            </span>
                          </div>
                          {booking.children > 0 && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FaChild className="text-pink-400 text-sm" />
                                <span className="text-gray-400 text-sm">
                                  Kids ({booking.children} pax)
                                  {tourDetails?.kidsPrice && (
                                    <span className="text-pink-300 text-xs ml-1"></span>
                                  )}
                                </span>
                              </div>
                              <span className="text-pink-400 font-bold text-sm">
                                ₹{(booking.priceBreakdown?.kidsPrice || (tourDetails?.kidsPrice || 0) * booking.children).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="">


                          {/* Adults Total (includes base + room + addons) */}
                          {(booking.priceBreakdown?.adultsTotal > 0 || booking.priceBreakdown?.basePrice > 0) && (
                            <div className="flex justify-between text-xs">

                            </div>
                          )}

                          {/* Kids Price */}
                          {(booking.priceBreakdown?.kidsPrice > 0 || (booking.children > 0 && tourDetails?.kidsPrice > 0)) && (
                            <div className="flex justify-between text-xs">

                            </div>
                          )}


                          {/* Subtotal - only show when there's a discount to compare */}
                          {booking.couponCode && booking.originalPrice > booking.totalPrice && (
                            <>
                              <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                                <span className="text-gray-300 font-semibold">Subtotal</span>
                                <span className="text-white font-semibold">₹{(booking.originalPrice || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs bg-purple-500/10 p-2 rounded-lg -mx-1">
                                <span className="text-purple-400 flex items-center gap-1">
                                  <FaTicketAlt className="text-[10px]" />
                                  {booking.couponCode}
                                </span>
                                <span className="text-green-400 font-bold">- ₹{(booking.originalPrice - booking.totalPrice).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                                <span className="text-[#D9A441] font-bold">Grand Total</span>
                                <span className="text-[#D9A441] font-bold">₹{(booking.totalPrice || 0).toLocaleString()}</span>
                              </div>
                            </>
                          )}

                          {/* Total - only when no coupon */}
                          {(!booking.couponCode || booking.originalPrice <= booking.totalPrice) && (
                            <div className="flex justify-between text-xs pt-2 border-t border-white/5">
                              <span className="text-gray-300 font-semibold">Total</span>
                              <span className="text-white font-bold">₹{(booking.totalPrice || booking.originalPrice || 0).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <FaWallet className="text-[#D9A441]" />
                        <h3 className="font-bold text-white">Payment Summary</h3>
                      </div>
                      <div className="space-y-3">
                        {/* Total Cost */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Total Cost</span>
                          <span className="text-white font-bold text-lg">₹{(booking.totalPrice || booking.totalRs || 0).toLocaleString()}</span>
                        </div>
                        {/* Additional Admin Discount */}
                        {booking.additionalDiscount > 0 && (
                          <div className="flex justify-between items-center text-red-400">
                            <span className="text-sm italic">Admin Discount</span>
                            <span className="font-semibold">- ₹{booking.additionalDiscount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Advance Paid</span>
                          <span className="text-green-400 font-bold">₹{(booking.paidAmount || booking.advanceRs || 0).toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-white/10"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 font-semibold">Balance Due</span>
                          <span className="text-[#D9A441] font-black text-lg">
                            ₹{((booking.totalPrice || booking.totalRs || 0) - (booking.additionalDiscount || 0) - (booking.paidAmount || booking.advanceRs || 0)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Important Policies Box */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <FaStickyNote className="text-[#D9A441]" />
                        <h3 className="font-bold text-white">Important Policies</h3>
                      </div>
                      <ul className="space-y-2.5">
                        {[
                          "50% Cancellation Charge • Advance Not Refundable",
                          "No charge for children below 3 years, half charge for 3–7 years",
                          "Check-out time: 12 Noon",
                          <span key="terms">
                            Read full{" "}
                            <Link
                              to="/terms"
                              target="_blank"
                              className="text-[#D9A441] underline hover:text-white transition-colors"
                            >
                              terms & conditions
                            </Link>
                            .
                          </span>
                        ].map((policy, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-gray-400 leading-relaxed">
                            <span className="text-amber-400 mt-0.5 text-[6px] shrink-0 opacity-70">●</span>
                            <span>{policy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Column - Itinerary & Inclusions/Exclusions */}
                  <div className="lg:col-span-3 space-y-5">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <FaRegSun className="text-[#D9A441]" />
                        <h3 className="font-bold text-white">Day-wise Itinerary</h3>
                      </div>
                      <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {renderItinerary()}
                      </div>
                    </div>

                    {/* Inclusions & Exclusions */}
                    {tourDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Inclusions */}
                        <div className="bg-emerald-900/10 rounded-2xl p-5 border border-emerald-500/10">
                          <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-sm" /> Included
                          </h3>
                          <ul className="space-y-2.5">
                            {tourDetails.inclusions?.map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-emerald-100/80 text-xs font-light leading-relaxed">
                                <FaCheck className="text-emerald-400 mt-0.5 text-[10px] flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Exclusions */}
                        <div className="bg-red-900/10 rounded-2xl p-5 border border-red-500/10">
                          <h3 className="text-base font-bold text-red-400 mb-4 flex items-center gap-2">
                            <FaTimesCircle className="text-sm" /> Excluded
                          </h3>
                          <ul className="space-y-2.5">
                            {[
                              "Personal Expenses",
                              "Airfare / Train Tickets",
                              "Lunch",
                              "Room Heater Charges",
                              "Entry Fees",
                              "Additional Sight Seeing other than mentioned in itinerary",
                              "Any Cost arising due to natural calamities-Lanslide,Political Disturbances(strikes), etc.to be borne by the client, which is directly payable on the spot."
                            ].map((item, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-gray-400 text-xs font-light leading-relaxed">
                                <FaTimes className="text-red-500 mt-0.5 text-[10px] flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar{width:6px}
        .custom-scrollbar::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:10px}
        .custom-scrollbar::-webkit-scrollbar-thumb{background:rgba(217,164,65,0.3);border-radius:10px}
        .custom-scrollbar::-webkit-scrollbar-thumb:hover{background:rgba(217,164,65,0.5)}
      `}</style>
    </>
  );
}