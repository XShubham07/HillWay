import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaPenNib, FaCheckCircle, FaSearch, FaFilter, FaExclamationTriangle } from "react-icons/fa";

export default function AllReviews() {
    const [reviews, setReviews] = useState([]);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRating, setFilterRating] = useState(0);

    // Form State
    const [formData, setFormData] = useState({
        tourId: "",
        name: "",
        title: "",
        email: "",
        mobile: "",
        rating: 5,
        text: ""
    });

    // Duplicate Handling State
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [duplicateReviewData, setDuplicateReviewData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resReviews, resTours] = await Promise.all([
                    fetch("https://admin.hillway.in/api/reviews"),
                    fetch("https://admin.hillway.in/api/tours")
                ]);

                const reviewsData = await resReviews.json();
                const toursData = await resTours.json();

                if (reviewsData.success) setReviews(reviewsData.data);
                if (toursData.success) setTours(toursData.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- HANDLE DUPLICATE ACTIONS ---
    const handleEditReview = () => {
        if (duplicateReviewData) {
            setFormData({
                tourId: duplicateReviewData.tourId,
                name: duplicateReviewData.name,
                title: duplicateReviewData.title || "",
                email: duplicateReviewData.email || "",
                mobile: duplicateReviewData.mobile || "",
                rating: duplicateReviewData.rating,
                text: duplicateReviewData.text
            });
            setIsEditing(true);
            setShowDuplicateModal(false);
            setShowForm(true); // Open form to edit
        }
    };

    const handleCancelReview = () => {
        setShowDuplicateModal(false);
        setDuplicateReviewData(null);
        // Reset form
        setFormData({
            tourId: "",
            name: "",
            title: "",
            email: "",
            mobile: "",
            rating: 5,
            text: ""
        });
        setIsEditing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // 1. Mobile Validation (Strict 10 Digit Indian Number)
        const indianMobileRegex = /^[6-9]\d{9}$/;
        if (!indianMobileRegex.test(formData.mobile)) {
            alert("Please enter a valid 10-digit Indian mobile number.");
            setSubmitting(false);
            return;
        }

        // 2. Check for Duplicate Review (If NOT editing)
        if (!isEditing) {
            // Check if a review exists for THIS mobile AND THIS tour
            const existing = reviews.find(r =>
                r.mobile === formData.mobile && r.tourId === formData.tourId
            );

            if (existing) {
                setDuplicateReviewData(existing);
                setShowDuplicateModal(true);
                setSubmitting(false);
                return;
            }
        }

        try {
            // If Editing: Delete old review first
            if (isEditing && duplicateReviewData?._id) {
                await fetch(`https://admin.hillway.in/api/reviews?tourId=${duplicateReviewData.tourId}&reviewId=${duplicateReviewData._id}`, {
                    method: 'DELETE'
                });
            }

            const res = await fetch("https://admin.hillway.in/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                alert(isEditing ? "Review updated successfully!" : "Review Submitted! It will appear shortly.");
                setShowForm(false);
                setFormData({ tourId: "", name: "", title: "", email: "", mobile: "", rating: 5, text: "" });
                setIsEditing(false);
                setDuplicateReviewData(null);
                window.location.reload();
            } else {
                alert("Failed: " + data.error);
            }
        } catch (err) {
            alert("Error submitting review.");
        }
        setSubmitting(false);
    };

    // Filter Logic
    const filteredReviews = reviews.filter(r => {
        const matchesSearch = r.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 0 || r.rating === filterRating;
        return matchesSearch && matchesRating;
    });

    return (
        <div className="min-h-screen bg-[#0f172a] text-white pt-28 pb-20 px-4 sm:px-6 font-inter">
            <div className="max-w-6xl mx-auto">

                {/* DUPLICATE REVIEW MODAL */}
                <AnimatePresence>
                    {showDuplicateModal && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
                            >
                                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-400 text-3xl">
                                    <FaExclamationTriangle />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Review Already Exists</h3>
                                <p className="text-gray-400 text-sm mb-8">
                                    You have already submitted a review for this package with this number. Would you like to edit it?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleCancelReview}
                                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition font-bold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditReview}
                                        className="flex-1 py-3 rounded-xl bg-[#D9A441] text-black hover:bg-[#fbbf24] transition font-bold"
                                    >
                                        Edit Review
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 mb-4">
                        Traveler Stories
                    </h1>
                    <p className="text-gray-400 text-lg">Real experiences from our Himalayan adventures</p>
                </div>

                {/* Controls & Form Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">

                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 md:w-64">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                placeholder="Search reviews..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:border-cyan-500 outline-none"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:border-cyan-500 outline-none cursor-pointer"
                                value={filterRating}
                                onChange={e => setFilterRating(Number(e.target.value))}
                            >
                                <option value={0}>All Stars</option>
                                <option value={5}>5 Stars Only</option>
                                <option value={4}>4 Stars & Up</option>
                                <option value={3}>3 Stars & Up</option>
                            </select>
                            <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 bg-[#D9A441] hover:bg-[#fbbf24] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(217,164,65,0.3)] transition flex items-center gap-2 active:scale-95"
                    >
                        <FaPenNib /> Write a Review
                    </button>
                </div>

                {/* WRITE REVIEW FORM */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-12"
                        >
                            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-3xl relative backdrop-blur-md">
                                <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
                                <h3 className="text-xl font-bold text-white mb-6">Share Your Experience</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Select Tour</label>
                                        <select
                                            required
                                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#D9A441]"
                                            value={formData.tourId}
                                            onChange={e => setFormData({ ...formData, tourId: e.target.value })}
                                            // Disable tour selection if editing a specific review to prevent moving it
                                            disabled={isEditing}
                                        >
                                            <option value="">-- Choose a Package --</option>
                                            {tours.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Your Name</label>
                                        <input required className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#D9A441]" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Rating</label>
                                        <div className="flex gap-2 p-2">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <FaStar key={s} className={`cursor-pointer text-2xl transition ${s <= formData.rating ? 'text-[#D9A441]' : 'text-gray-600'}`} onClick={() => setFormData({ ...formData, rating: s })} />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Mobile (Private)</label>
                                        <input
                                            required
                                            type="tel"
                                            placeholder="10 digit number"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#D9A441]"
                                            value={formData.mobile}
                                            // Restrict to numbers and 10 digits
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                if (val.length <= 10) setFormData({ ...formData, mobile: val });
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Email (Private)</label>
                                        <input required type="email" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#D9A441]" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>

                                {/* REVIEW TITLE ABOVE EXPERIENCE */}
                                <div className="mb-4">
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Review Title</label>
                                    <input required placeholder="e.g. Magical Trip!" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#D9A441]" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div className="mb-6">
                                    <label className="text-xs text-gray-400 uppercase font-bold mb-1 block">Your Review</label>
                                    <textarea required rows={4} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#D9A441]" value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} />
                                </div>

                                <button disabled={submitting} className="w-full md:w-auto px-8 py-3 bg-[#D9A441] text-black font-bold rounded-xl hover:bg-white transition">
                                    {submitting ? "Publishing..." : (isEditing ? "Update Review" : "Submit Review")}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* REVIEWS GRID */}
                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading reviews...</div>
                ) : filteredReviews.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-400">No reviews found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredReviews.map((r) => (
                            <motion.div
                                key={r._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#1e293b]/60 backdrop-blur border border-white/5 p-6 rounded-3xl hover:bg-white/5 transition duration-300"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D9A441] to-amber-600 flex items-center justify-center text-black font-bold text-lg">
                                            {r.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{r.name}</h4>
                                            <div className="flex items-center gap-1 text-[10px] text-green-400 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-500/20 w-fit mt-0.5">
                                                <FaCheckCircle /> Verified
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex text-[#D9A441] text-xs gap-0.5 justify-end">
                                            {[...Array(5)].map((_, i) => <FaStar key={i} className={i < r.rating ? "" : "text-gray-700"} />)}
                                        </div>
                                        <span className="text-[10px] text-gray-500">{r.date}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-xs font-bold text-cyan-400 mb-1 uppercase tracking-wide bg-cyan-900/10 inline-block px-2 py-0.5 rounded border border-cyan-500/20">
                                        {r.tourTitle}
                                    </div>
                                    {r.title && <h5 className="font-bold text-white text-lg mt-2">{r.title}</h5>}
                                    <p className="text-gray-300 text-sm leading-relaxed mt-1">"{r.text}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}