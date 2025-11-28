import { useState, useEffect } from "react";
import {
  FaUsers,
  FaChild,
  FaHotel,
  FaCheck,
  FaPlus,
  FaMinus,
  FaBed,
  FaCar,
  FaUserTie,
  FaChair,
  FaSpinner,
  FaEnvelope,
  FaTicketAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- HELPER COMPONENTS (Defined Outside to prevent re-renders) ---

const SuccessPopup = ({ isOpen, onClose }) => {
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
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="
              relative w-full max-w-sm overflow-hidden rounded-3xl
              bg-gradient-to-br from-[#1a2c42] to-[#0f172a]
              border border-white/10 shadow-2xl
              text-center p-8
            "
          >
            {/* Glass Shine Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* Animated Icon */}
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} 
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-green-500/30"
            >
              <FaCheck className="text-white text-4xl drop-shadow-md" />
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Booking Received!</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Your Himalayan journey begins here. Our travel expert will contact you shortly to confirm availability.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
            >
              Excellent!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const QuantityControl = ({ label, subLabel, icon: Icon, value, onChange, min = 0 }) => (
  <div>
    <label className="text-sm text-gray-200 mb-1 flex justify-between items-center">
      <span className="flex items-center gap-2">{Icon && <Icon className="text-[#D9A441]" />} {label}</span>
      <span className="text-xs text-gray-400 font-normal">{subLabel}</span>
    </label>
    <div className="flex items-center bg-white/5 rounded-xl border border-white/20 overflow-hidden backdrop-blur-sm">
      <button onClick={() => onChange(Math.max(min, Number(value) - 1))} className="p-3 hover:bg-white/10 text-yellow-400 active:scale-90 transition" disabled={Number(value) <= min}><FaMinus size={10} /></button>
      <div className="flex-1 text-center font-bold text-white select-none">{value}</div>
      <button onClick={() => onChange(Number(value) + 1)} className="p-3 hover:bg-white/10 text-yellow-400 active:scale-90 transition"><FaPlus size={10} /></button>
    </div>
  </div>
);

const TickButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
      active ? "bg-[#D9A441]/20 border-[#D9A441] shadow-[0_0_10px_rgba(217,164,65,0.1)]" : "bg-white/5 border-white/10 hover:bg-white/10"
    }`}
  >
    <span className={`text-sm font-medium ${active ? "text-[#D9A441]" : "text-gray-300"}`}>{label}</span>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${active ? "bg-[#D9A441] border-[#D9A441]" : "border-gray-500"}`}>
      {active && <FaCheck className="text-black text-xs" />}
    </div>
  </button>
);

