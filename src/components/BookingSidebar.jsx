export default function BookingSidebar({ tour }){
  return (
    <div className="bg-white rounded-xl shadow p-5 sticky top-24">
      <div className="text-xl font-bold text-[var(--p1)]">{tour.price}</div>
      <div className="mt-2 text-sm text-gray-600">{tour.days} • {tour.pax} persons</div>
      <a href="#booking" className="block mt-6 bg-[var(--p1)] text-white text-center py-3 rounded">Book Now</a>
    </div>
  );
}
