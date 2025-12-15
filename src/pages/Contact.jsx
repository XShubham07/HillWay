import { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaPaperPlane, FaHeadset } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
            Let's Talk! 👋
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            We're here to help plan your perfect adventure
          </p>
        </motion.div>

        {/* Quick Contact Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 mb-8"
        >
          <a
            href="tel:+919876543210"
            className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all group"
          >
            <FaPhoneAlt className="text-2xl sm:text-3xl text-white mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm text-white font-semibold">Call</span>
          </a>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all group"
          >
            <FaWhatsapp className="text-2xl sm:text-3xl text-white mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm text-white font-semibold">WhatsApp</span>
          </a>
          <a
            href="mailto:enquiry@hillway.in"
            className="flex flex-col items-center justify-center p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all group"
          >
            <FaEnvelope className="text-2xl sm:text-3xl text-white mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm text-white font-semibold">Email</span>
          </a>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 sm:gap-3 mb-6 sm:mb-8 bg-white/10 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl"
        >
          <button
            onClick={() => setActiveTab('enquiry')}
            className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'enquiry'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Plan Trip
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'support'
                ? 'bg-white text-purple-600 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            Get Support
          </button>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10"
        >
          <AnimatePresence mode="wait">
            {activeTab === 'enquiry' && (
              <motion.form
                key="enquiry"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                    <input
                      name="contact"
                      type="tel"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Destination *</label>
                    <select
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                    >
                      <option value="">Select destination</option>
                      {destinations.map((dest) => (
                        <option key={dest} value={dest}>{dest}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Duration *</label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                    >
                      <option value="">Select duration</option>
                      {durations.map((dur) => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Adventure Type</label>
                  <select
                    name="adventureType"
                    value={formData.adventureType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                  >
                    <option value="">Select type (Optional)</option>
                    {adventureTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                    <option value="All">All Types</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tell us more</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all resize-none"
                    placeholder="Budget, preferences, special requests..."
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                  >
                    <FaCheckCircle /> Message sent! We'll reply within 24 hours.
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane /> Send Enquiry
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {activeTab === 'support' && (
              <motion.form
                key="support"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-purple-900 font-semibold flex items-center gap-2">
                    <FaHeadset /> Need quick help? Call us at <a href="tel:+919876543210" className="underline">+91 9876543210</a>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                    <input
                      name="contact"
                      type="tel"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Booking ID</label>
                    <input
                      name="bookingRef"
                      value={formData.bookingRef}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                      placeholder="HW12345 (if any)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Issue Type *</label>
                    <select
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all"
                    >
                      <option value="">Select issue</option>
                      <option value="Payment">Payment Issue</option>
                      <option value="Date Change">Date Change</option>
                      <option value="Cancellation">Cancellation</option>
                      <option value="Info Update">Update Info</option>
                      <option value="General">General Query</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Describe Your Issue *</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white focus:outline-none transition-all resize-none"
                    placeholder="Please provide details about your booking issue..."
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
                  >
                    <FaCheckCircle /> Support request received! We'll respond within 2 hours.
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaHeadset /> Submit Request
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}