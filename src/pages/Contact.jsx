import { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    destination: '',
    duration: '',
    adventureType: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dynamic options from tours
  const [destinations, setDestinations] = useState([]);
  const [durations, setDurations] = useState([]);
  const [adventureTypes, setAdventureTypes] = useState([]);

  // Fetch tours data to populate dropdowns
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await fetch('https://admin.hillway.in/api/tours');
        const data = await response.json();
        
        if (data.success && data.data) {
          const tours = data.data;
          
          // Extract unique locations
          const uniqueLocations = [...new Set(tours.map(tour => tour.location).filter(Boolean))];
          setDestinations(uniqueLocations.sort());
          
          // Extract unique durations (formatted as 2N/3D, 3N/4D, etc.)
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
          
          // Extract unique tags/adventure types
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
          adventureType: '',
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

          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FaSpinner className="animate-spin" />
              Loading destinations...
            </div>
          )}
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

          {/* DESTINATION DROPDOWN */}
          <select
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
            "
          >
            <option value="" className="bg-[#102A43] text-gray-300">Select Preferred Destination *</option>
            {destinations.map((dest) => (
              <option key={dest} value={dest} className="bg-[#102A43]">{dest}</option>
            ))}
            <option value="Other" className="bg-[#102A43]">Other / Custom Location</option>
          </select>

          {/* DURATION DROPDOWN */}
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
            {durations.map((dur) => (
              <option key={dur} value={dur} className="bg-[#102A43]">{dur}</option>
            ))}
            <option value="Flexible" className="bg-[#102A43]">Flexible / Custom Duration</option>
          </select>

          {/* ADVENTURE TYPE DROPDOWN */}
          <select
            name="adventureType"
            value={formData.adventureType}
            onChange={handleChange}
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
            "
          >
            <option value="" className="bg-[#102A43] text-gray-300">Select Adventure Type (Optional)</option>
            {adventureTypes.map((type) => (
              <option key={type} value={type} className="bg-[#102A43]">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
            <option value="All" className="bg-[#102A43]">All Types / Mixed</option>
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
            disabled={submitting || loading}
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