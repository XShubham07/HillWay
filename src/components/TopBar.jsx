export default function TopBar(){
  return (
    <div className="bg-[var(--p2)] text-white text-sm py-1">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div>📞 +91 98xxxxxxx • ✉ travelx@gmail.com</div>
        <div className="hidden sm:flex gap-4">
          <a href="/tours" className="underline">Book Now</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </div>
  );
}
