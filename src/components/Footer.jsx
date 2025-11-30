import { IoLogoInstagram, IoLogoYoutube, IoLogoFacebook } from "react-icons/io5";

export default function Footer() {
  return (
    <footer
      className="
        relative pt-16 pb-10 mt-32
        bg-gradient-to-b from-[#0b0f17] via-[#0a0d14] to-[#05070a]
        border-t border-white/10 overflow-hidden
        rounded-t-3xl 
        shadow-[0_-8px_25px_rgba(0,0,0,0.5)]
      "
      style={{
        borderTop: "2px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 -4px 15px rgba(0,0,0,0.4), inset 0 6px 18px rgba(255,255,255,0.06)",
      }}
    >
      {/* BACKGLOW */}
      <div className="absolute inset-0 opacity-[0.25] bg-[radial-gradient(circle_at_top,rgba(98,226,255,0.35),transparent_60%),radial-gradient(circle_at_bottom,rgba(255,143,255,0.25),transparent_70%)]"></div>

      {/* SCENIC MOUNTAINS */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30 pointer-events-none">
        <img src="/mountains.svg" className="w-full" alt="mountains" />
      </div>

      {/* SOFT SUN */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-44 h-44 bg-yellow-300/25 blur-3xl rounded-full"></div>

      {/* MAIN GRID (LEFT + RIGHT) */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12">

        {/* LEFT SECTION */}
        <div>
          {/* BRAND */}
          <h2
            className="
              text-5xl font-extrabold tracking-wide mb-3
              bg-gradient-to-r from-cyan-300 via-white to-pink-300
              text-transparent bg-clip-text 
              drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]
            "
          >
            HillWay
          </h2>

          <p className="text-gray-400 text-sm mb-8">
            Your Way To The Mountains
          </p>

          {/* LINKS */}
          <div className="flex flex-col gap-3 text-[15px] font-medium">
            {[
              "About Us",
              "Contact",
              "Tours",
              "Blog",
              "Packages",
              "Privacy Policy",
            ].map((item, idx) => (
              <a
                key={idx}
                href={"/" + item.toLowerCase().replace(/ /g, "")}
                className="
                  text-gray-300 hover:text-white transition
                  hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.45)]
                "
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION — SOCIAL MEDIA */}
        <div className="flex flex-col justify-center md:items-end items-start">

          <h3 className="text-gray-300 text-lg font-semibold tracking-wide mb-4">
            Follow Us On
          </h3>

          {/* INSTAGRAM */}
          <div className="flex items-center gap-3 mb-4">
            <IoLogoInstagram size={34} className="text-[#E4405F]" />
            <a
              href="https://www.instagram.com/fuckuoff.69"
              className="text-gray-300 hover:text-white text-sm transition"
            >
              Instagram
            </a>
          </div>

          {/* YOUTUBE */}
          <div className="flex items-center gap-3 mb-4">
            <IoLogoYoutube size={34} className="text-[#FF0000]" />
            <a
              href="https://youtube.com"
              className="text-gray-300 hover:text-white text-sm transition"
            >
              YouTube
            </a>
          </div>

          {/* FACEBOOK */}
          <div className="flex items-center gap-3">
            <IoLogoFacebook size={34} className="text-[#1877F2]" />
            <a
              href="https://facebook.com"
              className="text-gray-300 hover:text-white text-sm transition"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <p className="text-center text-gray-500 text-sm mt-10">
        © 2025 HillWay — All Rights Reserved.
      </p>

      <p className="text-center text-gray-500 text-xs mt-2">
        Crafted by XShubham 🗿✨
      </p>

      <p className="text-center text-gray-500 text-xs mt-1">
        Credits — Xanand 🫠💀
      </p>
    </footer>
  );
}
