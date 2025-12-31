import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers, FaChild, FaCheck, FaPlus, FaMinus, FaTicketAlt,
  FaSpinner, FaTimes, FaExclamationTriangle, FaFire, FaCouch,
  FaUtensils, FaCoffee, FaHiking, FaCalendarAlt, FaLink, FaCopy, FaRupeeSign
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- STATUS POPUP COMPONENT ---
const StatusPopup = ({ isOpen, onClose, data, type }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Confetti Effect
  useEffect(() => {
    if (isOpen && type === 'success') {
      const count = 200;
      const defaults = {
        origin: { y: 0.5 },
        colors: ['#D9A441', '#ffffff', '#0891b2', '#F59E0B'],
        zIndex: 99995
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
      fire(0.35, { spread: 120, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 150, startVelocity: 30, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 180, startVelocity: 45 });
    }
  }, [isOpen, type]);

  const isSuccess = type === 'success';
  const refId = data?._id ? `#HW-${data._id.slice(-6).toUpperCase()}` : 'N/A';
  const trackingLink = data ? `${window.location.origin}/status?refId=${data._id.slice(-6).toUpperCase()}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99990] bg-black/85 backdrop-blur-md cursor-pointer"
          />

          <div className="fixed inset-0 z-[100000] flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`
                pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-[2.5rem]
                border shadow-2xl backdrop-blur-2xl text-center p-0
                ${isSuccess
                  ? "bg-gradient-to-b from-[#D9A441]/20 to-[#0f172a]/95 border-[#D9A441]/50"
                  : "bg-gradient-to-b from-red-500/20 to-[#0f172a]/95 border-red-500/50"}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

              <div className="relative p-8 z-10 flex flex-col items-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition text-white/70"
                >
                  <FaTimes size={14} />
                </button>

                <div className="relative mb-6">
                  {isSuccess && <div className="absolute inset-0 bg-[#D9A441] blur-2xl opacity-40 animate-pulse rounded-full"></div>}
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={isSuccess ? { scale: [1, 1.1, 1], rotate: 0 } : { scale: 1, rotate: 0 }}
                    transition={isSuccess
                      ? { scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, rotate: { type: "spring", stiffness: 200, delay: 0.1 } }
                      : { type: "spring", stiffness: 200, delay: 0.1 }
                    }
                    className={`
                      relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl z-10
                      ${isSuccess
                        ? "bg-gradient-to-tr from-[#D9A441] to-[#fbbf24] text-black shadow-[#D9A441]/50"
                        : "bg-gradient-to-tr from-red-500 to-red-400 text-white shadow-red-500/50"}
                    `}
                  >
                    {isSuccess ? <FaCheck className="text-4xl drop-shadow-md" /> : <FaExclamationTriangle className="text-3xl" />}
                  </motion.div>
                </div>

                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  {isSuccess ? "Booking Confirmed!" : "Booking Found"}
                </h3>

                <div className="bg-black/40 rounded-xl px-4 py-2 mb-4 border border-white/10 shadow-inner">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Reference ID</p>
                  <p className={`font-mono text-xl font-bold tracking-wider ${isSuccess ? "text-[#D9A441]" : "text-red-400"}`}>
                    {refId}
                  </p>
                </div>

                {isSuccess && (
                  <div className="w-full mb-6">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                          <FaLink size={10} />
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Tracking Link</p>
                          <p className="text-[10px] text-gray-300 truncate w-32 opacity-70">{trackingLink}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-md transition flex items-center gap-1.5 shrink-0"
                      >
                        {copied ? <FaCheck /> : <FaCopy />} {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-gray-300 text-sm leading-relaxed mb-8 font-medium px-2">
                  {isSuccess
                    ? "We have received your request! Use the link above or your Reference ID to track your status."
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
                      ? "bg-gradient-to-r from-[#D9A441] to-[#fbbf24] text-black shadow-[#D9A441]/30"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"}
                  `}
                >
                  {isSuccess ? "Awesome!" : "Okay, thanks"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

// ... [QuantityControl component] ...
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

// ... [TickButton component] ...
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

  // OTP & Submission State
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSending, setOtpSending] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [agreed, setAgreed] = useState(false);

  // Scroll Lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [open]);

  const [globalRates, setGlobalRates] = useState({
    meal: 500, tea: 60, bonfire: 500, cab: 3200,
    stdRoom: 1500, panoRoom: 2500, tourGuide: 1000, comfortSeat: 800
  });

  // Discount applicable items settings (which items are included in coupon discount calculation)
  const [discountSettings, setDiscountSettings] = useState({
    basePrice: true, roomCharges: true, transport: true,
    meal: true, tea: true, bonfire: true, tourGuide: true, comfortSeat: true
  });

  const [startingPoints, setStartingPoints] = useState([
    { name: "Siliguri", isDefault: true, requiresContact: false },
    { name: "Patna", isDefault: false, requiresContact: true }
  ]);

  useEffect(() => {
    fetch("https://admin.hillway.in/api/pricing")
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
          // Load discount settings
          if (p.discountApplicableItems) {
            setDiscountSettings({
              basePrice: p.discountApplicableItems.basePrice !== false,
              roomCharges: p.discountApplicableItems.roomCharges !== false,
              transport: p.discountApplicableItems.transport !== false,
              meal: p.discountApplicableItems.meal !== false,
              tea: p.discountApplicableItems.tea !== false,
              bonfire: p.discountApplicableItems.bonfire !== false,
              tourGuide: p.discountApplicableItems.tourGuide !== false,
              comfortSeat: p.discountApplicableItems.comfortSeat !== false
            });
          }
          // Load starting points
          if (p.startingPoints && p.startingPoints.length > 0) {
            setStartingPoints(p.startingPoints);
          }
        }
      })
      .catch((err) => console.error("Failed to load pricing", err));
  }, []);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", travelDate: null,
    adults: 3, children: 0,
    roomType: "standard",
    transport: "sharing", // Default to sharing
    bonfire: false, meal: false, tea: false, comfortSeat: false, tourGuide: false,
    rooms: 1,
    startingPoint: "siliguri"
  });

  const navigate = useNavigate();
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [selectedContactPoint, setSelectedContactPoint] = useState("");

  const handleStartingPointChange = (value) => {
    const point = startingPoints.find(p => p.name.toLowerCase() === value.toLowerCase());
    if (point && point.requiresContact) {
      setSelectedContactPoint(point.name);
      setShowContactPopup(true);
      return;
    }
    handle("startingPoint", value);
  };

  const handleContactConfirm = () => {
    setShowContactPopup(false);
    navigate("/contact");
  };

  const handleContactCancel = () => {
    setShowContactPopup(false);
    const defaultPoint = startingPoints.find(p => p.isDefault) || startingPoints[0];
    handle("startingPoint", defaultPoint?.name?.toLowerCase() || "siliguri");
  };

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
      const res = await fetch(`https://admin.hillway.in/api/coupons?code=${couponCode}`);
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

  const minRoomsRequired = Math.max(1, Math.ceil(Number(form.adults || 0) / 4));
  useEffect(() => {
    if (form.rooms !== minRoomsRequired) handle("rooms", minRoomsRequired);
  }, [form.adults, minRoomsRequired]);

  const [finalPrice, setFinalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [kidsPrice, setKidsPrice] = useState(0);
  const [adultsPrice, setAdultsPrice] = useState(0);
  const [discountedKidsPrice, setDiscountedKidsPrice] = useState(0);
  const [discountedAdultsPrice, setDiscountedAdultsPrice] = useState(0);
  const [priceBreakdown, setPriceBreakdown] = useState(null);

  useEffect(() => {
    const rates = {
      meal: tour?.pricing?.mealPerPerson ?? globalRates.meal,
      tea: tour?.pricing?.teaPerPerson ?? globalRates.tea,
      bonfire: tour?.pricing?.bonfire ?? globalRates.bonfire,
      cab: tour?.pricing?.personalCab?.rate ?? globalRates.cab,
      stdRoom: tour?.pricing?.room?.standard ?? globalRates.stdRoom,
      panoRoom: tour?.pricing?.room?.panoramic ?? globalRates.panoRoom,
      tourGuide: tour?.pricing?.tourGuide ?? globalRates.tourGuide,
      comfortSeat: tour?.pricing?.comfortSeat ?? globalRates.comfortSeat,
      sharingPrice: tour?.pricing?.sharingPrice ?? 0,
    };

    const base = Number(tour?.basePrice ?? 0);
    const nights = Math.max(1, Number(tour?.nights ?? 1));
    const days = nights + 1;
    const adultCount = Math.max(0, Number(form.adults || 0));
    const childCount = Math.max(0, Number(form.children || 0));
    const totalPax = adultCount;

    // Calculate room price per person per night
    const roomPricePerNight = (form.roomType === "panoramic" ? rates.panoRoom : rates.stdRoom);
    const roomChargesTotal = roomPricePerNight * Number(form.rooms || 0) * nights;
    const roomPricePerAdult = adultCount > 0 ? roomChargesTotal / adultCount : 0;

    // Kids price calculation: use the kidsPrice from tour data
    // If tour doesn't have kidsPrice set, fall back to 0
    const perKidPrice = Number(tour?.kidsPrice ?? 0);
    const totalKidsPrice = childCount * perKidPrice;
    setKidsPrice(totalKidsPrice);

    // Track individual cost components for discount calculation
    // Adults pay full base price, kids price is calculated separately
    const costs = {
      basePrice: adultCount * base,
      roomCharges: roomChargesTotal,
      kidsPrice: totalKidsPrice,
      transport: 0,
      meal: 0,
      tea: 0,
      bonfire: 0,
      tourGuide: 0,
      comfortSeat: 0
    };

    // --- TRANSPORT LOGIC ---
    if (form.transport === "personal") {
      costs.transport = rates.cab;
    } else if (form.transport === "self") {
      costs.transport = -(rates.sharingPrice * totalPax); // Negative for deduction
    }

    // --- ADDONS ---
    if (form.meal) costs.meal = totalPax * rates.meal * days;
    if (form.tea) costs.tea = totalPax * (form.meal ? 0 : rates.tea) * days;
    if (form.bonfire) costs.bonfire = rates.bonfire;
    if (form.tourGuide) costs.tourGuide = rates.tourGuide;
    if (form.comfortSeat) costs.comfortSeat = rates.comfortSeat;


    // Calculate adults total (base + room + addons)
    const adultsTotal = Math.max(0, Math.round(
      costs.basePrice + costs.roomCharges + costs.transport +
      costs.meal + costs.tea + costs.bonfire + costs.tourGuide + costs.comfortSeat
    ));
    setAdultsPrice(adultsTotal);

    // Calculate total price (including kids price in grand total)
    const calculatedTotal = Math.max(0, Math.round(adultsTotal + costs.kidsPrice));
    setFinalPrice(calculatedTotal);

    let dKidsPrice = Math.round(costs.kidsPrice);
    let dAdultsPrice = adultsTotal;
    let dTotalPrice = calculatedTotal;

    // Calculate discountable amount based on settings
    if (appliedCoupon) {
      let discountableAmount = 0;
      if (discountSettings.basePrice) discountableAmount += costs.basePrice + costs.kidsPrice;
      if (discountSettings.roomCharges) discountableAmount += costs.roomCharges;
      if (discountSettings.transport) discountableAmount += costs.transport;
      if (discountSettings.meal) discountableAmount += costs.meal;
      if (discountSettings.tea) discountableAmount += costs.tea;
      if (discountSettings.bonfire) discountableAmount += costs.bonfire;
      if (discountSettings.tourGuide) discountableAmount += costs.tourGuide;
      if (discountSettings.comfortSeat) discountableAmount += costs.comfortSeat;

      discountableAmount = Math.max(0, discountableAmount);

      let discount = 0;
      if (appliedCoupon.discountType === 'PERCENTAGE') {
        discount = (discountableAmount * appliedCoupon.discountValue) / 100;
      } else {
        discount = Math.min(appliedCoupon.discountValue, discountableAmount);
      }
      dTotalPrice = Math.max(0, Math.round(calculatedTotal - discount));

      // Calculate discounted kids price
      if (costs.kidsPrice > 0 && discountSettings.basePrice) {
        let kidsDiscount = 0;
        if (appliedCoupon.discountType === 'PERCENTAGE') {
          kidsDiscount = (costs.kidsPrice * appliedCoupon.discountValue) / 100;
        } else {
          const kidsShareOfDiscountable = discountableAmount > 0 ? costs.kidsPrice / discountableAmount : 0;
          kidsDiscount = discount * kidsShareOfDiscountable;
        }
        dKidsPrice = Math.max(0, Math.round(costs.kidsPrice - kidsDiscount));
      }

      // Discounted adults price is total minus discounted kids
      dAdultsPrice = dTotalPrice - dKidsPrice;
    }

    setDiscountedPrice(dTotalPrice);
    setDiscountedKidsPrice(dKidsPrice);
    setDiscountedAdultsPrice(dAdultsPrice);

    // Store enhanced price breakdown for booking data
    setPriceBreakdown({
      basePrice: Math.round(costs.basePrice),
      kidsPrice: Math.round(costs.kidsPrice),
      hotelPrice: Math.round(costs.roomCharges),
      cabPrice: costs.transport > 0 ? Math.round(costs.transport) : 0,
      mealPrice: Math.round(costs.meal),
      teaPrice: Math.round(costs.tea),
      bonfirePrice: Math.round(costs.bonfire),
      tourGuidePrice: Math.round(costs.tourGuide),
      comfortSeatPrice: Math.round(costs.comfortSeat),
      panoramicRoomPrice: form.roomType === 'panoramic' ? Math.round(costs.roomCharges) : 0,
      // Enhanced fields for display
      adultsTotal: adultsTotal,
      discountedAdultsTotal: dAdultsPrice,
      discountedKidsTotal: dKidsPrice
    });
  }, [form, tour, globalRates, appliedCoupon, discountSettings]);

  // Per adult price calculation (using discounted adults price)
  const adultCount = Math.max(1, Number(form.adults));
  const perHeadPrice = Math.round(discountedAdultsPrice / adultCount);
  const originalPerHeadPrice = Math.round(adultsPrice / adultCount);

  // --- OTP HELPERS UPDATED ---
  const otpRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    // Allow only single digit
    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // --- ACTIONS ---
  const handleInitiateBooking = async () => {
    if (!form.travelDate) return alert("Please select a Journey Date");
    if (!form.name.trim()) return alert("Please enter your Name");
    if (!form.phone || form.phone.length !== 10) return alert("Please enter a valid 10-digit Phone Number");
    if (!form.email.trim()) return alert("Please enter your Email");
    if (!agreed) return alert("Please agree to the Terms & Conditions");

    setOtpSending(true);
    setOtpError("");

    try {
      // Check for existing bookings BEFORE sending OTP
      const checkRes = await fetch('https://admin.hillway.in/api/bookings/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91 ${form.phone}`,
          tourTitle: tour.title || "Custom Package"
        })
      });

      const checkData = await checkRes.json();

      if (checkData.exists) {
        // Show existing booking popup
        setPopupData({ type: 'duplicate', data: checkData.booking });
        setOtpSending(false);
        return;
      }

      // No existing booking found, proceed with OTP
      const res = await fetch('https://admin.hillway.in/api/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, name: form.name })
      });
      const data = await res.json();

      if (data.success) {
        setStep('otp');
      } else {
        alert(data.error || "Failed to send verification code");
      }
    } catch (err) {
      alert("Connection failed. Please try again.");
    }
    setOtpSending(false);
  };

  const handleVerifyAndBook = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Please enter the complete 6-digit code");
      return;
    }

    setSubmitting(true);
    setOtpError("");

    const bookingData = {
      ...form,
      phone: `+91 ${form.phone}`,
      tourTitle: tour.title || "Custom Package",
      totalPrice: discountedPrice,
      originalPrice: finalPrice,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      startingPoint: startingPoints.find(p => p.name.toLowerCase() === form.startingPoint)?.name || form.startingPoint,
      priceBreakdown: priceBreakdown,
      addons: {
        bonfire: form.bonfire,
        meal: form.meal,
        tea: form.tea,
        comfortSeat: form.comfortSeat,
        tourGuide: form.tourGuide
      },
      otp: code
    };

    try {
      const res = await fetch('https://admin.hillway.in/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();

      if (res.status === 409) {
        setPopupData({ type: 'duplicate', data: data.existingBooking });
        setOpen(false);
        setStep('form');
        setOtp(['', '', '', '', '', '']);
      } else if (data.success) {
        setPopupData({ type: 'success', data: data.data });
        setOpen(false);
        setStep('form');
        setOtp(['', '', '', '', '', '']);
      } else {
        setOtpError(data.error || "Verification failed");
      }
    } catch (err) {
      setOtpError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const renderActionButtons = () => {
    if (step === 'otp') {
      return (
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-center text-gray-300 text-sm mb-3">
              Enter the code sent to <span className="text-[#D9A441]">{form.email}</span>
            </p>
            <div className="flex justify-center gap-2 sm:gap-3 mb-2 px-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-black/40 border border-white/20 rounded-lg text-center text-xl font-bold text-white focus:border-[#D9A441] focus:outline-none transition-colors"
                />
              ))}
            </div>
            {otpError && <p className="text-red-400 text-xs text-center font-bold animate-pulse">{otpError}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('form')}
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 transition"
            >
              Back
            </button>
            <button
              onClick={handleVerifyAndBook}
              disabled={submitting}
              className="flex-[2] bg-[#D9A441] hover:bg-[#fbbf24] text-black py-3.5 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(217,164,65,0.15)] transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? <><FaSpinner className="animate-spin" /> Verifying...</> : "Verify & Book"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={handleInitiateBooking}
        disabled={otpSending || !agreed}
        className="w-full bg-[#D9A441] hover:bg-[#fbbf24] text-black py-3.5 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(217,164,65,0.15)] transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {otpSending ? <><FaSpinner className="animate-spin" /> Checking...</> : "Proceed to Book"}
      </button>
    );
  };

  const getTransportSliderStyle = () => {
    switch (form.transport) {
      case 'self': return { left: '4px', width: 'calc((100% - 8px) / 3)' };
      case 'sharing': return { left: 'calc(4px + (100% - 8px) / 3)', width: 'calc((100% - 8px) / 3)' };
      case 'personal': return { left: 'calc(4px + 2 * (100% - 8px) / 3)', width: 'calc((100% - 8px) / 3)' };
      default: return { left: '4px', width: 'calc((100% - 8px) / 3)' };
    }
  };

  const contentJsx = (
    <div className="space-y-6 text-gray-100">
      <div className="hidden lg:block pb-4 border-b border-white/5">
        <h3 className="text-xl font-bold text-white tracking-wide">
          Book Your Trip
        </h3>
        <p className="text-gray-400 text-xs mt-1">Instant confirmation & transparent pricing</p>
      </div>

      {step === 'form' && (
        <div className="space-y-3">
          {/* Date Picker */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <FaCalendarAlt className="text-[#D9A441] text-lg" />
            </div>
            <DatePicker
              selected={form.travelDate}
              onChange={(date) => handle("travelDate", date)}
              onFocus={(e) => e.target.blur()} // Prevent Keyboard
              minDate={new Date()}
              placeholderText="Select Journey Date"
              dateFormat="dd MMM yyyy"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white font-medium outline-none transition-all text-base sm:text-sm cursor-pointer placeholder-gray-500"
              calendarClassName="!bg-[#1e293b] !border-white/10 !text-white !font-sans !rounded-xl !shadow-2xl !p-3 custom-datepicker"
              dayClassName={() => "!text-gray-200 hover:!bg-[#D9A441] hover:!text-black !rounded-full"}
              monthClassName={() => "!text-[#D9A441] !font-bold"}
              weekDayClassName={() => "!text-gray-500"}
              popperClassName="!z-[99999]"
              wrapperClassName="w-full"
            />
            <style>{`
                  .custom-datepicker .react-datepicker__header { background: transparent; border-bottom: 1px solid rgba(255,255,255,0.1); }
                  .custom-datepicker .react-datepicker__current-month { color: white; margin-bottom: 10px; }
                  .custom-datepicker .react-datepicker__day--selected { background-color: #D9A441 !important; color: black !important; font-weight: bold; }
                  .custom-datepicker .react-datepicker__day--keyboard-selected { background-color: rgba(217, 164, 65, 0.3) !important; color: white !important; }
                  .react-datepicker__triangle { display: none; }
                  .react-datepicker-popper { z-index: 100000 !important; }
              `}</style>
          </div>

          {/* Starting Point */}
          <div className="relative">
            <select
              value={form.startingPoint}
              onChange={(e) => handleStartingPointChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white font-medium outline-none transition-all text-base sm:text-sm cursor-pointer appearance-none"
            >
              {startingPoints.map((point, idx) => (
                <option key={idx} value={point.name.toLowerCase()} className="bg-[#1e293b] text-white">
                  📍 Starting Point: {point.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <input
            type="text"
            value={form.name}
            onChange={(e) => handle("name", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white placeholder-gray-500 outline-none transition-all text-base sm:text-sm"
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
                className="w-full pl-14 pr-3 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white placeholder-gray-500 font-medium outline-none transition-all text-base sm:text-sm"
                placeholder="Mobile Number"
              />
            </div>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handle("email", e.target.value)}
              className="w-full sm:flex-[1.2] px-4 py-3 rounded-xl bg-black/20 border border-white/5 focus:border-[#D9A441]/50 text-white placeholder-gray-500 outline-none transition-all text-base sm:text-sm"
              placeholder="Email"
            />
          </div>
        </div>
      )}

      {/* Adults/Kids */}
      <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
        <QuantityControl label="Adults" subLabel="5+" icon={FaUsers} value={form.adults} onChange={(v) => handle('adults', v)} min={2} />
        <QuantityControl label="Kids" subLabel="Upto 5" icon={FaChild} value={form.children} onChange={(v) => handle('children', v)} min={0} />
      </div>

      {/* Transport/RoomType */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-center isolate">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 text-center">Transport</label>
            <div className="flex bg-black/30 rounded-lg p-1 relative transform-gpu">
              <motion.div
                layout
                className="absolute inset-y-1 bg-[#D9A441] rounded-md shadow-md z-[1]"
                initial={false}
                animate={getTransportSliderStyle()}
              />
              <button onClick={() => handle('transport', 'self')} className="flex-1 relative z-[2] text-[10px] font-bold py-1.5 text-center transition-colors text-white">Self</button>
              <button onClick={() => handle('transport', 'sharing')} className="flex-1 relative z-[2] text-[10px] font-bold py-1.5 text-center transition-colors text-white">Sharing</button>
              <button onClick={() => handle('transport', 'personal')} className="flex-1 relative z-[2] text-[10px] font-bold py-1.5 text-center transition-colors text-white">Cab</button>
            </div>
          </div>

          <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex flex-col justify-center isolate">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 text-center">Room Type</label>
            <div className="flex bg-black/30 rounded-lg p-1 relative transform-gpu">
              <motion.div
                layout
                className="absolute inset-y-1 bg-[#D9A441] rounded-md shadow-md z-[1]"
                initial={false}
                animate={{
                  left: form.roomType === 'standard' ? 4 : '50%',
                  width: 'calc(50% - 4px)'
                }}
              />
              <button onClick={() => handle('roomType', 'standard')} className="flex-1 relative z-[2] text-[10px] font-bold py-1.5 text-center transition-colors text-white">Standard</button>
              <button onClick={() => handle('roomType', 'panoramic')} className="flex-1 relative z-[2] text-[10px] font-bold py-1.5 text-center transition-colors text-white">Panaromoic</button>
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

      {/* Enhancements */}
      <div className="pt-2">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Add-On</p>
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

      {/* Coupon */}
      <div className="bg-black/20 border border-white/5 rounded-xl p-2.5 flex items-center gap-3 relative">
        <div className="p-1.5 bg-[#D9A441]/10 rounded text-[#D9A441]"><FaTicketAlt size={12} /></div>
        <div className="flex-1 flex gap-2 items-center">
          <input
            className="flex-1 bg-transparent text-xs text-white uppercase placeholder-gray-600 focus:outline-none font-bold tracking-wider"
            placeholder="PROMO CODE"
            value={couponCode}
            onChange={e => setCouponCode(e.target.value)}
            disabled={appliedCoupon}
          />
          {appliedCoupon ? (
            <>
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[9px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20"
              >
                CODE APPLIED
              </motion.span>
              <button onClick={removeCoupon} className="text-red-400 text-[10px] font-bold hover:text-red-300">REMOVE</button>
            </>
          ) : (
            <button onClick={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon} className="text-[#D9A441] text-[10px] font-bold hover:text-yellow-300 disabled:opacity-50">APPLY</button>
          )}
        </div>
      </div>
      {!appliedCoupon && couponMessage && <p className="text-[10px] text-center -mt-4 text-yellow-400">{couponMessage}</p>}
      {appliedCoupon && <p className="text-[11px] text-center text-yellow-500 -mt-2 mb-2">⚠️ Discount not applicable on addons</p>}

      <motion.div
        animate={appliedCoupon ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.4 }}
        className="p-5 rounded-3xl bg-gradient-to-br from-[#D9A441]/10 via-black/20 to-transparent border border-[#D9A441]/20 shadow-lg backdrop-blur-md"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Estimated / Adult</p>
            {appliedCoupon && originalPerHeadPrice !== perHeadPrice ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 line-through decoration-red-500/80">
                  ₹{originalPerHeadPrice.toLocaleString("en-IN")}
                </span>
                <motion.div
                  key={perHeadPrice}
                  initial={{ y: 5, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  className="text-2xl font-black text-[#D9A441] tracking-tight"
                >
                  ₹{perHeadPrice.toLocaleString("en-IN")}
                </motion.div>
              </div>
            ) : (
              <motion.div
                key={perHeadPrice}
                initial={{ y: 5, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="text-2xl font-black text-[#D9A441] tracking-tight"
              >
                ₹{perHeadPrice.toLocaleString("en-IN")}
              </motion.div>
            )}
          </div>

          {/* Right Column: Show Adults Total only when kids selected, otherwise Grand Total */}
          <div className="text-right flex flex-col items-end">
            {Number(form.children) > 0 ? (
              <>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Adults Total</p>
                {appliedCoupon && adultsPrice !== discountedAdultsPrice ? (
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 line-through decoration-red-500/80">
                      ₹{adultsPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-lg font-bold text-white">
                      ₹{discountedAdultsPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-white">
                    ₹{adultsPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </>
            ) : (
              <>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Grand Total</p>
                {appliedCoupon ? (
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-xs font-semibold line-through decoration-red-500/80 mb-0.5">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-emerald-400 text-[11px] font-bold mb-1 flex items-center gap-1 bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-500/20"
                    >
                      <span>Saved ₹{(finalPrice - discountedPrice).toLocaleString()}</span>
                      <span className="animate-bounce">🎉</span>
                    </motion.div>
                    <motion.span
                      key={discountedPrice}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-white tracking-wide"
                    >
                      ₹{discountedPrice.toLocaleString("en-IN")}
                    </motion.span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-white tracking-wide">
                    ₹{finalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Kids price display - shown below adult price */}
        {kidsPrice > 0 && (
          <div className="flex justify-between items-center mb-4 px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2">
              <FaChild className="text-cyan-400 text-xs" />
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">Kids Price ({form.children} kid{form.children > 1 ? 's' : ''})</span>
            </div>
            <div className="flex items-center gap-2">
              {appliedCoupon && kidsPrice !== discountedKidsPrice ? (
                <>
                  <span className="text-[11px] text-gray-500 line-through decoration-red-500/80">
                    ₹{kidsPrice.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-bold text-cyan-400">
                    ₹{discountedKidsPrice.toLocaleString("en-IN")}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-cyan-400">
                  ₹{kidsPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Grand Total Section - Only show when kids are selected */}
        {Number(form.children) > 0 && (
          <div className="flex justify-between items-end mb-6 pt-3 border-t border-white/10">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Grand Total</p>

            {appliedCoupon ? (
              <div className="flex flex-col items-end">
                <span className="text-gray-500 text-xs font-semibold line-through decoration-red-500/80 mb-0.5">
                  ₹{finalPrice.toLocaleString()}
                </span>
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-emerald-400 text-[11px] font-bold mb-1 flex items-center gap-1 bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-500/20"
                >
                  <span>Saved ₹{(finalPrice - discountedPrice).toLocaleString()}</span>
                  <span className="animate-bounce">🎉</span>
                </motion.div>
                <motion.span
                  key={discountedPrice}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-white tracking-wide"
                >
                  ₹{discountedPrice.toLocaleString("en-IN")}
                </motion.span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-white tracking-wide">
                ₹{finalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        )}

        {/* Spacer when no kids - for consistent layout */}
        {Number(form.children) === 0 && <div className="mb-6" />}

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 mb-4 px-1">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-600 bg-black/40 text-[#D9A441] focus:ring-[#D9A441] cursor-pointer accent-[#D9A441]"
          />
          <label htmlFor="terms" className="text-xs text-gray-400 leading-tight select-none cursor-pointer">
            I agree to the <Link to="/terms" target="_blank" className="text-[#D9A441] font-bold hover:underline hover:text-white transition">Terms & Conditions</Link> and Cancellation Policy.
          </label>
        </div>

        {renderActionButtons()}
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

      {/* Contact Required Starting Point Popup */}
      {createPortal(
        <AnimatePresence>
          {showContactPopup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleContactCancel}
                className="fixed inset-0 z-[99990] bg-black/80 backdrop-blur-sm"
              />
              <div className="fixed inset-0 z-[99995] flex items-center justify-center px-4 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="pointer-events-auto bg-[#1e293b] border border-[#D9A441]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                >
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-[#D9A441]/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📍</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{selectedContactPoint} Starting Point</h3>
                    <p className="text-gray-400 text-sm">
                      For {selectedContactPoint} starting point, please contact us for more details on pricing and availability.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleContactCancel}
                      className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 transition border border-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleContactConfirm}
                      className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#D9A441] text-black hover:bg-[#fbbf24] transition shadow-lg"
                    >
                      Contact Us
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
      <div className="hidden lg:block">
        <div className="
          w-full p-6 rounded-3xl sticky top-24 
          bg-[#0f172a]/40 backdrop-blur-md
          border border-white/10 shadow-2xl
        ">
          {contentJsx}
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999]">
        <div className="p-3 px-5 rounded-t-3xl flex items-center gap-4 border-t border-white/10 bg-[#0f172a]/60 backdrop-blur-lg shadow-2xl">
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
              // FIXED: Removed heavy backdrop-blur-xl from scrolling element to prevent mobile frame drop/flicker
              // Added transform-gpu to force hardware acceleration
              className="fixed bottom-0 left-0 right-0 z-[2001] bg-[#0f172a] rounded-t-[2.5rem] border-t border-white/10 max-h-[85vh] overflow-y-auto shadow-2xl overscroll-contain transform-gpu will-change-transform"
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