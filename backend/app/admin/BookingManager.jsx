'use client';
import { useState, useEffect } from 'react';
import {
    FaMapMarkerAlt, FaEdit, FaTrash, FaCheck, FaSpinner, FaTimes, FaPhone,
    FaCalendarAlt, FaHotel, FaExternalLinkAlt, FaMoneyBillWave, FaTicketAlt,
    FaCheckCircle, FaClock, FaUser, FaSearch, FaEye, FaTag, FaBan,
    FaHourglassHalf, FaFlagCheckered, FaWalking, FaPlus, FaEnvelope, FaPen, FaExclamationTriangle
} from 'react-icons/fa';

export default function BookingManager({ bookings, tours, globalPrices, refreshData }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBookings, setFilteredBookings] = useState([]);

    // --- CUSTOM ALERT/CONFIRM STATE ---
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        type: 'alert', // 'alert' or 'confirm'
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null
    });

    // --- REJECT MODAL STATE ---
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [bookingToReject, setBookingToReject] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    // --- EDIT PAYMENT MODAL STATE ---
    const [editPaymentState, setEditPaymentState] = useState({
        isOpen: false,
        index: null,
        amount: '',
        note: '',
        date: ''
    });

    // --- CONFIRMATION / EDIT STATE ---
    const [confirmData, setConfirmData] = useState({
        adminNotes: '',
        hotelName: '',
        hotelAddress: '',
        hotelPhone: '',
        hotelNotes: '',
        resendEmail: false,

        // Payment Fields
        additionalDiscount: 0,
        newPaymentAmount: '',
        newPaymentNote: ''
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

    const triggerAlert = (title, message) => {
        setAlertConfig({
            isOpen: true,
            type: 'alert',
            title,
            message,
            onConfirm: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            onCancel: null
        });
    };

    const triggerConfirm = (title, message, onConfirmAction) => {
        setAlertConfig({
            isOpen: true,
            type: 'confirm',
            title,
            message,
            onConfirm: () => {
                onConfirmAction();
                setAlertConfig(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => setAlertConfig(prev => ({ ...prev, isOpen: false }))
        });
    };

    // Helper for "Tour Status"
    const getTourStatus = (b) => {
        if (b.status === 'Cancelled') return { label: 'Cancelled', color: 'red', icon: <FaTimes /> };
        if (b.status === 'Pending') return { label: 'Pending Approval', color: 'yellow', icon: <FaHourglassHalf /> };

        if (b.status === 'Confirmed' && b.travelDate) {
            const tour = tours.find(t => t.title === b.tourTitle);
            const durationNights = tour?.nights || 1;

            const startDate = new Date(b.travelDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + durationNights);

            const now = new Date();
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);

            if (now < startDate) {
                return { label: 'Upcoming', color: 'cyan', icon: <FaCalendarAlt /> };
            } else if (now >= startDate && now <= endDate) {
                return { label: 'Ongoing', color: 'green', icon: <FaWalking />, animate: true };
            } else {
                return { label: 'Completed', color: 'blue', icon: <FaFlagCheckered /> };
            }
        }
        return { label: b.status, color: 'gray' };
    };

    // Helper for "Status"
    const getBookingStatusBadge = (status) => {
        if (status === 'Confirmed') {
            return { label: 'CONFIRMED', color: 'green', icon: <FaCheckCircle /> };
        } else if (status === 'Cancelled') {
            return { label: 'CANCELLED', color: 'red', icon: <FaTimes /> };
        } else {
            return { label: 'PENDING', color: 'yellow', icon: <FaClock /> };
        }
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
        } else if (b.transport === 'self') {
            const sharingPrice = tour?.pricing?.sharingPrice ?? 0;
            rates.push({ label: 'Self Transport', value: `- ₹${sharingPrice} / pax` });
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
            kidsPrice: tour?.kidsPrice || 0,
            mealPrice: tour?.pricing?.mealPerPerson ?? globalPrices?.mealPrice,
            teaPrice: tour?.pricing?.teaPerPerson ?? globalPrices?.teaPrice,
            bonfirePrice: tour?.pricing?.bonfire ?? globalPrices?.bonfirePrice,
            tourGuidePrice: tour?.pricing?.tourGuide ?? globalPrices?.tourGuidePrice,
            comfortSeatPrice: tour?.pricing?.comfortSeat ?? globalPrices?.comfortSeatPrice,
            personalCabPrice: tour?.pricing?.personalCab?.rate ?? globalPrices?.personalCabPrice,
            sharingPrice: tour?.pricing?.sharingPrice ?? 0
        };

        const items = [];
        const adults = b.adults || 0;
        const children = b.children || 0;
        const totalPax = adults + children;
        const nights = b.rooms > 0 ? (tour?.nights || 1) : 0;
        const days = nights + 1;

        // Adult base cost
        items.push({
            name: `Base Cost - Adults (₹${p.basePrice} x ${adults})`,
            cost: `₹${(p.basePrice * adults).toLocaleString()}`,
            highlight: true
        });

        // Kids price breakdown (if there are children)
        if (children > 0) {
            items.push({
                name: `Kids Price (₹${p.kidsPrice} x ${children} kids)`,
                cost: `₹${(p.kidsPrice * children).toLocaleString()}`,
                highlight: true
            });
        }

        const isPanoramic = b.roomType?.toLowerCase() === 'panoramic';
        const roomRate = isPanoramic
            ? (tour?.pricing?.room?.panoramic || globalPrices?.panoRoomPrice)
            : (tour?.pricing?.room?.standard || globalPrices?.standardRoomPrice);

        const roomCost = roomRate * b.rooms * nights;
        items.push({ name: `${b.roomType} Room (${b.rooms} x ${nights}N)`, cost: `₹${roomCost.toLocaleString()}` });

        if (b.transport === 'personal') {
            items.push({ name: "Private Cab", cost: `₹${p.personalCabPrice.toLocaleString()}` });
        } else if (b.transport === 'self') {
            const deduction = p.sharingPrice * totalPax;
            items.push({ name: `Self Transport Discount`, cost: `- ₹${deduction.toLocaleString()}`, highlight: false });
        } else {
            items.push({ name: "Shared Transport", cost: 'Included' });
        }

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
    const handleDeleteBooking = (id) => {
        triggerConfirm("Delete Booking", "Are you sure you want to delete this booking? This action cannot be undone.", async () => {
            try {
                const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    if (selectedBooking?._id === id) setSelectedBooking(null);
                    triggerAlert("Success", "Booking deleted successfully.");
                    refreshData();
                } else {
                    triggerAlert("Error", "Failed to delete booking.");
                }
            } catch (e) { triggerAlert("Error", "Error deleting booking"); }
        });
    };

    // --- PAYMENT HISTORY ACTIONS ---
    const deletePaymentFromHistory = (index) => {
        triggerConfirm("Delete Payment", "Remove this payment record? You must click 'Save & Update' afterwards to make it permanent.", () => {
            const updatedHistory = [...selectedBooking.paymentHistory];
            const removedAmount = updatedHistory[index].amount;
            updatedHistory.splice(index, 1);

            // Update local state immediately
            setSelectedBooking(prev => ({
                ...prev,
                paymentHistory: updatedHistory,
                paidAmount: (prev.paidAmount || 0) - removedAmount
            }));
        });
    };

    const openEditPaymentModal = (index, payment) => {
        setEditPaymentState({
            isOpen: true,
            index: index,
            amount: payment.amount,
            note: payment.note,
            date: payment.date
        });
    };

    const saveEditedPayment = () => {
        const { index, amount, note, date } = editPaymentState;
        const updatedHistory = [...selectedBooking.paymentHistory];

        const oldAmount = updatedHistory[index].amount;
        const newAmount = Number(amount);

        updatedHistory[index] = {
            ...updatedHistory[index],
            amount: newAmount,
            note: note,
            date: date // Keep original date or allow editing if mapped
        };

        // Update local state
        setSelectedBooking(prev => ({
            ...prev,
            paymentHistory: updatedHistory,
            paidAmount: (prev.paidAmount || 0) - oldAmount + newAmount
        }));

        setEditPaymentState({ ...editPaymentState, isOpen: false });
    };

    const initiateConfirmation = () => {
        if (!selectedBooking) return;
        setConfirmData({
            adminNotes: selectedBooking.adminNotes || '',
            hotelName: selectedBooking.hotelDetails?.name || '',
            hotelAddress: selectedBooking.hotelDetails?.address || '',
            hotelPhone: selectedBooking.hotelDetails?.phone || '',
            hotelNotes: selectedBooking.hotelDetails?.notes || '',
            resendEmail: false,
            additionalDiscount: selectedBooking.additionalDiscount || 0,
            newPaymentAmount: '',
            newPaymentNote: ''
        });
        setShowConfirmModal(true);
    };

    const handleConfirmBooking = async () => {
        if (!selectedBooking) return;

        const currentPaid = selectedBooking.paidAmount || 0;
        const newPaymentVal = Number(confirmData.newPaymentAmount) || 0;
        const discount = Number(confirmData.additionalDiscount) || 0;
        const totalCost = selectedBooking.totalPrice - discount;
        const balanceDue = totalCost - currentPaid;

        if (newPaymentVal > balanceDue) {
            triggerAlert("Payment Error", `New payment amount (₹${newPaymentVal}) cannot be greater than the balance due (₹${balanceDue}).`);
            return;
        }

        setUpdatingStatus(true);
        try {
            let newStatus = selectedBooking.status;
            const totalPaid = currentPaid + newPaymentVal;

            if (selectedBooking.status === 'Pending' && totalPaid > 0) {
                newStatus = 'Confirmed';
            }

            const payload = {
                id: selectedBooking._id,
                status: newStatus,
                adminNotes: confirmData.adminNotes,
                hotelDetails: {
                    name: confirmData.hotelName,
                    address: confirmData.hotelAddress,
                    phone: confirmData.hotelPhone,
                    notes: confirmData.hotelNotes
                },
                resendEmail: confirmData.resendEmail,
                additionalDiscount: confirmData.additionalDiscount,
                // Send new payment if entered
                newPayment: newPaymentVal > 0 ? {
                    amount: newPaymentVal,
                    note: confirmData.newPaymentNote
                } : null,
                // CRITICAL: Send the updated history array (incase edits/deletes happened)
                updatedPaymentHistory: selectedBooking.paymentHistory
            };

            const res = await fetch('/api/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (data.success) {
                setSelectedBooking(data.data);
                setShowConfirmModal(false);
                triggerAlert("Success", "Booking Updated Successfully!");
                refreshData();
            } else {
                triggerAlert("Update Failed", data.error);
            }
        } catch (e) { triggerAlert("Network Error", "Could not update booking."); }
        setUpdatingStatus(false);
    };

    // --- REJECT ACTIONS ---
    const openRejectModal = (booking) => {
        setBookingToReject(booking);
        setRejectReason("");
        setShowRejectModal(true);
    };

    const handleRejectBooking = async () => {
        if (!bookingToReject) return;
        setUpdatingStatus(true);
        try {
            const payload = {
                id: bookingToReject._id,
                status: 'Cancelled',
                adminNotes: `REJECTED: ${rejectReason}`
            };

            const res = await fetch('/api/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (data.success) {
                triggerAlert("Rejected", "Booking has been rejected.");
                setShowRejectModal(false);
                setBookingToReject(null);
                refreshData();
            } else {
                triggerAlert("Error", "Failed to reject: " + data.error);
            }
        } catch (e) { triggerAlert("Error", "Error rejecting booking"); }
        setUpdatingStatus(false);
    };

    const isCancelled = selectedBooking?.status === 'Cancelled';

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
                            <tr><th className="p-4">ID</th><th className="p-4">Customer</th><th className="p-4">Tour</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Tour Status</th><th className="p-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredBookings.map((b) => {
                                const bookingStatusBadge = getBookingStatusBadge(b.status);
                                const tourStatusInfo = getTourStatus(b);
                                return (
                                    <tr key={b._id} className="hover:bg-white/5 transition group">
                                        <td className="p-4 font-mono text-cyan-300">{getBookingID(b._id)}</td>
                                        <td className="p-4"><div className="font-bold text-white">{b.name}</div><div className="text-xs text-gray-500">{b.phone}</div></td>
                                        <td className="p-4 text-gray-300 max-w-[180px] truncate">{b.tourTitle}</td>
                                        <td className="p-4 text-yellow-500 font-medium">{b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-IN') : '-'}</td>
                                        <td className="p-4 font-bold text-white">₹{b.totalPrice?.toLocaleString()}</td>

                                        <td className="p-4 text-center">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${bookingStatusBadge.color === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                bookingStatusBadge.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                {bookingStatusBadge.icon} {bookingStatusBadge.label}
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <div className={`flex items-center justify-center gap-2 px-2 py-1 rounded-md border text-xs font-bold ${tourStatusInfo.color === 'green' ? 'bg-green-500/10 text-green-400 border-green-500/20' : tourStatusInfo.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : tourStatusInfo.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-700/50 text-gray-400 border-gray-600'}`}>
                                                {tourStatusInfo.icon} {tourStatusInfo.label}
                                            </div>
                                        </td>

                                        <td className="p-4 text-right flex justify-end gap-2">
                                            {b.status === 'Pending' && <button onClick={() => openRejectModal(b)} className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/20 rounded-lg transition"><FaBan /></button>}
                                            <button onClick={() => setSelectedBooking(b)} className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition shadow-md"><FaEye /></button>
                                            <button onClick={() => handleDeleteBooking(b._id)} className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg transition"><FaTrash /></button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredBookings.length === 0 && <div className="p-12 text-center text-gray-500">No bookings found matching your search.</div>}
            </div>

            {/* === GLOBAL CUSTOM ALERT BOX === */}
            {alertConfig.isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 relative transform scale-100 transition-all">
                        <div className="flex flex-col items-center text-center">
                            <div className={`p-3 rounded-full mb-4 ${alertConfig.type === 'confirm' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {alertConfig.type === 'confirm' ? <FaExclamationTriangle size={24} /> : <FaCheckCircle size={24} />}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{alertConfig.title}</h3>
                            <p className="text-gray-400 text-sm mb-6">{alertConfig.message}</p>

                            <div className="flex gap-3 w-full">
                                {alertConfig.type === 'confirm' && (
                                    <button
                                        onClick={alertConfig.onCancel}
                                        className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={alertConfig.onConfirm}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-white transition shadow-lg ${alertConfig.type === 'confirm' ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                                >
                                    {alertConfig.type === 'confirm' ? 'Confirm' : 'OK'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* === EDIT PAYMENT MODAL === */}
            {editPaymentState.isOpen && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FaPen size={14} /> Edit Payment</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white"
                                    value={editPaymentState.amount}
                                    onChange={e => setEditPaymentState({ ...editPaymentState, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Note</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white"
                                    value={editPaymentState.note}
                                    onChange={e => setEditPaymentState({ ...editPaymentState, note: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setEditPaymentState({ ...editPaymentState, isOpen: false })} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg font-bold">Cancel</button>
                            <button onClick={saveEditedPayment} className="flex-1 py-2 bg-green-600 text-white rounded-lg font-bold">Save Change</button>
                        </div>
                    </div>
                </div>
            )}

            {/* === REJECT MODAL === */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl border border-red-500/30 shadow-2xl p-6 relative">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><FaBan className="text-red-500" /> Reject Booking</h3>
                        <label className="block text-xs text-gray-400 mb-1 uppercase font-bold">Reason</label>
                        <textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-3 text-white focus:border-red-500 outline-none text-sm mb-6" value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                        <div className="flex gap-3">
                            <button onClick={() => setShowRejectModal(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-bold transition">Cancel</button>
                            <button onClick={handleRejectBooking} disabled={updatingStatus} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition">{updatingStatus ? <FaSpinner className="animate-spin" /> : "Confirm Reject"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* === UPDATE/CONFIRM DIALOG (MODAL) === */}
            {showConfirmModal && selectedBooking && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto custom-scroll">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {isCancelled ? 'Booking Cancelled' : 'Manage Booking & Payments'}
                        </h3>

                        <div className="space-y-6">
                            {/* 1. Payment Calculation Section */}
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-4">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <p className="text-xs text-gray-400 uppercase font-bold">Total Cost</p>
                                        <p className="text-lg font-bold text-white">₹{selectedBooking.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg border border-red-500/20">
                                        <p className="text-xs text-red-400 uppercase font-bold">Less Discount</p>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent text-center font-bold text-red-400 focus:outline-none"
                                            value={confirmData.additionalDiscount}
                                            onChange={e => setConfirmData({ ...confirmData, additionalDiscount: e.target.value })}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="p-2 bg-white/5 rounded-lg border border-green-500/20">
                                        <p className="text-xs text-green-400 uppercase font-bold">Paid So Far</p>
                                        <p className="text-lg font-bold text-green-400">₹{(selectedBooking.paidAmount || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Balance Calculation */}
                                <div className="flex justify-between items-center border-t border-white/10 pt-3">
                                    <span className="text-gray-400 font-bold">
                                        Net Payable: ₹{(selectedBooking.totalPrice - (Number(confirmData.additionalDiscount) || 0)).toLocaleString()}
                                    </span>

                                    <span className="text-xl font-black text-yellow-400">
                                        Due: ₹{(
                                            selectedBooking.totalPrice
                                            - (Number(confirmData.additionalDiscount) || 0)
                                            - (selectedBooking.paidAmount || 0)
                                            - (Number(confirmData.newPaymentAmount) || 0)
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* 2. Payment History (UPDATED WITH ACTIONS) */}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <h4 className="text-gray-400 font-bold text-xs uppercase mb-3 flex items-center gap-2"><FaClock /> Payment History</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scroll">
                                    {selectedBooking.paymentHistory && selectedBooking.paymentHistory.length > 0 ? (
                                        selectedBooking.paymentHistory.slice().reverse().map((pay, i) => {
                                            // Since we reverse for display, we need original index for editing
                                            const originalIndex = selectedBooking.paymentHistory.length - 1 - i;
                                            return (
                                                <div key={i} className="flex justify-between items-center bg-black/30 p-2 rounded text-sm group">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">₹{pay.amount}</span>
                                                        <span className="text-[10px] text-gray-500">{new Date(pay.date).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-gray-400 italic text-xs max-w-[150px] truncate">{pay.note}</span>
                                                        {!isCancelled && (
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => openEditPaymentModal(originalIndex, pay)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40"><FaPen size={10} /></button>
                                                                <button onClick={() => deletePaymentFromHistory(originalIndex)} className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><FaTrash size={10} /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-xs text-gray-500 italic text-center">No partial payments recorded yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* 3. Add New Payment */}
                            {!isCancelled && (
                                <div className="bg-green-900/10 p-4 rounded-xl border border-green-500/20">
                                    <h4 className="text-green-400 font-bold text-xs uppercase mb-3 flex items-center gap-2"><FaPlus /> Record New Payment</h4>
                                    <div className="flex gap-3">
                                        <input
                                            type="number"
                                            className="flex-1 bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm"
                                            placeholder="Amount (₹)"
                                            value={confirmData.newPaymentAmount}
                                            onChange={e => setConfirmData({ ...confirmData, newPaymentAmount: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            className="flex-[2] bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm"
                                            placeholder="Note (e.g. GPay, Cash, ID...)"
                                            value={confirmData.newPaymentNote}
                                            onChange={e => setConfirmData({ ...confirmData, newPaymentNote: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 text-right">* Amount cannot exceed total due cost</p>
                                </div>
                            )}

                            {/* 4. Hotel & Admin Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    {/* Moved Hotel Info Label Above the Box */}
                                    <h4 className="block text-xs text-gray-400 mb-2 uppercase font-bold flex items-center gap-2"><FaHotel /> Hotel Info</h4>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2">
                                        <input className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm" placeholder="Hotel Name" value={confirmData.hotelName} onChange={e => setConfirmData({ ...confirmData, hotelName: e.target.value })} />
                                        <input className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm" placeholder="Hotel Address" value={confirmData.hotelAddress} onChange={e => setConfirmData({ ...confirmData, hotelAddress: e.target.value })} />
                                        <input className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm" placeholder="Hotel Phone" value={confirmData.hotelPhone} onChange={e => setConfirmData({ ...confirmData, hotelPhone: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="block text-xs text-gray-400 mb-2 uppercase font-bold flex items-center gap-2"><FaUser /> Admin Internal</h4>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 h-full flex flex-col justify-between">
                                        <textarea rows={3} className="w-full bg-black/30 border border-gray-600 rounded-lg p-2 text-white text-sm mb-2 resize-none" placeholder="Internal notes..." value={confirmData.adminNotes} onChange={e => setConfirmData({ ...confirmData, adminNotes: e.target.value })} />

                                        <div className="flex items-center gap-2 bg-blue-900/20 p-2 rounded-lg border border-blue-500/20">
                                            <input
                                                type="checkbox"
                                                id="resendEmail"
                                                checked={confirmData.resendEmail}
                                                onChange={e => setConfirmData({ ...confirmData, resendEmail: e.target.checked })}
                                                className="w-4 h-4 accent-blue-500"
                                            />
                                            <label htmlFor="resendEmail" className="text-xs text-blue-300 font-bold cursor-pointer flex items-center gap-1">
                                                <FaEnvelope /> Resend Updated Email
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-white/10">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl font-bold transition">Cancel</button>
                            <button onClick={handleConfirmBooking} disabled={updatingStatus} className={`flex-1 py-3 ${isCancelled ? 'bg-blue-600' : 'bg-green-600 hover:bg-green-500'} text-white rounded-xl font-bold transition flex items-center justify-center gap-2`}>
                                {updatingStatus ? <FaSpinner className="animate-spin" /> : "Save & Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* === BIG BOOKING DETAILS MODAL (Read Only) === */}
            {selectedBooking && !showConfirmModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] w-full max-w-7xl h-[90vh] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col relative">
                        {/* HEADER */}
                        <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-start bg-black/20">
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Booking Details</h2>
                                    <span className={`inline-flex items-center justify-center text-xs px-3 py-1 rounded-full font-mono tracking-wider border w-max ${selectedBooking.status === 'Confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{selectedBooking.status}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-400 text-xs md:text-sm flex flex-wrap items-center gap-3"><span className="flex items-center gap-2 font-mono text-cyan-300"><FaClock className="text-gray-500" /> #{selectedBooking._id.slice(-6).toUpperCase()}</span><span className="hidden md:inline text-gray-700">|</span><span className="text-gray-300 flex items-center gap-2">Booked: {new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</span></p>
                                    {selectedBooking.travelDate && (<p className="text-yellow-400 text-base md:text-lg font-bold flex items-center gap-2 mt-2"><FaCalendarAlt /> Journey: {new Date(selectedBooking.travelDate).toLocaleDateString('en-IN')}</p>)}
                                </div>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition text-gray-300 hover:text-white border border-white/5 shrink-0 ml-4"><FaTimes size={18} /></button>
                        </div>

                        {/* BODY */}
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scroll">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                                {/* LEFT */}
                                <div className="md:col-span-2 space-y-6 md:space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition"><h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaUser /> Customer</h3><p className="text-2xl font-semibold text-white mb-1">{selectedBooking.name}</p><div className="space-y-2 text-gray-400 text-sm mt-4"><p className="flex items-center gap-3"><FaPhone className="text-xs" /> {selectedBooking.phone}</p>{selectedBooking.email && <p className="flex items-center gap-3">✉ {selectedBooking.email}</p>}</div></div>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition"><h3 className="text-green-400 font-bold mb-4 flex items-center gap-2 text-xs uppercase tracking-widest"><FaMapMarkerAlt /> Tour Details</h3><p className="text-lg text-white leading-tight font-bold flex items-center gap-2 group">{selectedBooking.tourTitle}{getTourLink(selectedBooking.tourTitle) && (<a href={getTourLink(selectedBooking.tourTitle)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition text-sm"><FaExternalLinkAlt /></a>)}</p><div className="mt-4 space-y-1 text-gray-400 text-sm"><p>{selectedBooking.adults} Adults, {selectedBooking.children} Children</p><p>Rooms: {selectedBooking.rooms} <span className="text-xs bg-white/10 px-2 py-0.5 rounded ml-1">{selectedBooking.roomType}</span></p></div></div>
                                    </div>

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

                                    {/* PAYMENT INFO DISPLAY */}
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative hover:border-white/10 transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><FaMoneyBillWave /> Payments & Notes</h3>
                                            <button onClick={initiateConfirmation} className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><FaEdit /> Edit</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                {/* Original Price & Coupon Discount */}
                                                {selectedBooking.couponCode && selectedBooking.originalPrice > selectedBooking.totalPrice ? (
                                                    <>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-400">Original Price</span>
                                                            <span className="text-gray-500 line-through">₹{selectedBooking.originalPrice.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                                                            <div className="flex items-center gap-2">
                                                                <FaTicketAlt className="text-purple-400 text-xs" />
                                                                <span className="text-purple-400 font-bold">{selectedBooking.couponCode}</span>
                                                            </div>
                                                            <span className="text-purple-400 font-bold">- ₹{(selectedBooking.originalPrice - selectedBooking.totalPrice).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-400">After Coupon</span>
                                                            <span className="text-white font-bold">₹{selectedBooking.totalPrice.toLocaleString()}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex justify-between text-sm"><span className="text-gray-400">Total Price</span><span className="text-white font-bold">₹{selectedBooking.totalPrice.toLocaleString()}</span></div>
                                                )}
                                                {selectedBooking.additionalDiscount > 0 && <div className="flex justify-between text-sm text-red-400"><span className="italic">Admin Discount</span><span>- ₹{selectedBooking.additionalDiscount.toLocaleString()}</span></div>}
                                                <div className="flex justify-between text-sm text-green-400"><span className="font-bold">Total Paid</span><span className="font-bold">₹{(selectedBooking.paidAmount || 0).toLocaleString()}</span></div>
                                                <div className="flex justify-between text-sm text-yellow-400 border-t border-white/10 pt-2"><span className="font-black uppercase">Balance Due</span><span className="font-black">₹{(selectedBooking.totalPrice - (selectedBooking.additionalDiscount || 0) - (selectedBooking.paidAmount || 0)).toLocaleString()}</span></div>
                                            </div>
                                            <div className="bg-black/20 p-3 rounded-lg border border-white/5 max-h-32 overflow-y-auto custom-scroll">
                                                <p className="text-xs text-gray-500 font-bold uppercase mb-2">History</p>
                                                {selectedBooking.paymentHistory?.length > 0 ? selectedBooking.paymentHistory.map((h, i) => (
                                                    <div key={i} className="text-xs text-gray-300 flex justify-between mb-1"><span>{new Date(h.date).toLocaleDateString()}</span><span className="font-mono">₹{h.amount}</span></div>
                                                )) : <span className="text-xs text-gray-600">No history</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedBooking.hotelDetails && selectedBooking.hotelDetails.name && (
                                        <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-blue-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2"><FaHotel /> Assigned Hotel</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <div className="bg-black/20 p-3 rounded-lg border border-white/5"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Hotel Name</span><span className="text-white font-bold">{selectedBooking.hotelDetails.name}</span></div>
                                                <div className="bg-black/20 p-3 rounded-lg border border-white/5"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Phone</span><span className="text-white">{selectedBooking.hotelDetails.phone || "-"}</span></div>
                                                <div className="bg-black/20 p-3 rounded-lg border border-white/5 col-span-1 sm:col-span-2"><span className="text-gray-400 block text-xs uppercase font-bold mb-1">Address</span><span className="text-white">{selectedBooking.hotelDetails.address || "-"}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT */}
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
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-end pt-4 border-t border-white/10">
                                                <span className="text-gray-300 font-bold">Grand Total</span>
                                                <span className="text-3xl font-black text-white tracking-tight">₹{selectedBooking.totalPrice.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {!isCancelled && (
                                            <div className="space-y-3 mt-6">
                                                <button onClick={initiateConfirmation} className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition flex items-center justify-center gap-2"><FaCheckCircle /> Update / Confirm</button>
                                                <button onClick={() => handleDeleteBooking(selectedBooking._id)} className="w-full py-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-xl font-bold transition flex items-center justify-center gap-2"><FaTrash /> Delete Booking</button>
                                            </div>
                                        )}
                                        {isCancelled && (
                                            <div className="space-y-3 mt-6">
                                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-300 text-center font-bold">This booking is cancelled.</div>
                                                <button onClick={() => handleDeleteBooking(selectedBooking._id)} className="w-full py-4 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-xl font-bold transition flex items-center justify-center gap-2"><FaTrash /> Delete Booking</button>
                                            </div>
                                        )}
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