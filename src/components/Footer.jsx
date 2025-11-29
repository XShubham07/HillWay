import { IoLogoInstagram } from "react-icons/io5";

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
          {/* Changed Facebook Icon to Instagram (React Icon) */}
          <a href="https://www.instagram.com/fuckuoff.69?igsh=YmExN2puN2dmeGti" className="hover:scale-110 transition">
            <IoLogoInstagram size={26} className="text-gray-300 hover:text-white" />
          </a> 
           
          <div className="flex justify-center gap-6 mb-10">
          {/* Changed Facebook Icon to Instagram (React Icon) */}
          <a href="https://www.instagram.com/blissful.soul_69?igsh=MWtibjIyejFzNHBjMA==" className="hover:scale-110 transition">
            <IoLogoInstagram size={26} className="text-gray-300 hover:text-white" />
          </a>

          <a href="#" className="hover:scale-110 transition">
            <svg width="26" height="26" fill="currentColor" className="text-gray-300 hover:text-white">
              <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.2h-1.2c-1 0-1.3.6-1.3 1.2V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12z"/>
            </svg>
          </a>
          

      
        
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-500 text-sm">
          © 2025 HillWay — All Rights Reserved.
        </p>
        <p className="text-center text-gray-500 text-xs mt-2">
          Crafted by XShubham 🗿✨
        </p>
        <p className="text-center text-gray-500 text-xs mt-2">
           Credit goes to Xanand🫠💀
        </p>

      </div>
    </footer>
  );
}