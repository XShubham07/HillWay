export default function Footer() {
  return (
    <footer className="
      relative text-gray-300 pt-14 pb-10 mt-20
      bg-gradient-to-b from-[#1a1a1a] via-[#262626] to-[#0d0d0d]
      border-t border-white/10
      shadow-[0_-10px_30px_rgba(0,0,0,0.4)]
    ">
      
      {/* SMOKY OVERLAY */}
      <div className="absolute inset-0 bg-[url('/smoke.png')] opacity-5 bg-cover bg-center pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Brand */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            HillWay
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            Your Way To The Mountains
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-10 text-sm font-medium mb-10">
          <a href="/about" className="hover:text-white transition">About Us</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
          <a href="/tours" className="hover:text-white transition">Tours</a>
          <a href="/blog" className="hover:text-white transition">Blog</a>
          <a href="/packages" className="hover:text-white transition">Packages</a>
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 mb-10">
          <a href="#" className="hover:scale-110 transition">
            <svg width="26" height="26" fill="currentColor" className="text-gray-300 hover:text-white">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.26 4.26 0 0 0 1.88-2.35 8.46 8.46 0 0 1-2.7 1.03 4.22 4.22 0 0 0-7.3 3.85A12 12 0 0 1 3.15 4.6a4.2 4.2 0 0 0 1.3 5.63A4.18 4.18 0 0 1 2.8 9.6v.05a4.23 4.23 0 0 0 3.38 4.13 4.27 4.27 0 0 1-1.9.07 4.24 4.24 0 0 0 3.95 2.94A8.5 8.5 0 0 1 2 19.54 12 12 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68v-.54A8.35 8.35 0 0 0 22.46 6z"/>
            </svg>
          </a>

          <a href="#" className="hover:scale-110 transition">
            <svg width="26" height="26" fill="currentColor" className="text-gray-300 hover:text-white">
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.2h-1.2c-1 0-1.3.6-1.3 1.2V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12z"/>
            </svg>
          </a>

          <a href="#" className="hover:scale-110 transition">
            <svg width="26" height="26" fill="currentColor" className="text-gray-300 hover:text-white">
              <path d="M12 2.2C6.5 2.2 2 6.7 2 12.1c0 4.4 3.1 8.1 7.3 9v-6.3H7.4v-2.7h1.9v-2c0-1.9 1.1-3 2.9-3 .8 0 1.6.1 1.9.1v2.1h-1.1c-1 0-1.3.6-1.3 1.2v1.6h2.5l-.4 2.7h-2.1V21A10 10 0 0 0 22 12c0-5.4-4.5-9.8-10-9.8z"/>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-500 text-sm">
          © 2025 HillWay — All Rights Reserved.
        </p>
        <p className="text-center text-gray-500 text-xs mt-2">
          Crafted BY XShubham 💨✨
        </p>

      </div>
    </footer>
  );
}
