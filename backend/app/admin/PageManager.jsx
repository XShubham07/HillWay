
'use client';
import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaGlobe, FaSpinner, FaSearch, FaCheck } from 'react-icons/fa';

export default function PageManager() {
    const [pages, setPages] = useState([]);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        metaTitle: '', // Added
        slug: '',
        description: '', // Added
        toursTitle: '', // Added
        toursNote: '', // Added
        infoBoxes: [], // Added
        faqs: [], // Added
        metaDescription: '',
        metaKeywords: '',
        selectedTours: [],
        isActive: true
    });

    const [tourSearch, setTourSearch] = useState('');

    useEffect(() => {
        fetchData();
        fetchTours();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pages');
            const data = await res.json();
            if (data.success) setPages(data.data);
        } catch (err) { console.error(err); }
        setLoading(false);
    };

    const fetchTours = async () => {
        try {
            const res = await fetch('/api/tours');
            const data = await res.json();
            if (data.success) setTours(data.data);
        } catch (err) { console.error(err); }
    };

    const handleEdit = (page) => {
        setFormData({
            _id: page._id,
            title: page.title,
            metaTitle: page.metaTitle || '', // Added
            slug: page.slug,
            description: page.description || '', // Added
            toursTitle: page.toursTitle || '', // Added
            toursNote: page.toursNote || '', // Added
            infoBoxes: page.infoBoxes || [], // Added
            faqs: page.faqs || [], // Added
            metaDescription: page.metaDescription,
            metaKeywords: page.metaKeywords,
            selectedTours: page.selectedTours ? page.selectedTours.map(t => t._id || t) : [],
            isActive: page.isActive
        });
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this page?')) return;
        try {
            const res = await fetch(`/api/pages?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setPages(pages.filter(p => p._id !== id));
            } else {
                alert(data.error);
            }
        } catch (err) { alert('Failed to delete'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const url = '/api/pages';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                alert(isEditing ? 'Page Updated!' : 'Page Created!');
                setShowForm(false);
                setIsEditing(false);
                setFormData({ title: '', metaTitle: '', slug: '', description: '', toursTitle: '', toursNote: '', infoBoxes: [], faqs: [], metaDescription: '', metaKeywords: '', selectedTours: [], isActive: true });
                fetchData();
            } else {
                alert(data.error);
            }
        } catch (err) { alert('Error saving page'); }
        setLoading(false);
    };

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        if (!isEditing) {
            const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, title, slug }));
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    };

    const toggleTourSelection = (tourId) => {
        setFormData(prev => {
            const isSelected = prev.selectedTours.includes(tourId);
            if (isSelected) {
                return { ...prev, selectedTours: prev.selectedTours.filter(id => id !== tourId) };
            } else {
                return { ...prev, selectedTours: [...prev.selectedTours, tourId] };
            }
        });
    };

    // Filtered tours for selection
    const filteredTours = tours.filter(t => t.title.toLowerCase().includes(tourSearch.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <FaGlobe className="text-cyan-500" /> Pages Manager
                </h1>
                {!showForm && (
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setFormData({ title: '', metaTitle: '', slug: '', description: '', toursTitle: '', toursNote: '', infoBoxes: [], faqs: [], metaDescription: '', metaKeywords: '', selectedTours: [], isActive: true });
                            setShowForm(true);
                        }}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition"
                    >
                        <FaPlus /> Create New Page
                    </button>
                )}
            </div>

            {/* FORM */}
            {showForm && (
                <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 mb-8 shadow-xl animate-fade-in-down">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                        <h3 className="text-xl font-bold text-white">
                            {isEditing ? 'Edit Page' : 'Create New Page'}
                        </h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                            <FaTimes size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* SECTION 1: SEO SETTINGS (Meta Tags & URL) */}
                        <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                            <h4 className="text-cyan-400 font-bold mb-4 uppercase text-sm tracking-wider">SEO Settings (Meta Tags & URL)</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Title (Browser Tab)</label>
                                    <input
                                        className="w-full bg-black/30 border border-gray-600 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                                        placeholder="Leave empty to use Page Title"
                                        value={formData.metaTitle}
                                        onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Slug (URL)</label>
                                    <div className="flex items-center gap-2 bg-black/30 border border-gray-600 rounded-xl px-3">
                                        <span className="text-gray-500 text-sm">hillway.in/</span>
                                        <input
                                            required
                                            className="w-full bg-transparent p-3 text-white focus:outline-none"
                                            placeholder="best-summer-treks"
                                            value={formData.slug}
                                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>



                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Keywords</label>
                                <input
                                    className="w-full bg-black/30 border border-gray-600 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="trekking, summer, himalayas..."
                                    value={formData.metaKeywords}
                                    onChange={e => setFormData({ ...formData, metaKeywords: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Description (SEO)</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-black/30 border border-gray-600 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="Page summary for search engines..."
                                    value={formData.metaDescription}
                                    onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* SECTION 2: PAGE CONTENT */}
                        <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                            <h4 className="text-cyan-400 font-bold mb-4 uppercase text-sm tracking-wider">Page Content</h4>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Page Title (H1)</label>
                                    <input
                                        required
                                        className="w-full bg-black/30 border border-gray-600 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                                        placeholder="e.g. Best Summer Treks"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Page Description (Visible on Page)</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-black/30 border border-gray-600 rounded-xl p-3 text-white focus:border-cyan-500 outline-none"
                                        placeholder="Enter a brief description that will appear on the page itself..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: INFORMATION BOXES (NEW) */}
                        <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-cyan-400 font-bold uppercase text-sm tracking-wider">Information Boxes</h4>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, infoBoxes: [...formData.infoBoxes, { title: '', subTitle: '', content: '' }] })}
                                    className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs px-3 py-1 rounded-lg border border-cyan-500/30 transition font-bold"
                                >
                                    + Add Box
                                </button>
                            </div>

                            {formData.infoBoxes.length === 0 && (
                                <p className="text-gray-500 text-sm italic py-2">No info boxes added yet.</p>
                            )}

                            <div className="space-y-4">
                                {formData.infoBoxes.map((box, index) => (
                                    <div key={index} className="bg-[#1e293b] p-4 rounded-xl border border-gray-600 relative group">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newBoxes = formData.infoBoxes.filter((_, i) => i !== index);
                                                setFormData({ ...formData, infoBoxes: newBoxes });
                                            }}
                                            className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition"
                                        >
                                            <FaTrash size={14} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Heading</label>
                                                <input
                                                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white focus:border-cyan-500 outline-none text-sm"
                                                    placeholder="e.g. Inclusions"
                                                    value={box.title}
                                                    onChange={(e) => {
                                                        const newBoxes = [...formData.infoBoxes];
                                                        newBoxes[index].title = e.target.value;
                                                        setFormData({ ...formData, infoBoxes: newBoxes });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Sub Heading (Optional)</label>
                                                <input
                                                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white focus:border-cyan-500 outline-none text-sm"
                                                    placeholder="e.g. What's included"
                                                    value={box.subTitle}
                                                    onChange={(e) => {
                                                        const newBoxes = [...formData.infoBoxes];
                                                        newBoxes[index].subTitle = e.target.value;
                                                        setFormData({ ...formData, infoBoxes: newBoxes });
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Content (Bullet Points)</label>
                                            <textarea
                                                rows={3}
                                                className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white focus:border-cyan-500 outline-none text-sm font-mono"
                                                placeholder={`- Point 1\n- Point 2\n  - Sub Point A`}
                                                value={box.content}
                                                onChange={(e) => {
                                                    const newBoxes = [...formData.infoBoxes];
                                                    newBoxes[index].content = e.target.value;
                                                    setFormData({ ...formData, infoBoxes: newBoxes });
                                                }}
                                            />
                                            <p className="text-[10px] text-gray-500 mt-1">* Use dashes (-) for points. Indent for sub-points.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION 4: FAQs (NEW) */}
                        <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-cyan-400 font-bold uppercase text-sm tracking-wider">Frequently Asked Questions (FAQ)</h4>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] })}
                                    className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 text-xs px-3 py-1 rounded-lg border border-cyan-500/30 transition font-bold"
                                >
                                    + Add FAQ
                                </button>
                            </div>

                            {formData.faqs.length === 0 && (
                                <p className="text-gray-500 text-sm italic py-2">No FAQs added yet.</p>
                            )}

                            <div className="space-y-4">
                                {formData.faqs.map((faq, index) => (
                                    <div key={index} className="bg-[#1e293b] p-4 rounded-xl border border-gray-600 relative group">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFaqs = formData.faqs.filter((_, i) => i !== index);
                                                setFormData({ ...formData, faqs: newFaqs });
                                            }}
                                            className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition"
                                        >
                                            <FaTrash size={14} />
                                        </button>

                                        <div className="mb-3">
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Question</label>
                                            <input
                                                className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white focus:border-cyan-500 outline-none text-sm"
                                                placeholder="e.g. What is the cancellation policy?"
                                                value={faq.question}
                                                onChange={(e) => {
                                                    const newFaqs = [...formData.faqs];
                                                    newFaqs[index].question = e.target.value;
                                                    setFormData({ ...formData, faqs: newFaqs });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Answer</label>
                                            <textarea
                                                rows={2}
                                                className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white focus:border-cyan-500 outline-none text-sm"
                                                placeholder="e.g. Free cancellation up to 7 days before..."
                                                value={faq.answer}
                                                onChange={(e) => {
                                                    const newFaqs = [...formData.faqs];
                                                    newFaqs[index].answer = e.target.value;
                                                    setFormData({ ...formData, faqs: newFaqs });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TOUR SELECTOR */}
                        <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-bold text-cyan-400 uppercase">Select Tours to Display</label>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tours Section Title (H2)</label>
                                <input
                                    className="w-full bg-[#1e293b] border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="e.g. Popular Packages"
                                    value={formData.toursTitle}
                                    onChange={e => setFormData({ ...formData, toursTitle: e.target.value })}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tours Note (Displayed below tours)</label>
                                <textarea
                                    rows={2}
                                    className="w-full bg-[#1e293b] border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="e.g. *Prices are subject to change..."
                                    value={formData.toursNote}
                                    onChange={e => setFormData({ ...formData, toursNote: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase">Search Tours</span>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-3 text-gray-500" />
                                    <input
                                        className="bg-[#1e293b] border border-gray-600 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-cyan-500 outline-none w-64"
                                        placeholder="Search tours..."
                                        value={tourSearch}
                                        onChange={e => setTourSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                {filteredTours.map(tour => {
                                    const isSelected = formData.selectedTours.includes(tour._id);
                                    return (
                                        <div
                                            key={tour._id}
                                            onClick={() => toggleTourSelection(tour._id)}
                                            className={`p-3 rounded-lg border cursor-pointer transition text-sm flex items-start gap-2 ${isSelected
                                                ? 'bg-cyan-600/20 border-cyan-500'
                                                : 'bg-[#1e293b] border-gray-700 hover:border-gray-500'
                                                }`}
                                        >
                                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'
                                                }`}>
                                                {isSelected && <FaCheck size={10} className="text-white" />}
                                            </div>
                                            <span className={isSelected ? 'text-white font-medium' : 'text-gray-400'}>
                                                {tour.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-right text-xs text-gray-400 mt-2">
                                {formData.selectedTours.length} tours selected
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
                            {/* STATUS SELECTOR moved here */}
                            <div className="flex items-center gap-3 mr-auto">
                                <label className="text-sm font-bold text-gray-400 uppercase">Status:</label>
                                <select
                                    className={`bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 outline-none font-bold ${formData.isActive ? 'text-green-400' : 'text-red-400'}`}
                                    value={formData.isActive}
                                    onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                                >
                                    <option value="true">Active (Visible)</option>
                                    <option value="false">Draft (Hidden)</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition flex items-center gap-2"
                            >
                                {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                {isEditing ? 'Update Page' : 'Create Page'}
                            </button>
                        </div>
                    </form>
                </div >
            )
            }

            {/* PAGE LIST */}
            <div className="grid grid-cols-1 gap-4">
                {pages.map(page => (
                    <div key={page._id} className="bg-[#1e293b] p-5 rounded-xl border border-gray-700 shadow-lg hover:border-cyan-500/30 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-white">{page.title}</h3>
                                {!page.isActive && <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded font-bold uppercase">Draft</span>}
                            </div>
                            <p className="text-sm text-cyan-400 mt-1">/{page.slug}</p>
                            <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                                <span>{page.selectedTours?.length || 0} tours included</span>
                                <span>Last updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button
                                onClick={() => handleEdit(page)}
                                className="flex-1 md:flex-none px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-600/20 rounded-lg font-bold transition flex items-center justify-center gap-2"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(page._id)}
                                className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg font-bold transition flex items-center justify-center gap-2"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && pages.length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-[#1e293b] rounded-xl border border-gray-700 border-dashed">
                        No pages created yet. Click "Create New Page" to start.
                    </div>
                )}
            </div>
        </div >
    );
}
