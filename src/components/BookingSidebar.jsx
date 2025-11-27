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
  FaChair // Comfort Seat Icon
} from "react-icons/fa";

export default function BookingSidebar({ tour }) {
  const [open, setOpen] = useState(false);

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
    rooms: 1, 
  });

  const handle = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Auto-calculate rooms
  useEffect(() => {
    const totalPersons = (Number(form.adults) || 0) + (Number(form.children) || 0);
    const calculatedRooms = Math.ceil(totalPersons / 3) || 1;
    if (totalPersons > form.rooms * 3) {
       handle("rooms", calculatedRooms);
    }
  }, [form.adults, form.children]);

  const [finalPrice, setFinalPrice] = useState(0);

  // --- Calculations ---
  const totalPersons = (Number(form.adults) || 0) + (Number(form.children) || 0);
  
  useEffect(() => {
    const base = Number(tour?.basePrice || 0);
    const adults = Math.max(1, Number(form.adults));
    const children = Math.max(0, Number(form.children));
    const persons = adults + children;

    const mealPrice = Number(tour?.pricing?.mealPerPerson ?? 450);
    const teaPrice = Number(tour?.pricing?.teaPerPerson ?? 60);
    const cabRate = Number(tour?.pricing?.personalCab?.rate ?? 3200);
    const comfortSeatPrice = 800; 

    let price = base * persons;

    if (form.meal) price += persons * mealPrice;
    if (form.tea) price += persons * teaPrice;
    if (form.comfortSeat) price += persons * comfortSeatPrice;
    if (form.bonfire) price += 499; 
    
    if (form.transport === "personal") price += cabRate;
    if (form.transport === "bus") price += 900 * persons;

    // Extra room cost logic
    const requiredRooms = Math.ceil(persons / 3);
    if (form.rooms > requiredRooms) {
        price += (form.rooms - requiredRooms) * 2000; 
    }

    setFinalPrice(price);
  }, [form, tour]);

  const perHeadPrice = totalPersons > 0 ? Math.round(finalPrice / totalPersons) : finalPrice;

  // Lock body scroll
  useEffect(() => {
    if (open) {
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
  }, [open]);

  // --- STYLES ---
  const selectorBtn = (active) =>
    `px-4 py-2 rounded-xl font-semibold border whitespace-nowrap flex items-center gap-2 justify-center transition-all ${
      active
        ? "bg-gradient-to-r from-[#D9A441] to-[#b58b2d] text-black shadow-xl border-yellow-300 scale-105"
        : "bg-white/5 text-white border-white/20 hover:bg-white/10"
    }`;

  const toggleClass = (active) =>
    `min-w-[100px] px-3 py-3 rounded-xl flex items-center gap-2 justify-center font-medium text-sm border transition-all ${
      active 
        ? "bg-[#D9A441] text-black shadow-lg border-yellow-300 scale-[1.02]" 
        : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
    }`;

  // --- COMPONENTS ---
  const QuantityControl = ({ label, subLabel, icon: Icon, value, field, min }) => (
    <div>
      <label className="text-sm text-gray-200 mb-1 flex justify-between items-center">
        <span className="flex items-center gap-2">{Icon && <Icon />} {label}</span>
        <span className="text-xs text-gray-400 font-normal">{subLabel}</span>
      </label>
      <div className="flex items-center bg-white/5 rounded-xl border border-white/20 overflow-hidden">
        <button
          onClick={() => handle(field, Math.max(min, value - 1))}
          className="p-3 hover:bg-white/10 text-yellow-400 transition active:scale-90"
        >
          <FaMinus size={10} />
        </button>
        <div className="flex-1 text-center font-bold text-white select-none">
          {value}
        </div>
        <button
          onClick={() => handle(field, value + 1)}
          className="p-3 hover:bg-white/10 text-yellow-400 transition active:scale-90"
        >
          <FaPlus size={10} />
        </button>
      </div>
    </div>
  );

  const PriceDisplayBox = () => (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D9A441]/20 to-[#b58b2d]/5 border border-yellow-300/20 text-center shadow relative overflow-hidden group backdrop-blur-md">
      <div className="relative z-10">
        <div className="text-sm text-yellow-200 mb-1 font-medium uppercase tracking-wider">Per Person</div>
        <div className="text-4xl font-extrabold text-white drop-shadow-md">
          ₹{perHeadPrice.toLocaleString("en-IN")}
        </div>
        
        <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-xs text-gray-300">
           <span>Total ({totalPersons} pax)</span>
           <span className="font-bold text-[#D9A441]">₹{finalPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );

  const RoomControl = () => (
    <div className="mt-4">
      <label className="text-sm text-gray-200 mb-2 block flex items-center gap-2">
        <FaBed /> Number of Rooms
      </label>
      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm">
         <button 
            onClick={() => handle("rooms", Math.max(1, form.rooms - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-yellow-400 transition"
         >
            <FaMinus size={10} />
         </button>
         
         <div className="text-center font-bold text-white">
            {form.rooms} Room{form.rooms > 1 ? "s" : ""}
         </div>
         
         <button 
            onClick={() => handle("rooms", form.rooms + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-yellow-400 transition"
         >
            <FaPlus size={10} />
         </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        /* ULTRA TRANSPARENT GLASS EFFECT */
        .glass-effect {
          background: rgba(15, 23, 42, 0.4) !important; /* Lower opacity for transparency */
          backdrop-filter: blur(24px) !important;
          -webkit-backdrop-filter: blur(24px) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .modal-overlay-fixed {
          position: fixed !important; top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9999 !important; display: flex !important;
          align-items: center !important; justify-content: center !important;
          padding: 1.5rem !important;
        }
        
        .modal-content-box {
          width: 100% !important; max-width: 400px !important;
          margin: 0 auto !important; max-height: 85vh !important;
          display: flex !important; flex-direction: column !important;
          position: relative !important;
        }
      `}</style>

      {/* DESKTOP SIDEBAR - Fully Transparent Glass */}
      <div className="hidden lg:block">
        <div className="w-80 p-6 rounded-2xl sticky top-24 glass-effect text-white space-y-6 shadow-2xl">
          
          <div>
            <label className="text-sm text-gray-200">Traveller Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handle("name", e.target.value)}
              className="mt-1 w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:border-yellow-400/50 focus:outline-none transition-colors backdrop-blur-sm"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-200">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handle("phone", e.target.value)}
              className="mt-1 w-full p-3 rounded-xl bg-white/5 border border-white/20 focus:border-yellow-400/50 focus:outline-none transition-colors backdrop-blur-sm"
              placeholder="9876543210"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <QuantityControl label="Adults" subLabel="13+" icon={FaUsers} value={form.adults} field="adults" min={1} />
            <QuantityControl label="Children" subLabel="3-13" icon={FaChild} value={form.children} field="children" min={0} />
          </div>

          <div>
            <label className="text-sm text-gray-200 mb-2 block"><FaHotel className="inline" /> Room Type</label>
            <div className="flex gap-2">
              <button className={selectorBtn(form.roomType === "standard")} onClick={() => handle("roomType", "standard")}>Standard</button>
              <button className={selectorBtn(form.roomType === "panoramic")} onClick={() => handle("roomType", "panoramic")}>Panoramic</button>
            </div>
            <RoomControl />
          </div>

          <div>
            <label className="text-sm text-gray-200 mb-2 block">Transport</label>
            <div className="flex gap-2">
              <button className={selectorBtn(form.transport === "sharing")} onClick={() => handle("transport", "sharing")}>Sharing</button>
              <button className={selectorBtn(form.transport === "personal")} onClick={() => handle("transport", "personal")}>Personal</button>
              <button className={selectorBtn(form.transport === "bus")} onClick={() => handle("transport", "bus")}>Bus</button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-200 mb-2">Add-ons</div>
            <div className="grid grid-cols-2 gap-2">
               <button className={`${toggleClass(form.bonfire)} w-full`} onClick={() => handle("bonfire", !form.bonfire)}>
                 {form.bonfire && <FaCheck />} Bonfire
               </button>
               <button className={`${toggleClass(form.meal)} w-full`} onClick={() => handle("meal", !form.meal)}>
                 {form.meal && <FaCheck />} Meals
               </button>
               <button className={`${toggleClass(form.tea)} w-full`} onClick={() => handle("tea", !form.tea)}>
                 {form.tea && <FaCheck />} Tea
               </button>
               <button className={`${toggleClass(form.comfortSeat)} w-full`} onClick={() => handle("comfortSeat", !form.comfortSeat)}>
                 {form.comfortSeat && <FaCheck />} Comfort Seat
               </button>
            </div>
          </div>

          {/* Price Box Moved to Bottom on Desktop too */}
          <PriceDisplayBox />

          <button className="w-full bg-[#D9A441] text-black py-3 rounded-xl font-bold text-lg hover:bg-[#eac34d] transition-colors shadow-lg">
             Book Now
          </button>
        </div>
      </div>

      {/* MOBILE FLOATING DOCK - Glassmorphism on Container */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass-effect rounded-2xl p-2 shadow-2xl flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 bg-[#D9A441] text-black py-3 rounded-xl font-bold text-lg shadow-md flex items-center justify-between px-6 active:scale-95 transition-transform"
          >
            <span>Book Now</span>
            <span className="text-sm font-medium bg-black/10 px-2 py-1 rounded-md">
               ₹{perHeadPrice.toLocaleString("en-IN")}/pax
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE MODAL - Glass Effect */}
      {open && (
        <div className="modal-overlay-fixed">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />

          <div
            // Applied .glass-effect here
            className="modal-content-box rounded-2xl glass-effect text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            <div className="p-6 overflow-y-auto w-full" style={{ WebkitOverflowScrolling: "touch" }}>
              
              <div className="space-y-6 pb-4">
                
                <div className="space-y-3">
                    <input
                      placeholder="Traveller Name"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#D9A441] transition-colors outline-none"
                      value={form.name}
                      onChange={(e) => handle("name", e.target.value)}
                    />
                    <input
                      placeholder="Phone Number"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#D9A441] transition-colors outline-none"
                      value={form.phone}
                      onChange={(e) => handle("phone", e.target.value)}
                    />
                </div>

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2 text-sm uppercase tracking-wide">Travellers</div>
                  <div className="grid grid-cols-2 gap-3">
                    <QuantityControl label="Adults" subLabel="13+" value={form.adults} field="adults" min={1} />
                    <QuantityControl label="Children" subLabel="3-13" value={form.children} field="children" min={0} />
                  </div>
                </div>

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2 text-sm uppercase tracking-wide">Accommodation</div>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button className={toggleClass(form.roomType === "standard")} onClick={() => handle("roomType", "standard")}>
                      <span className="flex items-center gap-2">{form.roomType === "standard" ? <FaCheck /> : null} Standard</span>
                    </button>
                    <button className={toggleClass(form.roomType === "panoramic")} onClick={() => handle("roomType", "panoramic")}>
                      <span className="flex items-center gap-2">{form.roomType === "panoramic" ? <FaCheck /> : null} Panoramic</span>
                    </button>
                  </div>
                  <RoomControl />
                </div>

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2 text-sm uppercase tracking-wide">Transport</div>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button className={toggleClass(form.transport === "sharing")} onClick={() => handle("transport", "sharing")}>
                      {form.transport === "sharing" ? <FaCheck /> : null} Sharing
                    </button>
                    <button className={toggleClass(form.transport === "personal")} onClick={() => handle("transport", "personal")}>
                      {form.transport === "personal" ? <FaCheck /> : null} Personal
                    </button>
                    <button className={toggleClass(form.transport === "bus")} onClick={() => handle("transport", "bus")}>
                      {form.transport === "bus" ? <FaCheck /> : null} Bus
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2 text-sm uppercase tracking-wide">Extras</div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className={toggleClass(form.bonfire)} onClick={() => handle("bonfire", !form.bonfire)}>
                      {form.bonfire && <FaCheck />} Bonfire
                    </button>
                    <button className={toggleClass(form.meal)} onClick={() => handle("meal", !form.meal)}>
                      {form.meal && <FaCheck />} Meals
                    </button>
                    <button className={toggleClass(form.tea)} onClick={() => handle("tea", !form.tea)}>
                      {form.tea && <FaCheck />} Tea
                    </button>
                    <button className={toggleClass(form.comfortSeat)} onClick={() => handle("comfortSeat", !form.comfortSeat)}>
                      {form.comfortSeat && <FaCheck />} Comfort Seat
                    </button>
                  </div>
                </div>

                <PriceDisplayBox />

                <div className="pt-2">
                  <button className="w-full bg-[#D9A441] text-black py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform">
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}