import BookingModal from "../components/BookingModal";
import Gallery from "../components/Gallery";
export default function TourPage({/* route param id */}) {
  // fetch tour by id
  return (
    <div className="max-w-6xl mx-auto mt-24 px-6">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold">Gangtok 3N/4D</h1>
          <p className="text-gray-600 mt-2">Short description...</p>

          <section className="mt-6">
            <h3 className="font-semibold">Itinerary</h3>
            <ol className="list-decimal ml-6 mt-2 text-gray-700">
              <li>Day 1: Arrival & local sightseeing</li>
              <li>Day 2: Tsomgo Lake & Baba Mandir</li>
            </ol>
          </section>

          <section className="mt-6">
            <h3 className="font-semibold">Inclusions</h3>
            <ul className="list-disc ml-6 mt-2 text-gray-700">
              <li>Hotel</li>
              <li>Breakfast</li>
              <li>Transport</li>
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div><div className="text-sm text-gray-500">Starting from</div><div className="text-2xl font-bold">₹12,500</div></div>
              <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg">Book Now</button>
            </div>
          </div>

          <Gallery images={["/g1.jpg","/g2.jpg","/g3.jpg"]}/>

          {/* Map embed */}
          <div className="bg-white p-2 rounded-lg">
            <iframe src="https://www.google.com/maps?q=gangtok&output=embed" className="w-full h-40 rounded"></iframe>
          </div>
        </aside>
      </div>
    </div>
  );
}
