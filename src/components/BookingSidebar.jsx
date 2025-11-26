// src/components/BookingSidebar.jsx
import { useState, useEffect } from "react";
import {
  FaUsers,
  FaChild,
  FaHotel,
  FaCheck,
  FaPlus,
  FaMinus,
  FaBed
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
  });

  const handle = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const [finalPrice, setFinalPrice] = useState(0);

  // --- Derived Calculations ---
  const totalPersons = (Number(form.adults) || 0) + (Number(form.children) || 0);
  
  // Logic: 1-3 pax = 1 room, 4-6 pax = 2 rooms, 7-9 pax = 3 rooms, etc.
  const numberOfRooms = Math.ceil(totalPersons / 3) || 1; 

  const showPerHead = totalPersons > 2;
  const perHeadPrice = totalPersons > 0 ? Math.round(finalPrice / totalPersons) : 0;

  useEffect(() => {
    const base = Number(tour?.basePrice || 0);
    const adults = Math.max(1, Number(form.adults));
    const children = Math.max(0, Number(form.children));
    const persons = adults + children;

    const mealPrice = Number(tour?.pricing?.mealPerPerson ?? 450);
    const teaPrice = Number(tour?.pricing?.teaPerPerson ?? 60);
    const cabRate = Number(tour?.pricing?.personalCab?.rate ?? 3200);

    let price = base * persons;

    if (form.meal) price += persons * mealPrice;
    if (form.tea) price += persons * teaPrice;
    if (form.bonfire) price += 499;
    if (form.transport === "personal") price += cabRate;
    if (form.transport === "bus") price += 900;

    setFinalPrice(price);
  }, [form, tour]);

  // Lock body scroll when open
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

  const selectorBtn = (active) =>
    `px-4 py-2 rounded-xl font-semibold border whitespace-nowrap flex items-center gap-2 justify-center ${
      active
        ? "bg-gradient-to-r from-[#D9A441] to-[#b58b2d] text-black shadow-xl border-yellow-300"
        : "bg-white/10 text-white border-white/20"
    }`;

  const toggleClass = (active) =>
    `min-w-[110px] px-4 py-2 rounded-2xl flex items-center gap-2 justify-center font-semibold border ${
      active ? "bg-[#D9A441] text-black shadow-lg border-yellow-300" : "bg-white/10 text-white border-white/20"
    }`;

  // Helper component for Quantity Inputs
  const QuantityControl = ({ label, icon: Icon, value, field, min }) => (
    <div>
      <label className="text-sm flex items-center gap-2 text-gray-200 mb-1">
        {Icon && <Icon />} {label}
      </label>
      <div className="flex items-center bg-white/10 rounded-xl border border-white/20 overflow-hidden">
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
    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#D9A441]/30 to-[#b58b2d]/10 border border-yellow-300/20 text-center shadow">
      <div className="text-sm text-gray-200">Total (final)</div>
      <div className="text-3xl font-extrabold text-[#D9A441]">
        ₹{finalPrice.toLocaleString("en-IN")}
      </div>
      {showPerHead && (
        <div className="text-xs text-gray-300 mt-1 font-medium border-t border-white/10 pt-1 inline-block px-2">
          ₹{perHeadPrice.toLocaleString("en-IN")} / person
        </div>
      )}
    </div>
  );

  // New Component for Room Count Display
  const RoomCountDisplay = () => (
    <div className="mt-4">
      <label className="text-sm text-gray-200 mb-2 block flex items-center gap-2">
        <FaBed /> Number of Rooms
      </label>
      <div className="w-full p-3 rounded-xl bg-white/5 border border-white/20 text-center font-bold text-lg text-white">
        {numberOfRooms} Room{numberOfRooms > 1 ? "s" : ""}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
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

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block">
        <div className="w-80 p-6 rounded-2xl sticky top-24 border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl text-white space-y-6">
          
          <div>
            <label className="text-sm text-gray-200">Traveller Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handle("name", e.target.value)}
              className="mt-1 w-full p-3 rounded-xl bg-white/10 border border-white/20"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-200">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handle("phone", e.target.value)}
              className="mt-1 w-full p-3 rounded-xl bg-white/10 border border-white/20"
              placeholder="9876543210"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <QuantityControl label="Adults" icon={FaUsers} value={form.adults} field="adults" min={1} />
            <QuantityControl label="Children" icon={FaChild} value={form.children} field="children" min={0} />
          </div>

          <div>
            <label className="text-sm text-gray-200 mb-2 block"><FaHotel className="inline" /> Room Type</label>
            <div className="flex gap-2">
              <button className={selectorBtn(form.roomType === "standard")} onClick={() => handle("roomType", "standard")}>Standard</button>
              <button className={selectorBtn(form.roomType === "panoramic")} onClick={() => handle("roomType", "panoramic")}>Panoramic</button>
            </div>
            
            {/* Added Room Count Here */}
            <RoomCountDisplay />
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
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.bonfire} onChange={(e) => handle("bonfire", e.target.checked)} className="w-5 h-5 accent-yellow-400" />
                Bonfire
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.meal} onChange={(e) => handle("meal", e.target.checked)} className="w-5 h-5 accent-yellow-400" />
                Meals
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.tea} onChange={(e) => handle("tea", e.target.checked)} className="w-5 h-5 accent-yellow-400" />
                Tea
              </label>
            </div>
          </div>

          <PriceDisplayBox />

          <button className="w-full bg-[#D9A441] text-black py-3 rounded-xl font-bold text-lg">Book Now</button>
        </div>
      </div>

      {/* MOBILE FLOAT BUTTON */}
      <div className="lg:hidden fixed bottom-5 left-0 right-0 px-6 z-50">
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-[#D9A441] text-black py-4 rounded-2xl font-bold text-lg shadow-xl"
        >
          Book • ₹{finalPrice.toLocaleString("en-IN")}
        </button>
      </div>

      {/* MOBILE MODAL */}
      {open && (
        <div className="modal-overlay-fixed">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />

          <div
            className="modal-content-box rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            <div className="p-6 overflow-y-auto w-full" style={{ WebkitOverflowScrolling: "touch" }}>
              
              <div className="space-y-5 pb-4">
                <input
                  placeholder="Traveller Name"
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                  value={form.name}
                  onChange={(e) => handle("name", e.target.value)}
                />
                <input
                  placeholder="Phone Number"
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
                  value={form.phone}
                  onChange={(e) => handle("phone", e.target.value)}
                />

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2">Travellers</div>
                  <div className="grid grid-cols-2 gap-3">
                    <QuantityControl label="Adults" value={form.adults} field="adults" min={1} />
                    <QuantityControl label="Children" value={form.children} field="children" min={0} />
                  </div>
                </div>

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2">Room Type</div>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button className={toggleClass(form.roomType === "standard")} onClick={() => handle("roomType", "standard")}>
                      <span className="flex items-center gap-2">{form.roomType === "standard" ? <FaCheck /> : null} Standard</span>
                    </button>
                    <button className={toggleClass(form.roomType === "panoramic")} onClick={() => handle("roomType", "panoramic")}>
                      <span className="flex items-center gap-2">{form.roomType === "panoramic" ? <FaCheck /> : null} Panoramic</span>
                    </button>
                  </div>
                  
                  {/* Added Room Count Here for Mobile */}
                  <RoomCountDisplay />
                </div>

                <div>
                  <div className="text-[#D9A441] font-semibold mb-2">Transport</div>
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
                  <div className="text-[#D9A441] font-semibold mb-2">Add-ons</div>
                  <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button className={toggleClass(form.bonfire)} onClick={() => handle("bonfire", !form.bonfire)}>
                      {form.bonfire ? <FaCheck /> : null} Bonfire
                    </button>
                    <button className={toggleClass(form.meal)} onClick={() => handle("meal", !form.meal)}>
                      {form.meal ? <FaCheck /> : null} Meals
                    </button>
                    <button className={toggleClass(form.tea)} onClick={() => handle("tea", !form.tea)}>
                      {form.tea ? <FaCheck /> : null} Tea
                    </button>
                  </div>
                </div>

                <PriceDisplayBox />

                <div className="pt-2">
                  <button className="w-full bg-[#D9A441] text-black py-3 rounded-xl font-bold text-lg">
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