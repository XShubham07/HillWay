export default function PriceSummary({ title = "", quote, compact=false }) {
  if (!quote) return null;

  return (
    <div className={`bg-white p-4 rounded-xl shadow ${compact ? "" : ""}`}>
      <h4 className="font-semibold">{title || quote.title}</h4>
      <div className="mt-3 text-sm text-gray-600 space-y-1">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{quote.subtotal?.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Taxes & Fees</span><span>₹{quote.taxes?.toLocaleString()}</span></div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-[var(--p1)]"><span>Total</span><span>₹{quote.total?.toLocaleString()}</span></div>
      </div>
      {!compact && <p className="text-xs text-gray-500 mt-3">This is an instant estimate. Final price may vary based on availability.</p>}
    </div>
  );
}