// --- MAIN COMPONENT ---
export default function BookingSidebar({ tour = {} }) {
  const [open, setOpen] = useState(false); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Global Rates
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

  // Form State - Added Email
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    adults: 1, children: 0,
    roomType: "standard", transport: "sharing",
    bonfire: false, meal: false, tea: false, comfortSeat: false, tourGuide: false,
    rooms: 1
  });

  const handle = (k, v) =>
    setForm((p) => ({ ...p, [k]: (k === "adults" || k === "children" || k === "rooms") ? Number(v) : v }));

  // Phone Number Handler (Only Numbers, Max 10)
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 10) {
      handle("phone", value);
    }
  };

  // --- COUPON STATE & HANDLER ---
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if(!couponCode) return;
    setIsApplyingCoupon(true);
    setCouponMessage("");
    try {
      const res = await fetch(`/api/coupons?code=${couponCode}`);
      const data = await res.json();
      if(data.success) {
        setAppliedCoupon(data.data);
        setCouponMessage("Coupon Applied! 🎉");
      } else {
        setAppliedCoupon(null);
        setCouponMessage(data.error || "Invalid Coupon");
      }
    } catch(e) { setCouponMessage("Error applying coupon"); }
    setIsApplyingCoupon(false);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  };

  // Room Logic
  const minRoomsRequired = Math.max(1, Math.ceil(Number(form.adults || 0) / 3));
  useEffect(() => {
    if (form.rooms !== minRoomsRequired) handle("rooms", minRoomsRequired);
  }, [form.adults, minRoomsRequired]);

  // Price Calculation
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
    if (form.tea) price += totalPax * rates.tea * days;
    if (form.bonfire) price += rates.bonfire;
    if (form.tourGuide) price += rates.tourGuide;
    if (form.comfortSeat) price += rates.comfortSeat;

    const calculatedTotal = Math.max(0, Math.round(price));
    setFinalPrice(calculatedTotal);

    // Calculate Discount
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

  // --- BOOKING HANDLER ---
  const handleBook = async () => {
    if (!form.name.trim()) return alert("Please enter your Name");
    if (!form.phone || form.phone.length !== 10) return alert("Please enter a valid 10-digit Phone Number");
    
    setSubmitting(true);

    const bookingData = {
      ...form,
      phone: `+91 ${form.phone}`, // Add prefix for backend storage
      tourTitle: tour.title || "Custom Package",
      totalPrice: discountedPrice, // Send discounted price
      originalPrice: finalPrice, // Optional: track original price
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

  // --- RENDER VARIABLES (FIXED: NOT COMPONENTS) ---
  const selectorBtn = (active) =>
    `w-full py-3 rounded-xl font-semibold border flex items-center gap-2 justify-center transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-[#D9A441] to-[#b58b2d] text-black shadow-xl border-yellow-300 scale-[1.02]"
        : "bg-white/5 text-white border-white/20 hover:bg-white/10"
    }`;

  // --- CONTENT JSX (Inline to prevent re-mounts) ---
  const contentJsx = (
    <div className="space-y-6">
      
      {/* Inputs Section */}
      <div className="space-y-4">
        <div className="relative">
          <input 
            type="text" 
            value={form.name} 
            onChange={(e) => handle("name", e.target.value)} 
            className="w-full pl-4 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:border-[#D9A441] focus:bg-white/10 outline-none transition-colors text-white placeholder-gray-500" 
            placeholder="Full Name" 
          />
        </div>

        <div className="relative">
          <input 
            type="email" 
            value={form.email} 
            onChange={(e) => handle("email", e.target.value)} 
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:border-[#D9A441] focus:bg-white/10 outline-none transition-colors text-white placeholder-gray-500" 
            placeholder="Email Address (Optional)" 
          />
          <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        </div>
        
        <div className="relative flex items-center">
          <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 pr-3 border-r border-white/20 pointer-events-none">
            <span className="text-[#D9A441] font-bold text-sm">🇮🇳 +91</span>
          </div>
          <input 
            type="tel" 
            value={form.phone} 
            onChange={handlePhoneChange} 
            maxLength={10}
            className="w-full pl-24 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/20 focus:border-[#D9A441] focus:bg-white/10 outline-none transition-colors text-white placeholder-gray-500 tracking-wide font-medium" 
            placeholder="98765 43210" 
          />
        </div>
      </div>

      {/* Pax */}
      <div className="grid grid-cols-2 gap-3">
        <QuantityControl label="Adults" subLabel="13+" icon={FaUsers} value={form.adults} onChange={(v) => handle('adults', v)} min={1} />
        <QuantityControl label="Children" subLabel="3-13" icon={FaChild} value={form.children} onChange={(v) => handle('children', v)} min={0} />
      </div>

      {/* Rooms */}
      <div>
        <label className="text-sm text-gray-200 mb-2 block flex items-center gap-2"><FaHotel className="text-[#D9A441]" /> Room Preference</label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button className={selectorBtn(form.roomType === "standard")} onClick={() => handle("roomType", "standard")}>Standard</button>
          <button className={selectorBtn(form.roomType === "panoramic")} onClick={() => handle("roomType", "panoramic")}>Panoramic</button>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm">
          <button disabled={form.rooms <= minRoomsRequired} onClick={() => handle("rooms", Math.max(minRoomsRequired, Number(form.rooms) - 1))} className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${form.rooms <= minRoomsRequired ? "text-gray-600 cursor-not-allowed" : "bg-white/10 hover:bg-white/20 text-yellow-400"}`}><FaMinus size={10} /></button>
          <div className="text-center font-bold text-white">{form.rooms} Room{form.rooms > 1 ? "s" : ""}</div>
          <button onClick={() => handle("rooms", Number(form.rooms) + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-yellow-400"><FaPlus size={10} /></button>
        </div>
        <div className="mt-2 text-[10px] text-gray-400 text-right">Minimum rooms required: {minRoomsRequired}</div>
      </div>

      {/* Transport */}
      <div>
        <label className="text-sm text-gray-200 mb-2 block">Transport Mode</label>
        <div className="grid grid-cols-2 gap-3">
          <button className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${form.transport === "sharing" ? "bg-[#D9A441]/20 border-[#D9A441] text-white shadow-lg" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`} onClick={() => handle("transport", "sharing")}>
            <FaUsers className={`text-xl mb-1 ${form.transport === "sharing" ? "text-[#D9A441]" : "text-gray-500"}`} />
            <span className="text-sm font-medium">Sharing</span>
          </button>
          <button className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${form.transport === "personal" ? "bg-[#D9A441]/20 border-[#D9A441] text-white shadow-lg" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"}`} onClick={() => handle("transport", "personal")}>
            <FaCar className={`text-xl mb-1 ${form.transport === "personal" ? "text-[#D9A441]" : "text-gray-500"}`} />
            <span className="text-sm font-medium">Private Cab</span>
          </button>
        </div>
      </div>

      {/* Addons */}
      <div>
        <div className="text-sm text-gray-200 mb-2">Recommended Add-ons</div>
        <div className="grid grid-cols-2 gap-3">
          <TickButton label="Bonfire" active={form.bonfire} onClick={() => handle("bonfire", !form.bonfire)} />
          <TickButton label="Meals" active={form.meal} onClick={() => handle("meal", !form.meal)} />
          <TickButton label="Tea/Snacks" active={form.tea} onClick={() => handle("tea", !form.tea)} />
          <TickButton label="Comfort Seat" active={form.comfortSeat} onClick={() => handle("comfortSeat", !form.comfortSeat)} />
          <TickButton label="Tour Guide" active={form.tourGuide} onClick={() => handle("tourGuide", !form.tourGuide)} />
        </div>
      </div>

      {/* COUPON FIELD */}
      <div className="bg-white/5 border border-white/20 rounded-xl p-3">
        <div className="text-sm text-gray-200 mb-2 flex items-center gap-2"><FaTicketAlt className="text-[#D9A441]"/> Have a Coupon?</div>
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white uppercase placeholder-gray-500 focus:outline-none focus:border-[#D9A441]"
            placeholder="ENTER CODE"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            disabled={appliedCoupon}
          />
          {appliedCoupon ? (
            <button onClick={removeCoupon} className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-500/30">Remove</button>
          ) : (
            <button onClick={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon} className="bg-[#D9A441] text-black px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#eac34d] disabled:opacity-50">
              {isApplyingCoupon ? "..." : "Apply"}
            </button>
          )}
        </div>
        {couponMessage && (
          <p className={`text-xs mt-2 ${appliedCoupon ? "text-green-400" : "text-red-400"}`}>{couponMessage}</p>
        )}
      </div>

      {/* Price */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D9A441]/20 to-[#b58b2d]/5 border border-yellow-300/20 text-center shadow relative overflow-hidden group backdrop-blur-md">
        <div className="relative z-10">
          <div className="text-xs text-yellow-200 mb-1 font-medium uppercase tracking-wider opacity-80">Per Person Price</div>
          <div className="text-4xl font-extrabold text-white drop-shadow-md">₹{perHeadPrice.toLocaleString("en-IN")}</div>
          
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1">
            {appliedCoupon && (
              <div className="flex justify-between items-center text-xs text-green-400">
                <span>Coupon Discount</span>
                <span>- ₹{(finalPrice - discountedPrice).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs text-gray-300">
              <span>Total ({totalPersons} pax)</span>
              <div className="text-right">
                {appliedCoupon && <span className="line-through text-gray-500 mr-2">₹{finalPrice.toLocaleString()}</span>}
                <span className="font-bold text-[#D9A441] text-base">₹{discountedPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button 
        onClick={handleBook}
        disabled={submitting}
        className="w-full bg-gradient-to-r from-[#D9A441] to-[#F59E0B] text-black py-4 rounded-xl font-extrabold text-lg hover:shadow-[0_0_20px_rgba(217,164,65,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? <><FaSpinner className="animate-spin"/> Sending Request...</> : "Confirm Booking Request"}
      </button>
    </div>
  );

  // --- RENDER ---
  return (
    <>
      {/* POPUP OVERLAY */}
      <SuccessPopup isOpen={showSuccess} onClose={() => setShowSuccess(false)} />

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <div className="w-80 p-6 rounded-2xl sticky top-24 glass-effect text-white shadow-2xl border border-white/10 backdrop-blur-xl bg-[#0f172a]/80">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Customize Your Trip</h3>
          {contentJsx}
        </div>
      </div>

      {/* MOBILE TRIGGER BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999]">
        <div className="glass-effect p-4 rounded-t-3xl flex items-center gap-4 border-t border-white/20 bg-[#0f172a]/95 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-0.5">Total Estimate</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">₹{perHeadPrice.toLocaleString("en-IN")}</span>
              <span className="text-xs text-gray-300 font-medium">/ person</span>
            </div>
          </div>
          <button 
            onClick={() => setOpen(true)} 
            className="bg-gradient-to-r from-[#D9A441] to-[#F59E0B] text-black py-3 px-8 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
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
              className="fixed bottom-0 left-0 right-0 z-[2001] bg-[#0f172a] rounded-t-[2rem] border-t border-white/10 max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 w-full flex justify-center pt-4 pb-2 bg-[#0f172a] z-10" onClick={() => setOpen(false)}>
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

      {/* STYLES */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { display: none; }
        .glass-effect {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
      `}</style>
    </>
  );
}