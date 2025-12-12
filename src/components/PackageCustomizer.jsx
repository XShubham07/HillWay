import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import PriceSummary from "./PriceSummary";

export default function PackageCustomizer({ open, pkg, onClose, onQuote }) {
  const [travellers, setTravellers] = useState(2);
  const [room, setRoom] = useState("standard");
  const [addons, setAddons] = useState({ guide: false, meals: true, transport: true });
  const [notes, setNotes] = useState("");

  // Reset on open
  useEffect(() => {
    if (open) {
      setTravellers(2);
      setRoom("standard");
      setAddons({ guide: false, meals: true, transport: true });
      setNotes("");
    }
  }, [open, pkg]);

  // Disable background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!open || !pkg) return null;

  // Calculate quote
  function calc() {
    const base = Number(pkg.basePrice || 0);
    const perTraveller = 2000;
    const roomMultiplier = room === "standard" ? 1 : room === "deluxe" ? 1.25 : 1.6;

    const addonCost =
      (addons.guide ? 1500 : 0) +
      (addons.meals ? 800 * travellers : 0) +
      (addons.transport ? 1200 : 0);

    const subtotal = Math.round(base * roomMultiplier + perTraveller * (travellers - 2) + addonCost);
    const taxes = Math.round(subtotal * 0.05);
    return { subtotal, taxes, total: subtotal + taxes };
  }

  const quote = calc();

  function handleQuote() {
    onQuote?.({
      pkgId: pkg.id,
      title: pkg.title,
      travellers,
      room,
      addons,
      notes,
      ...quote,
    });
  }

  // FINAL MODAL
  const modal = (
    <AnimatePresence>
      {/* FIX: The Modal is now nested INSIDE this backdrop div.
         We use 'flex items-center justify-center' here to center the child.
      */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="
          fixed inset-0 
          bg-black/60 
          backdrop-blur-md 
          z-[2000]
          flex items-center justify-center 
        "
        onClick={onClose}
      >
        {/* MODAL CENTERED */}
        {/* FIX: Removed 'fixed', 'left-1/2', and translate classes.
            Added 'relative' so it sits naturally in the flex container.
        */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="
            relative
            z-[2050]
            w-[96vw] max-w-[900px]
            max-h-[88vh]
            overflow-y-auto
            rounded-2xl 
            p-6
            shadow-2xl
            border border-white/20
            bg-white/10 
            backdrop-blur-2xl
          "
          onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal
        >
          <div className="flex flex-col lg:flex-row gap-6">

            {/* LEFT SECTION */}
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-white drop-shadow">
                {pkg.title}
              </h2>
              <p className="text-white/80 mt-1">{pkg.subtitle}</p>

              <div className="mt-6 space-y-5">

                {/* Travellers */}
                <div>
                  <label className="text-white/90 text-sm font-medium">Travellers</label>
                  <input
                    type="number"
                    min={1}
                    value={travellers}
                    onChange={(e) => setTravellers(Math.max(1, Number(e.target.value)))}
                    className="
                      mt-2 p-2 w-28
                      rounded-lg bg-white/20 text-white
                      border border-white/30
                    "
                  />
                </div>

                {/* ROOM TYPE */}
                <div>
                  <label className="text-sm text-white/90 font-medium">Room Type</label>
                  <div className="flex gap-3 mt-2">
                    {["standard", "deluxe", "private"].map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoom(r)}
                        className={`
                          px-4 py-2 rounded-xl font-semibold text-sm
                          transition-all
                          ${room === r
                            ? "bg-[var(--p1)] text-black shadow-lg"
                            : "bg-white/10 text-white/80 border border-white/20"
                          }
                        `}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ADDONS */}
                <div>
                  <label className="text-sm text-white/90 font-medium">Add-ons</label>
                  <div className="flex flex-col gap-3 mt-3 text-white/90">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={addons.guide}
                        onChange={(e) => setAddons({ ...addons, guide: e.target.checked })} />
                      Local Guide (₹1500)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={addons.meals}
                        onChange={(e) => setAddons({ ...addons, meals: e.target.checked })} />
                      Meals (₹800 per person)
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={addons.transport}
                        onChange={(e) => setAddons({ ...addons, transport: e.target.checked })} />
                      Transport (₹1200)
                    </label>
                  </div>
                </div>

                {/* NOTES */}
                <div>
                  <label className="text-sm text-white/90 font-medium">Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="
                      w-full mt-2 p-3 rounded-xl
                      bg-white/10 text-white
                      border border-white/20
                    "
                    placeholder="Any custom requests..."
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <aside className="w-full lg:w-72">
              <PriceSummary title={pkg.title} quote={quote} />

              <div className="flex flex-col gap-4 mt-4">
                <button
                  className="
                    btn-ripple
                    bg-gradient-to-r from-[var(--p1)] to-[var(--p2)]
                    text-black py-3 rounded-xl font-extrabold shadow-xl
                  "
                  onClick={handleQuote}
                >
                  Confirm Booking
                </button>

                <button
                  className="
                    bg-white/10 text-white/90 py-3 rounded-xl border border-white/20
                  "
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </aside>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}