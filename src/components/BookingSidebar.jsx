// src/components/BookingSidebar.jsx
import { useState, useEffect } from "react";
import {
  FaUsers,
  FaChild,
  FaCheck,
  FaPlus,
  FaMinus,
  FaTicketAlt,
  FaSpinner,
  FaTimes,
  FaExclamationTriangle,
  FaFire,       // Bonfire
  FaCouch,      // Comfort Seat
  FaUtensils,   // Meals
  FaCoffee,     // Tea
  FaHiking,     // Guide
  FaCalendarAlt // Date Icon
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

/* -------------------------------------------
   🎉 SUCCESS / DUPLICATE POPUP
------------------------------------------- */
const StatusPopup = ({ isOpen, onClose, data, type }) => {
  useEffect(() => {
    if (isOpen && type === 'success') {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: ['#D9A441', '#ffffff', '#0891b2', '#F59E0B']
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen, type]);

  const isSuccess = type === 'success';
  const refId = data?._id ? `#HW-${data._id.slice(-6).toUpperCase()}` : 'N/A';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center px-4"
          style={{ background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`
              relative w-full max-w-sm overflow-hidden rounded-[2.5rem]
              border shadow-2xl backdrop-blur-3xl text-center p-0
              ${isSuccess 
                ? "bg-gradient-to-b from-[#D9A441]/20 to-[#0f172a]/90 border-[#D9A441]/30" 
                : "bg-gradient-to-b from-red-500/20 to-[#0f172a]/90 border-red-500/30"}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

            <div className="relative p-8 z-10 flex flex-col items-center">
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white/70"
              >
                <FaTimes size={14} />
              </button>

              <motion.div
                initial={{ scale: 0, rotate: -45 }} 
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className={`
                  w-20 h-20 mb-6 rounded-full flex items-center justify-center shadow-lg
                  ${isSuccess 
                    ? "bg-gradient-to-tr from-[#D9A441] to-[#fbbf24] text-black" 
                    : "bg-gradient-to-tr from-red-500 to-red-400 text-white"}
                `}
              >
                {isSuccess ? <FaCheck className="text-3xl" /> : <FaExclamationTriangle className="text-3xl" />}
              </motion.div>

              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                {isSuccess ? "Booking Confirmed!" : "Booking Found"}
              </h3>
              
              <div className="bg-black/30 rounded-xl px-4 py-2 mb-4 border border-white/5">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Reference ID</p>
                <p className={`font-mono text-xl font-bold tracking-wider ${isSuccess ? "text-[#D9A441]" : "text-red-400"}`}>
                  {refId}
                </p>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-8 font-medium px-2">
                {isSuccess 
                  ? "Get ready for the mountains! We have received your request and will contact you shortly."
                  : `We found an existing booking for this tour with your number. Current Status: ${data?.status || 'Pending'}.`
                }
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all
                  ${isSuccess 
                    ? "bg-gradient-to-r from-[#D9A441] to-[#fbbf24] text-black shadow-[#D9A441]/20" 
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"}
                `}
              >
                {isSuccess ? "Awesome!" : "Okay, thanks"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* -------------------------------------------
   ➕ QUANTITY CONTROL
------------------------------------------- */
const QuantityControl = ({ label, subLabel, icon: Icon, value, onChange, min = 0 }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-gray-300 flex justify-between items-center font-medium px-1">
      <span className="flex items-center gap-1.5">{Icon && <Icon className="text-[#D9A441]" />} {label}</span>
      <span className="text-[10px] text-gray-500 font-bold bg-black/20 px-1.5 py-0.5 rounded">{subLabel}</span>
    </label>

    <div className="flex items-center bg-black/20 rounded-xl border border-white/5 overflow-hidden backdrop-blur-sm h-10 p-1 gap-1">
      <button
        onClick={() => onChange(Math.max(min, Number(value) - 1))}
        className="h-full w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-yellow-400 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
        disabled={Number(value) <= min}
      >
        <FaMinus size={8} />
      </button>
      
      <div className="flex-1 text-center font-bold text-white text-base">{value}</div>
      
      <button
        onClick={() => onChange(Number(value) + 1)}
        className="h-full w-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-yellow-400 transition-all"
      >
        <FaPlus size={8} />
      </button>
    </div>
  </div>
);

/* -------------------------------------------
   ✅ TICK BUTTON
------------------------------------------- */
const TickButton = ({ label, icon: Icon, active, onClick, complimentary = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 group
      ${active 
        ? complimentary 
          ? "bg-emerald-500/10 border-emerald-500/50" 
          : "bg-[#D9A441]/10 border-[#D9A441]/50"
        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"}
    `}
  >
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors
        ${active 
          ? (complimentary ? "bg-emerald-500 border-emerald-500" : "bg-[#D9A441] border-[#D9A441]") 
          : "border-gray-600 group-hover:border-gray-500"}
      `}>
        {active && <FaCheck className="text-[8px] text-black" />}
      </div>
      
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`text-sm ${active ? (complimentary ? "text-emerald-400" : "text-[#D9A441]") : "text-gray-500"}`} />}
        <span className={`text-xs font-medium ${active ? "text-white" : "text-gray-400"}`}>
          {label}
        </span>
      </div>
    </div>

    {complimentary && active && (
      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
        FREE
      </span>
    )}
  </button>
);

export default function BookingSidebar({ tour = {} }) {
  const [open, setOpen] = useState(false);
  const [popupData, setPopupData] = useState(null); 
  const [submitting, setSubmitting] = useState(false);

  // Lock background scroll
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  const [globalRates, setGlobalRates] = useState({
    meal: 500, tea: 60, bonfire: 500, cab: 3200,
    stdRoom: 1500, panoRoom: 2500, tourGuide: 1000, comfortSeat: 800
  });

  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const p = data.data;
          setGlobalRates({
            meal: p.mealPrice ?? 500,
            tea: p.teaPrice ?? 60,
            bonfire: p.bonfirePrice ?? 500,
            cab: p.personalCabPrice ?? 3200,
            stdRoom: p.standardRoomPrice ?? 1500,
            panoRoom: p.panoRoomPrice ?? 2500,
            tourGuide: p.tourGuidePrice ?? 1000,
            comfortSeat: p.comfortSeatPrice ?? 800
          });
        }
      })
      .catch((err) => console.error("Failed to load pricing", err));
  }, []);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", travelDate: "",
    adults: 2, children: 0,
    roomType: "standard", transport: "sharing",
    bonfire: false, meal: false, tea: false, comfortSeat: false, tourGuide: false,
    rooms: 1
  });

  const handle = (k, v) =>
    setForm((p) => ({ ...p, [k]: (k === "adults" || k === "children" || k === "rooms") ? Number(v) : v }));

  const toggleMeal = () => {
    setForm(prev => {
      const newState = !prev.meal;
      return { ...prev, meal: newState, tea: newState };
    });
  };

  const toggleTea = () => {
    if (form.meal) return; 
    handle("tea", !form.tea);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) handle("phone", value);
  };

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponMessage("");
    try {
      const res = await fetch(`/api/coupons?code=${couponCode}`);
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data);
        setCouponMessage("Code Applied!");
      } else {
        setAppliedCoupon(null);
        setCouponMessage(data.error || "Invalid Code");
      }
    } catch (e) {
      setCouponMessage("Error");
    }
    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  const minRoomsRequired = Math.max(1, Math.ceil(Number(form.adults || 0) / 3));
  useEffect(() => {
    if (form.rooms !== minRoomsRequired) handle("rooms", minRoomsRequired);
  }, [form.adults, minRoomsRequired]);

  const [finalPrice, setFinalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);

  useEffect(() => {
    const rates = {
      meal: tour?.pricing?.mealPerPerson ?? globalRates.meal,
      tea: tour?.pricing?.teaPerPerson ?? globalRates.tea,
      bonfire: tour?.pricing?.bonfire ?? globalRates.bonfire,
      cab: tour?.pricing?.personalCab?.rate ?? globalRates.cab,
      stdRoom: tour?.pricing?.room?.standard ?? globalRates.stdRoom,
      panoRoom: tour?.pricing?.room?.panoramic ?? globalRates.panoRoom,
      tourGuide: tour?.pricing?.tourGuide ?? globalRates.tourGuide,
      comfortSeat: tour?.pricing?.comfortSeat ?? globalRates.comfortSeat
    };

    const base = Number(tour?.basePrice ?? 0);
    const nights = Math.max(1, Number(tour?.nights ?? 1));
    const days = nights + 1;
    const adultCount = Math.max(0, Number(form.adults || 0));
    const childCount = Math.max(0, Number(form.children || 0));

    let price = (adultCount * base) + (childCount * (base / 2));
    const roomRate = form.roomType === "panoramic" ? rates.panoRoom : rates.stdRoom;
    price += roomRate * Number(form.rooms || 0) * nights;

    if (form.transport === "personal") price += rates.cab;

    const totalPax = adultCount + childCount;
    if (form.meal) price += totalPax * rates.meal * days;
    if (form.tea) price += totalPax * (form.meal ? 0 : rates.tea) * days;
    if (form.bonfire) price += rates.bonfire;
    if (form.tourGuide) price += rates.tourGuide;
    if (form.comfortSeat) price += rates.comfortSeat;

    const calculatedTotal = Math.max(0, Math.round(price));
    setFinalPrice(calculatedTotal);

    if (appliedCoupon) {
      let discount = 0;
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        discount = (calculatedTotal * appliedCoupon.discountValue) / 100;
      } else {
        discount = appliedCoupon.discountValue;
      }
      setDiscountedPrice(Math.max(0, Math.round(calculatedTotal - discount)));
    } else {
      setDiscountedPrice(calculatedTotal);
    }
  }, [form, tour, globalRates, appliedCoupon]);

  const totalPersons = Math.max(1, Number(form.adults) + Number(form.children));
  const perHeadPrice = Math.round(discountedPrice / totalPersons);

  const handleBook = async () => {
    if (!form.travelDate) return alert("Please select a Journey Date");
    if (!form.name.trim()) return alert("Please enter your Name");
    if (!form.phone || form.phone.length !== 10) return alert("Please enter a valid 10-digit Phone Number");

    setSubmitting(true);

    const bookingData = {
      ...form,
      phone: `+91 ${form.phone}`,
      tourTitle: tour.title || "Custom Package",
      totalPrice: discountedPrice,
      originalPrice: finalPrice,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      addons: {
        bonfire: form.bonfire,
        meal: form.meal,
        tea: form.tea,
        comfortSeat: form.comfortSeat,
        tourGuide: form.tourGuide
      }
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      
      if (res.status === 409) {
        setPopupData({ type: 'duplicate', data: data.existingBooking });
        setOpen(false);
      } else if (data.success) {
        setPopupData({ type: 'success', data: data.data });
        setOpen(false);
      } else {
        alert("Booking failed: " + data.error);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const contentJsx = (
    <div className="space-y-6 text-gray-100">
      <div className="hidden lg:block pb-4 border-b border-white/5">
         <h3 className="text-xl font-bold text-white tracking-wide">
           Book Your Trip
         </h3>
         <p className="text-gray-400 text-xs mt-1">Instant confirmation & transparent pricing</p>
      </div>

      <div className="space-y-3">
        {/* DATE INPUT ADDED HERE */}
        <div className="relative w-full">
            <span className="absolute left-3 top-3.5 text-[#D9A441] text-xs z-10 pointer-events-none"><FaCalendarAlt /></span>
            <input
                type="date"
                value={form.travelDate}
                onChange={(e) => handle("travelDate", e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white font-medium outline-none transition-all text-base sm:text-sm backdrop-blur-sm appearance-none"
                style={{ colorScheme: 'dark' }}
                placeholder="Journey Date"
                min={new Date().toISOString().split('T')[0]}
            />
        </div>

        <input
            type="text"
            value={form.name}
            onChange={(e) => handle("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white placeholder-gray-500 outline-none transition-all text-base sm:text-sm backdrop-blur-sm"
            placeholder="Full Name"
        />

        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:flex-1">
                <span className="absolute left-3 top-3.5 text-[#D9A441] font-bold text-xs">🇮🇳 +91</span>
                <input
                    type="tel"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    maxLength={10}
                    className="w-full pl-14 pr-3 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white placeholder-gray-500 font-medium outline-none transition-all text-base sm:text-sm backdrop-blur-sm"
                    placeholder="Mobile Number"
                />
            </div>
            <input
                type="email"
                value={form.email}
                onChange={(e) => handle("email", e.target.value)}
                className="w-full sm:flex-[1.2] px-4 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white placeholder-gray-500 outline-none transition-all text-base sm:text-sm backdrop-blur-sm"
                placeholder="Email (Optional)"
            />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
        <QuantityControl label="Adults" subLabel="5+" icon={FaUsers} value={form.adults} onChange={(v) => handle('adults', v)} min={1} />
        <QuantityControl label="Kids" subLabel="Upto 5" icon={FaChild} value={form.children} onChange={(v) => handle('children', v)} min={0} />
      </div>

      <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-center">
               <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 text-center">Transport</label>
               <div className="flex bg-black/30 rounded-lg p-1 relative">
                  <motion.div 
                    layout 
                    className="absolute inset-y-1 bg-[#D9A441] rounded-md shadow-md"
                    initial={false}
                    animate={{ 
                        left: form.transport === 'sharing' ? 4 : '50%', 
                        width: 'calc(50% - 4px)' 
                    }}
                  />
                  <button onClick={() => handle('transport', 'sharing')} className="flex-1 relative z-10 text-[10px] font-bold py-1.5 text-center transition-colors text-white">Sharing</button>
                  <button onClick={() => handle('transport', 'personal')} className="flex-1 relative z-10 text-[10px] font-bold py-1.5 text-center transition-colors text-white">Cab</button>
               </div>
             </div>

             <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-center">
               <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 text-center">Room Type</label>
               <div className="flex bg-black/30 rounded-lg p-1 relative">
                  <motion.div 
                    layout 
                    className="absolute inset-y-1 bg-[#D9A441] rounded-md shadow-md"
                    initial={false}
                    animate={{ 
                        left: form.roomType === 'standard' ? 4 : '50%', 
                        width: 'calc(50% - 4px)' 
                    }}
                  />
                  <button onClick={() => handle('roomType', 'standard')} className="flex-1 relative z-10 text-[10px] font-bold py-1.5 text-center transition-colors text-white">Standard</button>
                  <button onClick={() => handle('roomType', 'panoramic')} className="flex-1 relative z-10 text-[10px] font-bold py-1.5 text-center transition-colors text-white">Panaromoic</button>
               </div>
             </div>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-xs text-gray-300 ml-2 font-medium">Total Rooms Required</span>
                <div className="flex items-center gap-3">
                    <button 
                    disabled={form.rooms <= minRoomsRequired} 
                    onClick={() => handle("rooms", Math.max(minRoomsRequired, Number(form.rooms) - 1))} 
                    className="w-6 h-6 flex items-center justify-center rounded bg-black/30 text-white disabled:opacity-20"
                    >
                    <FaMinus size={8} />
                    </button>
                    <div className="text-sm font-bold text-[#D9A441]">{form.rooms}</div>
                    <button 
                    onClick={() => handle("rooms", Number(form.rooms) + 1)} 
                    className="w-6 h-6 flex items-center justify-center rounded bg-black/30 text-white"
                    >
                    <FaPlus size={8} />
                    </button>
                </div>
          </div>
      </div>

      <div className="pt-2">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Enhancements</p>
        <div className="grid grid-cols-2 gap-2">
          <TickButton label="Bonfire" icon={FaFire} active={form.bonfire} onClick={() => handle("bonfire", !form.bonfire)} />
          <TickButton label="Comfort Seat" icon={FaCouch} active={form.comfortSeat} onClick={() => handle("comfortSeat", !form.comfortSeat)} />
          <TickButton label="Meals" icon={FaUtensils} active={form.meal} onClick={toggleMeal} />
          <TickButton label="Tea" icon={FaCoffee} active={form.tea} complimentary={form.meal} onClick={toggleTea} />
          <div className="col-span-2">
             <TickButton label="Tour Guide" icon={FaHiking} active={form.tourGuide} onClick={() => handle("tourGuide", !form.tourGuide)} />
          </div>
        </div>
      </div>

      <div className="bg-black/20 border border-white/5 rounded-xl p-2.5 flex items-center gap-3">
        <div className="p-1.5 bg-[#D9A441]/10 rounded text-[#D9A441]"><FaTicketAlt size={12} /></div>
        <div className="flex-1 flex gap-2">
            <input
                className="flex-1 bg-transparent text-xs text-white uppercase placeholder-gray-600 focus:outline-none font-bold tracking-wider"
                placeholder="PROMO CODE"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                disabled={appliedCoupon}
            />
            {appliedCoupon ? (
                <button onClick={removeCoupon} className="text-red-400 text-[10px] font-bold hover:text-red-300">REMOVE</button>
            ) : (
                <button onClick={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon} className="text-[#D9A441] text-[10px] font-bold hover:text-yellow-300 disabled:opacity-50">APPLY</button>
            )}
        </div>
      </div>
      {couponMessage && <p className={`text-[10px] text-center -mt-4 ${appliedCoupon ? "text-green-400" : "text-red-400"}`}>{couponMessage}</p>}

      <motion.div 
        animate={appliedCoupon ? { scale: [1, 1.03, 1] } : {}}
        transition={{ duration: 0.3 }}
        className="p-4 rounded-2xl bg-gradient-to-br from-[#D9A441]/10 to-transparent border border-[#D9A441]/20"
      >
        <div className="flex justify-between items-end mb-4">
            <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">Estimated / Person</p>
                <p className="text-2xl font-black text-[#D9A441]">₹{perHeadPrice.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Grand Total</p>
                <div className="flex flex-col items-end leading-none">
                  {appliedCoupon && <span className="line-through text-gray-600 text-[10px] mb-0.5">₹{finalPrice.toLocaleString()}</span>}
                  <span className="text-lg font-bold text-white">₹{discountedPrice.toLocaleString("en-IN")}</span>
                </div>
            </div>
        </div>

        <button
            onClick={handleBook}
            disabled={submitting}
            className="w-full bg-[#D9A441] hover:bg-[#fbbf24] text-black py-3.5 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(217,164,65,0.15)] transition active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
        >
            {submitting ? <><FaSpinner className="animate-spin" /> Processing...</> : "Confirm Booking"}
        </button>
      </motion.div>
    </div>
  );

  return (
    <>
      <StatusPopup 
        isOpen={!!popupData} 
        onClose={() => setPopupData(null)} 
        data={popupData?.data}
        type={popupData?.type} 
      />

      <div className="hidden lg:block">
        <div className="
          w-full p-6 rounded-3xl sticky top-24 
          bg-[#0f172a]/40 backdrop-blur-3xl 
          border border-white/10 shadow-2xl
        ">
          {contentJsx}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999]">
        <div className="p-3 px-5 rounded-t-3xl flex items-center gap-4 border-t border-white/10 bg-[#0f172a]/60 backdrop-blur-xl shadow-2xl">
          <div className="flex-1">
            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Starting From</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-[#D9A441] leading-none">₹{perHeadPrice.toLocaleString("en-IN")}</span>
              <span className="text-[10px] text-gray-500">/ Person</span>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="
              bg-[#D9A441] hover:bg-[#fbbf24]
              text-black py-3 px-8 rounded-xl font-bold text-base 
              shadow-lg active:scale-95 transition
            "
          >
            Customize
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[2001] bg-[#0f172a]/80 backdrop-blur-3xl rounded-t-[2.5rem] border-t border-white/10 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 w-full flex justify-center pt-4 pb-2 z-10" onClick={() => setOpen(false)}>
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              <div className="p-6 pb-24">
                {contentJsx}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}