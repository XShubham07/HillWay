import { useState, useEffect } from "react";
import {
  FaUsers,
  FaChild,
  FaHotel,
  FaCheck,
  FaPlus,
  FaMinus,
  FaCar,
  FaTicketAlt,
  FaSpinner,
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------
   🎉 CELEBRATION CONFETTI COMPONENT
------------------------------------------- */
const Confetti = () => {
  const colors = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          initial={{ 
            x: "50%", 
            y: "50%", 
            opacity: 1, 
            scale: 0 
          }}
          animate={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            opacity: 0,
            scale: [0, 1.5, 0]
          }}
          transition={{ 
            duration: 1.5 + Math.random(), 
            repeat: Infinity, 
            delay: Math.random() * 0.5,
            ease: "easeOut" 
          }}
          style={{ 
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left: "0%",
            top: "0%"
          }}
        />
      ))}
    </div>
  );
};

/* -------------------------------------------
   ✨ REDESIGNED SUCCESS POPUP
------------------------------------------- */
const SuccessPopup = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center px-4"
          style={{ background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(10px)" }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="
              relative w-full max-w-sm overflow-hidden rounded-[2rem]
              bg-white/10 border border-white/20 shadow-[0_0_50px_rgba(217,164,65,0.2)]
              backdrop-blur-2xl text-center p-0
            "
          >
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D9A441]/10 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D9A441]/20 blur-[80px] rounded-full pointer-events-none" />
            
            <Confetti />

            <div className="relative p-8 z-10">
              <div className="flex justify-end">
                <button onClick={onClose} className="text-white/50 hover:text-white transition">
                  <FaTimes />
                </button>
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -45 }} 
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-[#D9A441] to-[#F59E0B] flex items-center justify-center shadow-[0_0_30px_rgba(217,164,65,0.4)]"
              >
                <FaCheck className="text-black text-4xl drop-shadow-md" />
              </motion.div>

              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Booking Confirmed!</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-8 font-medium">
                Pack your bags! Your Himalayan adventure awaits. Our team will contact you shortly.
              </p>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(217,164,65,0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-4 rounded-xl font-bold text-black bg-gradient-to-r from-[#D9A441] to-[#F59E0B] shadow-lg transition-all"
              >
                Start Packing
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* -------------------------------------------
   ➕ QUANTITY CONTROL (Updated Buttons)
------------------------------------------- */
const QuantityControl = ({ label, subLabel, icon: Icon, value, onChange, min = 0 }) => (
  <div className="space-y-1">
    <label className="text-sm text-gray-200 flex justify-between items-center">
      <span className="flex items-center gap-2">{Icon && <Icon className="text-[#D9A441]" />} {label}</span>
      <span className="text-xs text-gray-400 font-normal">{subLabel}</span>
    </label>

    <div className="flex items-center bg-white/5 rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm h-11 p-1 gap-1">
      <button
        onClick={() => onChange(Math.max(min, Number(value) - 1))}
        className="h-full w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 text-yellow-400 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
        disabled={Number(value) <= min}
      >
        <FaMinus size={10} />
      </button>
      
      <div className="flex-1 text-center font-bold text-white text-lg">{value}</div>
      
      <button
        onClick={() => onChange(Number(value) + 1)}
        className="h-full w-10 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/20 text-yellow-400 transition-all"
      >
        <FaPlus size={10} />
      </button>
    </div>
  </div>
);

/* -------------------------------------------
   ✅ TICK BUTTON (Unchanged)
------------------------------------------- */
const TickButton = ({ label, active, onClick, complimentary = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 
      ${active 
        ? complimentary 
          ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
          : "bg-[#D9A441]/20 border-[#D9A441] shadow-[0_0_10px_rgba(217,164,65,0.1)]"
        : "bg-white/5 border-white/10 hover:bg-white/10"}
    `}
  >
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${active ? (complimentary ? "text-emerald-400" : "text-[#D9A441]") : "text-gray-300"}`}>
        {label}
      </span>

      {complimentary && active && (
        <span className="text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded-full animate-pulse">
          FREE
        </span>
      )}
    </div>

    <div className={`w-5 h-5 rounded-full flex items-center justify-center border
      ${active ? (complimentary ? "bg-emerald-400 border-emerald-400" : "bg-[#D9A441] border-[#D9A441]") : "border-gray-500"}
    `}>
      {active && <FaCheck className="text-xs text-black" />}
    </div>
  </button>
);

/* -------------------------------------------------------------------
   🔥🔥 MAIN COMPONENT 🔥🔥
------------------------------------------------------------------- */
export default function BookingSidebar({ tour = {} }) {
  /* ---- Original State Logic (No Logic Changes) ---- */
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    name: "", phone: "", email: "",
    adults: 1, children: 0,
    roomType: "standard", transport: "sharing",
    bonfire: false, meal: false, tea: false, comfortSeat: false, tourGuide: false,
    rooms: 1
  });

  const handle = (k, v) =>
    setForm((p) => ({ ...p, [k]: (k === "adults" || k === "children" || k === "rooms") ? Number(v) : v }));

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
        setCouponMessage("Coupon Applied! 🎉");
      } else {
        setAppliedCoupon(null);
        setCouponMessage(data.error || "Invalid Coupon");
      }
    } catch (e) {
      setCouponMessage("Error applying coupon");
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
      if (data.success) {
        setShowSuccess(true);
        setOpen(false);
      } else {
        alert("Booking failed: " + data.error);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  /* -------------------------------------------------------------------
       COMPUTED CONTENT FOR SIDEBAR & MOBILE DRAWER
   ------------------------------------------------------------------- */

  const contentJsx = (
    <div className="space-y-6">
      {/* Header for Desktop */}
      <div className="hidden lg:block pb-4 border-b border-white/10">
         <h3 className="text-2xl font-bold text-white">
           Book This Tour
         </h3>
         <p className="text-gray-400 text-sm mt-1">Customize your perfect trip</p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Traveler Name</label>
            <input
            type="text"
            value={form.name}
            onChange={(e) => handle("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#D9A441] text-white placeholder-gray-500 outline-none transition-all focus:bg-white/10"
            placeholder="Full Name"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Phone Number</label>
                <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#D9A441] font-bold text-sm">🇮🇳 +91</span>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        className="w-full pl-16 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#D9A441] text-white placeholder-gray-500 font-medium outline-none transition-all focus:bg-white/10"
                        placeholder="98765 43210"
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1 block">Email (Optional)</label>
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handle("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#D9A441] text-white placeholder-gray-500 outline-none transition-all focus:bg-white/10"
                    placeholder="mail@example.com"
                />
            </div>
        </div>
      </div>

      {/* Pax Row */}
      <div className="grid grid-cols-2 gap-4">
        <QuantityControl label="Adults" subLabel="13+" icon={FaUsers} value={form.adults} onChange={(v) => handle('adults', v)} min={1} />
        <QuantityControl label="Children" subLabel="3-13" icon={FaChild} value={form.children} onChange={(v) => handle('children', v)} min={0} />
      </div>

      {/* Rooms & Transport Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Rooms */}
          <div className="space-y-3">
            <label className="text-sm text-gray-200 flex items-center gap-2 font-semibold"><FaHotel className="text-[#D9A441]" /> Room Preference</label>
            <div className="flex gap-2">
                <button
                    className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                    form.roomType === "standard"
                        ? "bg-[#D9A441]/20 border-[#D9A441] text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                    onClick={() => handle("roomType", "standard")}
                >
                    Standard
                </button>
                <button
                    className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                    form.roomType === "panoramic"
                        ? "bg-[#D9A441]/20 border-[#D9A441] text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                    onClick={() => handle("roomType", "panoramic")}
                >
                    Panoramic
                </button>
            </div>
            
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5 border border-white/10">
                <button 
                  disabled={form.rooms <= minRoomsRequired} 
                  onClick={() => handle("rooms", Math.max(minRoomsRequired, Number(form.rooms) - 1))} 
                  className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/20 text-yellow-400 disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <FaMinus size={10} />
                </button>
                <div className="text-sm font-bold text-white">{form.rooms} Room{form.rooms > 1 ? "s" : ""}</div>
                <button 
                  onClick={() => handle("rooms", Number(form.rooms) + 1)} 
                  className="w-8 h-8 flex items-center justify-center rounded bg-white/5 hover:bg-white/20 text-yellow-400"
                >
                  <FaPlus size={10} />
                </button>
            </div>
          </div>

          {/* Transport */}
          <div className="space-y-3">
            <label className="text-sm text-gray-200 font-semibold flex items-center gap-2"><FaCar className="text-[#D9A441]" /> Transport</label>
            <div className="flex gap-2 h-[84px]">
                <button
                    className={`flex-1 flex flex-col items-center justify-center rounded-lg border text-sm transition-all ${
                    form.transport === "sharing"
                        ? "bg-[#D9A441]/15 border-[#D9A441] text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                    onClick={() => handle("transport", "sharing")}
                >
                    <FaUsers className="mb-1" /> Sharing
                </button>
                <button
                    className={`flex-1 flex flex-col items-center justify-center rounded-lg border text-sm transition-all ${
                    form.transport === "personal"
                        ? "bg-[#D9A441]/15 border-[#D9A441] text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                    onClick={() => handle("transport", "personal")}
                >
                    <FaCar className="mb-1" /> Private
                </button>
            </div>
          </div>
      </div>

      {/* Add-ons */}
      <div className="space-y-3 pt-2">
        <p className="text-sm text-gray-200 font-semibold">Enhance Your Trip</p>
        <div className="grid grid-cols-2 gap-3">
          <TickButton label="Bonfire" active={form.bonfire} onClick={() => handle("bonfire", !form.bonfire)} />
          <TickButton label="Comfort Seat" active={form.comfortSeat} onClick={() => handle("comfortSeat", !form.comfortSeat)} />
          <TickButton label="Meals" active={form.meal} onClick={() => { handle("meal", !form.meal); if (!form.meal) handle("tea", true); }} />
          <TickButton label="Tea" active={form.tea} complimentary={form.meal} onClick={() => !form.meal && handle("tea", !form.tea)} />
          <div className="col-span-2">
             <TickButton label="Tour Guide" active={form.tourGuide} onClick={() => handle("tourGuide", !form.tourGuide)} />
          </div>
        </div>
      </div>

      {/* Coupon */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
        <div className="p-2 bg-black/20 rounded-lg text-[#D9A441]"><FaTicketAlt /></div>
        <div className="flex-1">
            <div className="flex gap-2">
                <input
                    className="flex-1 bg-transparent text-sm text-white uppercase placeholder-gray-500 focus:outline-none font-bold tracking-wide"
                    placeholder="PROMO CODE"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    disabled={appliedCoupon}
                />
                {appliedCoupon ? (
                    <button onClick={removeCoupon} className="text-red-400 text-xs font-bold hover:text-red-300">REMOVE</button>
                ) : (
                    <button onClick={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon} className="text-[#D9A441] text-xs font-bold hover:text-yellow-300 disabled:opacity-50">APPLY</button>
                )}
            </div>
            {couponMessage && <p className={`text-[10px] mt-1 ${appliedCoupon ? "text-green-400" : "text-red-400"}`}>{couponMessage}</p>}
        </div>
      </div>

      {/* 💵 PC Price Section (Updated Hierarchy) */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#D9A441]/20 to-[#b58b2d]/5 border border-yellow-300/20 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-end mb-3">
            <div>
                {/* BIG PER HEAD */}
                <p className="text-[10px] text-gray-300 uppercase tracking-widest mb-0.5">Price Per Person</p>
                <p className="text-3xl font-black text-[#D9A441]">₹{perHeadPrice.toLocaleString("en-IN")}</p>
            </div>
            <div className="text-right">
                {/* SMALL TOTAL */}
                <p className="text-xs text-yellow-200/70 uppercase tracking-wider">Total Estimate</p>
                <div className="flex flex-col items-end">
                  {appliedCoupon && <span className="line-through text-gray-500 text-xs">₹{finalPrice.toLocaleString()}</span>}
                  <span className="text-lg font-bold text-white">₹{discountedPrice.toLocaleString("en-IN")}</span>
                </div>
            </div>
        </div>

        <button
            onClick={handleBook}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#D9A441] to-[#F59E0B] text-black py-4 rounded-xl font-extrabold text-lg hover:shadow-[0_0_20px_rgba(217,164,65,0.4)] transition active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
        >
            {submitting ? <><FaSpinner className="animate-spin" /> Processing...</> : "Confirm Booking"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* PC SIDEBAR */}
      <div className="hidden lg:block">
        <div className="
          w-full p-6 rounded-3xl sticky top-24 
          bg-[#0f172a]/80 backdrop-blur-2xl 
          border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]
        ">
          {contentJsx}
        </div>
      </div>

      {/* 📱 MOBILE BOTTOM BAR (Updated Glass & Hierarchy) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999]">
        <div className="p-4 rounded-t-3xl flex items-center gap-4 border-t border-white/20 bg-[#0f172a]/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Per Person</p>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#D9A441] leading-none">₹{perHeadPrice.toLocaleString("en-IN")}</span>
              <span className="text-[10px] text-gray-400 mt-1">Total: ₹{discountedPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="
              relative overflow-hidden
              bg-gradient-to-r from-[#D9A441] to-[#F59E0B] 
              text-black py-3 px-8 rounded-xl font-bold text-lg 
              shadow-lg active:scale-95 transition
              backdrop-blur-md
            "
          >
            <span className="relative z-10">Book Now</span>
            {/* Subtle glass sheen overlay on button */}
            <div className="absolute inset-0 bg-white/20 pointer-events-none" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[2000]"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[2001] bg-[#0f172a]/95 backdrop-blur-xl rounded-t-[2rem] border-t border-white/10 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 w-full flex justify-center pt-4 pb-2 bg-[#0f172a]/95 backdrop-blur-xl z-10" onClick={() => setOpen(false)}>
                <div className="w-12 h-1.5 rounded-full bg-white/20" />
              </div>

              <div className="p-6 pb-24">
                <h2 className="text-2xl font-bold text-white mb-6">Trip Details</h2>
                {contentJsx}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}