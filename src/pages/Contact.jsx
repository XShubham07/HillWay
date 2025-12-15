import { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaPaperPlane, FaHeadset, FaRocket } from 'react-icons/fa';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    <div className="min-h-screen py-16 px-4 relative overflow-hidden" style={{
      background: 'linear-gradient(to bottom, #0A0E27, #1a1f3a)',
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #2E6F95, transparent)',
            left: `${mousePosition.x / 20}px`,
            top: `${mousePosition.y / 20}px`,
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #D9A441, transparent)',
            right: `${mousePosition.x / 30}px`,
            bottom: `${mousePosition.y / 30}px`,
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Floating Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #2E6F95, #D9A441, #1F4F3C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            Get in Touch
          </motion.h1>
          <p className="text-xl text-gray-300">We turn travel dreams into reality ✨</p>
        </motion.div>

        {/* Interactive Contact Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          {[
            { icon: FaPhoneAlt, label: 'Call Us', value: '+91 9876543210', href: 'tel:+919876543210', color: '#2E6F95' },
            { icon: FaWhatsapp, label: 'WhatsApp', value: 'Chat Now', href: 'https://wa.me/919876543210', color: '#25D366' },
            { icon: FaEnvelope, label: 'Email', value: 'enquiry@hillway.in', href: 'mailto:enquiry@hillway.in', color: '#D9A441' },
          ].map((item, i) => (
            <motion.a
              key={i}
              href={item.href}
              target={item.label === 'WhatsApp' ? '_blank' : undefined}
              rel={item.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl opacity-50 blur-xl group-hover:opacity-100 transition-opacity" style={{ background: item.color }} />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all">
                <item.icon className="text-4xl mb-3" style={{ color: item.color }} />
                <p className="text-sm text-gray-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-white font-bold">{item.value}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Tabs with 3D effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-8 justify-center"
        >
          {[
            { id: 'enquiry', label: 'Plan Your Trip', icon: FaRocket },
            { id: 'support', label: 'Get Support', icon: FaHeadset },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className={`absolute inset-0 rounded-2xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#2E6F95] via-[#D9A441] to-[#1F4F3C] opacity-100 shadow-2xl'
                  : 'bg-white/5 opacity-50'
              }`} />
              <span className="relative flex items-center gap-2">
                <tab.icon />
                {tab.label}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Main Form Card with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E6F95]/20 via-[#D9A441]/20 to-[#1F4F3C]/20 rounded-3xl blur-2xl" />
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            <AnimatePresence mode="wait">
              {activeTab === 'enquiry' && (
                <motion.form
                  key="enquiry"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Your Name *</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                      placeholder="Enter your full name"
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Email *</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                        placeholder="your@email.com"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Phone *</label>
                      <input
                        name="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Destination *</label>
                      <select
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                      >
                        <option value="" className="bg-[#0A0E27]">Choose your dream destination</option>
                        {destinations.map((dest) => (
                          <option key={dest} value={dest} className="bg-[#0A0E27]">{dest}</option>
                        ))}
                        <option value="Other" className="bg-[#0A0E27]">Custom Location</option>
                      </select>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Duration *</label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                      >
                        <option value="" className="bg-[#0A0E27]">How long?</option>
                        {durations.map((dur) => (
                          <option key={dur} value={dur} className="bg-[#0A0E27]">{dur}</option>
                        ))}
                        <option value="Flexible" className="bg-[#0A0E27]">Flexible</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Adventure Type</label>
                    <select
                      name="adventureType"
                      value={formData.adventureType}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                    >
                      <option value="" className="bg-[#0A0E27]">What excites you? (Optional)</option>
                      {adventureTypes.map((type) => (
                        <option key={type} value={type} className="bg-[#0A0E27]">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                      <option value="All" className="bg-[#0A0E27]">Everything!</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Anything Else?</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all resize-none backdrop-blur-xl"
                      placeholder="Budget, preferences, special requests..."
                    />
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/20 border-2 border-red-500 text-red-200 px-4 py-3 rounded-xl font-semibold"
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 border-2 border-green-500 text-green-200 px-4 py-3 rounded-xl font-semibold flex items-center gap-2"
                    >
                      <FaCheckCircle /> Awesome! We'll get back to you within 24 hours.
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting || loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-gradient-to-r from-[#2E6F95] via-[#D9A441] to-[#1F4F3C] text-white font-bold rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1F4F3C] via-[#D9A441] to-[#2E6F95] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-3">
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane /> Let's Make It Happen!
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              )}

              {activeTab === 'support' && (
                <motion.form
                  key="support"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-r from-[#2E6F95]/20 to-[#D9A441]/20 border-2 border-[#D9A441]/50 rounded-xl p-4 mb-6">
                    <p className="text-white font-semibold flex items-center gap-2">
                      <FaHeadset className="text-[#D9A441]" /> Quick help? Call <a href="tel:+919876543210" className="underline text-[#D9A441]">+91 9876543210</a>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Name *</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Phone *</label>
                      <input
                        name="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                        placeholder="+91 XXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Booking ID</label>
                      <input
                        name="bookingRef"
                        value={formData.bookingRef}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                        placeholder="HW12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Issue Type *</label>
                      <select
                        name="issueType"
                        value={formData.issueType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white focus:border-[#D9A441] focus:outline-none transition-all backdrop-blur-xl"
                      >
                        <option value="" className="bg-[#0A0E27]">What's wrong?</option>
                        <option value="Payment" className="bg-[#0A0E27]">Payment Issue</option>
                        <option value="Date Change" className="bg-[#0A0E27]">Date Change</option>
                        <option value="Cancellation" className="bg-[#0A0E27]">Cancellation</option>
                        <option value="Info Update" className="bg-[#0A0E27]">Update Info</option>
                        <option value="General" className="bg-[#0A0E27]">General Query</option>
                        <option value="Other" className="bg-[#0A0E27]">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-[#D9A441] mb-2 uppercase tracking-wider">Tell us more *</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#D9A441] focus:outline-none transition-all resize-none backdrop-blur-xl"
                      placeholder="Describe your issue in detail..."
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/20 border-2 border-red-500 text-red-200 px-4 py-3 rounded-xl font-semibold"
                    >
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 border-2 border-green-500 text-green-200 px-4 py-3 rounded-xl font-semibold flex items-center gap-2"
                    >
                      <FaCheckCircle /> Got it! Our team will respond within 2 hours.
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-gradient-to-r from-[#2E6F95] via-[#D9A441] to-[#1F4F3C] text-white font-bold rounded-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1F4F3C] via-[#D9A441] to-[#2E6F95] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-3">
                      {submitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaHeadset /> Get Help Now
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}