'use client';
import { useState } from 'react';

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', subtitle: '', location: '', basePrice: '', img: '', nights: 1,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Tour Added Successfully!');
        setForm({ title: '', subtitle: '', location: '', basePrice: '', img: '', nights: 1 });
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      alert('❌ Something went wrong!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Tour</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" required placeholder="Tour Title" value={form.title} onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <input name="subtitle" required placeholder="Subtitle" value={form.subtitle} onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <div className="grid grid-cols-2 gap-4">
            <input name="location" required placeholder="Location" value={form.location} onChange={handleChange} className="w-full p-3 border rounded-lg" />
            <input name="basePrice" type="number" required placeholder="Price" value={form.basePrice} onChange={handleChange} className="w-full p-3 border rounded-lg" />
          </div>
          <input name="img" required placeholder="Image URL (e.g. /mountain.webp)" value={form.img} onChange={handleChange} className="w-full p-3 border rounded-lg" />
          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
            {loading ? 'Saving...' : 'Add Tour'}
          </button>
        </form>
      </div>
    </div>
  );
}