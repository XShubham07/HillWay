// src/components/BookingSidebar.jsx
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
  FaChair
} from "react-icons/fa";

export default function BookingSidebar({ tour = {} }) {
  const [open, setOpen] = useState(false);

  // --- 1. GLOBAL RATES STATE ---
  const [globalRates, setGlobalRates] = useState({
    meal: 500,
    tea: 60,
    bonfire: 500,
    cab: 3200,
    stdRoom: 1500,
    panoRoom: 2500,
    tourGuide: 1000,
    comfortSeat: 800
  });

  // --- 2. FETCH GLOBAL PRICING ---
  useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const p = data.data;
          setGlobalRates({
            meal: p.mealPrice ?? globalRates.meal,
            tea: p.teaPrice ?? globalRates.tea,
            bonfire: p.bonfirePrice ?? globalRates.bonfire,
            cab: p.personalCabPrice ?? globalRates.cab,
            stdRoom: p.standardRoomPrice ?? globalRates.stdRoom,
            panoRoom: p.panoRoomPrice ?? globalRates.panoRoom,
            tourGuide: p.tourGuidePrice ?? globalRates.tourGuide,
            comfortSeat: p.comfortSeatPrice ?? globalRates.comfortSeat
          });
        }
      })
      .catch((err) => {
        // keep defaults on error
        console.error("Failed to load pricing", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FORM STATE ---
  const [form, setForm] = useState({
    name: "",
    phone: "",
    adults: 1,
    children: 0,
    roomType: "standard",
    transport: "sharing",
    bonfire: false,
    meal: false,
    tea: false,
    comfortSeat: false,
    tourGuide: false,
    rooms: 1
  });

  const handle = (k, v) =>
    setForm((p) => {
      // ensure numeric fields store numbers
      if (k === "adults" || k === "children" || k === "rooms") {
        return { ...p, [k]: Number(v) };
      }
      return { ...p, [k]: v };
    });

  // --- SMART ROOM LOGIC (1 Room per 3 Adults) ---
  // Use Math.max to ensure at least 1 room required
  const minRoomsRequired = Math.max(1, Math.ceil(Number(form.adults || 0) / 3));

  useEffect(() => {
    // When adults change, adjust rooms to match new minRoomsRequired.
    // This both increases and decreases rooms automatically.
    if (form.rooms !== minRoomsRequired) {
      handle("rooms", minRoomsRequired);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.adults, minRoomsRequired]);

  // --- 3. PRICE CALCULATION LOGIC ---
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    // A. DETERMINE EFFECTIVE RATES (Tour Specific > Global)
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

    const base = Number(tour?.basePrice ?? 0); // per adult full base
    const nights = Math.max(1, Number(tour?.nights ?? 1));
    const days = nights + 1;

    const adultCount = Math.max(0, Number(form.adults || 0));
    const childCount = Math.max(0, Number(form.children || 0));

    // 1. Base Tour Cost
    // Adults pay full base, children pay half (base/2)
    const adultBaseTotal = adultCount * base;
    const childBaseTotal = childCount * (base / 2);
    let price = adultBaseTotal + childBaseTotal;

    // 2. Accommodation Cost (roomRate * rooms * nights)
    const roomRate = form.roomType === "panoramic" ? rates.panoRoom : rates.stdRoom;
    price += roomRate * Number(form.rooms || 0) * nights;

    // 3. Transport
    if (form.transport === "personal") {
      // flat cab charge per tour (not per person)
      price += rates.cab;
    }

    // 4. Add-ons (per person per day where applicable)
    const totalPeopleForPerPersonAddons = adultCount + childCount;
    if (form.meal) price += totalPeopleForPerPersonAddons * rates.meal * days;
    if (form.tea) price += totalPeopleForPerPersonAddons * rates.tea * days;

    // --- FIXED: FLAT RATE LOGIC (PER TOUR) ---
    if (form.bonfire) price += rates.bonfire; // Flat Rate per tour
    if (form.tourGuide) price += rates.tourGuide; // Flat Rate per tour
    if (form.comfortSeat) price += rates.comfortSeat; // Flat Rate per tour

    // Safety: ensure not negative, round to 2 decimals
    price = Math.max(0, Math.round(price * 100) / 100);

    setFinalPrice(price);
  }, [form, tour, globalRates]);

  const totalPersons = Math.max(1, Number(form.adults || 0) + Number(form.children || 0)); // avoid div by zero
  const perHeadPrice = Math.round(finalPrice / totalPersons);

  // Body Scroll Lock when bottom sheet open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // --- SUB-COMPONENTS ---
  const selectorBtn = (active) =>
    `w-full py-3 rounded-xl font-semibold border flex items-center gap-2 justify-center transition-all duration-200 ${
      active
        ? "bg-gradient-to-r from-[#D9A441] to-[#b58b2d] text-black shadow-xl border-yellow-300 scale-[1.02]"
        : "bg-white/5 text-white border-white/20 hover:bg-white/10"
    }`;

  const TickButton = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
        active ? "bg-[#D9A441]/20 border-[#D9A441]" : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <span className={`text-sm font-medium ${active ? "text-[#D9A441]" : "text-gray-300"}`}>{label}</span>
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
          active ? "bg-[#D9A441] border-[#D9A441]" : "border-gray-500"
        }`}
      >
        {active && <FaCheck className="text-black text-xs" />}
      </div>
    </button>
  );

  const QuantityControl = ({ label, subLabel, icon: Icon, value, field, min = 0 }) => {
    const numericValue = Number(value || 0);
    return (
      <div>
        <label className="text-sm text-gray-200 mb-1 flex justify-between items-center">
          <span className="flex items-center gap-2">{Icon && <Icon />} {label}</span>
          <span className="text-xs text-gray-400 font-normal">{subLabel}</span>
        </label>
        <div className="flex items-center bg-white/5 rounded-xl border border-white/20 overflow-hidden">
          <button
            onClick={() => handle(field, Math.max(min, numericValue - 1))}
            className="p-3 hover:bg-white/10 text-yellow-400 active:scale-90 transition"
            disabled={numericValue <= min}
          >
            <FaMinus size={10} />
          </button>
          <div className="flex-1 text-center font-bold text-white select-none">{numericValue}</div>
          <button onClick={() => handle(field, numericValue + 1)} className="p-3 hover:bg-white/10 text-yellow-400 active:scale-90 transition">
            <FaPlus size={10} />
          </button>
        </div>
      </div>
    );
  };

  const TransportSelector = () => (
    <div className="grid grid-cols-2 gap-3">
      <button
        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
          form.transport === "sharing" ? "bg-[#D9A441]/20 border-[#D9A441] text-white shadow-lg" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
        }`}
        onClick={() => handle("transport", "sharing")}
      >
        <FaUsers className={`text-xl mb-1 ${form.transport === "sharing" ? "text-[#D9A441]" : "text-gray-500"}`} />
        <span className="text-sm font-medium">Sharing</span>
      </button>
      <button
        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${
          form.transport === "personal" ? "bg-[#D9A441]/20 border-[#D9A441] text-white shadow-lg" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
        }`}
        onClick={() => handle("transport", "personal")}
      >
        <FaCar className={`text-xl mb-1 ${form.transport === "personal" ? "text-[#D9A441]" : "text-gray-500"}`} />
        <span className="text-sm font-medium">Private Cab</span>
      </button>
    </div>
  );

  const RoomControl = () => (
    <div className="mt-4">
      <label className="text-sm text-gray-200 mb-2 block flex items-center gap-2"><FaBed /> Number of Rooms</label>
      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm">
        <button
          disabled={form.rooms <= minRoomsRequired}
          onClick={() => handle("rooms", Math.max(minRoomsRequired, Number(form.rooms) - 1))}
          className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${form.rooms <= minRoomsRequired ? "text-gray-600 cursor-not-allowed" : "bg-white/10 hover:bg-white/20 text-yellow-400"}`}
        >
          <FaMinus size={10} />
        </button>

        <div className="text-center font-bold text-white">{form.rooms} Room{form.rooms > 1 ? "s" : ""}</div>

        <button onClick={() => handle("rooms", Number(form.rooms) + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-yellow-400">
          <FaPlus size={10} />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-400">Minimum rooms required: {minRoomsRequired}</div>
    </div>
  );

  const PriceDisplayBox = () => (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D9A441]/20 to-[#b58b2d]/5 border border-yellow-300/20 text-center shadow relative overflow-hidden group backdrop-blur-md">
      <div className="relative z-10">
        <div className="text-sm text-yellow-200 mb-1 font-medium uppercase tracking-wider">Per Person</div>
        <div className="text-4xl font-extrabold text-white drop-shadow-md">₹{perHeadPrice.toLocaleString("en-IN")}</div>
        <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-xs text-gray-300">
          <span>Total ({totalPersons} pax)</span>
          <span className="font-bold text-[#D9A441]">₹{finalPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );

  // --- RENDER ---
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <div className="w-80 p-6 rounded-2xl sticky top-24 glass-effect text-white space-y-6 shadow-2xl">
          <div>
            <label className="text-sm text-gray-200">Traveller Name</label>
            <input type="text" value={form.name} onChange={(e) => handle("name", e.target.value)} className="mt-1 w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:border-yellow-400/50 outline-none" placeholder="Enter your name" />
          </div>
          <div>
            <label className="text-sm text-gray-200">Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => handle("phone", e.target.value)} className="mt-1 w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:border-yellow-400/50 outline-none" placeholder="9876543210" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuantityControl label="Adults" subLabel="13+" icon={FaUsers} value={form.adults} field="adults" min={1} />
            <QuantityControl label="Children" subLabel="3-13" icon={FaChild} value={form.children} field="children" min={0} />
          </div>
          <div>
            <label className="text-sm text-gray-200 mb-2 block"><FaHotel className="inline" /> Room Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button className={selectorBtn(form.roomType === "standard")} onClick={() => handle("roomType", "standard")}>Standard</button>
              <button className={selectorBtn(form.roomType === "panoramic")} onClick={() => handle("roomType", "panoramic")}>Panoramic</button>
            </div>
            <RoomControl />
          </div>
          <div><label className="text-sm text-gray-200 mb-2 block">Transport</label><TransportSelector /></div>
          <div>
            <div className="text-sm text-gray-200 mb-2">Add-ons</div>
            <div className="grid grid-cols-2 gap-3">
              <TickButton label="Bonfire" active={form.bonfire} onClick={() => handle("bonfire", !form.bonfire)} />
              <TickButton label="Meals" active={form.meal} onClick={() => handle("meal", !form.meal)} />
              <TickButton label="Tea" active={form.tea} onClick={() => handle("tea", !form.tea)} />
              <TickButton label="Comfort Seat" active={form.comfortSeat} onClick={() => handle("comfortSeat", !form.comfortSeat)} />
              <TickButton label="Tour Guide" active={form.tourGuide} onClick={() => handle("tourGuide", !form.tourGuide)} />
            </div>
          </div>
          <PriceDisplayBox />
          <button className="w-full bg-[#D9A441] text-black py-3 rounded-xl font-bold text-lg hover:bg-[#eac34d] transition-colors shadow-lg">Book Now</button>
        </div>
      </div>

      {/* MOBILE TRIGGER */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[999]">
        <div className="glass-effect p-4 rounded-t-3xl flex items-center gap-4 border-t border-white/20">
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wide mb-1">Total Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">₹{perHeadPrice.toLocaleString("en-IN")}</span>
              <span className="text-xs text-gray-300 font-medium">/ person</span>
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="bg-[#D9A441] text-black py-3 px-8 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform">Book Now</button>
        </div>
      </div>

      {/* MOBILE MODAL */}
      {open && (
        <div className="bottom-sheet-overlay">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />

          <div className="bottom-sheet-content glass-effect text-white shadow-2xl animate-slide-up" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex justify-center pt-4 pb-2 shrink-0" onClick={() => setOpen(false)}>
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="p-6 overflow-y-auto w-full custom-scroll" style={{ WebkitOverflowScrolling: "touch" }}>
              <div className="space-y-6 pb-24">
                <div className="space-y-3">
                  <input placeholder="Traveller Name" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#D9A441] outline-none" value={form.name} onChange={(e) => handle("name", e.target.value)} />
                  <input placeholder="Phone Number" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#D9A441] outline-none" value={form.phone} onChange={(e) => handle("phone", e.target.value)} />
                </div>
                <div>
                  <div className="text-[#D9A441] font-semibold mb-2 text-sm uppercase tracking-wide">Travellers</div>
                  <div className="grid grid-cols-2 gap-3">
                    <QuantityControl label="Adults" subLabel="13+" value={form.adults} field="adults" min={1} icon={FaUsers} />
                    <QuantityControl label="Children" subLabel="3-13" value={form.children} field="children" min={0} icon={FaChild} />
                  </div>
                </div>
                <div>
                  <div className="text-[#D9A441] font-semibold mb-2 text-sm uppercase tracking-wide">Accommodation</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={selectorBtn(form.roomType === "standard")} onClick={() => handle("roomType", "standard")}>Standard</button>
                    <button className={selectorBtn(form.roomType === "panoramic")} onClick={() => handle("roomType", "panoramic")}>Panoramic</button>
                  </div>
                  <RoomControl />
                </div>
                <div><label className="text-sm text-gray-200 mb-2 block">Transport</label><TransportSelector /></div>

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2 text-sm uppercase tracking-wide">Extras</div>
                  <div className="grid grid-cols-2 gap-3">
                    <TickButton label="Bonfire" active={form.bonfire} onClick={() => handle("bonfire", !form.bonfire)} />
                    <TickButton label="Meals" active={form.meal} onClick={() => handle("meal", !form.meal)} />
                    <TickButton label="Tea" active={form.tea} onClick={() => handle("tea", !form.tea)} />
                    <TickButton label="Comfort Seat" active={form.comfortSeat} onClick={() => handle("comfortSeat", !form.comfortSeat)} />
                    <TickButton label="Tour Guide" active={form.tourGuide} onClick={() => handle("tourGuide", !form.tourGuide)} />
                  </div>
                </div>

                <PriceDisplayBox />
                <div className="pt-2">
                  <button className="w-full bg-[#D9A441] text-black py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform">Confirm Booking</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .glass-effect {
          background: rgba(15, 23, 42, 0.65) !important;
          backdrop-filter: blur(24px) !important;
          -webkit-backdrop-filter: blur(24px) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5) !important;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .bottom-sheet-overlay { position: fixed !important; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999 !important; display: flex !important; align-items: flex-end !important; justify-content: center !important; }
        .bottom-sheet-content { width: 100% !important; max-width: 100% !important; max-height: 85vh !important; border-radius: 24px 24px 0 0 !important; display: flex !important; flex-direction: column !important; position: relative !important; }
      `}</style>
    </>
  );
}
