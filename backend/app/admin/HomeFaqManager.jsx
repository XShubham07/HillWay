"use client";
import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaQuestionCircle } from 'react-icons/fa';

export default function HomeFaqManager() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ question: '', answer: '', order: 0 });

    const fetchFaqs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/home-faq');
            const data = await res.json();
            if (data.success) setFaqs(data.data);
        } catch (err) {
            console.error('Failed to fetch FAQs', err);
        }
        setLoading(false);
    };

    useEffect(() => { fetchFaqs(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const body = isEditing ? { id: editingId, ...formData } : formData;

        try {
            const res = await fetch('/api/home-faq', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                alert(isEditing ? 'FAQ Updated!' : 'FAQ Created!');
                setShowForm(false);
                setIsEditing(false);
                setFormData({ question: '', answer: '', order: 0 });
                fetchFaqs();
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        }
    };

    const handleEdit = (faq) => {
        setIsEditing(true);
        setEditingId(faq._id);
        setFormData({ question: faq.question, answer: faq.answer, order: faq.order || 0 });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
        try {
            const res = await fetch(`/api/home-faq?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                alert('FAQ Deleted!');
                fetchFaqs();
            } else {
                alert(data.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Home Page FAQs</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage Frequently Asked Questions displayed on the Home page</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => { setIsEditing(false); setFormData({ question: '', answer: '', order: 0 }); setShowForm(true); }}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition"
                    >
                        <FaPlus /> Add FAQ
                    </button>
                )}
            </div>

            {/* FORM */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-[#0f172a] border border-gray-700 rounded-2xl p-6 space-y-4">
                    <h3 className="text-lg font-bold text-cyan-400 border-b border-gray-700 pb-3 mb-4">
                        {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Question</label>
                        <input
                            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                            placeholder="e.g. What is the best time to visit Sikkim?"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Answer</label>
                        <textarea
                            rows={4}
                            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                            placeholder="Provide a detailed answer..."
                            value={formData.answer}
                            onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            required
                        />
                    </div>

                    <div className="w-32">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Order</label>
                        <input
                            type="number"
                            className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-700">
                        <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition">
                            <FaSave /> {isEditing ? 'Update' : 'Save'}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setIsEditing(false); }} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition">
                            <FaTimes /> Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* LIST */}
            {loading ? (
                <div className="text-center py-12 text-gray-400 animate-pulse">Loading FAQs...</div>
            ) : faqs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-700 rounded-2xl">
                    <FaQuestionCircle className="text-4xl text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">No FAQs added yet. Click "Add FAQ" to get started.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <div key={faq._id} className="bg-[#0f172a] border border-gray-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/30 transition">
                            <div className="flex-1">
                                <p className="font-bold text-white text-lg">{faq.question}</p>
                                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{faq.answer}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => handleEdit(faq)} className="p-2.5 bg-gray-700 hover:bg-cyan-600 text-white rounded-lg transition" title="Edit">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(faq._id)} className="p-2.5 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition" title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
