import { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaHeadset } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';

export default function Contact() {
  // Fetch contact settings from admin
  const [contactSettings, setContactSettings] = useState({
    contactPhone: "+91 7004165004",
    whatsappNumber: "917004165004"
  });

  const [activeTab, setActiveTab] = useState('enquiry');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    destination: '',
    duration: '',
    adventureType: '',
    notes: '',
    bookingRef: '',
    issueType: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [destinations, setDestinations] = useState([]);
  const [durations, setDurations] = useState([]);
  const [adventureTypes, setAdventureTypes] = useState([]);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await fetch('https://admin.hillway.in/api/tours');
        const data = await response.json();

        if (data.success && data.data) {
          const tours = data.data;
          const uniqueLocations = [...new Set(tours.map(tour => tour.location).filter(Boolean))];
          setDestinations(uniqueLocations.sort());

          const uniqueDurations = [...new Set(tours.map(tour => {
            if (tour.nights) {
              const nights = tour.nights;
              const days = nights + 1;
              return `${nights}N/${days}D`;
            }
            return null;
          }).filter(Boolean))];
          setDurations(uniqueDurations.sort((a, b) => {
            const aNights = parseInt(a.split('N')[0]);
            const bNights = parseInt(b.split('N')[0]);
            return aNights - bNights;
          }));

          const allTags = tours.flatMap(tour => tour.tags || []);
          const uniqueTags = [...new Set(allTags)].filter(Boolean);
          setAdventureTypes(uniqueTags.sort());
        }
      } catch (err) {
        console.error('Failed to fetch tour data:', err);
      }
      setLoading(false);
    };

    fetchTourData();

    // Fetch contact settings
    fetch("https://admin.hillway.in/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setContactSettings({
            contactPhone: data.data.contactPhone || "+91 7004165004",
            whatsappNumber: data.data.whatsappNumber || "917004165004"
          });
        }
      })
      .catch((err) => console.error("Failed to load contact settings", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (activeTab === 'enquiry') {
      if (!formData.name || !formData.email || !formData.contact || !formData.destination || !formData.duration) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }
    } else {
      if (!formData.name || !formData.email || !formData.contact || !formData.issueType || !formData.notes) {
        setError('Please fill in all required fields');
        setSubmitting(false);
        return;
      }
    }

    try {
      const payload = activeTab === 'enquiry' ? {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        destination: formData.destination,
        duration: formData.duration,
        adventureType: formData.adventureType,
        notes: formData.notes,
        type: 'enquiry'
      } : {
        name: formData.name,
        email: formData.email,
        contact: formData.contact,
        bookingRef: formData.bookingRef,
        issueType: formData.issueType,
        notes: formData.notes,
        type: 'support'
      };

      const response = await fetch('https://admin.hillway.in/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          contact: '',
          destination: '',
          duration: '',
          adventureType: '',
          notes: '',
          bookingRef: '',
          issueType: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to submit');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">

      {/* --- PAGE METADATA --- */}
      {/* --- PAGE METADATA --- */}
      <SEO title="Contact Us - HillWay | Your way to the Mountains" description="Reach out to HillWay for inquiries, bookings, or support. We're here to help you plan your perfect Himalayan adventure." />

      <div className="max-w-5xl mx-auto">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-[#2E6F95] via-[#D9A441] to-[#1F4F3C] text-transparent bg-clip-text drop-shadow-[0_0_40px_rgba(217,164,65,0.3)]">
              Get in Touch
            </span>
          </h1>
          <p className="text-xl text-white/90 font-playfair italic max-w-2xl mx-auto">
            Let's craft your perfect Himalayan adventure together ✨🏔️
          </p>
        </motion.div>

        {/* HORIZONTAL QUICK CONTACT BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href={`tel:${contactSettings.contactPhone}`} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2E6F95] to-[#1F4F3C] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaPhoneAlt className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Call Us</p>
                  <p className="text-white font-bold">{contactSettings.contactPhone}</p>
                </div>
              </a>

              <a href={`https://wa.me/${contactSettings.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">WhatsApp</p>
                  <p className="text-white font-bold">Chat with us</p>
                </div>
              </a>

              <a href="mailto:enquiry@hillway.in" className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#D9A441] to-[#b8861f] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider font-semibold">Email</p>
                  <p className="text-white font-bold text-sm">contact@hillway.in</p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>

        {/* TAB SELECTOR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white/10 backdrop-blur-xl rounded-2xl p-2 border border-white/20">
            <button
              onClick={() => setActiveTab('enquiry')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'enquiry'
                ? 'bg-gradient-to-r from-[#2E6F95] to-[#1F4F3C] text-white shadow-lg shadow-[#2E6F95]/50'
                : 'text-white/70 hover:text-white'
                }`}
            >
              <FaEnvelope /> Plan Your Trip
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === 'support'
                ? 'bg-gradient-to-r from-[#2E6F95] to-[#1F4F3C] text-white shadow-lg shadow-[#2E6F95]/50'
                : 'text-white/70 hover:text-white'
                }`}
            >
              <FaHeadset /> Booking Support
            </button>
          </div>
        </motion.div>

        {/* FORM CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#2E6F95] opacity-10 blur-[120px] rounded-full"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D9A441] opacity-10 blur-[120px] rounded-full"></div>
            </div>

            {/* ENQUIRY FORM */}
            <AnimatePresence mode="wait">
              {activeTab === 'enquiry' && (
                <motion.div
                  key="enquiry"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Plan Your Adventure</h2>
                    <p className="text-white/70">Fill in the details and we'll create a custom itinerary for you</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Your Name *</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Email Address *</label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">Phone Number *</label>
                      <input
                        name="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Preferred Destination *</label>
                        <select
                          name="destination"
                          value={formData.destination}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                        >
                          <option value="" className="bg-[#022c22]">Select destination</option>
                          {destinations.map((dest) => (
                            <option key={dest} value={dest} className="bg-[#022c22]">{dest}</option>
                          ))}
                          <option value="Other" className="bg-[#022c22]">Other / Custom</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Trip Duration *</label>
                        <select
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                        >
                          <option value="" className="bg-[#022c22]">Select duration</option>
                          {durations.map((dur) => (
                            <option key={dur} value={dur} className="bg-[#022c22]">{dur}</option>
                          ))}
                          <option value="Flexible" className="bg-[#022c22]">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">Adventure Type</label>
                      <select
                        name="adventureType"
                        value={formData.adventureType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                      >
                        <option value="" className="bg-[#022c22]">Select type (Optional)</option>
                        {adventureTypes.map((type) => (
                          <option key={type} value={type} className="bg-[#022c22]">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                        <option value="All" className="bg-[#022c22]">All Types</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about your preferences, budget, special requirements..."
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                      >
                        <FaCheckCircle /> Enquiry submitted! We'll contact you within 24 hours.
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || loading}
                      className="w-full py-4 bg-gradient-to-r from-[#2E6F95] to-[#1F4F3C] text-white font-bold rounded-xl shadow-lg shadow-[#2E6F95]/30 hover:shadow-[#2E6F95]/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaEnvelope /> Submit Enquiry
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* BOOKING SUPPORT */}
              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Booking Support</h2>
                    <p className="text-white/70">Need help with your booking? We're here to assist you!</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Your Name *</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Email Address *</label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Phone Number *</label>
                        <input
                          name="contact"
                          type="tel"
                          value={formData.contact}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                          placeholder="+91 XXXXXXXXXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Booking Reference</label>
                        <input
                          name="bookingRef"
                          value={formData.bookingRef}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                          placeholder="e.g., HW12345"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">Issue Type *</label>
                      <select
                        name="issueType"
                        value={formData.issueType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all"
                      >
                        <option value="" className="bg-[#022c22]">Select issue type</option>
                        <option value="Payment" className="bg-[#022c22]">Payment Issue</option>
                        <option value="Date Change" className="bg-[#022c22]">Date Change Request</option>
                        <option value="Traveler Info" className="bg-[#022c22]">Update Traveler Information</option>
                        <option value="Cancellation" className="bg-[#022c22]">Cancellation Request</option>
                        <option value="General Query" className="bg-[#022c22]">General Query</option>
                        <option value="Other" className="bg-[#022c22]">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-2">Message *</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#2E6F95] focus:border-transparent transition-all resize-none"
                        placeholder="Please describe your issue or query in detail..."
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    {success && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                      >
                        <FaCheckCircle /> Support request submitted! Our team will respond within 2 hours.
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gradient-to-r from-[#2E6F95] to-[#1F4F3C] text-white font-bold rounded-xl shadow-lg shadow-[#2E6F95]/30 hover:shadow-[#2E6F95]/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaHeadset /> Submit Support Request
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}