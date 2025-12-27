'use client';
import { useState, useEffect } from 'react';
import { FaSearch, FaSave, FaSpinner, FaGlobe } from 'react-icons/fa';

export default function SeoManager() {
    const PAGES = [
        { id: 'home', label: 'Home Page' },
        { id: 'destinations', label: 'Destinations Page' }
    ];

    const [activePage, setActivePage] = useState('home');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        keywords: ''
    });

    // Fetch data when active page changes
    useEffect(() => {
        setLoading(true);
        fetch(`/api/page-seo?page=${activePage}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setFormData({
                        title: data.data.title || '',
                        description: data.data.description || '',
                        keywords: data.data.keywords || ''
                    });
                } else {
                    // Reset if no data exists yet
                    setFormData({ title: '', description: '', keywords: '' });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [activePage]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/page-seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ page: activePage, ...formData })
            });
            const data = await res.json();
            if (data.success) {
                alert(`SEO Updated for ${activePage}!`);
            } else {
                alert('Failed to update.');
            }
        } catch (err) {
            alert('Error saving data.');
        }
        setSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <FaSearch className="text-cyan-500" /> SEO Manager
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Page Selector */}
                <div className="col-span-1 space-y-2">
                    {PAGES.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActivePage(p.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                                activePage === p.id 
                                    ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' 
                                    : 'bg-[#1e293b] text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <FaGlobe /> {p.label}
                        </button>
                    ))}
                </div>

                {/* Editor Form */}
                <div className="col-span-1 md:col-span-3 bg-[#1e293b] p-8 rounded-2xl border border-gray-700 shadow-xl relative">
                    {loading && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                            <FaSpinner className="animate-spin text-cyan-500 text-3xl" />
                        </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-white mb-6 capitalize border-b border-gray-700 pb-4">
                        Editing: <span className="text-cyan-400">{activePage}</span>
                    </h3>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Title</label>
                            <input 
                                className="w-full bg-black/30 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition"
                                placeholder="e.g. HillWay - Best Himalayan Tours"
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Recommended length: 50-60 characters</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Keywords</label>
                            <input 
                                className="w-full bg-black/30 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition"
                                placeholder="sikkim, travel, gangtok, tours..."
                                value={formData.keywords}
                                onChange={e => setFormData({...formData, keywords: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Description</label>
                            <textarea 
                                rows={4}
                                className="w-full bg-black/30 border border-gray-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none transition"
                                placeholder="A brief summary of the page content for search engines..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                            <p className="text-[10px] text-gray-500 mt-1">Recommended length: 150-160 characters</p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}