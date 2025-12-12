export default function Contact() {
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
              <span className="text-2xl">✉️</span> support@hillway.in
            </p>
          </div>

          <p className="text-[#D7DCE2]/80 font-light leading-relaxed">
            Whether it’s trek planning, custom packages, or premium stays —
            <br />
            our travel experts respond faster than mountain winds ⚡
          </p>
        </div>

        {/* RIGHT CONTACT FORM */}
        <form className="space-y-6 relative z-10">
          <input
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Your Name"
          />

          <input
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Your Email Or Phone"
          />

          <textarea
            rows="5"
            className="
              w-full p-4 rounded-xl
              bg-white/10 text-white 
              border border-white/20
              focus:outline-none focus:ring-2 focus:ring-[#2E6F95]
              backdrop-blur-xl
              placeholder-gray-300
            "
            placeholder="Your Message"
          />

          <button
            className="
              w-full py-4 rounded-xl text-white text-lg font-semibold
              
              bg-gradient-to-r from-[#2E6F95] to-[#1F4F3C]
              hover:scale-[1.03] transition-transform duration-200

              shadow-[0_0_20px_rgba(217,164,65,0.4)]
              border border-[#D9A441]/30
            "
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
