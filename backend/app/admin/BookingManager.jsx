'use client';
import { useState, useEffect } from 'react';
import {
    FaMapMarkerAlt, FaEdit, FaTrash, FaCheck, FaSpinner, FaTimes, FaPhone,
    FaCalendarAlt, FaHotel, FaExternalLinkAlt, FaMoneyBillWave, FaTicketAlt,
    FaCheckCircle, FaClock, FaUser, FaSearch, FaEye, FaTag
} from 'react-icons/fa';

export default function BookingManager({ bookings, tours, globalPrices, refreshData }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState([]);

    // Confirmation Form State
    const [confirmData, setConfirmData] = useState({
        paymentType: 'Full',
        paidAmount: 0,
        adminNotes: '',
        hotelName: '',
        hotelAddress: '',
        hotelPhone: '',
        hotelNotes: ''
    });

    // --- SEARCH EFFECT ---
    useEffect(() => {
        if (!searchQuery) {
            setFilteredBookings(bookings);
        } else {
            const lower = searchQuery.toLowerCase();
            const filtered = bookings.filter(b =>
                (b._id && b._id.slice(-6).toLowerCase().includes(lower)) ||
                (b.name && b.name.toLowerCase().includes(lower)) ||
                (b.phone && b.phone.includes(searchQuery))
            );
            setFilteredBookings(filtered);
        }
    }, [searchQuery, bookings]);

    // --- HELPERS ---
    const getBookingID = (id) => `#HW-${id.slice(-6).toUpperCase()}`;

    const getTourLink = (tourTitle) => {
        const tour = tours.find(t => t.title === tourTitle);
        return tour ? `/tours/${tour._id}` : null;
    };

    const getUnitRates = (b) => {
        const tour = tours.find(t => t.title === b.tourTitle);
        const p = tour?.pricing || globalPrices || {};
        const rates = [];

        const isPanoramic = b.roomType?.toLowerCase() === 'panoramic';
        const roomRate = isPanoramic
            ? (p.room?.panoramic ?? globalPrices?.panoRoomPrice)
            : (p.room?.standard ?? globalPrices?.standardRoomPrice);

        rates.push({ label: `${b.roomType} Room`, value: `₹${roomRate} / night` });

        if (b.transport === 'personal') {
            const cabRate = p.personalCab?.rate ?? globalPrices?.personalCabPrice;
            rates.push({ label: 'Private Cab', value: `₹${cabRate}` });
        }

        if (b.addons?.meal) rates.push({ label: 'Meal Plan', value: `₹${p.mealPerPerson ?? globalPrices?.mealPrice} / pax/day` });

        if (b.addons?.tea && !b.addons?.meal) {
            rates.push({ label: 'Tea/Snacks', value: `₹${p.teaPerPerson ?? globalPrices?.teaPrice} / pax/day` });
        } else if (b.addons?.tea && b.addons?.meal) {
            rates.push({ label: 'Tea/Snacks', value: 'FREE (w/ Meal)' });
        }

        if (b.addons?.bonfire) rates.push({ label: 'Bonfire', value: `₹${p.bonfire ?? globalPrices?.bonfirePrice}` });
        if (b.addons?.tourGuide) rates.push({ label: 'Guide', value: `₹${p.tourGuide ?? globalPrices?.tourGuidePrice}` });
        if (b.addons?.comfortSeat) rates.push({ label: 'Comfort Seat', value: `₹${p.comfortSeat ?? globalPrices?.comfortSeatPrice} (Flat)` });

        return rates;
    };

    const getPriceBreakdown = (b) => {
        const tour = tours.find(t => t.title === b.tourTitle);

        const p = {
            basePrice: tour?.basePrice || 0,
            mealPrice: tour?.pricing?.mealPerPerson ?? globalPrices?.mealPrice,
            teaPrice: tour?.pricing?.teaPerPerson ?? globalPrices?.teaPrice,
            bonfirePrice: tour?.pricing?.bonfire ?? globalPrices?.bonfirePrice,
            tourGuidePrice: tour?.pricing?.tourGuide ?? globalPrices?.tourGuidePrice,
            comfortSeatPrice: tour?.pricing?.comfortSeat ?? globalPrices?.comfortSeatPrice,
            personalCabPrice: tour?.pricing?.personalCab?.rate ?? globalPrices?.personalCabPrice
        };

        const items = [];
        const totalPax = (b.adults || 0) + (b.children || 0);
        const nights = b.rooms > 0 ? (tour?.nights || 1) : 0;
        const days = nights + 1;

        items.push({
            name: `Base Tour Cost (₹${p.basePrice} x ${totalPax} pax)`,
            cost: `₹${(p.basePrice * totalPax).toLocaleString()}`,
            highlight: true
        });

        const isPanoramic = b.roomType?.toLowerCase() === 'panoramic';
        const roomRate = isPanoramic
            ? (tour?.pricing?.room?.panoramic || globalPrices?.panoRoomPrice)
            : (tour?.pricing?.room?.standard || globalPrices?.standardRoomPrice);

        const roomCost = roomRate * b.rooms * nights;
        items.push({ name: `${b.roomType} Room (${b.rooms} x ${nights}N)`, cost: `₹${roomCost.toLocaleString()}` });

        items.push({
            name: b.transport === 'personal' ? "Private Cab" : "Shared Transport",
            cost: b.transport === 'personal' ? `₹${p.personalCabPrice.toLocaleString()}` : 'Included'
        });

        if (b.addons?.meal) {
            items.push({ name: `Meal Plan (${totalPax} pax)`, cost: `₹${(p.mealPrice * totalPax * days).toLocaleString()}` });
            if (b.addons?.tea) items.push({ name: "Tea/Snacks", cost: <span className="text-green-400 text-xs font-bold">FREE</span> });
        } else {
            if (b.addons?.tea) items.push({ name: `Tea/Snacks (${totalPax} pax)`, cost: `₹${(p.teaPrice * totalPax * days).toLocaleString()}` });
        }

        if (b.addons?.bonfire) items.push({ name: "Bonfire", cost: `₹${p.bonfirePrice.toLocaleString()}` });
        if (b.addons?.tourGuide) items.push({ name: "Tour Guide", cost: `₹${p.tourGuidePrice.toLocaleString()}` });
        if (b.addons?.comfortSeat) items.push({ name: `Comfort Seat`, cost: `₹${p.comfortSeatPrice.toLocaleString()}` });

        return items;
    };

    // --- ACTIONS ---
    const handleDeleteBooking = async (id) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;
        try {
            const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                if (selectedBooking?._id === id) setSelectedBooking(null);
                alert("Booking deleted.");
                refreshData();
            } else {
                alert("Failed to delete booking.");
            }
        } catch (e) { alert("Error deleting booking"); }
    };

    const initiateConfirmation = () => {
        if (!selectedBooking) return;
        setConfirmData({
            paymentType: selectedBooking.paymentType || 'Full',
            paidAmount: selectedBooking.paidAmount || selectedBooking.totalPrice,
            adminNotes: selectedBooking.adminNotes || '',
            hotelName: selectedBooking.hotelDetails?.name || '',
            hotelAddress: selectedBooking.hotelDetails?.address || '',
            hotelPhone: selectedBooking.hotelDetails?.phone || '',
            hotelNotes: selectedBooking.hotelDetails?.notes || ''
        });
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = async () => {
        if (!selectedBooking) return;
        setUpdatingStatus(true);
        try {
            const payload = {
                id: selectedBooking._id,
                status: 'Confirmed',
                paymentType: confirmData.paymentType,
                paidAmount: confirmData.paymentType === 'Full' ? selectedBooking.totalPrice : confirmData.paidAmount,
                adminNotes: confirmData.adminNotes,
                hotelDetails: {
                    name: confirmData.hotelName,
                    address: confirmData.hotelAddress,
                    phone: confirmData.hotelPhone,
                    notes: confirmData.hotelNotes
                }
            };

            const res = await fetch('/api/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (data.success) {
                setSelectedBooking(data.data);
                setShowConfirmModal(false);
                alert(`Booking Updated Successfully!`);
                refreshData();
            } else {
                alert("Update failed: " + data.error);
            }
        } catch (e) { alert("Network error updating booking"); }
        setUpdatingStatus(false);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Search Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white">All Bookings</h1>
                <div className="relative w-full md:w-auto">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search ID, Name, Phone..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-3 rounded-xl bg-[#1e293b] border border-gray-700 text-white focus:border-cyan-500 outline-none w-full md:w-72 shadow-sm transition"
                    />
                </div>
            </div>

            {/* Booking List Table */}
            <div className="bg-[#1e293b] rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400 whitespace-nowrap">
                        <thead className="bg-black/20 text-gray-200 uppercase font-bold border-b border-gray-700">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Tour</th>
                                <th className="p-4">Journey Date</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredBookings.map((b) => (
                                <tr key={b._id} className="hover:bg-white/5 transition group">
                                    <td className="p-4 font-mono text-cyan-300">{getBookingID(b._id)}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-white">{b.name}</div>
                                        <div className="text-xs text-gray-500">{b.phone}</div>
                                    </td>
                                    <td className="p-4 text-gray-300 max-w-[180px] truncate">{b.tourTitle}</td>
                                    <td className="p-4 text-yellow-500 font-medium">
                                        {b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className="p-4 font-bold text-green-400">₹{b.totalPrice?.toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${b.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                            {b.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => setSelectedBooking(b)} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition shadow-md"><FaEye /></button>
                                        <button onClick={() => handleDeleteBooking(b._id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg transition"><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredBookings.length === 0 && <div className="p-12 text-center text-gray-500">No bookings found matching your search.</div>}
            </div>

            {/* === UPDATE/CONFIRM DIALOG (MODAL) === */}
            {showConfirmModal && selectedBooking && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scroll">
                        <h3 className="text-xl font-bold text-white mb-4">Update Booking Status</h3>

                        <div className="space-y-4">
                            {/* Payment Section */}
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Payment Type</label>
                                <div className="flex bg-black/30 rounded-lg p-1">
                                    <button onClick={() => setConfirmData({ ...confirmData, paymentType: 'Full', paidAmount: selectedBooking.totalPrice })} className={`flex-1 py-2 rounded-md text-sm font-bold transition ${confirmData.paymentType === 'Full' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>Full Payment</button>
                                    <button onClick={() => setConfirmData({ ...confirmData, paymentType: 'Partial', paidAmount: selectedBooking.paidAmount || 0 })} className={`flex-1 py-2 rounded-md text-sm font-bold transition ${confirmData.paymentType === 'Partial' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:text-white'}`}>Partial</button>
                                </div>
                                {confirmData.paymentType === 'Partial' && (
                                    <div className="mt-2">
                                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Amount Paid (₹)</label>
                                        <input type="number" className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white focus:border-yellow-500 outline-none font-mono font-bold" value={confirmData.paidAmount} onChange={e => setConfirmData({ ...confirmData, paidAmount: e.target.value })} />
                                        <p className="text-xs text-red-400 mt-1 font-bold text-right">Due: ₹{(selectedBooking.totalPrice - confirmData.paidAmount).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {/* HOTEL DETAILS SECTION */}
                            <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20">
                                <h4 className="text-blue-400 font-bold text-xs uppercase mb-3 flex items-center gap-2"><FaHotel /> Assign Hotel Details</h4>
                                <div className="space-y-2">
                                    <input className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" placeholder="Hotel Name" value={confirmData.hotelName} onChange={e => setConfirmData({ ...confirmData, hotelName: e.target.value })} />
                                    <input className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" placeholder="Address" value={confirmData.hotelAddress} onChange={e => setConfirmData({ ...confirmData, hotelAddress: e.target.value })} />
                                    <input className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" placeholder="Hotel Phone" value={confirmData.hotelPhone} onChange={e => setConfirmData({ ...confirmData, hotelPhone: e.target.value })} />
                                    <textarea className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm placeholder-gray-500" rows={2} placeholder="Room details or notes..." value={confirmData.hotelNotes} onChange={e => setConfirmData({ ...confirmData, hotelNotes: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Admin Note</label>
                                <textarea rows={2} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none text-sm placeholder-gray-600" placeholder="Transaction ID, remarks..." value={confirmData.adminNotes} onChange={e => setConfirmData({ ...confirmData, adminNotes: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-bold transition">Cancel</button>
                            <button onClick={handleConfirmBooking} disabled={updatingStatus} className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
                                {updatingStatus ? <FaSpinner className="animate-spin" /> : "Save & Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === BIG BOOKING DETAILS MODAL === */}
            {selectedBooking && !showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] w-full max-w-7xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative">

                        {/* UPDATED HEADER: Show Booked Date & Journey Date */}
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-black/20">
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Booking Details</h2>
                                    <span className={`inline-flex items-center justify-center text-xs px-3 py-1 rounded-full font-mono tracking-wider border w-max ${selectedBooking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                        {selectedBooking.status}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-400 text-xs md:text-sm flex flex-wrap items-center gap-3">
                                        <span className="flex items-center gap-2 font-mono text-cyan-300">
                                            <FaClock className="text-gray-500" /> #{selectedBooking._id.slice(-6).toUpperCase()}
                                        </span>
                                        <span className="hidden md:inline text-gray-700">|</span>
                                        <span className="text-gray-300 flex items-center gap-2">
                                            Booked: {new Date(selectedBooking.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </p>

                                    {selectedBooking.travelDate && (
                                        <p className="text-yellow-400 text-base md:text-lg font-bold flex items-center gap-2 mt-2">
                                            <FaCalendarAlt /> Journey: {new Date(selectedBooking.travelDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-gray-300 hover:text-white border border-white/5 shrink-0 ml-4">
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scroll">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                {/* Left Column */}
                                <div className="md:col-span-2 space-y-6 md:space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Customer Info Block */}
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                                            <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaUser /> Customer</h3>
                                            <p className="text-2xl font-semibold text-white mb-1">{selectedBooking.name}</p>
                                            <div className="space-y-2 text-gray-400 text-sm mt-4">
                                                <p className="flex items-center gap-3"><FaPhone className="text-xs" /> {selectedBooking.phone}</p>
                                                {selectedBooking.email && <p className="flex items-center gap-3">✉ {selectedBooking.email}</p>}
                                            </div>
                                        </div>
                                        {/* Tour Info Block */}
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                                            <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaMapMarkerAlt /> Tour Details</h3>
                                            <p className="text-lg text-white leading-tight font-bold flex items-center gap-2 group">
                                                {selectedBooking.tourTitle}
                                                {getTourLink(selectedBooking.tourTitle) && (
                                                    <a href={getTourLink(selectedBooking.tourTitle)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition text-sm"><FaExternalLinkAlt /></a>
                                                )}
                                            </p>
                                            <div className="mt-4 space-y-1 text-gray-400 text-sm">
                                                <p>{selectedBooking.adults} Adults, {selectedBooking.children} Children</p>
                                                <p>Rooms: {selectedBooking.rooms} <span className="text-xs bg-white/10 px-2 py-0.5 rounded ml-1">{selectedBooking.roomType}</span></p>
                                                <p>Date: {selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hotel Details Display */}
                                    {selectedBooking.hotelDetails && selectedBooking.hotelDetails.name && (
                                        <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><FaHotel /> Assigned Hotel</h3>
                                                <button onClick={initiateConfirmation} className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><FaEdit /> Edit</button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <div className="bg-black/20 p-3 rounded-lg border border-white/5"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Hotel Name</span><span className="text-white font-bold">{selectedBooking.hotelDetails.name}</span></div>
                                                <div className="bg-black/20 p-3 rounded-lg border border-white/5"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Phone</span><span className="text-white">{selectedBooking.hotelDetails.phone || "-"}</span></div>
                                                <div className="bg-black/20 p-3 rounded-lg border border-white/5 col-span-1 sm:col-span-2"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Address</span><span className="text-white">{selectedBooking.hotelDetails.address || "-"}</span></div>
                                                {selectedBooking.hotelDetails.notes && <div className="bg-black/20 p-3 rounded-lg border border-white/5 col-span-1 sm:col-span-2"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Notes</span><span className="text-yellow-400">{selectedBooking.hotelDetails.notes}</span></div>}
                                            </div>
                                        </div>
                                    )}

                                    {/* NEW: Applied Unit Rates Box */}
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                                        <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaTag /> Applied Unit Rates</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {getUnitRates(selectedBooking).map((rate, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
                                                    <span className="text-gray-400 text-xs font-bold uppercase">{rate.label}</span>
                                                    <span className="text-white font-mono text-sm">{rate.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative hover:border-white/10 transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><FaMoneyBillWave /> Payment & Notes</h3>
                                            <button onClick={initiateConfirmation} className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><FaEdit /> Edit</button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                                <span className="text-gray-400 block text-xs uppercase font-bold mb-1">Payment Type</span>
                                                <span className="text-white font-bold text-lg">{selectedBooking.paymentType || 'Full'}</span>
                                            </div>
                                            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                                <span className="text-gray-400 block text-xs uppercase font-bold mb-1">Amount Paid</span>
                                                <span className="text-green-400 font-bold text-lg">₹{(selectedBooking.paidAmount || selectedBooking.totalPrice).toLocaleString()}</span>
                                                {selectedBooking.totalPrice > (selectedBooking.paidAmount || 0) && (
                                                    <div className="text-red-400 text-xs mt-1 font-bold bg-red-900/20 px-2 py-0.5 rounded inline-block">Due: ₹{(selectedBooking.totalPrice - (selectedBooking.paidAmount || 0)).toLocaleString()}</div>
                                                )}
                                            </div>
                                            {selectedBooking.adminNotes && (
                                                <div className="col-span-1 sm:col-span-2 pt-2 border-t border-white/10">
                                                    <span className="text-gray-400 block text-xs uppercase font-bold mb-2">Admin Note</span>
                                                    <p className="text-white italic bg-black/20 p-3 rounded-lg border border-white/5">"{selectedBooking.adminNotes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Breakdown */}
                                <div className="md:col-span-1 space-y-6">
                                    <div className="bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 sticky top-4">
                                        <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Price Breakdown</h3>
                                        <div className="space-y-3 mb-6 border-b border-white/10 pb-4">
                                            {getPriceBreakdown(selectedBooking).map((item, idx) => (
                                                <div key={idx} className={`flex justify-between text-sm ${item.highlight ? 'text-cyan-300 font-bold pb-2 border-b border-white/5' : 'text-gray-400'}`}>
                                                    <span>{item.name}</span>
                                                    <span className={item.highlight ? 'text-white' : 'text-gray-200'}>{item.cost}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Totals & Coupon */}
                                        <div className="space-y-2">
                                            {/* NEW: Coupon Display */}
                                            {selectedBooking.couponCode && (
                                                <div className="flex justify-between items-center text-green-400 border-t border-white/10 pt-2">
                                                    <span className="flex items-center gap-2 text-sm"><FaTicketAlt /> Coupon ({selectedBooking.couponCode})</span>
                                                    <span className="font-bold text-sm">- ₹{((selectedBooking.originalPrice || selectedBooking.totalPrice) - selectedBooking.totalPrice).toLocaleString()}</span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-end pt-4 border-t border-white/10">
                                                <span className="text-gray-300 font-bold">Grand Total</span>
                                                <span className="text-3xl font-black text-white tracking-tight">₹{selectedBooking.totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {/* Buttons */}
                                        <div className="space-y-3 mt-6">
                                            <button onClick={initiateConfirmation} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2">
                                                <FaCheckCircle /> Update / Confirm
                                            </button>
                                            <button onClick={() => handleDeleteBooking(selectedBooking._id)} className="w-full py-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-xl font-bold transition flex items-center justify-center gap-2">
                                                <FaTrash /> Delete Booking
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}