export default function Contact(){
  return (
    <div className="max-w-4xl mx-auto px-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p>📍 Gangtok, Sikkim</p>
          <p>📞 +91 9876543210</p>
          <p>✉ travelx@gmail.com</p>
        </div>

        <form className="space-y-4">
          <input className="border p-3 rounded w-full" placeholder="Name"/>
          <input className="border p-3 rounded w-full" placeholder="Email"/>
          <textarea className="border p-3 rounded w-full" rows="5" placeholder="Message"/>
          <button className="bg-[var(--p1)] text-white px-6 py-3 rounded">Send</button>
        </form>
      </div>
    </div>
  );
}
