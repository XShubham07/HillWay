// src/components/Footer.jsx
import { useState, useEffect } from "react";
import { IoLogoInstagram, IoLogoFacebook } from "react-icons/io5";
import {
  FaInfoCircle,
  FaPhone,
  FaRoute,
  FaBook,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaFileContract,
  FaEnvelope,
  FaHeart,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";

export default function Footer() {
  const [contactSettings, setContactSettings] = useState({
    contactPhone: "+91 7004165004",
    instagramUrl: "https://www.instagram.com/hillwaydotin/",
    facebookUrl: "https://www.facebook.com/",
  });

  useEffect(() => {
    fetch("https://admin.hillway.in/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setContactSettings({
            contactPhone: data.data.contactPhone || "+91 7004165004",
            instagramUrl:
              data.data.instagramUrl ||
              "https://www.instagram.com/hillwaydotin/",
            facebookUrl: data.data.facebookUrl || "https://www.facebook.com/",
          });
        }
      })
      .catch(() => { });
  }, []);

  const footerLinks = [
    { name: "Track Booking", path: "/status", icon: FaSearch },
    { name: "About Us", path: "/about", icon: FaInfoCircle },
    { name: "Contact", path: "/contact", icon: FaPhone },
    { name: "Tours", path: "/tours", icon: FaRoute },
    { name: "Destinations", path: "/destinations", icon: FaMapMarkerAlt },
    { name: "Blogs", path: "/blogs", icon: FaBook },
    { name: "Privacy Policy", path: "/privacy-policy", icon: FaShieldAlt },
    { name: "Terms & Conditions", path: "/terms", icon: FaFileContract },
    { name: "Disclaimer", path: "/disclaimer", icon: FaExclamationTriangle },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      url: contactSettings.instagramUrl,
      icon: IoLogoInstagram,
      color: "from-purple-600 via-pink-600 to-orange-500",
    },
    {
      name: "Facebook",
      url: contactSettings.facebookUrl,
      icon: IoLogoFacebook,
      color: "from-blue-600 to-blue-500",
    },
  ];

  return (
    <footer className="relative mt-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1117] to-black" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/hillway-footer.png"
              alt="HillWay"
              className="h-20 w-auto mb-6"
            />
            <p className="text-gray-500 text-sm max-w-xs">
              Discover the Himalayas with expertly curated tours and unforgettable
              experiences.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              {footerLinks.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-white"
                  >
                    <Icon className="text-amber-400 text-xs" />
                    <span className="text-sm">{item.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Connect With Us
            </h3>

            <div className="space-y-3 mb-6 text-sm text-gray-400">
              <div className="flex gap-3">
                <FaMapMarkerAlt className="text-cyan-400" />
                <span>Bhagwat Nagar, Patna, Bihar - 800026</span>
              </div>
              <div className="flex gap-3">
                <FaEnvelope className="text-cyan-400" />
                <span>contact@hillway.in</span>
              </div>
              <div className="flex gap-3">
                <FaPhone className="text-cyan-400" />
                <span>{contactSettings.contactPhone}</span>
              </div>
            </div>

            {/* Social Rounded Box */}
            <div className="flex gap-4">
              {socialLinks.filter(social => social.url).map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 rounded-full bg-gradient-to-r ${social.color} p-[2px] hover:scale-105 transition`}
                  >
                    <div className="flex items-center gap-2 bg-gray-900 rounded-full px-5 py-2">
                      <Icon className="text-white text-lg" />
                      <span className="text-white text-sm font-semibold">
                        Follow us
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 <span className="text-amber-400 font-semibold">HillWay</span>
          </p>

          <p className="text-gray-600 text-xs flex items-center gap-2">
            Crafted with <FaHeart className="text-red-500 text-xs" /> for
            <span className="font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Explorers
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
