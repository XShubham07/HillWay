import { useState } from 'react';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    destination: '',
    duration: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.contact || !formData.destination || !formData.duration) {
      setError('Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://admin.hillway.in/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
          notes: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to submit enquiry');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 mt-24 mb-24 font-inter">
      {/* PREMIUM HEADING */}
      <div className="text-center mb-14">
        <h1
          className="
            text-5xl md:text-6xl font-montserrat font-extrabold tracking-tight
            bg-gradient-to-r from-[#2E6F95] via-[#D9A441] to-[#1F4F3C]
            text-transparent bg-clip-text
            drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]
          "
        >
          Contact HillWay
        </h1>

        <p className="mt-3 text-[#00000] text-lg font-playfair italic">
          Crafting unforgettable Himalayan journeys ✨🏔️
        </p>
      </div>

      {/* GLASS CONTAINER */}
      <div
        className="
          grid grid-cols-1 md:grid-cols-2 gap-12 
          p-12 rounded-3xl

          bg-[#102A43]/40 
          backdrop-blur-2xl 
          border border-white/10 
        
          shadow-[0_0_50px_rgba(0,0,0,0.45)]
          relative overflow-hidden
        "
      >
        {/* glowing gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#2E6F95] opacity-[0.20] blur-[120px]"></div>
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#D9A441] opacity-[0.25] blur-[130px]"></div>
        </div>

        {/* LEFT INFORMATION */}
        <div className="space-y-6 text-[#D7DCE2] relative z-10">
          <div className="space-y-3 text-lg">
            <p className="flex items-center gap-3">
              <span className="text-2xl">📍</span> Gangtok, Sikkim – India
            </p>
            <p className="flex items-center gap-3">
              <span className="text-2xl">📞</span> +91 9876543210
            </p>
            <p className="flex items-center gap-3">
              <span className="text-2xl">✉️</span> enquiry@hillway.in
            </p>
          </div>

          <p className="text-[#D7DCE2]/80 font-light leading-relaxed">
            Whether it's trek planning, custom packages, or premium stays —
            <br />
            our travel experts respond faster than mountain winds ⚡
          </p>
        </div>

        {/* RIGHT CONTACT FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Your Name *"
          />

          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Your Email *"
          />

          <input
            name="contact"
            type="tel"
            value={formData.contact}
            onChange={handleChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Contact Number *"
          />

          <input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Preferred Destination *"
          />

          <select
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
            "
          >
            <option value="" className="bg-[#102A43] text-gray-300">Select Trip Duration *</option>
            <option value="1-2 Days" className="bg-[#102A43]">1-2 Days</option>
            <option value="3-4 Days" className="bg-[#102A43]">3-4 Days</option>
            <option value="5-7 Days" className="bg-[#102A43]">5-7 Days</option>
            <option value="1-2 Weeks" className="bg-[#102A43]">1-2 Weeks</option>
            <option value="2+ Weeks" className="bg-[#102A43]">2+ Weeks</option>
          </select>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Additional Notes (Optional)"
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
              >
                <FaCheckCircle /> Enquiry submitted successfully! We'll contact you soon.
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="
              w-full py-4 rounded-xl text-white text-lg font-semibold
              bg-gradient-to-r from-[#2E6F95] to-[#1F4F3C]
              hover:scale-[1.03] transition-transform duration-200
              shadow-[0_0_20px_rgba(217,164,65,0.4)]
              border border-[#D9A441]/30
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" />
                Submitting...
              </>
            ) : (
              'Send Enquiry'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}